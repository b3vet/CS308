import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Products.css';


import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginRight: "50px",
    marginLeft: "50px"
  },
}));
function AllProducts(props) {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    
    const [products, setProducts] = useState([]);
    const [caid, setCaid] = useState(-1)
    const [category, setCategory] = useState("")
    useEffect(() => {
        setLoading(true);
        setCaid(props.match.params.caid);
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/productsbycategory/',
            data: {
              caid: props.match.params.caid
            }
          }).then(
            response => {
              //console.log(response.data)
              setProducts(response.data.products);
              setLoading(false);
            }
          ).catch(
            error => {
              setLoading(false);
              //if (error.response.status === 401) //setError(error.response.data.message);
              //else //setError("Something went wrong. Please try again later.");
            }
          )
          if (props.match.params.caid == 4) {
            setCategory("WEDDING RINGS")
          }
          else if (props.match.params.caid == 5) {
            setCategory("ENGAGEMENT RINGS")
          }
          else if (props.match.params.caid == 6) {
            setCategory("NECKLACES")
          }
          else if (props.match.params.caid == 7) {
            setCategory("BRACELETS")
          }
          else if (props.match.params.caid == 8) {
            setCategory("EARRINGS")
          }
    }, [])


    //console.log(products);
    //const productsArray = JSON.parse(products);

    if(loading) {
      return(<div>Loading...</div>)
    }
    else {
    return (

    <div class="Product-Category-Page-Container">

    <div class = "Filter-Box">

      <header class = "Filter-Box-Header">Type</header>

      <div class = "Type-Filter">

        <div>
          <input type="checkbox" class="Type-Filter-Box"/>
          <label>New</label>
        </div>

        <div>
          <input type="checkbox"/>
          <label>Used</label>
        </div>

        <div>
          <input type="checkbox"/>
          <label>Collectible</label>
        </div>

        <div>
          <input type="checkbox"/>
          <label>Renewed</label>
        </div>
      </div>

      <header class = "Filter-Box-Header">Price</header>

      <div class="slider-price d-flex align-items-center my-4">
        <span class="font-weight-normal small text-muted mr-2">$0</span>
        <form class="multi-range-field w-100 mb-1">
          <input id="multi" class="multi-range" type="range" />
        </form>
        <span class="font-weight-normal small text-muted ml-2">$100</span>
      </div>

      <header class = "Filter-Box-Header">Price Range</header>

      <form>
        <div class="d-flex align-items-center mt-4 pb-1">
          <div class="md-form md-outline my-0">
            <input id="from" type="text" class="form-control mb-0"/>
            <label for="form">$ Min</label>
          </div>
          <p class="px-2 mb-0 text-muted"> - </p>
          <div class="md-form md-outline my-0">
            <input id="to" type="text" class="form-control mb-0"/>
            <label for="to">$ Max</label>
          </div>
        </div>
      </form>

    <header class = "Filter-Box-Header">Colors</header>

    <div class="Color-Filters">

    <div class="Color-Filter-3  Color-Filter">
    <input type="checkbox" class="Color-Filter-1"/>
    <label>Rose</label>
    </div>

    <div class="Color-Filter-4  Color-Filter">
    <input type="checkbox" class="Color-Filter-1"/>
    <label>Silver</label>
    </div>

    <div class="Color-Filter-5  Color-Filter">
    <input type="checkbox" class="Color-Filter-1"/>
    <label>Gold</label>
    </div>

    </div>

    <button type="button" class = "Filter-Button">Apply</button>
    </div>
      
      <div className={classes.root}>
      <p class = "products-header">{category}</p><br></br>
      <Grid container spacing={10}>
          {
          products.map((product) => (

            <Grid item xs={3}>

              <img src={"http://127.0.0.1:8000"+product.image} alt = "Product's Image" style={{height: 250, width:250}}></img>
              <Link className="nonActiveLink" to={`/product/${product.pid}`}>{product.name}</Link>
              <p>{product.price} ₺</p>

            </Grid>

          ))
          }

      </Grid>
      </div>
    </div>
  );
  }
}

export default AllProducts;
