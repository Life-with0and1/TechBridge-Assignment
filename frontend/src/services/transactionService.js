import api from "./api";

export const getTransactions = async ({
  page = 1,
  limit = 10,
  search = "",
  category_id = "",
  type = "",
} = {}) => {
  const response = await api.get("/transactions", {
    params: {
      page,
      limit,
      search: search || undefined,
      category_id: category_id || undefined,
      type: type || undefined,
    },
  });

  return response.data;
};

export const getTransactionById = async (id) => {
  const response = await api.get(`/transactions/${id}`);

  return response.data;
};

export const createTransaction = async (transactionData) => {
  const response = await api.post(
    "/transactions",
    transactionData
  );

  return response.data;
};

export const updateTransaction = async (
  id,
  transactionData
) => {
  const response = await api.put(
    `/transactions/${id}`,
    transactionData
  );

  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await api.delete(
    `/transactions/${id}`
  );

  return response.data;
};