import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { Ripple } from 'react-spinners-css';
import Collapsible from 'react-collapsible';




function Orders(props) {
    const [user, setUser] = useState(props.user)
  const [loading, setLoading] = useState(false)
  const [error,setError] = useState(null)
  const [orders, setOrders] = useState([])
  
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

  
  useEffect(() => {
    setError(null);
    setLoading(true);    
    axios({
      method: 'get',
      url: 'http://127.0.0.1:8000/api/allorders/',
      
    })
        .then(res => {
          setOrders(res.data)
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
    }, [])
    
  

    if(loading) {
      return(
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 150}}>
        <Ripple color="#111" />
      </div>
      )
    }
    
    
    return(
    <div style={{textAlign: 'center', padding: 10, width: '100%'}}> 
      <div style={{fontSize: 22, marginBottom: 40,marginLeft: 20, textAlign: 'left'}}><p style={{fontWeight: 'bold'}}>List of every order placed</p></div>
      <Container style={{marginBottom: 40}}>
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
                    <Row style={{height: 150,display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
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
                                    <p>Order ID: {order.oid}</p><br />
                                    <p>Date: {d.toLocaleDateString("en-US")}</p>
                                </div>
                            </Col>
                            <Col xs={6}>{order.deliveryAddress}</Col>
                            <Col xs={2}>
                                <div>
                                    <p>{totalPrice}$</p><br />
                                    <Button size ="sm" onClick = {() => getPDF(order.oid)} variant = "dark">See Invoice PDF</Button>
                                </div>
                            </Col>
                            
                        </Row>

                        </Container>

                    </Row>
                )
            } 


            return(
                <Container style={{border: '2px solid rgb(50,50,50, 0.4)'}}>
                <Collapsible trigger={<SingleOrderRow />}>
                    
                    <Table>
                    <thead>
                        <tr>
                            <th>OHID</th>
                            <th>Product Name</th>
                            <th>Ordered Price</th>
                            <th>Status</th>
                            <th>Edit Status</th>     
                        </tr>
                    </thead>
                    <tbody>
                        {
                            order.connection.map((ohp) => {
                                return (
                                    <tr>
                                    <td>{ohp.ohid}</td>
                                    <td>{ohp.product.name}</td>
                                    <td>{ohp.orderedPrice}</td>
                                    <td>{ohp.status}</td>
                                    <td style={{textAlign: 'center'}}><Button variant = "dark" onClick={() => {props.history.push(`/pAdmin/editorder/${ohp.ohid}`, {ohp: ohp})}}>Edit Status</Button></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                    </Table>

                </Collapsible>
                </Container>
          )
      })}
      </Container>
      
    </div>
      )
  

}
export default Orders;

