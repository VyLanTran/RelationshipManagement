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

import authReducer from './authReducer.js'
import chatReducer from './chatReducer.js'
import friendReducer from './friendReducer.js'

const rootReducer = combineReducers({
    auth: authReducer,
    chat: chatReducer,
    friend: friendReducer,
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
        }),
})

// export const store = configureStore({
//     reducer: persistedReducer,
// })

export const persistor = persistStore(store)

export const clearPersistedState = () => {
    persistor.purge()
}
