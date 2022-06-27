import { useState, useContext } from 'react';
import { AuthContext } from '../shared/context/auth-context';
import Input from '../navigation/Input';
import Button from '../navigation/Button';
import './Auth.css';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLogIn, setIsLogIn] = useState(true);

  const [nameAttributes, setNameAttributes] = useState({
    value: '',
    validity: false,
  });
  const [emailAttributes, setEmailAttributes] = useState({
    value: '',
    validity: false,
  });
  const [passwordAttributes, setPasswordAttributes] = useState({
    value: '',
    validity: false,
  });

  const [userExists, setUserExists] = useState({ exists: false, message: '' });
  const [invalidCredentials, setInvalidCredentials] = useState({
    invalid: false,
    message: '',
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    if (isLogIn) {
      try {
        const res = await fetch(
          process.env.REACT_APP_BACKEND_URL + '/api/users/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: emailAttributes.value,
              password: passwordAttributes.value,
            }),
          }
        );
        const resJson = await res.json();
        if (res.status === 401 || res.status === 403) {
          setInvalidCredentials({ invalid: true, message: resJson.message });
          return;
        }
        if (resJson.userId) auth.login(resJson.userId, resJson.token);
      } catch (err) {}
    } else {
      try {
        const res = await fetch(
          process.env.REACT_APP_BACKEND_URL + '/api/users/signup',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: nameAttributes.value,
              email: emailAttributes.value,
              password: passwordAttributes.value,
            }),
          }
        );
        const resJson = await res.json();
        if (res.status === 404) {
          setUserExists({ exists: true, message: resJson.message });
          return;
        }
        if (resJson.userId) auth.login(resJson.userId, resJson.token);
      } catch (err) {}
    }
  };

  return (
    <div className='auth'>
      <div className='auth-form'>
        <div className='auth-switch'>
          <h3>{!isLogIn ? 'SIGN UP' : 'LOG IN'}</h3>
        </div>
        <Button onClick={() => setIsLogIn((prev) => !prev)}>
          {!isLogIn ? 'LOG IN' : 'SIGN UP'}
        </Button>
        <form>
          {!isLogIn && (
            <div>
              <Input
                id='name'
                type='text'
                initialValue={''}
                func={(val) => val.trim() !== ''}
                change={(value, validity) =>
                  setNameAttributes({ value, validity })
                }
              />
            </div>
          )}
          <div>
            <Input
              id='email'
              type='email'
              initialValue={''}
              func={(val) => val.includes('@')}
              change={(value, validity) => {
                setEmailAttributes({ value, validity });
                invalidCredentials.invalid &&
                  setInvalidCredentials({ invalid: false, message: '' });
                userExists.exists &&
                  setUserExists({ exists: false, message: '' });
              }}
            />
            {userExists.exists && <h5>{userExists.message}</h5>}
          </div>
          <div>
            <Input
              id='password'
              type='password'
              initialValue={''}
              func={(val) => val.length > 5}
              change={(value, validity) => {
                setPasswordAttributes({ value, validity });
                invalidCredentials.invalid &&
                  setInvalidCredentials({ invalid: false, message: '' });
              }}
            />
            {invalidCredentials.invalid && (
              <h5>{invalidCredentials.message}</h5>
            )}
          </div>
          <Button
            onClick={submitHandler}
            disabled={
              isLogIn
                ? !emailAttributes.validity || !passwordAttributes.validity
                : !nameAttributes.validity ||
                  !emailAttributes.validity ||
                  !passwordAttributes.validity
            }
          >
            SUBMIT
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
