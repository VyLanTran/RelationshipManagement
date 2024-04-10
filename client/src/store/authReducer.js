import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: JSON.parse(localStorage.getItem("token")) || null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  // reducers are all functions related to authentication
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    updateUser: (state, action) => {
      state.user = action.payload.user;
    },
  },
});

export const { setLogin, setLogout, updateUser } = authSlice.actions;
export default authSlice.reducer;
