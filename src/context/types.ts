import { SubscriptionDetail } from "../types/apps/NavashipTypes";

export type ErrCallbackType = (err: { [key: string]: string }) => void;

export type LoginParams = {
  email: string;
  password: string;
};

export type RegisterParams = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type User = {
  id: number;
  role: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  subscriptionDetail: SubscriptionDetail;
};

export type AuthValuesType = {
  loading: boolean;
  setLoading: (value: boolean) => void;
  logout: () => void;
  isInitialized: boolean;
  user: User | null;
  setUser: (value: User | null) => void;
  setIsInitialized: (value: boolean) => void;
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void;
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void;
};
