import api from "../api/axios";

const likeRequest = async (post_id) => {
  try {
    const res=await api.put(`/like/${post_id}`);
    console.log(res);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

export { likeRequest };
