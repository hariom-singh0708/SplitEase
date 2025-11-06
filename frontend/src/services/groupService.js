import api from "./apiClient";

export const getGroups = async () => {
  const res = await api.get("/groups");
  return res.data.groups;
};

export const createGroup = async (data) => {
  const res = await api.post("/groups", data);
  return res.data.group;
};

export const getGroupExpenses = async (groupId) => {
  const res = await api.get(`/expenses/${groupId}`);
  return res.data.expenses;
};

export const addExpense = async (data) => {
  const res = await api.post("/expenses", data);
  return res.data.expense;
};

export const getSettlement = async (groupId) => {
  const res = await api.get(`/groups/${groupId}/settlement`);
  return res.data;
};

export const searchUsers = async (query) => {
  const res = await fetch(`/api/users/search?query=${query}`);
  return await res.json();
};

export const addMemberToGroup = async (groupId, userId) => {
  const res = await fetch(`/api/groups/${groupId}/add-member`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  return await res.json();
};


export const deleteGroup = async (groupId) => {
  try {
    const res = await api.delete(`/groups/${groupId}`);
    return res.data;
  } catch (err) {
    console.error("❌ Error deleting group:", err);
    throw err;
  }
};
