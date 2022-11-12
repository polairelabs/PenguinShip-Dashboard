import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const headers = {
    "Content-type": "application/json"
};

console.log("baseUrl", baseUrl);

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

export const BaseApi = {
    async get(url: string, params?: object) {
        try {
            const response = await http.get(url, { params });
            return Promise.resolve(response.data);
        } catch (error) {
            // TODO create handle error method
            console.log(error);
            return Promise.reject(error);
        }
    },

    async post(url: string, body: object) {
        try {
            const response = await http.post(url, body);
            return Promise.resolve(response.data);
        } catch (error) {
            return Promise.reject(error);
        }
    },

    async put(url: string, body: object) {
        try {
            const response = await http.put(url, body);
            return Promise.resolve(response.data);
        } catch (error) {
            return Promise.reject(error);
        }
    },

    async delete(url: string) {
        try {
            const response = await http.delete(url);
            return Promise.resolve(response.data);
        } catch (error) {
            return Promise.reject(error);
        }
    }
};

export default BaseApi;