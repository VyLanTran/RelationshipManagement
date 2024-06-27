import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import BASE_URL from './.@/../../constants.js'

export const fetchedPosts = createAsyncThunk('posts', async (_, { getState }) => {
    const token = getState().auth.token;
    const response = await fetch(`${BASE_URL}/posts`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json()
    return data
})

const initialState = {
    items: [],
    status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
  }

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPost: (state, action) => {
            state.items = action.payload
        },
        addPost: (state, action) => {
            state.items.push(action.payload);
          },
          deletePost: (state, action) => {
            state.items = state.items.filter(post => post.id !== action.payload);
          },
          editPost: (state, action) => {
            const index = state.items.findIndex(post => post.id === action.payload.id);
            state.items[index] = action.payload;
          },
          postReset: (state, action) => {
            state.items = []
            state.status = 'idle'
            state.error = null
          }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchedPosts.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchedPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.posts;
            })
            .addCase(fetchedPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
        }
})

export const { setPost, addPost, deletePost, editPost, postReset } = postSlice.actions;

export default postSlice.reducer;