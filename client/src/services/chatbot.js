import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/chatbot",
  withCredentials: true,
});

export const askAI = async (query) => {
  const res = await API.post("/", { query });
  return res.data;
};
