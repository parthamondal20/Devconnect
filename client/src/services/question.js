import api from "../api/axios";
const createQuestion = async (payload) => {
  try {
    const res = await api.post("/questions/create", { payload });
    return res.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllQuestions = async () => {
  try {
    const res = await api.get("/questions/");
    console.log(res);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

const deleteQuestion = async (id) => {
  try {
    const res = await api.delete(`/questions/delete/${id}`);
    console.log(res);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

const handleVote = async (questionId) => {
  try {
    const res = await api.post(`/questions/vote/${questionId}`);
    console.log(res);
    return res.data.data;
  } catch (error) {
    throw error;
  }
}
export { createQuestion, getAllQuestions, deleteQuestion, handleVote };
