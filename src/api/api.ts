import axios, { AxiosError } from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ApiError {
  statusCode: number,
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

http.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");
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
  return (
    "status_code" in error &&
    "status" in error &&
    "message" in error
  );
}

function handleError(error: unknown): ApiError {
  if (axios.isAxiosError(error) && error.response) {
    // @ts-ignore
    const messages = error?.response?.data?.validation_errors ? error.response.data.validation_errors.map((item) => `${item.field} ${item.message}`) : [error.response.data.message];
    return {
      statusCode: error?.response?.status,
      messages
    };
  }

  const {data: errorResponse} = (error as any).response;
  if (instanceOfApiErrorResponse(errorResponse)) {
    return {
      statusCode: errorResponse.status_code,
      messages: [errorResponse.message]
    }
  }

  return {
    statusCode: 500,
    messages: ["A server error has occurred"],
  }
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
      return Promise.reject(handleError(error))
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
