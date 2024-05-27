import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.SERVER_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    reducerPath: 'api',
    tagTypes: ['User', 'Chat', 'Message'],
    endpoints: (build) => ({
        getAllFriends: build.query({
            query: (userId) => `users/${userId}/friends`,
            providesTags: ['User'],
        }),
        searchChats: build.query({
            query: (search) => `chats/search/?search=${search}`,
            providesTags: ['Chat'],
        }),
        getAllMessages: build.query({
            query: (messageId) => `messages/${messageId}`,
            providesTags: ['Message'],
        }),
    }),
})

export const {
    useGetAllFriendsQuery,
    useSearchChatsQuery,
    useGetAllMessagesQuery,
} = api
