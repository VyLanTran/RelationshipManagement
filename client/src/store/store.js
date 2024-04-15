import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage/session";

import authReducer from "./authReducer.js";
import chatReducer from "./chatReducer.js";

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  // whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
