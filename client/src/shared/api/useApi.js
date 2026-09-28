import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAccessToken,
  setAccessToken,
  logout,
} from "../../features/auth/state/authSlice";
import { clearCart } from "../../features/cart/state/cartSlice";

export const useApi = () => {
  const accessToken = useSelector(selectAccessToken);
  const dispatch = useDispatch();

  const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
    timeout: 10000,
    withCredentials: true,
  });

  api.interceptors.request.use((config) => {
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      const isAuthRoute = originalRequest.url.includes('/auth/login') || 
                          originalRequest.url.includes('/auth/register') ||
                          originalRequest.url.includes('/auth/refresh-token');

      if (error.response && error.response.status === 401 && !originalRequest._retry && !isAuthRoute) {
        originalRequest._retry = true;
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh-token`,
            {},
            { withCredentials: true }
          );
      
          dispatch(setAccessToken(res.data.accessToken));
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return await api(originalRequest);
        } catch (refreshError) {
          // Call backend logout to clear any httpOnly cookies just in case
          try {
            await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
              {},
              { withCredentials: true }
            );
          } catch (logoutErr) {
            console.error("Logout API failed", logoutErr);
          }
          dispatch(logout());
          dispatch(clearCart());

          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
  return api;
};
