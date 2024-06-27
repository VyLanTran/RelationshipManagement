import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'

import authReducer, { setLogout } from './authReducer.js'
import chatReducer, { chatReset } from './chatReducer.js'
import friendReducer, { friendReset } from './friendReducer.js'
import postReducer, { postReset } from './postReducer.js'

const rootReducer = combineReducers({
    auth: authReducer,
    chat: chatReducer,
    friend: friendReducer,
    post: postReducer,
})

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
})

export const resetAllSlices = () => {
    store.dispatch(setLogout())
    store.dispatch(chatReset())
    store.dispatch(friendReset())
    store.dispatch(postReset())
}

export const persistor = persistStore(store)

export const clearPersistedState = () => {
    persistor.purge()
}
