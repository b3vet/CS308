import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUser } from '../utils/Common';
import '../css/Products.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { Link, Redirect, useLocation } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { Ripple } from 'react-spinners-css';
import cookie from 'react-cookies'

function Purchase(props) {

    const [user,setUser] = useState(getUser())
    const [products, setProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0)
    const [loading, setLoading] = useState(false)
    const [agreed, setAgreed] = useState(false)
    const [cartNumber, setCartNumber] = useState('')
    const [endMonth, setEndMonth] = useState(null)
    const [endYear, setEndYear] = useState(null)
    const [cvv, setCvv] = useState(null)
    const [delivery, setDelivery] = useState('')
    const [invoiceAddress, setInvoiceAddress] = useState('')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [error, setError] = useState('')
    let location = useLocation();
    function isNumeric(value) {
        return /^-?\d+$/.test(value);
    }
    const submit = () => {
        if(!agreed) {
            setError("You must agree to the terms of use!")
        }
        else {
            if(cartNumber.length != 16) {
                setError("Invalid card number!")
            }
            else if(!isNumeric(cartNumber)) {
                setError("Invalid card number!")
            }
            else if(endMonth.length != 2) {
                setError("Invalid end month!")
            }
            else if(endYear.length != 4) {
                setError("Invalid end year!")
            }
            else if(!isNumeric(endMonth)) {
                setError("Invalid end month!")
            }
            else if(!isNumeric(endYear)) {
                setError("Invalid end year!")
            }
            else if(!isNumeric(cvv)) {
                setError("Invalid CVV!")
            }
            else if(cvv.length != 3) {
                setError("Invalid CVV")
            }
            else if(endYear > 2100) {
                setError("End Year cannot be greater than 2100")
            }
            else if(endMonth > 12 || endMonth < 1) {
                setError("Invalid end month!")
            }
            else {
                var data = {}
                if(location.state != null) {
                    if(location.state.fromLogin) {
                        data = {
                            uid: user.uid,
                            address: delivery,
                            invoiceAddress: invoiceAddress,
                            name: name,
                            surname: surname,
                            afterLogin: true
                        }
                    }
                    else {
                        data = {
                            uid: user.uid,
                            address: delivery,
                            invoiceAddress: invoiceAddress,
                            name: name,
                            surname: surname,
                            afterLogin: false
                        }
                    }
                }
                else {
                    data = {
                        uid: user.uid,
                        address: delivery,
                        invoiceAddress: invoiceAddress,
                        name: name,
                        surname: surname,
                        afterLogin: false
                    }
                }
                axios({
                    method: 'post',
                    url: 'http://127.0.0.1:8000/api/order/',
                    data: data
                })
                  .then(
                    response => {
                      console.log(response.data)
                      props.history.push('/success');        
                    }
                    ).catch(
                      error => {
                        
                        if (error.response) {
                            setError(error.response.data.error)
                            console.log(error.response.data);
                            console.log(error.response.status);
                            console.log(error.response.headers);
                        } else {
                            console.log('Error', error.message);
                        }
                      }
                    )
            }
        }
    }
    useEffect(() => {
      setLoading(true)
      setAgreed(false)
      setError('')
      setEndYear(null)
      setEndMonth(null)
      setCartNumber(null)
      setInvoiceAddress(null)
      setDelivery(null)
      setCvv(null)
      console.log(location.state)
      if(location.state != null) {
          if(location.state.fromLogin) {
            setLoading(true)
            
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
       <h1>It seems like there is nothing to purchase here. Why don't you start shopping?</h1>
      </div>
      )
   }
    return (

        <Container style={{ marginTop: 100}}>
            <Row>
                <Col xs={10} style={{textAlign: 'left'}}>
                        <Form>
                            <Container style={{paddingBottom: 30, marginTop: 30}}>
                                <Row style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', textAlign: 'left', padding: 20}}>
                                    <h4>Delivery Address</h4>
                                    <Form.Group>
                                        <Form.Control value={delivery} onChange={(e) => setDelivery(e.target.value)} style={{width: 700}} as="textarea" rows={2} />
                                    </Form.Group>
                                </Row>
                                <Row style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', textAlign: 'left', padding: 20}}>
                                <h4>Invoice Information</h4>
                                    <Container>
                                    <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control value={name} onChange={(e) => setName(e.target.value)} style={{width: 320}} type="text"/>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Surname</Form.Label>
                                            <Form.Control value={surname} onChange={(e) => setSurname(e.target.value)} style={{width: 320}} type="text"/>
                                        </Form.Group>
                                    </Col>
                                    </Row>
                                    <Row>
                                        <Form.Group>
                                            <Form.Label>Invoice Address</Form.Label>
                                            <Form.Control value={invoiceAddress} onChange={(e) => setInvoiceAddress(e.target.value)} style={{width: 700}} as="textarea" rows={2} />
                                        </Form.Group>
                                    </Row>
                                    </Container>
                                </Row>
                                <Row style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', textAlign: 'left', padding: 20}}>
                                    <h4>Order Details</h4>
                                    {
                                        products.map((product) => {
                                            return(
                                                <p>{product.name + "    x" + product.quantity+ " = " + product.discountPrice * product.quantity + "$"}</p>
                                            )
                                        })
                                    }
                                </Row>
                                <Row style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', textAlign: 'left', padding: 20}}>
                                    <h4>Payment Information</h4>
                                    <Container>
                                        <Row>
                                            <Col xs = {6}>
                                                <Form.Group>
                                                    <Form.Label>16-Digit Cart Number</Form.Label>
                                                    <Form.Control value={cartNumber} onChange={(e) => setCartNumber(e.target.value)} style={{width: 300}} type="text"/>
                                                </Form.Group>
                                            </Col>
                                            <Col xs={6} style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                                                <Form.Group>
                                                    <Form.Label>Month   </Form.Label>
                                                    <Form.Control value={endMonth} onChange={(e) => setEndMonth(e.target.value)} style={{width: 70}} type="number"  />
                                                </Form.Group>
                                                <p>/</p>
                                                <Form.Group style={{marginLeft: 10}}>
                                                    <Form.Label>Year</Form.Label>
                                                    <Form.Control value={endYear} onChange={(e) => setEndYear(e.target.value)} style={{width: 70}} type="number"  />
                                                </Form.Group>
                                                <Form.Group style={{marginLeft: 30}}>
                                                    <Form.Label>CVV1</Form.Label>
                                                    <Form.Control value={cvv} onChange={(e) => setCvv(e.target.value)} style={{width: 70}} type="number"  />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Row>
                            </Container>
                            {error && <p style={{color: 'red'}}>{error}</p>}
                        </Form>
                </Col>
             
                <Col xs={2} >
                    <Form>
                        <Container style={{ position: 'fixed', border: '2px solid rgb(50,50,50)', borderRadius: 20}}>
                            <Row style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', textAlign: 'left', padding: 20}}>
                                <h3>Price to Pay:</h3>
                                <h1>{totalPrice+73}$</h1>
                            </Row>
                            <Row style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', textAlign: 'left', padding: 20}}>
                                <h5>Products: {totalPrice}$</h5>
                                
                                <h5>Shipment Fee: 73$</h5>
                            </Row>
                            <Row style={{padding: 20, display: 'flex', flexDirection: 'row', justifyContent: 'left', alignItems: 'center'}}>
                            <Form.Check 
                                type={"checkbox"}
                                id={"terms"}
                                label={"I agree to the terms and conditions of use."}
                                style={{maxWidth: 200, fontSize: 10}}
                                checked={agreed}
                                onChange={() => setAgreed(!agreed)}
                            />
                            </Row>
                            <Row style={{padding: 20}}>
                                <Button onClick={() => {submit()}} variant="dark" size={"lg"} disabled={!agreed}>Place Order</Button>
                            </Row>
                        </Container>
                    </Form>
                </Col>


            </Row>
        </Container>
    );
                    
}


export default Purchase;
