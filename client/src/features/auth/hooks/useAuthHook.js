import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import { login } from "../state/authSlice";
import { useApiAuth } from "../api/authApi";
import { toast } from "react-toastify";

export const useAuthHook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, registerUser } = useApiAuth();

  const handleLogin = async (data) => {
    try {
      const email = data.email;
      const response = await loginUser(email, data.password);
      
      const name = response.data.data.name;
      const role = response.data.data.role;
      dispatch(login({ user: { email, name }, role }));
      
      toast.success("Login successful!");

      const from = location.state?.from?.pathname;
      if (from && from !== "/login") {
        navigate(from, { replace: true });
      } else {
        navigate(role === "seller" ? "/seller/products" : "/products", {
          replace: true,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Invalid email or password.";
      toast.error(errorMessage);
    }
  };

  const handleRegister = async (data) => {
    try {
      const email = data.email;
      const role = data.isSeller ? "seller" : "user";
      const name = data.username || (email ? email.split("@")[0] : "User");

      const response = await registerUser({
        name,
        email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role
      });

      const responseData = response.data.data || { name, email, role };
      dispatch(login({ user: { email: responseData.email, name: responseData.name }, role: responseData.role }));
      
      toast.success("Registration successful!");

      navigate(responseData.role === "seller" ? "/seller/products" : "/products", {
        replace: true,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed.";
      toast.error(errorMessage);
    }
  };

  return {
    handleLogin,
    handleRegister,
  };
};

export default useAuthHook;
