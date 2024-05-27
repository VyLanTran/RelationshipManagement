import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    allChats: [],
    currentChat: null,
    // chats that contain at least a new message that we haven't read
    unreadChats: [],
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
        setUnreadChats: (state, action) => {
            state.unreadChats = action.payload
        },
        chatReset: (state) => {
            state.allChats = []
            state.currentChat = null
            state.unreadChats = []
        },
    },
})

export const { setAllChats, setCurrentChat, setUnreadChats, chatReset } =
    chatSlice.actions
export default chatSlice.reducer
