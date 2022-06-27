const mongoose = require('mongoose');
const Expense = require('../models/expense');
const User = require('../models/user');

const getExpensesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let userExpenses;
    try {
        userExpenses = await Expense.find({ creator: userId });
    } catch (err) {
        res.status(500).json({ message: 'Could not find any expenses for that id' });
        return;
    }

    if (userExpenses.length === 0) {
        res.status(404).json({ message: 'User has no expenses saved' });
        return;
    }

    res.status(200).json({ userExpenses: userExpenses.map(expense => expense.toObject({ getters: true })) });
};

const createExpense = async (req, res, next) => {
    const { name, amount, date } = req.body;

    const createdExpense = new Expense({
        name, amount, date, creator: req.currUserData.userId
    });

    let user;
    try {
        user = await User.findById(req.currUserData.userId);
    } catch (err) {
        res.status(500).json({ message: 'Error finding user with that id' });
        return;
    }

    if (!user) {
        res.status(404).json({ message: 'Could not find user' });
        return;
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdExpense.save({ session: sess });
        user.expenses.push(createdExpense);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        res.status(500).json({ message: 'Creating expense failed' });
        return;
    }

    res.status(201).json({ expense: createdExpense });
};

const deleteExpense = async (req, res, next) => {
    const expenseId = req.params.eid;

    let expense;
    try {
        expense = await Expense.findById(expenseId).populate('creator');
    } catch (err) {
        res.status(500).json({ message: 'Could not find an expense with that id' });
        return;
    }
    if (!expense) {
        res.status(404).json({ message: 'Expense does not exist' });
        return;
    }

    if (expense.creator.id !== req.currUserData.userId) {
        res.status(401).json({ message: 'You are not allowed to delete this expense' });
        return;
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await expense.remove({ session: sess });
        expense.creator.expenses.pull(expense);
        await expense.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        res.status(500).json({ message: 'Could not delete expense' });
        return;
    }

    res.status(200).json({ message: 'Expense deleted' });
};

exports.getExpensesByUserId = getExpensesByUserId;
exports.createExpense = createExpense;
exports.deleteExpense = deleteExpense;