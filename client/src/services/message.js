import api from "../api/axios";

const getConversations = async () => {
    try {
        const res = await api.get("/message/conversations");
        return res.data.data;
    } catch (error) {
        throw error;
    }
};

const getConversationById = async (conversationId) => {
    try {
        const res = await api.get(`/message/${conversationId}`);
        console.log("messages:", res);
        return res.data.data;
    } catch (error) {
        throw error;
    }
};

const createConversation = async (memberIds) => {
    try {
        const res = await api.post("/message/create", { memberIds });
        return res.data.data;
    } catch (error) {
        throw error;
    }
};
const sendMessage = async (conversationId, text, receiverId) => {
    try {
        const res = await api.post("/message/send", { conversationId, text, receiverId });
        return res.data.data;
    } catch (error) {
        throw error;
    }
};


export { getConversations, createConversation, sendMessage, getConversationById };