import { createContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/router";
import axios, { AxiosError } from "axios";
import authConfig from "src/configs/auth";
import {
  AuthValuesType,
  RegisterParams,
  LoginParams,
  ErrCallbackType,
  User
} from "./types";
import { httpRequest } from "../api/api";

const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve()
};

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(defaultProvider.user);
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);
  const [isInitialized, setIsInitialized] = useState<boolean>(
    defaultProvider.isInitialized
  );

  const router = useRouter();

  useEffect(() => {
    // SET AXIOS INTERCEPTORS HERE
    console.log("SET AXIOS INTERCEPTORS HERE");
    const reqInterceptor = httpRequest.interceptors.request.use(
      async (config) => {
        const accessToken = localStorage.getItem(
          authConfig.storageAccessTokenKey
        );
        if (accessToken) {
          // @ts-ignore
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        // No action
      }
    );

    const resInterceptor = httpRequest.interceptors.response.use(
      async (response) => {
        return response;
      },
      (error) => {
        let axiosError = error as AxiosError;
        if (axiosError.response?.status == 401) {
          handleLogout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // Remove all intercepts when done
      httpRequest.interceptors.request.eject(reqInterceptor);
      httpRequest.interceptors.response.eject(resInterceptor);
    };
  }, []);

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      setIsInitialized(true);
      const userData = window.localStorage.getItem(
        authConfig.storageUserDataKey
      );
      if (userData) {
        const user: User = JSON.parse(userData);
        setUser({ ...user });
        setLoading(false);
      } else {
        setLoading(false);
        handleLogout();
      }
    };
    initAuth();
  }, []);

  const handleLogin = (
    params: LoginParams,
    errorCallback?: ErrCallbackType
  ) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async (res) => {
        window.localStorage.setItem(
          authConfig.storageAccessTokenKey,
          res.data.access_token
        );
        window.localStorage.setItem(
          authConfig.storageRefreshTokenKey,
          res.data.refresh_token
        );
        window.localStorage.setItem(
          authConfig.storageUserDataKey,
          JSON.stringify(res.data.user)
        );
        setUser({ ...res.data.user });
        const returnUrl = router.query.returnUrl;
        const redirectURL = returnUrl && returnUrl !== "/" ? returnUrl : "/";
        await router.replace(redirectURL as string);
      })
      .catch((err) => {
        if (errorCallback) errorCallback(err);
      });
  };

  const handleLogout = () => {
    console.log("Resetting and signing out...");
    resetAuthValues();
    router.push("/login");
  };

  const resetAuthValues = () => {
    setUser(null);
    setIsInitialized(false);
    window.localStorage.removeItem(authConfig.storageUserDataKey);
    window.localStorage.removeItem(authConfig.storageAccessTokenKey);
    window.localStorage.removeItem(authConfig.storageRefreshTokenKey);
  };

  const handleRegister = (
    params: RegisterParams,
    errorCallback?: ErrCallbackType
  ) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then((res) => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error);
        } else {
          handleLogin({
            email: params.email,
            password: params.password
          });
        }
      })
      .catch((err: { [key: string]: string }) =>
        errorCallback ? errorCallback(err) : null
      );
  };

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
