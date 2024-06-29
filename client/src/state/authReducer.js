import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    token: null,
    oAuthToken: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    // reducers are all functions related to authentication
    reducers: {
        setLogin: (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.oAuthToken = action.payload.oAuthToken
        },
        setLogout: (state) => {
            state.user = null
            state.token = null
        },
        updateUser: (state, action) => {
            state.user = action.payload.user
        },
    },
})

export const { setLogin, setLogout, updateUser } = authSlice.actions
export default authSlice.reducer
