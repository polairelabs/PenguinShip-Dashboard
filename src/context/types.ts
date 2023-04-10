import { AccountData, SubscriptionDetail } from "../types/apps/NavashipTypes";

export type ErrCallbackType = (err: { [key: string]: string }) => void;

export type LoginParams = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  role: string;
  email: string;
  firstName: string;
  lastName: string;
  subscriptionDetail: SubscriptionDetail;
};

export type AuthValuesType = {
  accessToken: string | undefined;
  loading: boolean;
  setLoading: (value: boolean) => void;
  logout: () => void;
  isInitialized: boolean;
  user: User | null;
  setUser: (value: User | null) => void;
  setIsInitialized: (value: boolean) => void;
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void;
  updateUser: (errorCallback?: ErrCallbackType) => void;
};
