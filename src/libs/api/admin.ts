import axios from "axios";

export const login = async (admin) => {
  return await axios.post("/api/admin/login", {
    ...admin,
  });
};

export const getAdminInfo = async () => {
  return await axios.get("/api/admin");
};

export const getReport = async (time) => {
  return await axios.get(`/api/admin/report?time=${time}`);
};

export const getUsers = async () => {
  return await axios.get("/api/admin/user");
};

export const updateUserStatus = async (id, status) => {
  return await axios.post(`/api/admin/user/${id}/status`, {
    userId: id,
    status,
  });
};

export const updateUserVerify = async (id, verify) => {
  return await axios.post(`/api/admin/user/${id}/verify`, {
    userId: id,
    verify,
  });
};

export const updateUserPlan = async (id, accountType) => {
  return await axios.post(`/api/admin/user/${id}/plan`, {
    userId: id,
    accountType,
  });
};

export const getUserTickets = async (status) => {
  return await axios.get(`/api/admin/user/tickets?status=${status}`);
};

export const closeTicket = async (id) => {
  return await axios.put(`/api/admin/user/tickets`, {
    id: id,
  });
};

export const getUsersStat = async (time) => {
  return await axios.get(`/api/admin/user/stats/users?time=${time}`);
};

export const getUsersStatChart = async () => {
  return await axios.get(`/api/admin/user/stats/users/chart`);
};

export const getUsersStatTickets = async (time) => {
  return await axios.get(`/api/admin/user/stats/tickets?time=${time}`);
};

export const getUsersStatFeedback = async (time) => {
  return await axios.get(`/api/admin/user/stats/feedback?time=${time}`);
};

export const getUsersStatFeedbackData = async (time) => {
  return await axios.get(`/api/admin/user/stats/feedback/data?time=${time}`);
};

export const getUsersStatsChat = async (time) => {
  return await axios.get(`/api/admin/user/stats/chats?time=${time}`);
};
