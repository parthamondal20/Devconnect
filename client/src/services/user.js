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

const editProfile = async (payload) => {
  try {
    const res = await api.put("/user/profile/edit", {
      payload
    })
  } catch (error) {
    throw error;
  }
}
const getUserProfile = async (userId) => {
  try {
    // Public user route (no auth required)
    const res = await api.get(`/user/profile/${userId}`);
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


const getFollowers = async () => {
  try {
    const res = await api.get("/user/followers");
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

const getFollowing = async () => {
  try {
    const res = await api.get("/user/following");
    return res.data.data;
  } catch (error) {
    throw error;
  }
}
const searchUser = async (query) => {
  try {
    const res = await api.get(`/user/search?q=${query}`);
    console.log(res);
    return res.data.data;
  } catch (error) {
    throw error;
  }
}
const addToSearchHistory = async (searchedUser) => {
  try {
    const res = await api.post(`/user/search-history/add`, {
      searchedUser
    });
  } catch (error) {
    throw error;
  }
}
const getSearchHistory = async () => {
  try {
    const res = await api.get(`/user/search-history`);
    return res.data.data;
  } catch (error) {
    throw error;
  }
}
const clearSearchHistory = async () => {
  try {
    const res = await api.delete(`/user/search-history/clear`);
  } catch (error) {
    throw error;
  }
}
const deleteSearchHistoryItem = async (searchHistoryId) => {
  try {
    const res = await api.delete(`/user/search-history/${searchHistoryId}`);
  } catch (error) {
    throw error;
  }
}

const saveToken = async (token) => {
  try {
    const res = await api.post(`/user/save-token`, {
      token
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}
export { getUser, uploadAvatar, getUserProfile, followUser, getFollowers, searchUser, getFollowing, editProfile, addToSearchHistory, getSearchHistory, clearSearchHistory, deleteSearchHistoryItem, saveToken };