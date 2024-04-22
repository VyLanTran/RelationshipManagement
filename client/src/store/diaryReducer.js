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
    },
    setInitialData: (state, action) => {
      state.allDiaries = action.payload.allDiaries;
      state.currentDiary = action.payload.currentDiary;
      state.groupDiaries = action.payload.groupDiaries;
    },
  },
});

export const { setAllDiaries, setCurrentDiary, setGroupDiaries, setInitialData, changeGroup } = diarySlice.actions;
export default diarySlice.reducer;
