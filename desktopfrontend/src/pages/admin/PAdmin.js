import React, {useState, useEffect} from 'react';
import { getUser, removeUserSession } from '../../utils/Common';
import { Link, BrowserRouter, NavLink, Switch, Route, Redirect } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios';
import Products from './productManager/Products';
import AddProduct from './productManager/AddProduct';

import EditProduct from './productManager/EditProduct';
import SingleOrder from './productManager/SingleOrder';
import Comments from './productManager/Comments';
import SingleInvoice from './salesManager/SingleInvoice';
import Orders from './productManager/Orders';
import Welcome from './productManager/Welcome';



function Dashboard(props) {
  const [user, setUser] = useState(getUser())
  return (
    <div>
      <BrowserRouter>
        <Container style={{marginLeft: 0, marginTop: 80}}>
          <Row className = "dashboard_container">
          <Col xl={2}>
          <div style={{position: 'fixed', minWidth: 220}}>
            <div className="dashboard_left_bar">
              <div className = "bar_links"> 
              <NavLink style={{ textDecoration: 'none', margin: 10 }} activeClassName="dashboard_bar_active" to="/pAdmin/products"><i class="fas fa-parking"></i>   Products</NavLink><br />
              <NavLink style={{ textDecoration: 'none', margin: 10}} activeClassName="dashboard_bar_active" to="/pAdmin/orders"><i class="fas fa-truck"></i>   Delivery List / Orders</NavLink><br />
              <NavLink style={{ textDecoration: 'none', margin: 10}} activeClassName="dashboard_bar_active" to="/pAdmin/approvecomments"><i class="fas fa-comments"></i>   Approve Comments</NavLink>
              <Button style = {{marginTop: 30, marginBottom: 10, marginLeft: 10, marginRight: 10}} onClick={() => handleLogout(props)} variant="dark">Log Out</Button>
              </div>
            </div>
          </div>
          </Col>
          <Col xl={10}>
          <div className="dashboard_content">
            <Switch>
              <Route path="/pAdmin/products" component={(props) => <Products {...props} user={user} />} />
              <Route path="/pAdmin/addproduct" component={(props) => <AddProduct {...props} user={user} />} />
              <Route path="/pAdmin/editproduct/:pid" component={(props) => <EditProduct {...props} user={user} key={window.location.pathname}/>} />
              <Route path="/pAdmin/editorder/:ohid" component={(props) => <SingleOrder {...props} user={user} key={window.location.pathname}/>} />
              <Route path="/pAdmin/orders/:iid" component={(props) => <SingleInvoice {...props} user={user} key={window.location.pathname}/>} />
              <Route path="/pAdmin/orders" component={(props) => <Orders {...props} user={user} />} />
              <Route path="/pAdmin/approvecomments" component={(props) => <Comments {...props} user={user} />} />
              <Route path="/pAdmin" component={Welcome} />
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