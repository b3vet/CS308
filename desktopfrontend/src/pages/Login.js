import React, { useState } from 'react';
import axios from 'axios';
import { setUserSession, getUser, getRefreshToken, getAccessToken } from '../utils/Common';
import { Link } from 'react-router-dom';
function Login(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);
 
  // handle button click of login form
  //post will change 
  //response may change
  const handleLogin = () => {
    setError(null);
    setLoading(true);
   axios({
    method: 'post',
    url: 'http://127.0.0.1:8000/api/user/',
    data: {
      uname: username.value,
      password: password.value
    }
  }).then(
    response => {
      setLoading(false);
      setUserSession(response.data.refresh, response.data.access, response.data.user);
      console.log(getUser())
      console.log(getRefreshToken())
      console.log(getAccessToken())
      props.history.push('/');
    }
  ).catch(
    error => {
      setLoading(false);
      if (error.response) {
        setError(error.response.status)
      }
      else setError(error.message);
    }
  )
  }
 
  return (
    <div>
      Login<br /><br />
      <div>
        Username<br />
        <input type="text" {...username} autoComplete="new-password" />
      </div>
      <div style={{ marginTop: 10 }}>
        Password<br />
        <input type="password" {...password} autoComplete="new-password" />
      </div>
      {error && <><small style={{ color: 'red' }}>{error==406 ? "Invalid username or password!" : "Network error!"}</small><br /></>}<br />
      <input type="button" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading} /><br /><br />
      <Link to="/register">Don't have an account? Click here to register.</Link>
    </div>
  );
}
 
const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);
 
  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}
 
export default Login;