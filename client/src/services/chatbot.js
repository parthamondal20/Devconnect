import api from "../api/axios.js";

export const askAI = async (query) => {
  try {
    const res = await api.post("/chatbot/chat", {
      query
    })
    return res.data.data;
  } catch (error) {
    throw error;
  }
};
