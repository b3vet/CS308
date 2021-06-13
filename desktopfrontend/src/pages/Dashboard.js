import React, {useState, useEffect} from 'react';
import { getUser, removeUserSession } from '../utils/Common';
import { Link, BrowserRouter, NavLink, Switch, Route, Redirect } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios';
import UserInfo from './UserInfo';
import UserOrders from './UserOrders';
import UserSettings from './UserSettings';
import DashboardRedirect from './DashboardRedirect';



function Dashboard(props) {
  const [user, setUser] = useState(getUser())
  return (
    <div>
      <BrowserRouter>
        <Container style={{marginLeft: 0, marginTop: 80}}>
          <Row className = "dashboard_container">
          <Col xl={2} >
          <div style={{position: 'fixed', minWidth: 220}}>
          <div className="dashboard_left_bar">
            <div className = "bar_links"> 
            <NavLink style={{ textDecoration: 'none', margin: 10 }} activeClassName="dashboard_bar_active" to="/dashboard/info"><i class="fas fa-user"></i>   User Info</NavLink><br />
            <NavLink style={{ textDecoration: 'none', margin: 10}} activeClassName="dashboard_bar_active" to="/dashboard/orders"><i class="fas fa-truck"></i>   Orders</NavLink><br />
            <NavLink style={{ textDecoration: 'none', margin: 10}} activeClassName="dashboard_bar_active" to="/dashboard/settings"><i class="fas fa-cog"></i>   Settings</NavLink>
            {user.role == "productM" && <><Button style = {{marginTop: 30, marginBottom: 5, marginLeft: 10, marginRight: 10}} variant ="dark" onClick={() =>props.history.push('/pAdmin')}>Admin Page</Button><br /></>}
            {user.role == "salesM" && <><Button style = {{marginTop: 30, marginBottom: 5, marginLeft: 10, marginRight: 10}} variant ="dark" onClick={() =>props.history.push('/sAdmin')}>Admin Page</Button><br /></>}
            <Button style = {{marginTop: 5, marginBottom: 10, marginLeft: 10, marginRight: 10}} onClick={() => handleLogout(props)} variant="dark">Log Out</Button>
            </div>
          </div>
          </div>
          </Col>
          <Col xl={10}>
          <div className="dashboard_content">
            <Switch>
              <Route path="/dashboard/settings" component={(props) => <UserSettings {...props} user={user} />} />
              <Route path="/dashboard/info" component={(props) => <UserInfo {...props} user={user} />} />
              <Route path="/dashboard/orders" component={(props) => <UserOrders {...props} user={user} />} />
              <Route path="/dashboard" component={DashboardRedirect} />
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




export default Dashboard;

{
  /* Welcome {user.name}!<br /><br />
      <input type="button" onClick={() => handleLogout(props)} value="Logout" /><br />
      {user.role == "productM" && <><Link to="/addproduct">Add Product!</Link><br /></>}
      */
}