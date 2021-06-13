import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
function EditProduct(props) {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null)
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
  const [res, setRes] = useState('');
 
  const handleSubmit = (e) => {
    setError(null);
    setLoading(true);
    e.preventDefault();
    //console.log(this.state);
    let form_data = new FormData();
    image && form_data.append('image', image, image.name);
    name && form_data.append('name', name);
    material && form_data.append('material', material);
    cost && form_data.append('productionCost', parseInt(cost));
    stock && form_data.append('stock', parseInt(stock));
    warranty && form_data.append('warranty', parseInt(warranty));
    price && form_data.append('price', parseInt(price));
    category && form_data.append('caid', parseInt(category));
    color && form_data.append('color', color);
    description && form_data.append('description', description);
    form_data.append('pid', props.match.params.pid);
    let url = 'http://127.0.0.1:8000/api/products/';
    axios.put(url, form_data, {
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
            setName(response.data.product[0].name)
            setMaterial(response.data.product[0].material)
            setCost(response.data.product[0].productionCost)
            setPrice(response.data.product[0].price)
            setColor(response.data.product[0].color)
            setDescription(response.data.product[0].description)
            setStock(response.data.product[0].stock)
            setWarranty(response.data.product[0].warranty)
            setCategory(response.data.product[0].caid)
            setLoading(false);
            
            
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
            
            
        }, [props.match.params.pid])
        
 
  return (
    <div style={{textAlign: 'center', padding: 10, width: '80%', paddingLeft: '19%'}}> 
      <div style={{fontSize: 22, marginBottom: 40, textAlign: 'left'}}><p>You can change the information about the product here</p></div>
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
              <option value = {"10K Gold"}>10K Gold</option>
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
        {result && <><small style={{ color: 'green' }}>{result+"\n"}</small></>}
        {error && <><small style={{ color: 'red' }}>{error==226 ? "This product name already exists!\n" : ""}</small></>}
        {error && <><small style={{ color: 'red' }}>{error!=226 && error.error ? error.error : ""}</small><br /></>}<br />
        <Button type="submit" style = {{marginTop: 40, alignSelf: 'center'}} onClick={handleSubmit} variant="dark">{loading ? "Loading.." : "Save Changes"}</Button><br />
      </Col>
      </Form.Row>
      </Form>
      
  
    </div>
    
  );
}

 
export default EditProduct;