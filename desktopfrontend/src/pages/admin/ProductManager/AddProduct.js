import React, { useState } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
function AddProduct(props) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('')
  const [material, setMaterial] = useState('')
  const [color, setColor] = useState('')
  const [description, setDescription] = useState('')
  const [cost, setCost] = useState('')
  const [stock, setStock] = useState('')
  const [warranty, setWarranty] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState(null);
  const [result, setResult] = useState(null);
  const [image, setImage] = useState(null)
  const [error, setError] = useState(null);
 
  const handleSubmit = (e) => {
    setError(null);
    setLoading(true);
    e.preventDefault();
    //console.log(this.state);
    let form_data = new FormData();
    form_data.append('image', image, image.name);
    form_data.append('name', name);
    form_data.append('material', material);
    form_data.append('productionCost', parseInt(cost));
    form_data.append('stock', parseInt(stock));
    form_data.append('warranty', parseInt(warranty));
    form_data.append('price', parseInt(price));
    form_data.append('caid', parseInt(category));
    form_data.append('color', color);
    form_data.append('description', description);
    let url = 'http://127.0.0.1:8000/api/products/';
    axios.post(url, form_data, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
        .then(res => {
          console.log(res.data);
          setResult(res.data.success)
          setLoading(false);
        })
        .catch(err => {
          if(err.response) {
            setError(err.response.data)
          }
          else {
            setError(err.message)
          }
          
          setLoading(false);
        })
  }
 
  return (
    <div style={{textAlign: 'center', padding: 10, width: '80%', paddingLeft: '19%'}}> 
      <div style={{fontSize: 22, marginBottom: 40, textAlign: 'left'}}><p>Enter the information of the new product here</p></div>
      <Form>
      <Form.Row>
        <Col>
          <Form.Group>
            <Form.Label>Product Name</Form.Label>
            <Form.Control value={name} type="text" onChange={(event) => setName(event.target.value)}/>
          </Form.Group>
        </Col>
        <Col>
            <Form.Label>Material</Form.Label>
            <Form.Control value={material} as = "select" onChange={(event) => setColor(event.target.value)}>
              <option value = {"14K GOLD"}>14K Gold</option>
              <option value = {"18K GOLD"}>18K Gold</option>
              <option value = {"10K GOLD"}>10K Gold</option>
            </Form.Control>
        </Col>
      </Form.Row>
      <Form.Row>
        <Col>
          <Form.Group>
            <Form.Label>Color</Form.Label>
            <Form.Control value={color} as = "select" onChange={(event) => setColor(event.target.value)}>
              <option value = {"GOLD"}>Gold</option>
              <option value = {"SILVER"}>Silver</option>
              <option value = {"ROSE"}>Rose</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Stock</Form.Label>
            <Form.Control value={stock} type="text" onChange={(event) => setStock(event.target.value)}/>
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Row>
        <Col>
          <Form.Group>
            <Form.Label>Price</Form.Label>
            <Form.Control value={price} type="text" onChange={(event) => setPrice(event.target.value)}/>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Production Cost</Form.Label>
            <Form.Control value={cost} type="text" onChange={(event) => setCost(event.target.value)}/>
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Row>
        <Col>
          <Form.Group>
            <Form.Label>Warranty</Form.Label>
            <Form.Control value={warranty} type="text" onChange={(event) => setWarranty(event.target.value)}/>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Control value={category} as = "select" onChange={(event) => setCategory(event.target.value)}>
              <option value = {4}>Wedding Ring</option>
              <option value = {5}>Engagement Ring</option>
              <option value = {6}>Necklace</option>
              <option value = {7}>Bracelet</option>
              <option value = {8}>Earring</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Row>
        <Col style={{width: '100%'}}>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control as = "textarea" value={description} type="text" onChange={(event) => setDescription(event.target.value)}/>
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Row>
        <Col style={{width: '100%'}}>
          <Form.Group>
            <Form.Label>Image</Form.Label>
            <Form.File onChange={(e) => {setImage(e.target.files[0]);}}/>
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Row>
      <Col>
        <Button type="submit" style = {{marginTop: 40, alignSelf: 'center'}} onClick={handleSubmit} variant="dark">Save Changes</Button><br />
      </Col>
      </Form.Row>
      </Form>
      {result && <><small style={{ color: 'green' }}>{result+"\n"}</small></>}
      {error && <><small style={{ color: 'red' }}>{error==226 ? "This product name already exists!\n" : ""}</small></>}
      {error && <><small style={{ color: 'red' }}>{error!=226 && error.error ? error.error : ""}</small><br /></>}<br />
  
    </div>
    
  );
}
const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);
 
  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}
 
export default AddProduct;