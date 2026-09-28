import { useApi } from "../../../shared/api/useApi";

export const useApiAuth = () => {
  const api = useApi();

  const loginUser = async (email, password) => {
    return await api.post("/auth/login", { email, password });
  };

  const registerUser = async (payload) => {
    return await api.post("/auth/register", payload);
  };

  const fetchUser = async () => {
    return await api.get("/auth/me");
  };

  const logoutUser = async () => {
    return await api.post("/auth/logout");
  };

  return {
    loginUser,
    registerUser,
    fetchUser,
    logoutUser,
  };
};
