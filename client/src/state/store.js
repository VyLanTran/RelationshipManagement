import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
// import storage from 'redux-persist/lib/storage/session'
import storage from 'redux-persist/lib/storage'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react.js'
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

import { setupListeners } from '@reduxjs/toolkit/query'
import { api } from './api.js'

const rootReducer = combineReducers({
    auth: authReducer,
    chat: chatReducer,
    friend: friendReducer,
    [api.reducerPath]: api.reducer,
})

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
    // whitelist: ["auth"],
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
        }).concat(api.middleware),
})
setupListeners(store.dispatch)

export const resetAllSlices = () => {
    store.dispatch(setLogout())
    store.dispatch(chatReset())
    store.dispatch(friendReset())
}

// export const store = configureStore({
//     reducer: persistedReducer,
// })

export const persistor = persistStore(store)

export const clearPersistedState = () => {
    persistor.purge()
}