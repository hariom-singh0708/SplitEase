import api from "./apiClient";

export const getTransactions = async (type) => {
  const res = await api.get(`/transactions?type=${type}`);
  return res.data.transactions;
};

export const createTransaction = async (payload) => {
  const res = await api.post("/transactions", payload);
  return res.data.transaction;
};

export const updateTransaction = async (id, payload) => {
  const res = await api.patch(`/transactions/${id}`, payload);
  return res.data.transaction;
};

export const deleteTransaction = async (id) => {
  await api.delete(`/transactions/${id}`);
};
