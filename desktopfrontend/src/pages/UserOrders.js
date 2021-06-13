import React, {useState, useEffect} from 'react';
import { getUser, removeUserSession } from '../utils/Common';
import { Ripple } from 'react-spinners-css';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import axios from 'axios';
import Collapsible from 'react-collapsible';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

function UserInfo(props) {
    const [user, setUser] = useState(props.user)
  const [loading, setLoading] = useState(false)
  const [error,setError] = useState(null)
  const [orders, setOrders] = useState([])
  const [result, setResult] = useState('');
  const [reason, setReason] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [retPid, setRetPid] = useState(-1)
  const [retOid, setRetOid] = useState(-1)

  const getPDF = (oooid) => {
    setError(null);
    setLoading(true);    
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/api/invoice/',
      data: {oid: oooid}
    })
        .then(res => {
          window.open("http://127.0.0.1:8000"+res.data.pdf, '_blank');
          setLoading(false);
        })
        .catch(err => {
          if(err.response) {
            setError(err.response.data)
            console.log(err.response.data)
          }
          else {
            setError(err.message)
            console.log(err.message)
          }
          
          setLoading(false);
        })
  }


  const handleOpenModal = (pid, oid) => {
    setShowModal(true)
    setRetPid(pid)
    setRetOid(oid)
  }
  const handleCloseModal = () => {
    setShowModal(false)
  }

  const returnOrder = () => {
    setLoading(true)
    axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/refundrequest/',
        data: {
            pid: retPid,
            oid: retOid,
            reason: reason,
        }
    })
      .then(
        response => {
          console.log(response.data)
          setOrders(response.data.orders)
          setLoading(false)
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
            setLoading(false)
          }
        )
  }

  const cancelOrder = (pid, oid) => {
    setLoading(true)
    axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/cancelproductinorder/',
        data: {
            uid: user.uid,
            pid: pid,
            oid: oid
        }
    })
      .then(
        response => {
          console.log(response.data)
          setOrders(response.data.orders)
          setLoading(false)
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
            setLoading(false)
          }
        )
  }

  useEffect(() => {
    setResult(null);
    setLoading(true);
    
    axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/usersorders/',
        data: {uid: user.uid},
    }).then(
        response => {
            setOrders(response.data);
            console.log(orders)
            setLoading(false);

        }).catch(
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
  }, [])

    

  if(loading) {
    return(
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 150}}>
      <div style={{paddingBottom: 300}}><Ripple  color="#111" /></div>
      
    </div>
    )
  }
    
  if(orders.length == 0) {
    return(
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 150}}>
       <h1>Your did not place any orders yet.</h1>
      </div>
      )
   }
    return(
    <div style={{textAlign: 'center', width: '100%'}}> 
    <Modal 
           isOpen={showModal}
           contentLabel="Why do you want to return this product?"
        >
          <Form style={{marginTop: 60}}>
              <Form.Group>
                  <Form.Label>What is the reason for returning this product?</Form.Label>
                  <Form.Control as = "textarea" onChange={(e) => {setReason(e.target.value)}}></Form.Control>
              </Form.Group>
          </Form>
          <Button variant="dark" onClick={() => {handleCloseModal();returnOrder();}}>Submit</Button>
    </Modal>
    <Container>
      {orders.map((order, index) => {
        const SingleOrderRow = () => {
        var totalPrice = 0;
        var productCount = 0
        for (const ohp of order.connection) {
            totalPrice += ohp.orderedPrice
            productCount+=1
        }
        let d = new Date(order.date)
        return (
            <Row style={{height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Container>
                <Row>
                    <Col xs={2}>
                        <Container>
                            <Row>
                            {
                                order.connection.map((ohp) => {
                                    return(
                                        <Col xs = {1}>
                                        <img src={"http://127.0.0.1:8000"+ohp.product.image} alt = "Product's Image" style={{height: 50, width:50, borderRadius: '50%', border: '1px solid'}}></img>
                                        </Col>
                                    )
                                })
                            }
                            </Row>
                        </Container>
                    </Col>
                    <Col xs={2}>
                        <div>
                            
                            <p>Order ID: {order.oid}</p>
                            <p>Date: {d.toLocaleDateString("en-US")}</p>
                            <p><b>{totalPrice}$</b></p>
                            
                        </div>
                    </Col>
                    <Col xs={6} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{order.delivery}</Col>
                    <Col xs={2} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Button size ="sm" onClick = {() => getPDF(order.oid)} variant = "dark">See Invoice PDF</Button>
                    </Col>
                    
                </Row>

                </Container>

            </Row>
        )
        } 


          return(
            <Container style={{border: '2px solid rgb(50,50,50, 0.4)', marginBottom: 20, paddingTop: 10}}>
            <Collapsible trigger={<SingleOrderRow />}>
                
                <ul>
                    {
                        order.connection.map((ohp) => {
                            return (
                                <Container style={{marginBottom: 30, borderTop: '2px solid rgb(50,50,50, 0.4)', paddingTop: 20, marginLeft: -25}}>
                                    <Row style={{height: 150}}>
                                        <Col xs={5}>
                                        <Container>
                                            <Row style={{textAlign: 'left'}}>
                                                <Col xs={5}>
                                                    <img src={"http://127.0.0.1:8000"+ohp.product.image} alt = "Product's Image" style={{height: 150, width:150, borderRadius: '1%', border: '1px solid'}}></img>
                                                </Col>
                                                <Col xs={5}>
                                                <Link to={`/product/${ohp.product.pid}`} style={{all: 'revert',fontSize: 16, textDecoration: 'none', color: 'black'}}>{ohp.product.name}</Link>
                                                    <p style ={{fontWeight: 'bold', fontSize: 14}}>{ohp.orderedPrice}$</p>
                                                </Col>
                                            </Row>
                                        </Container>
                                        </Col>
                                        {
                                            ohp.status == "DELIVERED" ? 
                                            <>
                                            <Col xs={3} style={{alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                                <div><p>Status:</p><p style={{color: 'rgba(51,255,51)'}}> {ohp.status}</p></div>
        
                                            </Col>
                                            <Col xs={3} style={{alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                                <Button variant="dark" size="sm" onClick={() => handleOpenModal(ohp.product.pid, order.oid)}>Return This Product</Button>
                                            </Col>
                                            </>
                                            :
                                            (
                                                ohp.status == "CANCELED" || ohp.status == "RETURNED" ? 
                                                <Col xs={3} style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                                    <div><p>Status:</p><p style={{color: 'rgba(255,0,0)'}}> {ohp.status}</p></div>
                                                </Col>
                                                :
                                                (
                                                    ohp.status == "IN-TRANSIT" ?
                                                    <>
                                                    <Col xs={3} style={{alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                                        
                                                        <div><p>Status:</p><p style={{color: 'rgba(255,128,0)'}}> {ohp.status}</p></div>
                                                    </Col>
                                                    <Col xs={3} style={{alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                                        <Button variant="dark" size="sm">Track Delivery</Button>
                                                    </Col>
                                                    </>
                                                    :
                                                    (
                                                        ohp.status == "PROCESSING" ?
                                                        <>
                                                        <Col xs={3} style={{alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                                            
                                                            <div><p>Status:</p><p style={{color: 'rgba(255,128,0)'}}> {ohp.status}</p></div>
                                                            
                                                        </Col> 
                                                        <Col xs={3} style={{alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                                            <Button variant="dark" size="sm" onClick={() => cancelOrder(ohp.product.pid, order.oid)}>Cancel This Product</Button>
                                                        </Col>
                                                        </>
                                                        :
                                                        (
                                                            <Col xs={3} style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                                                
                                                                <div><p>Status:</p><p style={{color: 'rgba(255,128,0)'}}> {ohp.status}</p></div>
                                                            </Col>
                                                        )
                                                    )
                                                )
                                            )

                                        }
                                        
                                        
                                    </Row>
                                </Container>
                            )
                        })
                    }
                </ul>

            </Collapsible>
            </Container>
          )
      })}
      </Container>
    </div>
    )
    
  

}
export default UserInfo;

