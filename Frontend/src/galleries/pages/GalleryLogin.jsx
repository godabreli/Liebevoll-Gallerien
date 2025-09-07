import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '../../shared/ui-elements/Card';
import Input from '../../shared/form-elements/Input';
import Button from '../../shared/form-elements/Button';
import LoadingSpinner from '../../shared/ui-elements/LoadingSpinner';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRED } from '../../util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../../context/auth-context';

import './GalleryLogin.css';
import { API_URL } from '../../util/globalURLS';

function GalleryLogin() {
  const [formState, inputHandler] = useForm(
    {
      galleryName: { value: '', isValid: false },
      password: { value: '', isValid: false },
    },
    false
  );

  const { isLoading, error, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const responseData = await sendRequest(
        `${API_URL}api/galleries/login`,
        'POST',
        JSON.stringify({
          name: formState.inputs.galleryName.value,
          password: formState.inputs.password.value,
        }),
        {
          'Content-Type': 'application/json',
        }
      );

      if (responseData.status === 'success') {
        auth.galleryLogin(responseData.data.galleryId, responseData.data.token);
        setTimeout(() => {
          navigate(`/galleries/${responseData.data.galleryName}`);
        }, 100);
      }
    } catch (err) {
      console.error(`Error by fetchin data: ${err}`);
    }
  };

  return (
    <Card className="galleryLogin-card">
      {isLoading && <LoadingSpinner />}
      <span className="login-tittel">LOGIN TO YOUR GALLERY</span>
      {error && <p className="error">{error}</p>}
      <form onSubmit={submitHandler}>
        <Input
          element="input"
          id="galleryName"
          type="text"
          label="GALLERY NAME:"
          onInput={inputHandler}
          validators={VALIDATOR_REQUIRED()}
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
  );
}

export default GalleryLogin;
