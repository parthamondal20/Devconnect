import api from "../api/axios";
const githubLogin = async () => {
  try {
    const res = await api.get("/auth/github");
    return res;
  } catch (error) {
    throw error;
  }
};
const logout = async (user_id) => {
  try {
    await api.post("/auth/logout", {
      user_id,
    });
  } catch (error) {
    throw error;
  }
};

const sendOTP = async (email) => {
  try {
    const res = await api.post("/auth/send-otp", {
      email,
    });
    console.log(res);
  } catch (error) {
    throw error;
  }
};

const verifyOTP = async (email, otp) => {
  try {
    await api.post("/auth/verify-otp", {
      email,
      otp,
    });
  } catch (error) {
    throw error;
  }
};

const resendOTP = async (email) => {
  try {
    const res = await api.post("/auth/resend-otp", {
      email,
    });
  } catch (error) {
    throw error;
  }
};
const signup = async (username, email, password) => {
  try {
    const res = await api.post("/auth/signup", {
      email,
      password,
      username,
    });
    return res.data.data;
  } catch (error) {
    throw error;
  }
};
const signin = async (email, password) => {
  try {
    const res = await api.post("/auth/signin", {
      email,
      password,
    });
    return res.data.data;
  } catch (error) {
    throw error;
  }
};
export { githubLogin, logout, sendOTP, verifyOTP, signup, signin, resendOTP };
