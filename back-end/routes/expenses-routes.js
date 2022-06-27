const express = require('express');

const expensesController = require('../controllers/expenses-controllers');

const authCheck = require('../middleware/auth-check');

const router = express.Router();

router.get('/user/:uid', expensesController.getExpensesByUserId);

router.use(authCheck);

router.post('/', expensesController.createExpense);

router.delete('/:eid', expensesController.deleteExpense);

module.exports = router;