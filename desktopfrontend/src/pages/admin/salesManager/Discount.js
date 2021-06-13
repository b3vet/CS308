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



function Discount(props) {
    const [user, setUser] = useState(props.user)
  const [loading, setLoading] = useState(false)
  const [error,setError] = useState(null)
  const [discounts, setDiscounts] = useState([])
  

  
  useEffect(() => {
    setError(null);
    setLoading(true);    
    axios({
      method: 'get',
      url: 'http://127.0.0.1:8000/api/getdiscounts/',
      
    })
        .then(res => {
          setDiscounts(res.data.discounts)
          setLoading(false);
          console.log(discounts);
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
            <th>Discount ID</th>
            <th>Start Date and Time</th>
            <th>End Date and Time</th>
            <th>Ratio</th>
            <th>Edit</th>
        </tr>
     </thead>
     <tbody>
      {
          discounts.map((discount) => {
              return(
                  <tr>
                    <td>{discount.did}</td>
                    <td>{discount.startDateTime}</td>
                    <td>{discount.endDateTime}</td>
                    <td>{discount.ratio}</td>
                    <td style={{textAlign: 'center'}}><Link to = {`/sAdmin/discount/${discount.did}`}><Button variant = "dark">Edit Discount</Button></Link></td>
                  </tr>
              )
          })
      }
      </tbody>
      </Table>
      <Link to = "discount/adddiscount"><Button variant = "dark">Add Discount</Button></Link>
    </div>
      )
  

}
export default Discount;

