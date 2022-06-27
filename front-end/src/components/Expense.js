import { months } from '../shared/util/months';
import Button from '../navigation/Button';
import './Expense.css';

const Expense = props => {
    return (
        <div className='expense'>
            <div className='expense-date'>
                <div className='expense-date__month'>
                    <p>{months[props.date.getMonth()]}</p>
                </div>
                <div className='expense-date__day'>
                    <p>{props.date.getDate() + 1}</p>
                </div>
                <div className='expense-date__year'>
                    <p>{props.date.getFullYear()}</p>
                </div>
            </div>
            <div className='expense-amount'>
                <h3>${props.amount}</h3>
            </div>
            <div className='expense-name'>
                <h2>{props.name}</h2>
            </div>
            <Button delete
                onClick={() => props.onDelete(props.id)} >x</Button>
        </div>
    );
}

export default Expense;