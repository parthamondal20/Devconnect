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
  },
});
export const { setPost } = postSlice.actions;
export default postSlice.reducer;
