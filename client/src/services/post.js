import api from "../api/axios.js";

const getPosts = async () => {
  try {
    const res = await api.get("/post/all");
    console.log(res);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

const createPost = async (formdata) => {
  try {
    const res = await api.post("/post/create", formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

const deletePost = async (postId) => {
  try {
    await api.delete(`/post/delete/${postId}`);
  } catch (error) {
    throw error;
  }
}
export { createPost, getPosts, deletePost };
