import Meter from "./Meter";
import { months } from '../shared/util/months';
import './ExpensesChart.css';

const ExpensesChart = props => {
    let monthlyExpenses = new Array(12).fill(0);

    for (const expense of props.expenses) {
        const currDate = new Date(expense.date);
        monthlyExpenses[currDate.getMonth()] += expense.amount;
    }

    const maxExpenseMonth = Math.max(...monthlyExpenses);

    return (
        <div className='chart'>
            {months.map(month => {
                return (
                    <Meter
                        key={month}
                        month={month}
                        monthly={monthlyExpenses[months.indexOf(month)]}
                        max={maxExpenseMonth} />
                );
            })}
        </div>
    );
};

export default ExpensesChart;