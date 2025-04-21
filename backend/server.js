// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const expensesRoutes = require('./routes/expenses');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Routes
const expenseRoutes = require('./routes/expenses');
app.use('/api/expenses', expenseRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// GET all expenses
app.get("/api/expenses", async (req, res) => {
    try {
      const expenses = await Expense.find().sort({ date: -1 });
      res.json(expenses);
    } catch (err) {
      res.status(500).json({ error: "Something went wrong" });
    }
  });
  