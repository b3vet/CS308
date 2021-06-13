import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUser } from '../utils/Common';
import '../css/Products.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { Link, Redirect, useHistory } from 'react-router-dom';

import { Ripple } from 'react-spinners-css';
import cookie from 'react-cookies'


function Cart(props) {

    const [user,setUser] = useState(getUser())
    const [products, setProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0)
    const [loading, setLoading] = useState(false)
   // let history = useHistory();
    
    const submit = () => {

    }

    const getData = () => {
      setLoading(true)
      if(user == null) {
        if(products == []) {
          cookie.save("cart", [], {path: '/'})
        }
        else {
          let x = cookie.load("cart")
          setProducts(x === undefined ? [] : x);
          var total = 0;
          if(x !== undefined) {
            for (const obj of x) {
              total+=obj.discountPrice * obj.quantity
            }
          }
          setTotalPrice(total)
        }
        setLoading(false)
        return;
      }
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/cart/',
            data: {
                uid: user.uid,
            }
          }).then(
            response => {
              //console.log(response.data)
              setProducts(response.data.products);
              setTotalPrice(response.data.total)
              setLoading(false)
            }
          ).catch(
            error => {
              if(error.response) {
                console.log(error.response.data)
              }
              setLoading(false)
            }
          )
    }
    const increaseQuantity = (product) => {
      setLoading(true)
      if(user == null) {
        let x = products;
        let idx = x.findIndex((p) => p.pid === product.pid)
        x[idx] = {...x[idx], quantity: x[idx].quantity + 1}

        cookie.remove('cart', { path: '/' })
        cookie.save("cart", x, { path: '/' })
        getData()
        return;
      }
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/addtocart/',
        data: {
          cart: {
            pid:product.pid,
            uid: user.uid,
            quantity: 1,
          },
          pid: product.pid,
        }
      }).then(
        response => {
          
          console.log(response.data)
          
        }
      ).catch(
        error => {
          setLoading(false);
          if (error.response) {
            
            console.log(error.response.data)
          }
          else {
              
              console.log(error.message)
          }
        }
      )
      getData()
      
    }
    const removeFromCart = (productHere) => {
      if(user == null) {
        let x = products;
        let idx = x.findIndex((p) => p.pid === productHere.pid)
        x[idx] = {...x[idx], quantity: x[idx].quantity - 1}

        if(x[idx].quantity === 0) {
          //means that we need to remove this product from the cart completely
          x = x.filter(product => product.pid !== productHere.pid)
        }
        
        
        cookie.remove('cart', { path: '/' })
        cookie.save("cart", x, { path: '/' })
        //setProducts(x);
        //setTotalPrice(totalPrice - productHere.discountPrice)
        //console.log(products)

        getData()
        return;
      }
      setLoading(false)
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/removefromcart/',
        data: {
            cart: {
              pid:productHere.pid,
              quantity: 1,
              uid: user.uid,
              totalPrice: 0
            }
          },
      }).then(
        response => {
          console.log(response.data)
          
        }
        ).catch(
          error => {
            
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else {
                console.log('Error', error.message);
            }
          }
        )
        getData()
    }
    

    useEffect(() => {
      setLoading(true)
      if(user == null) {
        if(products == []) {
          cookie.save("cart", [], {path: '/'})
        }
        else {
          let x = cookie.load("cart")
          setProducts(x === undefined ? [] : x);
          var total = 0;
          if(x !== undefined) {
            for (const obj of x) {
              total+=obj.discountPrice * obj.quantity
            }
          }
          setTotalPrice(total)
        }
        setLoading(false)
      }
      else {
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/cart/',
            data: {
                uid: user.uid,
            }
          }).then(
            response => {
              //console.log(response.data)
              setProducts(response.data.products);
              setTotalPrice(response.data.total)
              
              setLoading(false)
            }
          ).catch(
            error => {
              if(error.response) {
                console.log(error.response.data)
              }
              setLoading(false)
            }
          )
      }
      }, [])

    if(loading) {
      return(
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 300}}>
        <Ripple color="#111" />
      </div>
      )
    }
   if(products.length == 0) {
    return(
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 300}}>
       <h1>Your cart is empty. You can add products by shopping.</h1>
      </div>
      )
   }
    return (
      
        <Container style={{ marginTop: 100, marginBottom: 40}}>
        <Row>
        <Col xs={10} style={{textAlign: 'left'}}>
        
        <h1>My Cart</h1><h2>  {products.length} items</h2>

      <div>
          {
          products.map((p) => {
              return( 
                <Container style={{borderBottom: '2px solid rgb(50,50,50)', paddingBottom: 30, marginTop: 30}}>
                  <Row>
                    <Col xs={2}>
                        
                          <img src={"http://127.0.0.1:8000"+p.image} alt = "Product's Image" style={{height: 125, width:125}}></img>
                        
                    </Col>
                    <Col style={{display: 'flex', justifyContent: 'space-around', flexDirection: 'column', textAlign: 'left'}} xs={8}>
                        <Link style={{color: 'black', textDecoration: 'none', fontSize: 24}} to={`/product/${p.pid}`}>{p.name}</Link>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}><p style={{fontSize: 24, fontWeight: 'bold'}}>{p.discountPrice} ₺</p><p style={{fontSize: 20}}>Quantity: {p.quantity}</p></div>
                    </Col>
                    <Col xs={2} style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                      
                      <div className="pointed" onClick={() => {increaseQuantity(p)}} ><i style={{height: 50, width: 50, borderRadius: 50, border: '1px solid rgb(50,50,50)', justifyContent: 'center', alignItems: 'center', display: 'flex'}} class="fas fa-plus"></i></div>
                      
                      <div className="pointed" onClick={() => {removeFromCart(p)}} ><i style={{height: 50, width: 50, borderRadius: 50, border: '1px solid rgb(50,50,50)', justifyContent: 'center', alignItems: 'center', display: 'flex'}} class={p.quantity === 1 ? "fas fa-trash" : "fas fa-minus"}></i></div>
                    </Col>
                  </Row>
                </Container>
              )
          })
          }

      </div>
      </Col>
      <Col xs={2} >
        <Container style={{ position: 'fixed', border: '2px solid rgb(50,50,50)', borderRadius: 20}}>
          <Row style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', textAlign: 'left', padding: 20}}>
            <h3>Price to Pay:</h3>
            <h1>{totalPrice+73}$</h1>
          </Row>
          <Row style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', textAlign: 'left', padding: 20}}>
            <h5>Products: {totalPrice}$</h5>
            
            <h5>Shipment Fee: 73$</h5>
          </Row>
          <Row style={{padding: 20}}>
            <Button onClick={() => {user ? props.history.push(`/purchase`) : props.history.push("/login", {toPurchase: true})}} variant="dark" size={"lg"}>Place Order</Button>
          </Row>
        </Container>
      </Col>


      </Row>
      </Container>
        );
                    
}


export default Cart;
