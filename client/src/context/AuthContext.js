import { createContext, useEffect, useReducer } from "react";

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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "LOGIN", payload: user });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
