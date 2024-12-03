import { useState } from "react";
import PropTypes from "prop-types";

function ExpenseForm({ onAddExpense }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [customDescription, setCustomDescription] = useState(""); // For new descriptions
  const [isCustom, setIsCustom] = useState(false); // Toggle for custom description

  const predefinedDescriptions = ["Food", "Travel", "Shopping", "Utilities"];

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setIsCustom(true);
      setCustomDescription(""); // Reset custom description input
    } else {
      setIsCustom(false);
      setDescription(value);
    }
  };

  const handleCustomDescriptionChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setCustomDescription(value); // Update custom description
      setDescription(value); // Directly set description from custom input
    } else {
      alert("Only alphabets are allowed in custom description");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (description && amount && date) {
      const newExpense = { description, amount: parseFloat(amount), date };
      await onAddExpense(newExpense);
      setDescription("");
      setAmount("");
      setDate("");
      setCustomDescription(""); // Reset custom description
      setIsCustom(false); // Reset custom toggle
    } else {
      alert("Please fill out all fields");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Expense</h2>
      <label>
        Description:
        <select
          value={isCustom ? "custom" : description}
          onChange={handleDescriptionChange}
          required
        >
          <option value="" disabled>
            Select Description
          </option>
          {predefinedDescriptions.map((desc) => (
            <option key={desc} value={desc}>
              {desc}
            </option>
          ))}
          <option value="custom">Create New</option>
        </select>
      </label>
      {isCustom && (
        <label>
          Custom Description:
          <input
            type="text"
            value={customDescription}
            onChange={handleCustomDescriptionChange}
            required
          />
        </label>
      )}
      <label>
        Amount:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          step="0.01"
        />
      </label>
      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>
      <button type="submit">Add Expense</button>
    </form>
  );
}

ExpenseForm.propTypes = {
  onAddExpense: PropTypes.func.isRequired,
};

export default ExpenseForm;
