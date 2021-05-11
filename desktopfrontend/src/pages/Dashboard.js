import React, {useState, useEffect} from 'react';
import { getUser, removeUserSession } from '../utils/Common';
import { Link, BrowserRouter, NavLink, Switch, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios';



function Dashboard(props) {
  const [user, setUser] = useState(getUser())
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
    if(newPassword.value == '') {
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

  const Info = (props) => {
    const user = props.user;
    
    return(
    <div style={{textAlign: 'center', padding: 10, width: '80%', paddingLeft: '19%'}}> 
      <p style={{fontSize: 22, fontWeight: 'bold', marginBottom: 40, textAlign: 'left'}}>{user.name} {user.surname}</p>
      <div>
        <div>
          Email<br />
          <input value={newMail} type="text" onChange={(event) => setNewMail(event.target.value)}/>
        </div>
        <div>
          Password<br />
          <input placeholder={'Enter new password'} type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)}/>
        </div>
        <div>
          Name<br />
          <input value={newName} type="text" onChange={(event) => setNewName(event.target.value)}/>
        </div>
        <div>
          Surname<br />
          <input value={newSurname} type="text" onChange={(event) => setNewSurname(event.target.value)}/>
        </div>
        <div>
          Phone Number<br />
          <input value={newPhone} type="text" onChange={(event) => setNewPhone(event.target.value)}/>
        </div>
        <div>
          Tax ID<br />
          <input value={newTaxID} type="text" onChange={(event) => setNewTaxID(event.target.value)}/>
        </div>
      <Button type="submit" style = {{marginTop: 40, alignSelf: 'center'}} onClick={handleSubmit} variant="dark">Save Changes</Button><br />
      </div>
      
      {passRequired && <><small style={{ color: 'red' }}>{passRequired}</small><br /></>}<br />
  
    </div>
      )
  }

 if(loading) {
   return (<p>Loading...</p>)
 }
 
  return (
    <div>
      <BrowserRouter>
        <Container style={{marginLeft: 0}}>
          <Row className = "dashboard_container">
          <Col xl={2}>
          <div className="dashboard_left_bar">
            <div className = "bar_links"> 
            <NavLink style={{ textDecoration: 'none', margin: 10 }} activeClassName="dashboard_bar_active" to="/dashboard/info"><i class="fas fa-user"></i>   User Info</NavLink><br />
            <NavLink style={{ textDecoration: 'none', margin: 10}} activeClassName="dashboard_bar_active" to="/dashboard/orders"><i class="fas fa-truck"></i>   Orders</NavLink><br />
            <NavLink style={{ textDecoration: 'none', margin: 10}} activeClassName="dashboard_bar_active" to="/dashboard/settings"><i class="fas fa-cog"></i>   Settings</NavLink>
            {user.role == "productM" && <><Button onClick={() =>props.history.push('/addproduct')}>Add Product!</Button><br /></>}
            <Button style = {{marginTop: 350, marginBottom: 10, marginLeft: 10, marginRight: 10}} onClick={() => handleLogout(props)} variant="dark">Log Out</Button>
            </div>
          </div>
          </Col>
          <Col xl={10}>
          <div className="dashboard_content">
            <Switch>
              <Route path="/dashboard/settings" component={settings} />
              <Route path="/dashboard/info" component={(props) => <Info {...props} user={user} handleSubmit={handleSubmit} />} />
              <Route path="/dashboard/orders" component={orders} />
            </Switch>
          </div>
          </Col>
          </Row>
        </Container>
      </BrowserRouter>
      
    </div>
  );
}
const handleLogout = (props) => {
  removeUserSession();
  props.history.push('/login');
}

const settings = (props) => {
  return(<div> this is settings page yeah</div>)
}
const orders = (props) => {
  return(<div> this is orders page yeah</div>)
}


export default Dashboard;

{
  /* Welcome {user.name}!<br /><br />
      <input type="button" onClick={() => handleLogout(props)} value="Logout" /><br />
      {user.role == "productM" && <><Link to="/addproduct">Add Product!</Link><br /></>}
      */
}