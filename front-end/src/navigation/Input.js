import { useState } from 'react';
import './Input.css';

const Input = (props) => {
  const [validity, setValidity] = useState(false);
  const [inputTouched, setInputTouched] = useState(false);

  const onChangeHandler = (e) => {
    const currValue =
      props.type === 'date' ? new Date(e.target.value) : e.target.value;

    setValidity(props.func(currValue));
    props.change(currValue, props.func(currValue));

    if (props.type === 'number') setInputTouched(true);
  };

  return (
    <div className={!validity && inputTouched ? 'input invalid' : 'input'}>
      <label>{props.id}</label>
      <input
        id={props.id}
        type={props.type}
        step={props.step || '1'}
        onChange={onChangeHandler}
        onBlur={() => setInputTouched(true)}
      />
      {!validity && inputTouched && <p>Enter a valid {props.id}</p>}
    </div>
  );
};

export default Input;
