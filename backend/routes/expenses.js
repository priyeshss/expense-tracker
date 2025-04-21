// backend/routes/expenses.js
const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Create expense
router.post('/', async (req, res) => {
  try {
    const newExpense = new Expense(req.body);
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all expenses
router.get("/", async (req, res) => {
  const { category, from, to } = req.query;
  let filter = {};

  if (category) {
    filter.category = { $regex: category, $options: "i" }; // case-insensitive
  }

  if (from && to) {
    filter.date = {
      $gte: new Date(from),
      $lte: new Date(to),
    };
  }

  try {
    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE /api/expenses/:id
router.delete("/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/expenses/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
