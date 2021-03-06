import React, {useState, useEffect} from 'react';
import { getUser, removeUserSession } from '../utils/Common';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios';
import { Ripple } from 'react-spinners-css';



function UserInfo(props) {

  const [user, setUser] = useState(props.user)
  const [loading, setLoading] = useState(false)
  const [error,setError] = useState(null)
  const [newMail, setNewMail] = useState(user.email);
  const [newPassword, setNewPassword] = useState('');
  const [newPhone, setNewPhone]  = useState(user.phoneNumber);
  const [newTaxID, setNewTaxID] = useState(user.taxID);
  const [newName, setNewName] = useState(user.name);
  const [newSurname, setNewSurname] = useState(user.surname);
  const [passRequired, setPassRequired] = useState('');
  const [result, setResult] = useState('');

  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(newPassword)
    if(newPassword == '') {
      setPassRequired("Please enter your old password if you do not want to change your password.")
      
    }
    else {
      setError(null);
    setLoading(true);
    setPassRequired('');
    //console.log(this.state);
    const d = {
      password: newPassword,
      name: newName,
      surname: newSurname,
      email: newMail,
      phone: newPhone,
      taxID: newTaxID,
      uid: user.uid,
    }
    
    console.log('sending request')
    
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/api/changeuserinfo/',
      data: d
    })
        .then(res => {
          console.log(res.data);
          
          setResult(res.data.success)
          setLoading(false);
          setNewPassword('')
        })
        .catch(err => {
          if(err.response) {
            setError(err.response.data)
            console.log(err.response.data)
          }
          else {
            setError(err.message)
            console.log(err.message)
          }
          
          setLoading(false);
        })
    }
    }
  

    if(loading) {
      return(
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 300}}>
        <div style={{paddingBottom: 300}}><Ripple  color="#111" /></div>
        
      </div>
      )
    }
    
    
    return(
    <div style={{textAlign: 'center', padding: 10, width: '80%', paddingLeft: '19%'}}> 
      <div style={{fontSize: 22, marginBottom: 40, textAlign: 'left'}}><p>You can change your personal informations here </p><p style={{fontWeight: 'bold'}}>{user.name} {user.surname}</p></div>
      <Form>
      <Form.Row>
        <Col>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control value={newMail} type="text" onChange={(event) => setNewMail(event.target.value)}/>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control placeholder={'Enter new password'} type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)}/>
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Row>
        <Col>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control value={newName} type="text" onChange={(event) => setNewName(event.target.value)}/>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Surname</Form.Label>
            <Form.Control value={newSurname} type="text" onChange={(event) => setNewSurname(event.target.value)}/>
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Row>
        <Col>
          <Form.Group>
            <Form.Label>Phone</Form.Label>
            <Form.Control value={newPhone} type="text" onChange={(event) => setNewPhone(event.target.value)}/>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Tax ID</Form.Label>
            <Form.Control value={newTaxID} type="text" onChange={(event) => setNewTaxID(event.target.value)}/>
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Row>
      <Col>
        <Button type="submit" style = {{marginTop: 40, alignSelf: 'center'}} onClick={handleSubmit} variant="dark">Save Changes</Button><br />
      </Col>
      </Form.Row>
      </Form>
      {result && <><small style={{ color: 'green' }}>{result}</small><br /></>}<br />
      {passRequired && <><small style={{ color: 'red' }}>{passRequired}</small><br /></>}<br />
  
    </div>
      )
  

}
export default UserInfo;

