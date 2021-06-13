import { Document } from 'react-pdf/dist/esm/entry.webpack';
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




function SingleInvoice(props) {
    const [user, setUser] = useState(props.user)
    const [loading, setLoading] = useState(false)
    const [error,setError] = useState(null)
    const [iid, setIid] = useState(null)
    const [pdf, setPdf] = useState(null)
  

  
  useEffect(() => {
    setError(null);
    setLoading(true);    
    axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/invoice/',
      data: {iid : props.match.params.iid}
      
    })
        .then(res => {
            console.log(res)
            setPdf("http://127.0.0.1:8000"+res.data.pdf)
            setLoading(false)
        }
        )
        
        .catch(err => {
          if(err.response) {
            setError(err.response.data)
            console.log(err.response.data)
          }
          else {
            setError(err.message)
            console.log(err.message)
          }
          setIid(props.match.params.iid)
          setLoading(false);
        })
    }, [props.match.params.iid])
    
  

    if(loading) {
      return(
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 150}}>
        <Ripple color="#111" />
      </div>
      )
    }
    
    
    return(
    <div style={{textAlign: 'center', padding: 10, width: '100%'}}> 
      <div style={{fontSize: 22, marginBottom: 40, textAlign: 'left'}}><p style={{fontWeight: 'bold'}}>You can download or just view the PDF of the invoice.</p></div>
      <Document file={{url: pdf}} />
    </div>
      )
  

}
export default SingleInvoice;

