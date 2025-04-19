import React, { useState, useEffect } from "react";

import axios from "axios";

function App() {
  const [expense, setExpense] = useState({
    date: "",
    category: "",
    amount: "",
    description: "",
  });
  
  const [expensesList, setExpensesList] = useState([]);
  
  useEffect(() => {
    fetchExpenses();
  }, []);
  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/expenses");
      setExpensesList(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };
  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/expenses", expense);
      alert("Expense added!");
      fetchExpenses(); //For refreshing the page on submit to show the results in table

      setExpense({ date: "", category: "", amount: "", description: "" });
    } catch (err) {
      console.error("Error adding expense:", err);
      alert("Something went wrong!");
    }
  };


  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "auto" }}>
      <h1>Expense Tracker 💸</h1>
      <form onSubmit={handleSubmit}>
        <label>Date: </label>
        <input type="date" name="date" value={expense.date} onChange={handleChange} required /><br /><br />

        <label>Category: </label>
        <input type="text" name="category" value={expense.category} onChange={handleChange} required /><br /><br />

        <label>Amount: </label>
        <input type="number" name="amount" value={expense.amount} onChange={handleChange} required /><br /><br />

        <label>Description: </label>
        <input type="text" name="description" value={expense.description} onChange={handleChange} /><br /><br />

        <button type="submit">Add Expense</button>
      </form>
  
      <h2>Expenses</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {expensesList.map((exp) => (
            <tr key={exp._id}>
              <td>{new Date(exp.date).toLocaleDateString()}</td>
              <td>{exp.category}</td>
              <td>₹{exp.amount}</td>
              <td>{exp.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
}

export default App;
