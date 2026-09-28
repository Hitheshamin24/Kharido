import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import { login, setAccessToken } from "../state/authSlice";
import { useApiAuth } from "../api/authApi";
import { toast } from "react-toastify";
import { useCart } from "../../cart/hooks/useCart";

export const useAuthHook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, registerUser } = useApiAuth();
  const cart = useCart();

  const handleLogin = async (data) => {
    try {
      const email = data.email;
      const response = await loginUser(email, data.password);

      const name = response.data.data.name;
      const role = response.data.data.role;
      const userId = response.data.data.id;
      
      if (response.data.accessToken) {
        dispatch(setAccessToken(response.data.accessToken));
      }
      dispatch(login({ user: { userId, email, name }, role }));
      
      
      await cart.loadCart();

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
      const errorMessage =
        error.response?.data?.message || "Invalid email or password.";
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
        role,
      });

      const responseData = response.data.data || { name, email, role };
      console.log(responseData);
      if (response.data.accessToken) {
        dispatch(setAccessToken(response.data.accessToken));
      }
      dispatch(
        login({
          user: {
            email: responseData.email,
            name: responseData.name,
            userId: responseData.id,
          },
          role: responseData.role,
        }),
      );
      
      await cart.loadCart();

      toast.success("Registration successful!");

      navigate(
        responseData.role === "seller" ? "/seller/products" : "/products",
        {
          replace: true,
        },
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed.";
      toast.error(errorMessage);
    }
  };

  return {
    handleLogin,
    handleRegister,
  };
};

export default useAuthHook;
