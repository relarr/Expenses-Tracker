import { useState } from 'react';
import Input from '../navigation/Input';
import Button from '../navigation/Button';
import './NewExpenseForm.css';

const NewExpenseForm = (props) => {
  const [expenseAttributes, setExpenseAttributes] = useState({
    value: '',
    validity: false,
  });
  const [amountAttributes, setAmountAttributes] = useState({
    value: 0,
    validity: false,
  });
  const [dateAttributes, setDateAttributes] = useState({
    value: '',
    validity: false,
  });

  const submitHandler = async (event) => {
    event.preventDefault();
    props.onAdd(
      expenseAttributes.value,
      amountAttributes.value,
      dateAttributes.value
    );
    props.onCancel();
  };

  return (
    <div className='new-expense'>
      <form onSubmit={submitHandler}>
        <Input
          id='expense'
          type='text'
          initialValue={''}
          func={(val) => val.trim() !== ''}
          change={(value, validity) =>
            setExpenseAttributes({ value, validity })
          }
        />

        <Input
          id='amount'
          type='number'
          step='0.01'
          initialValue={0}
          func={(val) => val > 0}
          change={(value, validity) => setAmountAttributes({ value, validity })}
        />
        <Input
          id='date'
          type='date'
          initialValue={new Date()}
          func={(val) => val.getFullYear() < 2023 && val.getFullYear() > 2018}
          change={(value, validity) => setDateAttributes({ value, validity })}
        />
        <div className='new-expense-form__buttons'>
          <Button type='button' onClick={props.onCancel}>
            CANCEL
          </Button>
          <Button
            type='submit'
            disabled={
              !expenseAttributes.validity ||
              !amountAttributes.validity ||
              !dateAttributes.validity
            }
          >
            SUBMIT
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewExpenseForm;
