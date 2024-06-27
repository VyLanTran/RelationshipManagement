import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    friendIds: [],
    sentRequests: [],
    receivedRequests: [],
    profileViewing: null,
}

export const friendSlice = createSlice({
    name: 'friend',
    initialState,
    reducers: {
        setFriendIds: (state, action) => {
            state.friendIds = action.payload
        },
        setSentRequests: (state, action) => {
            state.sentRequests = action.payload
        },
        setReceivedRequests: (state, action) => {
            state.receivedRequests = action.payload
        },
        setProfileViewing: (state, action) => {
            state.profileViewing = action.payload
        },
        friendReset: (state) => {
            state.friendIds = []
            state.sentRequests = []
            state.receivedRequests = []
            state.profileViewing = null
        },
    },
})

export const {
    setFriendIds,
    setSentRequests,
    setReceivedRequests,
    setProfileViewing,
    friendReset,
} = friendSlice.actions
export default friendSlice.reducer
