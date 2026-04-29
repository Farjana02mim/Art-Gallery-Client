import axios from "axios";
import useAuth from "./useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL?.trim() || "http://localhost:3000",
});

const useAxiosSecure = () => {
  const { signOut } = useAuth() || {};
  const navigate = useNavigate();

  useEffect(() => {

    // ===== Request Interceptor =====
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access-token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ===== Response Interceptor =====
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          (error.response?.status === 401 || error.response?.status === 403) &&
          signOut
        ) {
          await signOut();
          localStorage.removeItem("access-token");
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    // ===== Cleanup on unmount =====
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };

  }, [signOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;