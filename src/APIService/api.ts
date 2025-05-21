import { API_URL } from "../APIService/endPoints";
import axios from "axios";
import STORAGE_KEYS from "../utils/Constants";
import { getLocalStorageData } from "../utils/Storage";

type ApiResponse<T> = {
  access_token: any;
  data: T;
  message: string;
  success: boolean;
};

// Create the Axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token dynamically
api.interceptors.request.use(
  async (config) => {
    const token = await getLocalStorageData(STORAGE_KEYS.token); // Fetch token from AsyncStorage

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.role = `user`;
      config.headers["x-client-type"] = "mobile";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Extract API error response
      console.error("API Error:", error.response);
      return Promise.reject({
        ...error.response.data,
        status: error.response.status,
      }); // Reject with only response data
    } else {
      // Handle network or unexpected errors
      console.error("Network/Unexpected Error:", error.message);
      return Promise.reject({
        success: false,
        message: "Something went wrong",
      });
    }
  }
);

// API methods with optional headers
export const fetchData = <T>(endpoint: string, params?: any, headers?: any) =>
  api.get<ApiResponse<T>>(endpoint, { params, headers });

export const postData = <T>(endpoint: string, data?: any, headers?: any) =>
  api.post<ApiResponse<T>>(endpoint, data, { headers });

export const patchData = <T>(endpoint: string, data: any, headers?: any) =>
  api.patch<ApiResponse<T>>(endpoint, data, { headers });

export const putData = <T>(endpoint: string, data: any, headers?: any) =>
  api.put<ApiResponse<T>>(endpoint, data, { headers });

export const deleteData = <T>(endpoint: string) =>
  api.delete<ApiResponse<T>>(endpoint);

export default api;
