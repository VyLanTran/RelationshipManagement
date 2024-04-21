import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allDiaries: [],
  currentDiary: {},
  groupDiaries: [],
};

export const diarySlice = createSlice({
  name: "diary",
  initialState,
  reducers: {
    setAllDiaries: (state, action) => {
      state.allDiaries = action.payload;
    },
    setCurrentDiary: (state, action) => {
      state.currentDiary = action.payload;
    },
    setGroupDiaries: (state, action) => {
        state.groupDiaries = action.payload;
    }
  },
});

export const { setAllDiaries, setCurrentDiary, setGroupDiaries } = diarySlice.actions;
export default diarySlice.reducer;
