// src/services/api.js
import axios from "axios";

const EXPENSE_API_URL = "/api/expenses";
const INCOME_API_URL = "/api/income";
const AUTH_API_URL = "/api/auth";

// Expenses API
export const getExpenses = async (startDate, endDate, token) => {
  try {
    const response = await axios.get(EXPENSE_API_URL, {
      params: { startDate, endDate },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
};

export const addExpense = async (expense, token) => {
  try {
    const response = await axios.post(EXPENSE_API_URL, expense, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding expense:", error);
    throw error;
  }
};

export const deleteExpense = async (id, token) => {
  try {
    const response = await axios.delete(`${EXPENSE_API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};

export const updateExpense = async (id, updatedExpense, token) => {
  try {
    const response = await axios.put(`${EXPENSE_API_URL}/${id}`, updatedExpense, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
};

// Income API
export const getAllIncome = async (token) => {
  try {
    const response = await axios.get(INCOME_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching income:", error);
    throw error;
  }
};

export const addIncome = async (income, token) => {
  try {
    const response = await axios.post(INCOME_API_URL, income, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding income:", error);
    throw error;
  }
};

// Authentication API
export const register = async (email, password) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/register`, {
      email,
      password,
    });
    return response.data; // Expected to be a string message
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/login`, {
      email,
      password,
    });
    return response.data; // Expected to be the token string
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
