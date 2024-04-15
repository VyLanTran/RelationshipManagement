import { useDispatch } from "react-redux";
import { setLogout } from "../store/authReducer";

export const useLogout = () => {
  const dispatch = useDispatch();

  const logout = () => {
    // remove current user from local storage
    // localStorage.removeItem("user");
    // localStorage.removeItem("token");

    dispatch(setLogout());
  };

  return { logout };
};
