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
        setSentRequest: (state, action) => {
            state.sentRequests = action.payload
        },
        setProfileViewing: (state, action) => {
            state.profileViewing = action.payload
        },
        friendReset: (state) => {
            state.friendIds = []
            state.friendRequests = []
            state.profileViewing = null
        },
    },
})

export const { setFriendIds, setSentRequest, setProfileViewing, friendReset } =
    friendSlice.actions
export default friendSlice.reducer
