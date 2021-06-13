import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUser } from '../utils/Common';
import '../css/Products.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import { Ripple } from 'react-spinners-css';
import { Link } from 'react-router-dom';
import time from '../assets/icons/timeBl.png'
import truck from '../assets/icons/delivery-truckBl.png'
import leaf from '../assets/icons/leaf.png'
import ring from '../assets/icons/wedding-ringBl.png'
import handshake from '../assets/icons/handshakeBl.png'
import diamond from '../assets/icons/diamondNewBl.png'
import cookie from 'react-cookies'
import Ratings from 'react-ratings-declarative';

function Product(props) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [product, setProduct] = useState(null);
    const [comments, setComments] = useState([]);
    const [avgRating, setAvgRating] = useState(0)
    const [pid, setPid] = useState(-1)
    const [key, setKey] = useState(null);
    const [comment, setComment] = useState(null);
    const [rating, setRating] = useState(null);
    const [res, setRes] = useState(null);
    const [user, setUser] = useState(getUser());
    const [added, setAdded] = useState(false);
    const [out, setOut] = useState(false)
    
    
    const addDays = (date, days) => {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }
    const handleSubmit = (event) => {
        
        event.preventDefault()
        const data = {
            comment: {
              pid: props.match.params.pid,
              comment: comment,
              uid: user.uid,
              approved: false,
              rating: rating,
            },
            pid: props.match.params.pid
          };
          console.log(data);
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/addcommentandrating/',
            data: {
              comment: {
                pid: props.match.params.pid,
                comment: comment,
                uid: user.uid,
                approved: false,
                rating: rating,
              },
              pid: props.match.params.pid
            }
          }).then(
            response => {
              setLoading(false);
              setRes("Your comment will appear here when it is approved.");
            }
          ).catch(
            error => {
              setLoading(false);
              if (error.response) {
                setError(error.response.data.error)
                console.log(error.response)
              }
              else {
                  setError(error.message);
                  console.log(error.message)
              }
            }
          )
          getData();
    }
    const getData = () => {
      setRes(null);
        setLoading(true);
        
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/singleproduct/',
            data: {pid: props.match.params.pid},
        }).then(
            response => {
                setProduct(response.data.product[0]);
                setComments(response.data.comments);
                setAvgRating(response.data.avgRating);
                setLoading(false);
                
                if(response.data.product[0].stock == 0) {
                  setOut(true);
                }
                
            }
            ).catch(
                error => {
                    setLoading(false);
                    if (error.response) {
                        console.log(error.response.status);
                        console.log(error.response.data.error);
                    } else {
                        console.log('Error', error.message);
                    }
                }
                )
                setPid(props.match.params.pid)
    }
    const addToCart = (event) => {
        if(user == null) {
          
          var check = false;
          let x = cookie.load("cart") || []
          let idx = x.findIndex((p) => p.pid === product.pid)
          if(idx == -1) {
            const data = {
              pid: product.pid,
              name: product.name,
              material: product.material,
              productionCost: product.prodcutionCost,
              color: product.color,
              stock: product.stock,
              warranty: product.warranty,
              price: product.price,
              description: product.description,
              totalRating: product.totalRating,
              ratingCount: product.ratingCount,
              image: product.image,
              caid: product.caid,
              did: product.did,
              discountPrice: product.discountPrice,
              quantity: 1,
            }
            x = [...x, data]
          }
          else {
            x[idx] = {...x[idx], quantity: x[idx].quantity + 1}
          }
          console.log(x)
          cookie.remove('cart', { path: '/' })
          cookie.save("cart", x, { path: '/' })
          setAdded(true)
          return;
        }

        const data = {
            data: {
              pid: props.match.params.pid,
              uid: user.uid,
            },
          };
          console.log(data);
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/addtocart/',
            data: {
              cart: {
                pid: props.match.params.pid,
                uid: user.uid,
                quantity: 1,
              },
              pid: props.match.params.pid,
            }
          }).then(
            response => {
              setLoading(false);
              setAdded(true);
              setRes("Added to cart successfully.");
            }
          ).catch(
            error => {
              setLoading(false);
              if (error.response) {
                setError(error.response.data.error)
                console.log(error.response)
              }
              else {
                  setError(error.message);
                  console.log(error.message)
              }
            }
          )
    }

    useEffect(() => {
        setRes(null);
        setLoading(true);
        
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/singleproduct/',
            data: {pid: props.match.params.pid},
        }).then(
            response => {
                setProduct(response.data.product[0]);
                setComments(response.data.comments);
                setAvgRating(response.data.avgRating);
                setLoading(false);
                
                if(response.data.product[0].stock == 0) {
                  setOut(true);
                }
                
            }
            ).catch(
                error => {
                    setLoading(false);
                    if (error.response) {
                        console.log(error.response.status);
                        console.log(error.response.data.error);
                    } else {
                        console.log('Error', error.message);
                    }
                }
                )
                setPid(props.match.params.pid)
                
            }, [props.match.params.pid])

            if(loading) {
              return(
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 300}}>
                <Ripple color="#111" />
              </div>
              )
            }
            else {
                if(product == null) {
                    return(<div>A PROBLEM OCCURED</div>)
                }
                else {
                    
                    var d = new Date()
                    var d = addDays(d, 7)
                    var options = { weekday: 'long', month: 'long', day: 'numeric' };
                    
                    return (
                        <>
                        <Container style={{paddingTop: 50, marginBottom: 50}}>
                          <Row>
                            <Col>
                              <img src={"http://127.0.0.1:8000"+product.image} alt = "Product's Image" width={500} height ={500}></img>
                            </Col>
                            <Col>
                              <div class = "Product-info">
                              <h1>{product.name}</h1><br></br>
                              {product.discountPrice === product.price ? <><b><p style={{textAlign: 'right', fontWeight: 'bold', fontSize: 40}}>{product.price}$</p></b><br></br></> : <><b><p style={{textAlign: 'right', fontWeight: 'bold', fontSize: 30, color:'red', textDecoration: 'line-through'}}>{product.price}$</p><p style={{textAlign: 'right', fontWeight: 'bold', fontSize: 40}}>         {product.discountPrice}$</p></b><br></br></>}
                              <div class = "product-details">
                              <h4>Product Details:</h4>
                              <p><b>Color: </b>{product.color}</p>
                              <p><b>Material: </b>{product.material}</p>
                              <p><b>Stock: </b>{product.stock}</p>
                              <p><b>Warranty: </b>{product.warranty} year(s)</p>
                              <Button style={{marginBottom: 40}} variant="dark" style={{height: 50, width: 400, alignSelf: 'center'}} onClick={addToCart} disabled={product.stock == 0}>{product.stock == 0 ? "This product is out of stock" : "Add to Cart"}</Button>
                              {added && <Alert style={{marginTop: 20}} variant="success" onClose={() => setAdded(false)} dismissible>
                                          <Alert.Heading>Added to cart!</Alert.Heading>
                                          <p>
                                            You can go to your cart to complete the order!
                                          </p>
                                        </Alert>}
                              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 20}}><p>Ships by: </p><p style={{fontWeight: 'bold', fontSize: 16, marginLeft: 5, marginRight: 5}}>{d.toLocaleDateString("en-US", options)}</p><p> if you order today.</p></div>
                              <div style={{textAlign: 'center', width: '65%', margin: 'auto', padding: 20}}><span>Questions? Speak with a Diamond Expert at </span> <b> <a style={{all: 'revert', color: 'black'}} class="usualLink" href="tel:19176754845">(917)-675-4845 </a></b> <span> or </span> <b> <a href="" style={{all: 'revert'}} class="usualLink">send a message</a> </b></div>
                              </div>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col style={{marginTop: -40}}>
                            <Row style={{marginTop: 20, alignItems: 'center'}}>
                              <img src={time}  style={{height: 60, width: 60}} /> 
                              
                                <p style={{marginLeft: 10, paddingTop: 20}}>
                                <b>1-week Shipping </b>
                                </p>
                              <br />
                              
                            </Row>

                            <Row style={{marginTop: 20}}>
                              <img src={truck} style={{height: 60, width: 60}}/> 
                              
                                <p style={{marginLeft: 10, paddingTop: 20}}>
                                <b>Free Insured Shipping and Returns </b>
                                </p>
                              
                              
                            </Row>


                            <Row style={{marginTop: 20}}>
                              <img src={ring} style={{ height: 60, width: 60}}/> 
                              
                                <p style={{marginLeft: 10, paddingTop: 20}}>
                                <b>Lifetime Warranty and Free Resizing </b>
                                </p>
                              
                            </Row>


                            <Row style={{marginTop: 20}}>
                              <img src={leaf} style={{height: 60, width: 60}}/> 
                              
                                <p style={{marginLeft: 10, paddingTop: 20}}>
                                <b>Ethically Sourced </b>
                                </p>
                                
                            </Row>

                            <Row style={{marginTop: 20}}>
                              <img src={handshake} style={{height: 60, width: 60}}/> 
                              
                                <p style={{marginLeft: 10, paddingTop: 20}}>
                                <b>30-day Free Returns</b>
                                </p>
                                
                            </Row>

                            <Row style={{marginTop: 20}}>
                              <img src={diamond} style={{height: 60, width: 60}}/> 
                              
                                <p style={{marginLeft: 10, paddingTop: 20}}>
                                <b>Top Quality In-house Manufacturing</b>
                                </p>
                            </Row>
                            </Col>
                            <Col>
                                <h2>Description:{"\n"}</h2>
                                <p>{product.description}</p><br></br>
                            </Col>
                          </Row>
                          <Row style={{marginTop: 30}}>
                          <Col>
                          <Container>
                          <Row>
                            <h2 style={{marginRight: 'auto'}}>Comments and Ratings:{"\n"}</h2>
                          </Row>
                                {
                                    comments.length === 0 ? (
                                        <Row><p>No comment added yet.</p></Row>
                                    )
                                    : 
                                    (
                                    comments.map((comment) => {
                                      return (
                                          <Row style={{border: "1px solid rgb(50,50,50)", borderRadius: 20, width: '100%', display: 'flex', justifyContent: 'left', alignItems: 'left', flexDirection: 'column'}}>
                                            <Container>
                                            <Row id="stars" style={{alignItems: 'center',display: 'flex'}}>
                                              <Ratings
                                                rating={comment.rating}
                                                widgetRatedColors="black"
                                                widgetSpacings="2px"
                                                
                                              >
                                                <Ratings.Widget widgetDimension="25px"/>
                                                 <Ratings.Widget widgetDimension="25px"/>
                                                 <Ratings.Widget widgetDimension="25px"/>
                                                 <Ratings.Widget widgetDimension="25px"/>
                                                 <Ratings.Widget widgetDimension="25px"/>
                                                 
                                              </Ratings>
                                              <p style={{fontWeight: 'bold', marginLeft: 4}}>({comment.rating})</p>
                                            </Row>
                                            <Row id="comment">
                                              <p style={{fontSize: 15}}>{comment.comment}</p>
                                            </Row>
                                            </Container>
                                          </Row>
                                      )
                                    })
                                    )
                                }
                                
                          </Container>
                          </Col>
                          <Col style={{display: 'flex', alignItems: 'center', textAlign: 'left'}}>
                          <div style={{position: 'relative', width: 300}}>
                          {
                                user ? <>
                                
                                <Form>
                                <Row>
                                <h2>Add Comment{"\n"}</h2>
                                </Row>
                                <Row>
                                <Form.Group>
                                  <Form.Label>Comment:</Form.Label>
                                  <Form.Control as="textarea" style={{width: 300}} value={comment} onChange={(event) => setComment(event.target.value)}/>
                                </Form.Group>
                                </Row>
                                <Row>
                                <Form.Group>
                                <Form.Control as="select" value={rating} onChange={(event) => {setRating(event.target.value);}}>
                                    <option value="">SELECT A RATING</option>
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4</option>
                                    <option value={5}>5</option>
                                </Form.Control>
                                </Form.Group>
                                </Row>
                                <Row style={{display: 'flex', flexDirection: 'column'}}>
                                  <Button type="submit" value="Submit" onClick={handleSubmit} size={"md"} variant="dark">SUBMIT COMMENT</Button>
                                  {res && <><small style={{ color: 'green' }}>{res}</small></>}
                                </Row>
                                </Form>
                                </> : <p>You must <Link style={{marginLeft: 3}} to="/login" >login</Link> to add comment.</p>
                            }
                          </div>

                          </Col>
                          </Row>
                        </Container>
                        </>
                        );
                    }
                }
}


export default Product;
