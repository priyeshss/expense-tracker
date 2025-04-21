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
  const [editingId, setEditingId] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [total, setTotal] = useState(0);


  useEffect(() => {
    fetchExpenses();
  }, []);
  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/expenses", {
        params: {
          category: filterCategory,
          from: filterFrom,
          to: filterTo,
        },
      });
      setExpensesList(res.data);
      setExpensesList(res.data);
      const totalAmount = res.data.reduce((sum, exp) => sum + Number(exp.amount), 0);
      setTotal(totalAmount);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };
  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchExpenses();
  };
  
  const resetFilters = () => {
    setFilterCategory("");
    setFilterFrom("");
    setFilterTo("");
    fetchExpenses();
  };
  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.post("http://localhost:5000/api/expenses", expense);
  //     alert("Expense added!");
  //     fetchExpenses(); //For refreshing the page on submit to show the results in table

  //     setExpense({ date: "", category: "", amount: "", description: "" });
  //   } catch (err) {
  //     console.error("Error adding expense:", err);
  //     alert("Something went wrong!");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/expenses/${editingId}`, expense);
        alert("Expense updated!");
      } else {
        await axios.post("http://localhost:5000/api/expenses", expense);
        alert("Expense added!");
      }
  
      setExpense({ date: "", category: "", amount: "", description: "" });
      setEditingId(null);
      fetchExpenses();
    } catch (err) {
      console.error("Error submitting expense:", err);
      alert("Something went wrong!");
    }
  };
  

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await axios.delete(`http://localhost:5000/api/expenses/${id}`);
        setExpensesList(expensesList.filter((e) => e._id !== id));
      } catch (err) {
        console.error("Error deleting expense:", err);
        alert("Could not delete expense.");
      }
    }
  };

  


  const handleEdit = (exp) => {
    setExpense({
      date: exp.date.substring(0, 10), // Format for input type="date"
      category: exp.category,
      amount: exp.amount,
      description: exp.description,
    });
    setEditingId(exp._id);
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

<div style={{ marginBottom: "1rem" }}>
  <label>Filter by Category: </label>
  <input
    type="text"
    placeholder="e.g. Food"
    value={filterCategory}
    onChange={(e) => setFilterCategory(e.target.value)}
  />

  <label style={{ marginLeft: "1rem" }}>From: </label>
  <input
    type="date"
    value={filterFrom}
    onChange={(e) => setFilterFrom(e.target.value)}
  />

  <label style={{ marginLeft: "1rem" }}>To: </label>
  <input
    type="date"
    value={filterTo}
    onChange={(e) => setFilterTo(e.target.value)}
  />

  <button onClick={applyFilters} style={{ marginLeft: "1rem" }}>
    Apply
  </button>

  <button
    onClick={resetFilters}
    style={{ marginLeft: "0.5rem", backgroundColor: "#ccc" }}
  >
    Reset
  </button>
</div>
<h3>Total Spent: ₹{total}</h3>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Delete</th>

          </tr>
        </thead>
        <tbody>
          {expensesList.map((exp) => (
            <tr key={exp._id}>
              <td>{new Date(exp.date).toLocaleDateString()}</td>
              <td>{exp.category}</td>
              <td>₹{exp.amount}</td>
              <td>{exp.description}</td>
              <td>
              <button onClick={() => handleEdit(exp)}>✏️</button>
              <button onClick={() => handleDelete(exp._id)} style={{ marginLeft: "5px" }}>🗑️</button>
              {editingId && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditingId(null);
                      setExpense({ date: "", category: "", amount: "", description: "" });
                    }}
                    style={{ marginLeft: "10px", background: "#ccc" }}
                  >
                    Cancel
                  </button>
                )}

              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
}

export default App;
