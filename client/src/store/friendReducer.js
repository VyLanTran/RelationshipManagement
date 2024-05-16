import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    friends: [],
    friendRequests: [],
    profileViewing: null,
}

export const friendSlice = createSlice({
    name: 'friend',
    initialState,
    reducers: {
        setFriends: (state, action) => {
            state.friends = action.payload
        },
        setFriendRequests: (state, action) => {
            state.friendRequests = action.payload
        },
        setProfileViewing: (state, action) => {
            state.profileViewing = action.payload
        },
        friendReset: (state) => {
            state.friends = []
            state.friendRequests = []
            state.profileViewing = null
        },
    },
})

export const { setFriends, setFriendRequests, setProfileViewing, friendReset } =
    friendSlice.actions
export default friendSlice.reducer
