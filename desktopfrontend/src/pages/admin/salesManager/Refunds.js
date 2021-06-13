import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Ripple } from 'react-spinners-css';



function Refunds(props) {
    const [user, setUser] = useState(props.user)
  const [loading, setLoading] = useState(false)
  const [error,setError] = useState(null)
  const [refunds, setRefunds] = useState([])
  
    const approve = () => {

    }
    const decline = () => {
        
    }
    const getData = () => {

    }
  
  useEffect(() => {
    setError(null);
    setLoading(true);    
    axios({
      method: 'get',
      url: 'http://127.0.0.1:8000/api/allrefunds/',
      
    })
        .then(res => {
          setRefunds(res.data.refunds)
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
      <div style={{fontSize: 22, marginBottom: 40, textAlign: 'left'}}><p style={{fontWeight: 'bold'}}>List of every discount active at the moment.</p></div>
      <Table striped bordered hover>
      <thead>
        <tr>
            <th>Request ID</th>
            <th>Reason</th>
            <th>Product Name</th>
            <th>Approve</th>
            <th>Decline</th>
        </tr>
     </thead>
     <tbody>
      {
          refunds.map((refund) => {
              return(
                  <tr>
                    <td>{refund.rid}</td>
                    <td>{refund.reason}</td>
                    <td>{refund.product.name}</td>
                    <td style={{textAlign: 'center'}}><Button onClick={approve} variant = "dark">Approve</Button></td>
                    <td style={{textAlign: 'center'}}><Button onClick={decline} variant = "dark">Decline</Button></td>
                  </tr>
              )
          })
      }
      </tbody>
      </Table>
      
    </div>
      )
  

}
export default Refunds;

