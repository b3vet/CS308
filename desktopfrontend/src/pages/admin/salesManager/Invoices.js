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




function Invoices(props) {
  const [user, setUser] = useState(props.user)
  const [loading, setLoading] = useState(false)
  const [error,setError] = useState(null)
  const [invoices, setInvoices] = useState([])
  
  
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
      url: 'http://127.0.0.1:8000/api/allinvoices/',
      
    })
        .then(res => {
          setInvoices(res.data.invoices)
          setLoading(false);
          console.log(invoices);
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
            <th>Invoice ID</th>
            <th>Full Name</th>
            <th>Paid Amount</th>
            <th>Address</th>
            <th>Date</th>
            <th>Active</th>
            <th>PDF</th>
        </tr>
     </thead>
     <tbody>
      {
          invoices.map((invoice) => {
              return(
                
                  <tr >
                    <td>{invoice.iid}</td>
                    <td>{invoice.fullName}</td>
                    <td>{invoice.paidAmount}$</td>
                    <td>{invoice.address}</td>
                    <td>{invoice.date}</td>
                    <td>{invoice.isActive ? "Active" : "Inactive"}</td>
                    <td><Button onClick = {() => getPDF(invoice.oid)} variant = "dark">See PDF</Button></td>
                  </tr>
                
              )
          })
      }
      </tbody>
      </Table>
      
    </div>
      )
  

}
export default Invoices;

/* 
<Link to={`/sAdmin/invoices/${invoice.iid}`}><Button variant = "dark">See PDF</Button></Link>
*/