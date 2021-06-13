import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CookiesProvider } from 'react-cookie';
 
ReactDOM.render(<CookiesProvider><App /></CookiesProvider>, document.getElementById('root'));
