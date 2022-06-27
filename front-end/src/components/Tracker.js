import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../shared/context/auth-context';
import { useParams } from 'react-router';
import Expenses from './Expenses';
import NewExpenseForm from './NewExpenseForm';
import Button from '../navigation/Button';
import './Tracker.css';

const Tracker = () => {
  const auth = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const userId = useParams().uid;
  const fetchExpenses = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/expenses/user/${userId}`
      );
      const resJson = await res.json();
      res.status === 404 ? setExpenses([]) : setExpenses(resJson.userExpenses);
    } catch (err) {}
  }, [userId]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const onAddHandler = async (expense, amount, date) => {
    try {
      const res = await fetch(
        process.env.REACT_APP_BACKEND_URL + '/api/expenses',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token,
          },
          body: JSON.stringify({ name: expense, amount, date }),
        }
      );
      if (res.ok) fetchExpenses();
    } catch (err) {}
  };

  const onDeleteHandler = async (id) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/expenses/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token,
          },
        }
      );
      if (res.ok) fetchExpenses();
    } catch (err) {}
  };

  return (
    <div className='tracker'>
      {showForm && (
        <NewExpenseForm
          onAdd={onAddHandler}
          onCancel={() => setShowForm(false)}
        />
      )}
      {!showForm && (
        <Button onClick={() => setShowForm(true)}>ADD EXPENSE</Button>
      )}
      <Expenses expenses={expenses} onDelete={onDeleteHandler} />
    </div>
  );
};

export default Tracker;
