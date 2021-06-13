import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Products.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { Ripple } from 'react-spinners-css';
import { Link, useLocation } from 'react-router-dom';
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
    const [loading, setLoading] = useState(false)
    
    const [products, setProducts] = useState([])
    const [caid, setCaid] = useState(-1)
    const [category, setCategory] = useState("")
    const [selectedValue, setSelectedValue] = useState('old')
    const maxPrice = useFormInput('');
    const minPrice = useFormInput('');
    const [color, setColor] = useState("all");
    const [material, setMaterial] = useState("all");
    let location = useLocation();

    const order = (ord) => {
      setSelectedValue(ord)
      if(ord == "incPrc") {
        products.sort((a, b) => (a.discountPrice > b.discountPrice) ? 1 : (a.discountPrice === b.discountPrice) ? ((a.name > b.name) ? 1 : -1) : -1 )
      }
      else if (ord == "decPrc") {
        products.sort((a, b) => (a.discountPrice < b.discountPrice) ? 1 : (a.discountPrice === b.discountPrice) ? ((a.name > b.name) ? 1 : -1) : -1 )
      }
      else if(ord == "old") {
        products.sort((a, b) => (a.pid > b.pid) ? 1 : (a.pid === b.pid) ? ((a.name > b.name) ? 1 : -1) : -1 )
      }
      else if(ord == "new") {
        products.sort((a, b) => (a.pid < b.pid) ? 1 : (a.pid === b.pid) ? ((a.name > b.name) ? 1 : -1) : -1 )
      }
      else if(ord == "rating") {
        products.sort((a, b) => (a.totalRating < b.totalRating) ? 1 : (a.totalRating === b.totalRating) ? ((a.name > b.name) ? 1 : -1) : -1 )
      }
      
    }

    const filter = (e) => {
      e.preventDefault();
      setLoading(true)
      console.log("maxprice is " + maxPrice + "min price is " + minPrice)
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/filteredproductsbycategory/',
        data: {
          caid: props.match.params.caid,
          minPrice: minPrice.value == '' ? 0 : minPrice.value,
          maxPrice: maxPrice.value == '' ? 100000 : maxPrice.value,
          color: color,
          material: material
        },
      })
      .then(
        response => {
          setProducts(response.data.products);
          setLoading(false);
          console.log(products)
      })
      .then(() => order(selectedValue))
      .catch(
        error => {
          setLoading(false);
          if (error.response) {
              console.log(error.response.data);      
          } else {
             console.log('Error', error.message);
            }
        }
      )
      
    }
    const resetFilters = () => {
      setLoading(true)
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/productsbycategory/',
        data: {caid:props.match.params.caid},
      }).then(
        response => {
          
          setProducts(response.data.products);
          setLoading(false);
          minPrice.change('')
              maxPrice.change('')
              setColor("all")
              setMaterial("all")
              order('old')
        }
        ).catch(
          error => {
            setLoading(false);
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else {
                console.log('Error', error.message);
            }
          }
          )
      
    }
    useEffect(() => {
        setLoading(true);
        setCaid(props.match.params.caid);
        if(location.state != null) { //means we are here for search
          console.log(location.state)
          axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/search/',
            data: {
              query: location.state.q,
            }
          }).then(
            response => {
              
              setProducts(response.data.results);
                setLoading(false);
                minPrice.change('')
                maxPrice.change('')
                setColor("all")
                setMaterial("all")
                setCategory("Search Results")
            }
          ).catch(
            error => {
              setLoading(false);
              
              if (error.response) {
                console.log(error.response)
              }
              else console.log(error.message);
              
            }
          )
          return;
        }
        
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/productsbycategory/',
            data: {
              caid: props.match.params.caid
            }
          }).then(
            response => {
              //console.log(response.data)
              console.log(response.data.products)
              setProducts(response.data.products);
              setLoading(false);
              minPrice.change('')
              maxPrice.change('')
              setColor("all")
              setMaterial("all")
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
          else {
            setCategory("Search")
          }
    }, [])


    //console.log(products);
    //const productsArray = JSON.parse(products);

    if(loading) {
      return(
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 300}}>
        <Ripple color="#111" />
      </div>
      )
    }
    else {
    return (
      
    <div class="Product-Category-Page-Container">
    
      <div class = "Filter-Box">
        <p>Find your <i class="fas fa-ring"></i></p>
        <form>
        <header class = "Filter-Box-Header">Material</header>

        <div class = "Type-Filter">
          <fieldset id="group2" onChange={(e) => setMaterial(e.target.value)}>
          <div class="Karat">
            <input type="radio" class="Type-Filter-Box" name="group2" value="18K GOLD" checked={material==="18K GOLD"}/>
            <label>18K Gold</label>
          </div>

          <div class="Karat">
            <input type="radio"  name="group2" value="14K GOLD" checked={material==="14K GOLD"}/>
            <label>14K Gold</label>
          </div>

          <div class="Karat">
            <input type="radio"  name="group2" value="10K GOLD" checked={material==="10K GOLD"}/>
            <label>10K Gold</label>
          </div>
          </fieldset>
        </div>
        <header class = "Filter-Box-Header">Price</header>

      
        <div class="d-flex align-items-center mt-4 pb-1">
          <div class="md-form md-outline my-0">
            <input {...minPrice} id="from" type="text" class="form-control mb-0"/>
            <label for="form">$ Min</label>
          </div>
          <p class="px-2 mb-0 text-muted"> - </p>
          <div class="md-form md-outline my-0">
            <input {...maxPrice} id="to" type="text" class="form-control mb-0"/>
            <label for="to">$ Max</label>
          </div>
        </div>
      

        <header class = "Filter-Box-Header">Color</header>
        
        <div class="Color-Filters">
        <fieldset id="group1" onChange={(e) => setColor(e.target.value)}>

          <div class="Color-Filter-3  Color-Filter">
          <input type="radio" name="group1" value="ROSE" checked={color==="ROSE"}/>
          </div>
          

          <div class="Color-Filter-4  Color-Filter">
          <input type="radio" class="Color-Filter-1" name="group1" value="SILVER" checked={color==="SILVER"}/>
          </div>

          <div class="Color-Filter-5  Color-Filter">
          <input type="radio" class="Color-Filter-1" name="group1" value="GOLD" checked={color==="GOLD"}/>
          </div>
        </fieldset>
        </div>
        

        <button  style={{marginRight: 5}} type="button" onClick = {(e) => {filter(e)}} class = "Filter-Button">Apply</button>
        <button type="button" onClick = {(e) => {resetFilters(e)}} class = "Filter-Button">Reset</button>
        </form>
    </div>
    
      
      <div className={classes.root}>
      <p class = "products-header">{category}</p><br></br>
      <div style={{width: '100%', height: 25}}>
        <Container className="Order-Row-Container">
          <Row className="Order-Row">
            <Col className="orderByButton-Title">Order By:</Col>
            <Col onClick={() => {order('incPrc')}} className={selectedValue !== 'incPrc' ? "orderByButton" : "selectedOrderByButton"}><i class="fas fa-arrow-up"></i>Price</Col>
            <Col onClick={() => {order('decPrc')}} className={selectedValue !== 'decPrc' ? "orderByButton" : "selectedOrderByButton"}><i class="fas fa-arrow-down"></i> Price</Col>
            <Col onClick={() => {order('new')}} className={selectedValue !== 'new' ? "orderByButton" : "selectedOrderByButton"}>Newest</Col>
            <Col onClick={() => {order('old')}} className={selectedValue !== 'old' ? "orderByButton" : "selectedOrderByButton"}>Oldest</Col>
            <Col onClick={() => {order('rating')}} className={selectedValue !== 'rating' ? "orderByButton" : "selectedOrderByButton"}>Most <i class="fas fa-star"></i></Col>
          </Row>
        </Container>
      </div>

      <Grid container spacing={10}>
          {
          products.map((product) => (

            <Grid item xs={3}>

                <Link to={`/product/${product.pid}`}>  
                  <img src={"http://127.0.0.1:8000"+product.image} alt = "Product's Image" style={{height: 250, width:250}}></img>
                </Link>
                <Link className="nonActiveLink, productGridLink" to={`/product/${product.pid}`}>{product.name}</Link>
                {product.price === product.discountPrice ? <p style={{fontWeight: 'bold', fontSize: 18, display: 'flex', justifyContent: 'flex-end', flexDirection: 'row'}}>{product.price}$</p> : <div style={{display: 'flex', justifyContent: 'flex-end', flexDirection: 'row'}}><p style={{color: 'red', textDecoration: 'line-through', marginRight: 5}}>{product.price}$</p><p style={{fontWeight: 'bold', fontSize: 18}}>{product.discountPrice}$</p></div>}
              

            </Grid>

          ))
          }

      </Grid>
      </div>
    </div>
  );
  }
}
const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);
 
  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange,
    change: (val) => setValue(val) 
  }
}


export default AllProducts;
