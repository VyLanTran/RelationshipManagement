import { useState } from "react";
import { useDispatch } from "react-redux";
import { setLogin } from "../store/authReducer";

export const useLogin = () => {
  const [error, setError] = useState(null); // at the beginning, there is no error
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const res = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // indicate the body of request is json
      body: JSON.stringify({
        email,
        password,
      }), // convert json-formatted data into a string and parse it to extract required field
    });

    const json = await res.json();

    if (!res.ok) {
      setIsLoading(false); // stop loading
      setError(json.error);
      throw new Error(json.error);
    } else {
      // save user into local storage
      localStorage.setItem("user", JSON.stringify(json.user));
      localStorage.setItem("token", JSON.stringify(json.token));
      dispatch(
        setLogin({
          user: json.user,
          token: json.token,
        })
      );

      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
