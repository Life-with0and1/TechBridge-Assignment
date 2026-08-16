import api from "./api";

export const getCategories = async () => {
  const response = await api.get("/categories");

  return response.data;
};

export const createCategory = async (name) => {
  const response = await api.post("/categories", {
    name,
  });

  return response.data;
};