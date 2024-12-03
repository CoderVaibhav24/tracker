import PropTypes from "prop-types";
import { updateExpense, deleteExpense } from "../services/api"; // Keep this line
import "./ExpenseList.css";


function ExpenseList({ expenses, onExpenseUpdated, onExpenseDeleted }) {
  const handleUpdate = async (expense) => {
    const updatedDescription = prompt(
      "Enter new description:",
      expense.description
    );
    const updatedAmount = parseFloat(
      prompt("Enter new amount:", expense.amount)
    );
    const updatedDate = prompt("Enter new date (YYYY-MM-DD):", expense.date);

    if (updatedDescription && !isNaN(updatedAmount) && updatedDate) {
      try {
        const updatedExpense = {
          ...expense,
          description: updatedDescription,
          amount: updatedAmount,
          date: updatedDate,
        };
        await updateExpense(expense.id, updatedExpense);
        onExpenseUpdated(); // Trigger refresh after update
        alert("Expense updated successfully!");
      } catch (error) {
        console.error("Error updating expense:", error);
        alert("Failed to update expense.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(id);
        onExpenseDeleted(); // Trigger refresh after delete
        alert("Expense deleted successfully!");
      } catch (error) {
        console.error("Error deleting expense:", error);
        alert("Failed to delete expense.");
      }
    }
  };

  return (
    <div className="expense-list">
      {expenses.length === 0 ? (
        <p>No expenses available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>₹ {expense.amount.toFixed(2)}</td>
                <td>{expense.description}</td>
                <td>
                  <button onClick={() => handleUpdate(expense)}>Update</button>
                  <button onClick={() => handleDelete(expense.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

ExpenseList.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  onExpenseUpdated: PropTypes.func.isRequired,
  onExpenseDeleted: PropTypes.func.isRequired,
};

export default ExpenseList;
