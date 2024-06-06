import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import { store, persistor } from './state/store' // Import the store and persistor
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from './components/ui/toaster'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
                <Toaster />
            </PersistGate>
        </Provider>
    </React.StrictMode>
)
