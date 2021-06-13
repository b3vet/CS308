import React, {useState, useEffect} from 'react';
import { getUser, removeUserSession } from '../utils/Common';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios';
import { Ripple } from 'react-spinners-css';


function UserInfo(props) {
    const [user, setUser] = useState(props.user)
  const [loading, setLoading] = useState(false)
  const [error,setError] = useState(null)
  const [orders, setOrders] = useState([])
  const [result, setResult] = useState('');

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
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 300}}>
      <Ripple color="#111" />
    </div>
    )
  }
    
    
    return(
    <div style={{textAlign: 'center', padding: 10, width: '80%', paddingLeft: '19%'}}> 
      {orders.map((order) => {
        <li>{order.deliveryAddress}</li>
      })}
  
    </div>
    )
  

}
export default UserInfo;

