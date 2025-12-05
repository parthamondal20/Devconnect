import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  post: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPost: (state, action) => {
      state.post = action.payload;
    },
    clearPost: (state) => {
      state.post = null;
    }
  },
});
export const { setPost, clearPost } = postSlice.actions;
export default postSlice.reducer;
