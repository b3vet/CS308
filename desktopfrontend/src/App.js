import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route, NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import header_logo from './assets/logo_inverted.png';


import { setUserSession, getRefreshToken, getAccessToken, removeUserSession, getUser } from './utils/Common';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Home from './pages/Home';
import AllProducts from './pages/AllProducts';
import Product from './pages/Product';
import AddProduct from './pages/admin/ProductManager/AddProduct';
import PrivateRoute from './utils/PrivateRoute';
import PublicRoute from './utils/PublicRoute';
import './assets/FontAwesome/css/fontawesome.css';
import './assets/FontAwesome/css/solid.css';

function App() {
  const [user, setUser] = React.useState(localStorage.getItem('user') || null);
  
 
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <div className="header">
              <div id="icon-bar">
              <i class="fas fa-search"></i>
              <i class="fas fa-shopping-cart"></i>
              <Link className = "linkClass" to={user ? "/dashboard/info" : "/login"}><i class="fas fa-user"></i></Link>
             </div>
            <Link exact to="/"><img id = "header-logo" src={header_logo} style={{width: 1600, height: 323}} /></Link>
            <div className = "navbar"> 
            <NavLink activeClassName="active" to="/products/4">WEDDING RINGS</NavLink>
            <NavLink activeClassName="active" to="/products/5">ENGAGEMENT RINGS</NavLink>
            <NavLink activeClassName="active" to="/products/6">NECKLACES</NavLink>
            <NavLink activeClassName="active" to="/products/7">BRACELETS</NavLink>
            <NavLink activeClassName="active" to="/products/8">EARRINGS</NavLink>
            </div>

          </div>
          <div className="content">
            <Switch>
              <Route exact path="/" component={Home} />
              <PublicRoute path="/login" component={Login} />
              <PrivateRoute path="/dashboard" component={(props) => <Dashboard {...props} user={user} />} />
              <PrivateRoute path="/addproduct" component={(props) => <AddProduct {...props} user={user} />} />
              <PublicRoute path="/register" component={Register} />
              <Route path="/product/:pid" component={(props) => <Product {...props} key={window.location.pathname}/>} />
              <Route path="/products/:caid" component={(props) => <AllProducts {...props} key={window.location.pathname}/>} />
            </Switch>
          </div>
          <div className="footer">
            <div>
            <br /><h5>Contact Info</h5>
              <p>BANDORA LTD ŞTİ</p>
              <p>Selamidere Mahallesi Canımsın Sokak No: 17 Kat: 2 Sultanbeyli/ISTANBUL</p>
              <p><b>PHONE: </b>1234567</p>
              <p><b>EMAIL: </b>crazy38@hotmail.com</p>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
