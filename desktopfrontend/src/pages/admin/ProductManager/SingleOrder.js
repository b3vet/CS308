import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useLocation } from 'react-router-dom';
function EditProduct(props) {
  let location = useLocation();
  const [loading, setLoading] = useState(false);
  const [ohp, setOhp] = useState(location.state.ohp || null)
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(ohp.status)
 
  const handleSubmit = (e) => {
    setError(null);
    setLoading(true);
    e.preventDefault();
    axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/changeohpstatus/',
        data: {ohid: ohp.ohid, status: status},
    }).then(
        response => {
            props.history.push("/pAdmin/orders")
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
  }

  useEffect(() => {

    }, [props.match.params.ohid])
        
 
  return (
    <div style={{textAlign: 'center', padding: 10, width: '80%', paddingLeft: '19%'}}> 
      <div style={{fontSize: 22, marginBottom: 40, textAlign: 'left'}}><p>You can change the information about the product here</p></div>
      <Container>
          <Row>
              <Col>
                <img src={"http://127.0.0.1:8000"+ohp.product.image} alt = "Product's Image" style={{height: 300, width:300, border: '1px solid'}}></img>
              </Col>
              <Col>
                <Container>
                    <Row>
                        {ohp.product.name}
                    </Row>
                    <Row>
                        <p>Current Status: </p><b>{status}</b>
                    </Row>
                </Container>
              </Col>
          </Row>
      </Container>
      <Form>
      <Form.Row>
        <Col>
            <Form.Label>New Status</Form.Label>
            <Form.Control value={status} as = "select" onChange={(event) => setStatus(event.target.value)}>
              <option value = {"PROCESSING"}>Processing</option>
              <option value = {"IN-TRANSIT"}>In-Transit</option>
              <option value = {"DELIVERED"}>Delivered</option>
              <option value = {"CANCELED"}>Canceled</option>
              <option value = {"RETURNED"}>Returned</option>
            </Form.Control>
        </Col>
      </Form.Row>
      
      <Form.Row>
      <Col>
        {result && <><small style={{ color: 'green' }}>{result+"\n"}</small></>}
        
        {error && <><small style={{ color: 'red' }}>{error!=226 && error.error ? error.error : ""}</small><br /></>}<br />
        <Button type="submit" style = {{marginTop: 40, alignSelf: 'center'}} onClick={handleSubmit} variant="dark">{loading ? "Loading.." : "Save Changes"}</Button><br />
      </Col>
      </Form.Row>
      </Form>
      
  
    </div>
    
  );
}

 
export default EditProduct;