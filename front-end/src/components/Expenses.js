import { useState } from 'react';
import ExpensesList from './ExpensesList';
import YearFilter from './YearFilter';
import ExpensesChart from './ExpensesChart';
import './Expenses.css';

const Expenses = (props) => {
  const [year, setYear] = useState('2022');
  const yearlyExpenses =
    props.expenses &&
    props.expenses.filter(
      (expense) => new Date(expense.date).getFullYear() === +year
    );

  return (
    <div>
      <div className='expenses-responsive'>
        <YearFilter
          currYear={year}
          getYear={(gottenYear) => setYear(gottenYear)}
        />
        {yearlyExpenses && <ExpensesChart expenses={yearlyExpenses} />}
        <ExpensesList
          expenses={yearlyExpenses}
          onDelete={(id) => props.onDelete(id)}
        />
      </div>
      <div className='expenses'>
        <div className='year-and-chart'>
          <YearFilter
            currYear={year}
            getYear={(gottenYear) => setYear(gottenYear)}
          />
          {yearlyExpenses && <ExpensesChart expenses={yearlyExpenses} />}
        </div>
        <ExpensesList
          expenses={yearlyExpenses}
          onDelete={(id) => props.onDelete(id)}
        />
      </div>
    </div>
  );
};

export default Expenses;
