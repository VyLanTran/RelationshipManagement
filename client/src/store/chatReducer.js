import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  //   allChats: JSON.parse(localStorage.getItem("allChats")) || null,
  //   selectedChat: JSON.parse(localStorage.getItem("selectedChat")) || null,
  allChats: [],
  selectedChat: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setAllChats: (state, action) => {
      state.allChats = action.payload;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
  },
});

export const { setAllChats, setSelectedChat } = chatSlice.actions;
export default chatSlice.reducer;
