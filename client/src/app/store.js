import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import themeReducer from "../features/themeSlice";
import postReducer from "../features/postSlice";
const saveState = (state) => {
  localStorage.setItem("appStore", JSON.stringify(state));
};
const loadState = () => {
  const state = localStorage.getItem("appStore");
  return state ? JSON.parse(state) : undefined;
};
const preloadedState = loadState();
const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    post: postReducer,
  },
  preloadedState,
});
store.subscribe(() =>
  saveState({
    auth: store.getState().auth,
    theme: store.getState().theme,
    post: store.getState().post,
  })
);
export default store;
