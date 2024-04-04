import { createContext, useEffect, useReducer, useState } from "react";

export const AuthContext = createContext();

/*
Set the state of user based on 3 cases: 
- Just logging in: current state will take all information of the user just logged in
- Logging out: current state becomes null
- Between logging in and logging out: current state stays the same
*/
export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null, // user is null in the beginning because no user logged in yet
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "LOGIN", payload: user });
    }
    setLoading(false);
    console.log(user);
  }, []);

  // If the page is still loading, we return null
  if (loading) return null;

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
