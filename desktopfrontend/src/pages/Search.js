import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from 'react-bootstrap/Button'
import { Ripple } from 'react-spinners-css';
function Login(props) {
  const [loading, setLoading] = useState(false);
  //const username = useFormInput('');
  //const password = useFormInput('');
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
   axios({
    method: 'post',
    url: 'http://127.0.0.1:8000/api/search/',
    data: {
      query: query,
    }
  }).then(
    response => {
      setLoading(false);
      setResults(response.data.results);
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
      
      <div class="Search-Field">
        <i class="fas fa-search"></i><br />
        <form class="Search-Field-1">
        <input enabled={!loading} type="text" value={query} onChange={(event) => setQuery(event.target.value)}/>
        <Button class = "Search-Button" variant = "dark" onClick={(event) => {handleSearch(event)}}>Search</Button>
        </form>

      </div>
      {loading ? 
        <div class="Product-Single-List">
      <div class="Product-Single-List">
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 180}}>
                <Ripple color="#111" />
              </div>
              </div></div>
              :
      <div class="Product-Single-List">
      <div class="Product-Single-List">

          {
          results.map((product) => (
              <Link to={`/product/${product.pid}`} class="Product-Single-Item">  
                  <img src={"http://127.0.0.1:8000"+product.image} alt = "Product's Image" style={{height: 180, width:180}}></img>
                <Link className="nonActiveLink, productGridLink" to={`/product/${product.pid}`}>{product.name}</Link>
                <p>{product.price} ₺</p>
              </Link>
          ))
          }
      
          </div>
      </div>
      }
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