import React, { useState } from 'react';
import axios from 'axios';
import { setUserSession, getUser, getRefreshToken, getAccessToken } from '../utils/Common';
 
function Register(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput('');
  const password = useFormInput('');
  const name = useFormInput('');
  const surname = useFormInput('');
  const taxID = useFormInput('');
  const email = useFormInput('');
  const phonenumber = useFormInput('');
  const [error, setError] = useState(null);
 
  const handleRegister = () => {
    setError(null);
    setLoading(true);
   axios({
    method: 'post',
    url: 'http://127.0.0.1:8000/api/register/',
    data: {
      uname: username.value,
      password: password.value,
      name: name.value,
      surname: surname.value,
      taxID: taxID.value,
      email: email.value,
      phoneNumber: phonenumber.value,
    }
  }).then(
    response => {
      setLoading(false);
      if (response.status == 226) setError(response.status)
      else {
        console.log(response.data.user)
        props.history.push('/login');
      }
      
    }
  ).catch(
    error => {
      setLoading(false);
      if (error.response) {
        setError(error.response.data);
      }
      else setError(error.message);
    }
  )
  }
 
  return (
    <div class="Login-Container">
    <div class="Login-Float">
      <div>
        Username<br />
        <input type="text" {...username} autoComplete="new-password" required/>
      </div>
      <div style={{ marginTop: 10 }}>
        Password<br />
        <input type="password" {...password} autoComplete="new-password" />
      </div>
      <div style={{ marginTop: 10 }}>
        Name<br />
        <input type="text" {...name} autoComplete="new-password" />
      </div>
      <div style={{ marginTop: 10 }}>
        Surname<br />
        <input type="text" {...surname} autoComplete="new-password" />
      </div>
      <div style={{ marginTop: 10 }}>
        Tax ID<br />
        <input type="text" {...taxID} autoComplete="new-password" />
      </div>
      <div style={{ marginTop: 10 }}>
        Email<br />
        <input type="email" {...email} autoComplete="new-password" />
      </div>
      <div style={{ marginTop: 10 }}>
        Phone Number<br />
        <input type="text" {...phonenumber} autoComplete="new-password" pattern="[0-9]{10}"/>
      </div>
      {error && <><small style={{ color: 'red' }}>{error==226 ? "This username already exists!\n" : ""}</small></>}
      {error && <><small style={{ color: 'red' }}>{error!=226 && error.error ? error.error : ""}</small><br /></>}<br />
      <input class = "Login-Button" type="button" value={loading ? 'Loading...' : 'Register'} onClick={handleRegister} disabled={loading} /><br />
      
      </div>
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
 
export default Register;