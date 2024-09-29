import axios from "axios";

export const login = async (user) => {
  return await axios.post("/api/auth/login", {
    ...user,
  });
};

export const signup = async (user) => {
  return await axios.post("/api/auth/register", {
    ...user,
  });
};

export const getUserDetails = async () => {
  return await axios.get("/api/user");
};

export const getUserChats = async () => {
  return await axios.get("/api/user/chat");
};

export const createNewChat = async (query) => {
  return await axios.post("/api/user/chat", { query });
};

export const userAskQuery = async (query, chatId) => {
  return await axios.post(`/api/user/chat/${chatId}`, {
    userQuery: query,
  });
};

export const getChatTicket = async (chatId) => {
  return await axios.get(`/api/user/chat/${chatId}/tickets`);
};

export const verifyUser = async (otp) => {
  return await axios.post(`/api/auth/register/verify`, {
    otp: otp,
  });
};

export const resendOTP = async () => {
  return await axios.put("/api/auth/register/verify");
};

export const sendResetPassowordEmail = async (email) => {
  return await axios.post("/api/auth/login/reset-password", {
    email: email,
  });
};

export const verifyResetPasswordToken = async (token) => {
  return await axios.get("/api/auth/login/reset-password", {
    headers: {
      "reset-token": token,
    },
  });
};

export const resetPassword = async (password) => {
  return await axios.put("/api/auth/login/reset-password", {
    password: password,
  });
};

export const deleteAllChats = async () => {
  return await axios.delete("/api/user/chat");
};

export const deleteChat = async (chatId) => {
  return await axios.delete(`/api/user/chat/${chatId}`);
};

export const updateChatTitle = async (chatId, title) => {
  return await axios.put(`/api/user/chat/${chatId}`, {
    title: title,
  });
};

export const googleLogin = async (token) => {
  return await axios.post("/api/auth/google", {
    accessToken: token,
  });
};

export const upgradeToPro = async () => {
  return await axios.post("/api/user/plan/pro");
};

export const manageCustomerPortal = async () => {
  return await axios.post("/api/user/customerportal");
};

export const messageHelpful = async (chatId, messageId, helpful, reason) => {
  return await axios.put(
    `/api/user/chat/${chatId}/message/${messageId}/helpful`,
    {
      helpful,
      reason,
    }
  );
};

export const getChatById = async (chatId) => {
  return axios.get(`/api/user/chat/${chatId}`);
};

export const getQuestions = async () => {
  return axios.get("/api/user/questions");
};

export const postQuestionsAnswers = async (questions) => {
  return axios.post("/api/user/questions", {
    questions,
  });
};
