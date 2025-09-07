import React, { useState } from 'react';

import { useForm } from '../shared/hooks/form-hook';
import { useHttpClient } from '../shared/hooks/http-hook';

import { VALIDATOR_REQUIRED, VALIDATOR_EMAIL } from '../util/validators';
import Input from '../shared/form-elements/Input';

import './Contact.css';
import Button from '../shared/form-elements/Button';
import LoadingSpinner from '../shared/ui-elements/LoadingSpinner';
import ErrorModal from '../shared/ui-elements/ErrorModal';
import { API_URL } from '../util/globalURLS';
import { Helmet } from 'react-helmet';

function Kontakt() {
  const [reset, setReset] = useState(false);
  const [emailSendt, setEmailSendt] = useState(false);

  const { isLoading, error, sendRequest } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: { value: '', isValid: false },
      email: { value: '', isValid: false },
      message: { value: '', isValid: false },
    },
    false
  );

  const sendEmailHandler = async (e) => {
    e.preventDefault();
    const name = formState.inputs.name.value;
    const email = formState.inputs.email.value;
    const message = formState.inputs.message.value;

    try {
      const responseData = await sendRequest(
        `${API_URL}api/users/sendCustomerRequest`,
        'POST',
        JSON.stringify({
          name,
          email,
          message,
        }),
        {
          'Content-Type': 'application/json',
        }
      );

      if (responseData.status === 'success') {
        setEmailSendt(true);
        setFormData(
          {
            name: { value: '', isValid: false },
            email: { value: '', isValid: false },
            message: { value: '', isValid: false },
          },
          false
        );
        setReset(true);

        setTimeout(() => {
          setReset(false);
        }, 200);
      }
    } catch (err) {
      console.error(`Error by sending email: ${err}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Kontakt Hochzeitsfotograf | Hochzeitsfotografie Düsseldorf
        </title>
        <meta
          name="description"
          content="Kontaktieren Sie mich heute, um Ihre Hochzeit in ein Kunstwerk aus wundershönen Erinerungen zu verwandeln.  "
        />
        <link rel="canonical" href="https://liebevollbelichtet.de/Kontakt" />
      </Helmet>
      <div className="contact-wrapper">
        {emailSendt && (
          <ErrorModal
            errorMessage={'Deine Nachricht wurde gesendet'}
            onClick={() => setEmailSendt(false)}
          ></ErrorModal>
        )}
        <div className="contact-form-wrapper">
          {isLoading && <LoadingSpinner position="absolute" />}
          <form className="contact-form" onSubmit={sendEmailHandler}>
            <Input
              element="input"
              reset={reset}
              id="name"
              type="text"
              label="DEIN NAME:"
              onInput={inputHandler}
              validators={VALIDATOR_REQUIRED()}
              errorText={'Please provide your name.'}
            />
            <Input
              element="input"
              reset={reset}
              id="email"
              type="text"
              label="E-MAIL:"
              onInput={inputHandler}
              validators={VALIDATOR_EMAIL()}
              errorText={'Please provide valid email.'}
            />
            <Input
              reset={reset}
              id="message"
              type="text"
              rows={10}
              label="DEINE NACHRICHT:"
              onInput={inputHandler}
              validators={VALIDATOR_REQUIRED()}
              errorText={'Please provide your message.'}
            />
            <div className="send-button-wrapper" style={{ marginTop: '20px' }}>
              <Button disabled={!formState.formIsValid}>ABSENDEN</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Kontakt;
