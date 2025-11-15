import api from "../api/axios";
const getUser = async () => {
  try {
    const res = await api.get("/user/me");
    console.log(res);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

const getUserProfile = async (userId) => {
  try {
    // Public user route (no auth required)
    const res = await api.get(`/user/${userId}`);
    console.log(res);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

const followUser = async (userId) => {
  try {
    const res = await api.post(`/user/follow`, { user_id: userId });
    return res.data.data;
  } catch (error) {
    throw error;
  }
}
const uploadAvatar = async (formdata) => {
  try {
    const res = await api.put("/user/upload-avatar", formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data;
  } catch (error) {
    throw error;
  }
};
export { getUser, uploadAvatar, getUserProfile, followUser };
