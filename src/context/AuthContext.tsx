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
  updateUser: () => Promise.resolve()
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

  // useEffect(() => {
  //   console.log("accessToken is", accessToken);
  // }, [accessToken]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    // SETTING AXIOS INTERCEPTORS HERE (once access token is present)
    const reqInterceptor = httpRequest.interceptors.request.use(
      async (config) => {
        if (accessToken) {
          // @ts-ignore
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        // config.withCredentials = true;
        console.log("Refresh token baby!!");
        handleRefreshTokenRefresh();
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
          // TODO Time to use the refresh token
          // console.log("Refresh token baby!!");
          // handleRefreshTokenRefresh();
          // handleLogout();
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
        // Get from the endpoint and not the local storage
        // setLoading(true);
        // await axios
        //   .get(authConfig.meEndpoint, {
        //     headers: {
        //       Authorization: storedToken
        //     }
        //   })
        //   .then(async response => {
        //     setLoading(false)
        //     setUser({ ...response.data.userData })
        //   })
        //   .catch(() => {
        //     localStorage.removeItem('userData')
        //     localStorage.removeItem('refreshToken')
        //     localStorage.removeItem('accessToken')
        //     setUser(null)
        //     setLoading(false)
        //   })
        const user: User = JSON.parse(userInfo);
        setUser({ ...user });
        setLoading(false);
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
    });
  };

  const updateUserInformation = (errorCallback?: ErrCallbackType) => {
    httpRequest
      .get(authConfig.userInformationEndpoint)
      .then(async (res) => {
        setUser({ ...res.data.user });
      })
      .catch((err) => {
        if (errorCallback) errorCallback(err);
      });
  };

  const handleRefreshTokenRefresh = () => {
    // axios(authConfig.refreshTokenEndpoint, {
    //   method: "GET",
    //   withCredentials: true
    // }).then(res => {
    //   console.log(res);
    // }).catch(err => {
    //   console.log(err.response);
    // });
    axios
      .get(authConfig.refreshTokenEndpoint, { withCredentials: true })
      .then((res) => {
        console.log("Response", res.headers);
        if (res.data.error) {
          console.log("error", res.data.error);
        } else {
          console.log("We got a new refresh token token!!");
        }
      })
      .catch((err: { [key: string]: string }) => console.log("error", err));
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
    updateUser: updateUserInformation
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
