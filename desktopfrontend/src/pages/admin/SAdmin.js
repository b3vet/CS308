import React, {useState, useEffect} from 'react';
import { getUser, removeUserSession } from '../../utils/Common';
import { Link, BrowserRouter, NavLink, Switch, Route, Redirect } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios';
import Invoices from './salesManager/Invoices';
import Discount from './salesManager/Discount';
import Revenue from './salesManager/Revenue';
import Welcome from './salesManager/Welcome';
import EditDiscount from './salesManager/EditDiscount';
import AddDiscount from './salesManager/AddDiscount';
import SingleInvoice from './salesManager/SingleInvoice';
import Refunds from './salesManager/Refunds';



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
              <NavLink style={{ textDecoration: 'none', margin: 10 }} activeClassName="dashboard_bar_active" to="/sAdmin/imrich"><i class="fas fa-money-bill-wave"></i>   Revenue</NavLink><br />
              <NavLink style={{ textDecoration: 'none', margin: 10}} activeClassName="dashboard_bar_active" to="/sAdmin/discount"><i class="fas fa-percent"></i>   Discounts</NavLink><br />
              <NavLink style={{ textDecoration: 'none', margin: 10}} activeClassName="dashboard_bar_active" to="/sAdmin/invoices"><i class="fas fa-file-invoice"></i>   Invoices</NavLink><br />
              <NavLink style={{ textDecoration: 'none', margin: 10}} activeClassName="dashboard_bar_active" to="/sAdmin/refunds"><i class="fas fa-undo"></i>   Refund Requests</NavLink>
              <Button style = {{marginTop: 30, marginBottom: 10, marginLeft: 10, marginRight: 10}} onClick={() => handleLogout(props)} variant="dark">Log Out</Button>
              </div>
            </div>
          </div>
          </Col>
          <Col xl={10}>
          <div className="dashboard_content">
            <Switch>
              
              <Route path="/sAdmin/imrich" component={(props) => <Revenue {...props} user={user} />} />
              <Route path="/sAdmin/discount/adddiscount" component={(props) => <AddDiscount {...props} user={user} />} />
              <Route path="/sAdmin/discount/:did" component={(props) => <EditDiscount {...props} user={user} key={window.location.pathname}/>} />
              <Route path="/sAdmin/invoices/:iid" component={(props) => <SingleInvoice {...props} user={user} key={window.location.pathname}/>} />
              <Route path="/sAdmin/discount" component={(props) => <Discount {...props} user={user} />} />
              <Route path="/sAdmin/invoices" component={(props) => <Invoices {...props} user={user} />} />
              <Route path="/sAdmin/refunds" component={(props) => <Refunds {...props} user={user} />} />
              <Route path="/sAdmin" component={Welcome} />
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
