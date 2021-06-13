import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route, NavLink, Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import header_logo from './assets/logo_inverted.png';


import { setUserSession, getRefreshToken, getAccessToken, removeUserSession, getUser } from './utils/Common';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Home from './pages/Home';
import AllProducts from './pages/AllProducts';
import Product from './pages/Product';
import PAdmin from './pages/admin/PAdmin';
import SAdmin from './pages/admin/SAdmin';
import Cart from './pages/Cart';
import Purchase from './pages/Purchase';
import Success from './pages/Success';
import PrivateRoute from './utils/PrivateRoute';
import PublicRoute from './utils/PublicRoute';
import './assets/FontAwesome/css/fontawesome.css';
import './assets/FontAwesome/css/solid.css';

function App() {

  const [user, setUser] = React.useState(localStorage.getItem('user') || null);

  const Search = (props) => {
    const [query, setQuery] = useState('')
    let history = useHistory();
    const searchFunc = () => {
      history.push("/products", {q: query})
      console.log(query)
    }
    return (
      <><input value={query} style={{marginTop: 20, borderRadius: 40, outline: 'none'}} name="s" type="text" onChange={(e) => setQuery(e.target.value)} /><a className="linkClass" type = "submit" onClick={searchFunc}><i class="fas fa-search"></i></a></>
    )
  }
  
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <div className="header">

            <div className = "navbar"> 
            <Link exact to="/"><img id = "header-logo" src={header_logo} style={{width: 1600, height: 323}} /></Link>
            <NavLink activeClassName="active" to="/products/4">WEDDING RINGS</NavLink>
            <NavLink activeClassName="active" to="/products/5">ENGAGEMENT RINGS</NavLink>
            <NavLink activeClassName="active" to="/products/6">NECKLACES</NavLink>
            <NavLink activeClassName="active" to="/products/7">BRACELETS</NavLink>
            <NavLink activeClassName="active" to="/products/8">EARRINGS</NavLink>
              <div id="icon-bar">

              <Search/>

              

              <Link className = "linkClass" to={"/cart"}><i class="fas fa-shopping-cart"></i></Link>
              <Link className = "linkClass" to={user ? "/dashboard/info" : "/login"}><i class="fas fa-user"></i></Link>
             </div>
            </div>

          </div>
          <div className="content">
            <Switch>
              <Route exact path="/" component={Home} />
              <PublicRoute path="/login" component={Login} />
              <PrivateRoute path="/dashboard" component={(props) => <Dashboard {...props} user={user} />} />
              <PrivateRoute path="/pAdmin" component={(props) => <PAdmin {...props} user={user} />} />
              <PrivateRoute path="/sAdmin" component={(props) => <SAdmin {...props} user={user} />} />
              <Route path="/cart" component={(props) => <Cart {...props} user={user}  />} />
              <Route path="/purchase" component={(props) => <Purchase {...props} user={user}  />} />
              <PublicRoute path="/register" component={Register} />
              <Route path="/success" component={Success} />
              
              <Route path="/product/:pid" component={(props) => <Product {...props} key={window.location.pathname}/>} />
              <Route path="/products/:caid" component={(props) => <AllProducts {...props} key={window.location.pathname}/>} />
              <Route path="/products" component={(props) => <AllProducts {...props} key={window.location.pathname}/>} />
            </Switch>

            <footer className="footer">
            <div>
            <br /><h5>Contact Info</h5>
              <p>BANDORA LTD ŞTİ</p>
              <p>Selamidere Mahallesi Canımsın Sokak No: 17 Kat: 2 Sultanbeyli/ISTANBUL</p>
              <p><b>PHONE: </b>1234567</p>
              <p><b>EMAIL: </b>crazy38@hotmail.com</p>
            </div>
          </footer>
          </div>
          
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
