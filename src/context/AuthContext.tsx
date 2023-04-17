import { createContext, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios, { AxiosError } from "axios";
import authConfig from "src/configs/auth";
import { AuthValuesType, ErrCallbackType, LoginParams, User } from "./types";
import { httpRequest } from "../api/api";

const defaultProvider: AuthValuesType = {
  accessToken: undefined,
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  updateUserData: () => Promise.resolve()
};

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const [accessToken, setAccessToken] = useState<string | undefined>(
    defaultProvider.accessToken
  );
  const [user, setUser] = useState<User | null>(defaultProvider.user);
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);
  const [isInitialized, setIsInitialized] = useState<boolean>(
    defaultProvider.isInitialized
  );

  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    // SETTING AXIOS INTERCEPTORS HERE (once access token is present)
    const reqInterceptor = httpRequest.interceptors.request.use(
      async (config) => {
        config.withCredentials = true;
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
          // Time to use the refresh token
          refreshAccessToken();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // Remove all intercepts when done
      httpRequest.interceptors.request.eject(reqInterceptor);
      httpRequest.interceptors.response.eject(resInterceptor);
    };
  }, [accessToken]);

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      setIsInitialized(true);
      const userInfo = window.localStorage.getItem(
        authConfig.storageUserDataKey
      );
      if (userInfo) {
        if (process.env.NEXT_PUBLIC_STAGE === "prod") {
          // Added prod check because don't wanna logout in dev each time
          refreshAccessToken(true);
        } else {
          const user: User = JSON.parse(userInfo);
          setUser({ ...user });
          setLoading(false);
        }
      } else {
        setLoading(false);
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
        // Set the access token in memory
        setAccessToken(res.data.access_token);
        setUser({ ...res.data.user });
        window.localStorage.setItem(
          authConfig.storageUserDataKey,
          JSON.stringify(res.data.user)
        );
        const returnUrl = router.query.returnUrl;
        const redirectURL = returnUrl && returnUrl !== "/" ? returnUrl : "/";
        await router.replace(redirectURL as string);
      })
      .catch((err) => {
        if (errorCallback) errorCallback(err);
      });
  };

  const handleLogout = () => {
    axios.post(authConfig.logoutEndpoint).then(async (res) => {
      resetAuthValues();
      router.push("/login");
      setLoading(false);
    });
  };

  const updateUserInformation = () => {
    refreshAccessToken(true);
  };

  const requestUpdatedUserInfo = (accessToken: string) => {
    httpRequest
      .get(authConfig.userInformationEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(async (res) => {
        setUser({ ...res.data.user });
      })
      .catch((err) => {
        console.log("Error requesting new user data", err);
        handleLogout();
      });
  };

  // Exchanges refresh token in secure httponly cookie to receive new access token as to not log out the user
  const refreshAccessToken = (requestNewUserInfo = false) => {
    // Sends refresh token in cookie to get new access token
    if (process.env.NEXT_PUBLIC_STAGE === "dev") {
      console.log("Dev mode - Don't request new access token. Logging out");
      handleLogout();
      return;
    }

    axios
      .post(authConfig.refreshTokenEndpoint, null, { withCredentials: true })
      .then((res) => {
        console.log("Got new access token", res.data);
        const accessToken = res.data.access_token;
        setAccessToken(accessToken);
        if (requestNewUserInfo) {
          // Setting new user info (e.g. on subscription change)
          requestUpdatedUserInfo(accessToken);
        }
      })
      .catch(() => handleLogout());
  };

  const resetAuthValues = () => {
    setUser(null);
    setIsInitialized(false);
    setAccessToken(undefined);
    window.localStorage.removeItem(authConfig.storageUserDataKey);
  };

  const values = {
    accessToken,
    user,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
    updateUserData: updateUserInformation
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
