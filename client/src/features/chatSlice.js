import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    chatPartner: null,
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        clearChatPartner: (state) => {
            state.chatPartner = null;
        },
        setChatPartner: (state, action) => {
            state.chatPartner = action.payload;
        }
    }
});

export const { clearChatPartner, setChatPartner } = chatSlice.actions;
export default chatSlice.reducer;
