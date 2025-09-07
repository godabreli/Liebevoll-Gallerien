import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

import Card from '../../shared/ui-elements/Card';
import Input from '../../shared/form-elements/Input';
import { VALIDATOR_MINLENGTH } from '../../util/validators';
import Button from '../../shared/form-elements/Button';

import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../../context/auth-context';

import LoadingSpinner from '../../shared/ui-elements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { API_URL } from '../../util/globalURLS';

import './UserLogin.css';
import ErrorModal from '../../shared/ui-elements/ErrorModal';

function UserLogin() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [formState, inputHandler] = useForm(
    {
      loginName: { value: '', isValid: false },
      password: { value: '', isValid: false },
    },
    false
  );

  const { isLoading, error, sendRequest } = useHttpClient();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const responseData = await sendRequest(
        API_URL + 'api/users/login',

        'POST',
        JSON.stringify({
          loginName: formState.inputs.loginName.value,
          password: formState.inputs.password.value,
        }),
        {
          'Content-Type': 'application/json',
        }
      );

      if (responseData.status === 'success') {
        auth.userLogin(responseData.data.userId, responseData.data.token);
        setTimeout(() => {
          navigate('/galleries');
        }, 100);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login-wrapper">
      <Card className="user-login">
        {isLoading && <LoadingSpinner />}
        <span className="login-tittel">USER LOGIN</span>
        {error && <p className="error">{error}</p>}
        <form onSubmit={submitHandler}>
          <Input
            element="input"
            id="loginName"
            type="text"
            label="LOGIN NAME:"
            onInput={inputHandler}
            validators={VALIDATOR_MINLENGTH(5)}
            errorText="Login Name has min length of 5"
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="PASSWORD:"
            onInput={inputHandler}
            validators={VALIDATOR_MINLENGTH(8)}
            errorText="Password has min lenght of 8"
          />
          <div className="login-button-div">
            <Button disabled={!formState.formIsValid} type="submit">
              LOGIN
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default UserLogin;
