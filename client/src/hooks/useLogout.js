import { useDispatch } from "react-redux";
import { setLogout } from "../store/authReducer";

export const useLogout = () => {
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(setLogout());
  };

  return { logout };
};
