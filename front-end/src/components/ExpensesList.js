import Expense from './Expense';
import './ExpensesList.css';

const ExpensesList = (props) => {
  return (
    <div className='expenses-list'>
      {props.expenses.length === 0 ? (
        <h1>No expenses for this year</h1>
      ) : (
        props.expenses.map((expense) => (
          <Expense
            key={expense.id}
            id={expense.id}
            name={expense.name}
            amount={expense.amount}
            date={new Date(expense.date)}
            onDelete={(id) => props.onDelete(id)}
          />
        ))
      )}
    </div>
  );
};

export default ExpensesList;
