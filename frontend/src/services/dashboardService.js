import api from "./api";

export const getDashboardSummary = async ({
  from = "",
  to = "",
} = {}) => {
  const response = await api.get("/dashboard/summary", {
    params: {
      from: from || undefined,
      to: to || undefined,
    },
  });

  return response.data;
};

export const getMonthlySummary = async ({
  from = "",
  to = "",
} = {}) => {
  const response = await api.get("/dashboard/monthly", {
    params: {
      from: from || undefined,
      to: to || undefined,
    },
  });

  return response.data;
};

export const getYearlySummary = async ({
  from = "",
  to = "",
} = {}) => {
  const response = await api.get("/dashboard/yearly", {
    params: {
      from: from || undefined,
      to: to || undefined,
    },
  });

  return response.data;
};

export const getCategorySummary = async ({
  from = "",
  to = "",
} = {}) => {
  const response = await api.get("/dashboard/categories", {
    params: {
      from: from || undefined,
      to: to || undefined,
    },
  });

  return response.data;
};