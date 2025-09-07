import React, { useEffect, useReducer } from 'react';

import { validate } from '../../util/validators';

import './Input.css';

const inputReduser = (state, action) => {
  if (action.type === 'CHANGE') {
    return {
      ...state,
      value: action.value,
      isValid: validate(action.value, action.validators),
    };
  }

  if (action.type === 'TOUCH') {
    return {
      ...state,
      isTouched: true,
    };
  }

  if (action.type === 'RESET') {
    return {
      value: '',
      isTouched: false,
      isValid: false,
    };
  }

  if (action.type === 'RESET-TOUCH') {
    return {
      ...state,
      isTouched: false,
    };
  }
  return state;
};

function Input(props) {
  const [state, dispatch] = useReducer(inputReduser, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValidity || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = state;

  useEffect(() => {
    if (props.reset) {
      dispatch({ type: 'RESET' });
    }
  }, [props.reset, props.value]);

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (e) => {
    dispatch({
      type: 'CHANGE',
      value: e.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({ type: 'TOUCH' });
  };

  const element =
    props.element === 'input' ? (
      <input
        id={props.id}
        type={props.type}
        value={state.value}
        onChange={changeHandler}
        onBlur={touchHandler}
        placeholder={props.placeholder}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={state.value}
      />
    );

  return (
    <div
      className={`form-control ${
        !state.isValid && state.isTouched && 'form-control--invalid'
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!state.isValid && state.isTouched && <p>{props.errorText}</p>}
    </div>
  );
}

export default Input;
