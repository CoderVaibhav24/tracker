/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef, useContext } from "react";
import { getExpenses, addExpense, addIncome, getAllIncome } from "../services/api";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseChart from "../components/ExpenseChart";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import "./Dashboard.css";
import { AuthContext } from "../contexts/AuthContext"; // Import AuthContext

function Dashboard() {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [incomeList, setIncomeList] = useState([]); // List of income records
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState(null);

  const [incomeDescription, setIncomeDescription] = useState(""); // Income description
  const [incomeAmount, setIncomeAmount] = useState(""); // Single income amount
  const [incomeDate, setIncomeDate] = useState(""); // Income date
  const [balanceLeft, setBalanceLeft] = useState("");

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const chartRef = useRef(); // Reference for the chart

  // Initialize savingGoal with localStorage or default to 500
  const [savingGoal, setSavingGoal] = useState(() => {
    const storedSavingGoal = localStorage.getItem("savingGoal");
    return storedSavingGoal !== null ? parseFloat(storedSavingGoal) : 500;
  });

  // Load categories from localStorage on mount
  useEffect(() => {
    const storedCategories = localStorage.getItem("categories");
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(["Salary", "Business", "Others"]); // Default categories
    }
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !incomeDescription) {
      setIncomeDescription(categories[0]);
    }
  }, [categories]);

  // Save savingGoal to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("savingGoal", savingGoal);
  }, [savingGoal]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchExpenses();
      fetchIncomeDetails();
    }
  }, [isAuthenticated, startDate, endDate]);

  useEffect(() => {
    const totalIncome = incomeList.reduce((sum, record) => sum + record.amount, 0);
    calculateBalanceLeft(totalIncome, savingGoal);
  }, [incomeList, savingGoal, expenses]);

  const fetchIncomeDetails = async () => {
    try {
      const incomeData = await getAllIncome(token); // Pass token
      setIncomeList(incomeData); // Backend should return an array of income records
    } catch (error) {
      setError("Failed to fetch income details. Please try again.");
      console.error("Failed to fetch income details:", error);
    }
  };

  const calculateBalanceLeft = (totalIncome, savingGoal) => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    setBalanceLeft(totalIncome - totalExpenses - savingGoal);
  };

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses(startDate, endDate, token); // Pass token
      setExpenses(data);
      setFilteredExpenses(data);
    } catch (error) {
      setError("Failed to fetch expenses.");
      console.error("Failed to fetch expenses:", error);
    }
  };

  const handleAddIncome = async () => {
    try {
      let description = incomeDescription;

      if (description === "add_new_category") {
        if (newCategory && !categories.includes(newCategory)) {
          const updatedCategories = [...categories, newCategory];
          setCategories(updatedCategories);
          localStorage.setItem("categories", JSON.stringify(updatedCategories));
          description = newCategory;
          setNewCategory("");
        } else {
          setError("Please enter a valid new category.");
          return;
        }
      }

      if (!description || !incomeAmount || !incomeDate) {
        setError("Please fill in all income fields.");
        return;
      }
      await addIncome(
        {
          description: description,
          amount: parseFloat(incomeAmount),
          date: incomeDate,
        },
        token // Pass token
      );
      setIncomeDescription(categories[0]); // Reset to first category
      setIncomeAmount("");
      setIncomeDate("");
      fetchIncomeDetails();
    } catch (error) {
      setError("Failed to add income. Please try again.");
      console.error("Failed to add income:", error);
    }
  };

  const handleExportPDF = async () => {
    const chartElement = chartRef.current;
    if (chartElement) {
      const canvas = await html2canvas(chartElement);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 190, 90); // Add the chart image to the PDF
      pdf.save("chart.pdf");
    } else {
      alert("Chart is not available for export.");
    }
  };

  const handleExportExcel = () => {
    const data = filteredExpenses.map((expense) => ({
      Date: new Date(expense.date).toLocaleDateString(),
      Amount: expense.amount.toFixed(2),
      Description: expense.description,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    XLSX.writeFile(workbook, "expenses.xlsx");
  };

  const handleAddExpense = async (expense) => {
    try {
      await addExpense(expense, token); // Pass token
      fetchExpenses();
    } catch (error) {
      setError("Failed to add expense. Please try again.");
      console.error("Failed to add expense:", error);
    }
  };

  const handleSavingGoalChange = (e) => {
    const value = e.target.value;
    setSavingGoal(value !== "" ? parseFloat(value) : 0);
  };

  const handleLogout = () => {
    logout();
    // Optionally, redirect to login page
  };

  return (
    <div className="dashboard">
      <div className="main-content">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Personal Finance Tracker
          </h1>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </header>

        {/* Income Goals */}
        <div className="my-4">
          <h2>Income Goals</h2>
          <label className="block mb-2">
            Saving Goal:
            <input
              type="number"
              value={savingGoal}
              onChange={handleSavingGoalChange}
              className="ml-2 p-1 border border-gray-300 rounded"
            />
          </label>
          <p>
            <strong>Balance Left:</strong> ₹{balanceLeft}
          </p>
        </div>

        {/* Add Income Section */}
        <div className="my-4">
          <h2>Income Sources</h2>
          <div className="income-form mb-4">
            <label>
              Description:
              <select
                value={incomeDescription}
                onChange={(e) => setIncomeDescription(e.target.value)}
                className="ml-2 p-1 border border-gray-300 rounded"
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
                <option value="add_new_category">Add New Category</option>
              </select>
            </label>
            {incomeDescription === "add_new_category" && (
              <div className="mt-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category"
                  className="ml-2 p-1 border border-gray-300 rounded"
                />
                <button
                  className="ml-2 p-1 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => {
                    if (newCategory && !categories.includes(newCategory)) {
                      const updatedCategories = [...categories, newCategory];
                      setCategories(updatedCategories);
                      localStorage.setItem(
                        "categories",
                        JSON.stringify(updatedCategories)
                      );
                      setIncomeDescription(newCategory);
                      setNewCategory("");
                    }
                  }}
                >
                  Add Category
                </button>
              </div>
            )}
            <label className="block mt-4">
              Amount:
              <input
                type="number"
                value={incomeAmount}
                onChange={(e) => setIncomeAmount(e.target.value)}
                className="ml-2 p-1 border border-gray-300 rounded"
              />
            </label>
            <label className="block mt-2">
              Date:
              <input
                type="date"
                value={incomeDate}
                onChange={(e) => setIncomeDate(e.target.value)}
                className="ml-2 p-1 border border-gray-300 rounded"
              />
            </label>
            <button
              className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleAddIncome}
            >
              Add Income
            </button>
          </div>
          <div className="income-list">
            <h3>Income Sources:</h3>
            <ul>
              {incomeList.map((income, index) => (
                <li key={index}>
                  {income.date || "No Date"} -{" "}
                  {income.description || "No Description"}:{" "}
                  {income.amount !== null && income.amount !== undefined
                    ? `₹${income.amount.toFixed(2)}`
                    : "No Amount"}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Filter Expenses */}
        <div className="filter-section my-4">
          <h2>Filter Expenses</h2>
          <label className="block mb-2">
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="ml-2 p-1 border border-gray-300 rounded"
            />
          </label>
          <label className="block mb-2">
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="ml-2 p-1 border border-gray-300 rounded"
            />
          </label>
          <button
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={fetchExpenses}
          >
            Apply Filter
          </button>
        </div>

        {/* Add Expense */}
        <ExpenseForm onAddExpense={handleAddExpense} />

        {/* Export Options */}
        <div className="export-buttons my-4">
          <button
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
            onClick={handleExportPDF}
          >
            Export as PDF
          </button>
          <button
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleExportExcel}
          >
            Export as Excel
          </button>
        </div>

        {/* Expense List */}
        <ExpenseList
          expenses={filteredExpenses}
          onExpenseUpdated={fetchExpenses}
          onExpenseDeleted={fetchExpenses}
        />

        {/* Expense Chart */}
        <div className="chart-container" ref={chartRef}>
          <ExpenseChart expenses={filteredExpenses} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
