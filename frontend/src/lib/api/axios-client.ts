// import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect } from "react";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const axiosInstance = axios.create({
  baseURL,
});

// custom hook to use auth token
export const useAuthAxios = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // cleanup
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
    };
  }, [getToken]);

  return axiosInstance;
};

// public axios instance
export const publicAxios = axios.create({
  baseURL,
});

