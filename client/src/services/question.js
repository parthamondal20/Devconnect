import api from "../api/axios";
const createQuestion = async (payload) => {
  const res = await api.post("/", payload);
  return res.data;
};

const getAllQuestions = async () => {
  const res = await api.get("/");
  return res.data;
};

export { createQuestion, getAllQuestions };
