import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    allChats: [],
    currentChat: null,
}

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setAllChats: (state, action) => {
            state.allChats = action.payload
        },
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload
        },
    },
})

export const { setAllChats, setCurrentChat } = chatSlice.actions
export default chatSlice.reducer
