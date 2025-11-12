import api from "../api/axios.js";

export const askAI = async (messages) => {
  try {
    const res = await api.post("/chatbot/chat", {
      messages
    })
    return res.data.data;
  } catch (error) {
    throw error;
  }
};
