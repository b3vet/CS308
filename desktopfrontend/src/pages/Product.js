import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUser } from '../utils/Common';
import '../css/Products.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { Link } from 'react-router-dom';
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
    const [user, setUser] = useState(localStorage.getItem('user') || null);
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
                setError(error.response.status)
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

                console.log(comments)
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
                return(<div>Loading...</div>)
            }
            else {
                if(product == null) {
                    return(<div>A PROBLEM OCCURED</div>)
                }
                else {
                    return (
                        <>
                        <Container>
                        <Row>
                        <Col>
                        <img src={"http://127.0.0.1:8000"+product.image} alt = "Product's Image" width={500} height ={500}></img>
                        </Col>
                        <Col>
                        <div class = "Product-info">
                        <h1>{product.name}</h1><br></br>
                        <b><p>{product.price}$</p></b><br></br>
                        <p><b>Color: </b>{product.color}</p><br></br>
                        <p><b>Material: </b>{product.material}</p><br></br>
                        <p><b>Stock: </b>{product.stock}</p><br></br>
                        <p><b>Warranty: </b>{product.warranty} year(s)</p><br></br>
                        <Button variant="dark">Add to Cart</Button>
                        </div>
                        </Col>
                        </Row>
                        <Row>
                        <Col>
                            <h2>Description:{"\n"}</h2>
                            <p>{product.description}</p><br></br>
                            <h2>Comments:{"\n"}</h2>
                            {
                                comments.length === 0 ? (
                                    <p>No comment added yet.</p>
                                )
                                : 
                                (
                                comments.map((comment) => {
                                  return (
                                      <p>{comment.comment} RATING: {comment.rating}</p>
                                  )
                                })
                                )
                            }
                            {
                            user ? <>
                            <h2>Add Comment{"\n"}</h2>
                            
                            <label>
                                Comment:<br></br>
                                <textarea value={comment} onChange={(event) => {setComment(event.target.value)}} />
                            </label><br></br>
                            <select value={rating} onChange={(event) => {setRating(event.target.value);}}>
                                <option value="">SELECT A RATING</option>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                            </select><br></br>
                            <Button type="submit" value="Submit" onClick={handleSubmit} variant="dark">SUBMIT COMMENT</Button><br />
                            {res && <><small style={{ color: 'green' }}>{res}</small><br /></>}<br />
                            </> : <p>You must <Link to="/login" >login</Link> to add comment.</p>
                            }
                        </Col>
                        </Row>
                        </Container>
                        </>
                        );
                    }
                }
}


export default Product;
