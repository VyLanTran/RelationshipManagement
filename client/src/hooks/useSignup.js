import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [error, setError] = useState(null); // at the beginning, there is no error
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (
    firstName,
    lastName,
    email,
    username,
    password,
    confirmPassword
  ) => {
    setIsLoading(true);
    setError(null);

    const res = await fetch("http://localhost:3001/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // indicate the body of request is json
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        username,
        password,
        confirmPassword,
      }), // convert json-formatted data into a string and parse it to extract required field
    });

    const resJson = await res.json();

    if (!res.ok) {
      setIsLoading(false); // stop loading
      setError(resJson.error);
    } else {
      // save user into local storage
      localStorage.setItem("user", JSON.stringify(resJson));
      // update auth context with current user
      dispatch({ type: "LOGIN", payload: resJson });

      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
