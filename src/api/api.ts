import axios, { AxiosError, AxiosResponse } from "axios";
import authConfig from "src/configs/auth";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ApiError {
  statusCode: number | undefined;
  messages: string[];
}

interface ApiErrorResponse {
  status_code: number;
  status: string;
  message: string;
}

const headers = {
  "Content-type": "application/json"
};

const http = axios.create({
  baseURL: baseUrl,
  headers
});

export const httpRequest = http;

httpRequest.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem(authConfig.storageAccessTokenKey);
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

function instanceOfApiErrorResponse(error: any): error is ApiErrorResponse {
  return "status_code" in error && "status" in error && "message" in error;
}

function handleError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    // Check if validation error exists
    // const messages = error?.response?.data?.validation_errors
    //   ? error.response.data.validation_errors.map(
    //       (item) => `${item.field} ${item.message}`
    //     )
    //   : [error.response.data.message];
    const axiosError = error as AxiosError;
    const axiosResponse = axiosError.response as AxiosResponse;
    return {
      statusCode: axiosError.response?.status,
      messages: [axiosResponse.data.message]
    };
  }
  const { data: errorResponse } = (error as any).response;
  if (instanceOfApiErrorResponse(errorResponse)) {
    return {
      statusCode: errorResponse.status_code,
      messages: [errorResponse.message]
    };
  }

  return {
    statusCode: 500,
    messages: ["A server error has occurred"]
  };
}

export const BaseApi = {
  async get(url: string, params?: object) {
    try {
      const response = await http.get(url, { params });
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(handleError(error));
    }
  },

  async post(url: string, body: object) {
    try {
      const response = await http.post(url, body);
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(handleError(error));
    }
  },

  async createCheckoutSession(priceId: string, stripeCustomerId: string) {
    try {
      const response = await http.post(
        "/subscriptions/create-checkout-session/?price=" +
          priceId +
          "&customerId=" +
          stripeCustomerId
      );
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(handleError(error));
    }
  },

  async put(url: string, body: object) {
    try {
      const response = await http.put(url, body);
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(handleError(error));
    }
  },

  async delete(url: string) {
    try {
      const response = await http.delete(url);
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(handleError(error));
    }
  }
};

export default BaseApi;
