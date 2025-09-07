import { useCallback, useReducer } from 'react';

const formReducer = (state, action) => {
  if (action.type === 'INPUT_CHANGE') {
    let formIsValid = true;
    for (const inputId in state.inputs) {
      if (!state.inputs[inputId]) {
        continue;
      }

      if (inputId === action.id) {
        formIsValid = formIsValid && action.isValid;
      } else {
        formIsValid = formIsValid && state.inputs[inputId].isValid;
      }
    }
    return {
      ...state,
      inputs: {
        ...state.inputs,
        [action.id]: {
          value: action.value,
          isValid: action.isValid,
        },
      },
      formIsValid: formIsValid,
    };
  }

  if (action.type === 'SET_DATA') {
    return {
      inputs: action.inputs,
      formIsValid: action.formIsValid,
    };
  }

  return state;
};

export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    formIsValid: initialFormValidity,
  });

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: 'INPUT_CHANGE',
      id,
      value,
      isValid,
    });
  }, []);

  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: 'SET_DATA',
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);

  return [formState, inputHandler, setFormData];
};
