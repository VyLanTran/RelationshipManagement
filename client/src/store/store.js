// this file accumulates all of the reducers that we have created
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authReducer.js";

const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

export default store;
