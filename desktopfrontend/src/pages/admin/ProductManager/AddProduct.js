import React, { useState } from 'react';
import axios from 'axios';

function AddProduct(props) {
  const [loading, setLoading] = useState(false);
  const name = useFormInput('');
  const material = useFormInput('');
  const color = useFormInput('');
  const description = useFormInput('');
  const productionCost = useFormInput('');
  const stock = useFormInput('');
  const warranty = useFormInput('');
  const price = useFormInput('');
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
    form_data.append('name', name.value);
    form_data.append('material', material.value);
    form_data.append('productionCost', parseInt(productionCost.value));
    form_data.append('stock', parseInt(stock.value));
    form_data.append('warranty', parseInt(warranty.value));
    form_data.append('price', parseInt(price.value));
    form_data.append('caid', parseInt(category));
    form_data.append('color', color.value);
    form_data.append('description', description.value);
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
    <div>
      Register<br /><br />
      <div>
        Product Name<br />
        <input type="text" {...name}/>
      </div>
      <div style={{ marginTop: 10 }}>
        Material<br />
        <input type="text" {...material} />
      </div>
      <div style={{ marginTop: 10 }}>
        Color<br />
        <input type="text" {...color}/>
      </div>
      <div style={{ marginTop: 10 }}>
        Stock<br />
        <input type="number" {...stock} />
      </div>
      <div style={{ marginTop: 10 }}>
        Warranty<br />
        <input type="numbe" {...warranty} />
      </div>
      <div style={{ marginTop: 10 }}>
        Production Cost<br />
        <input type="number" {...productionCost} />
      </div>
      <div style={{ marginTop: 10 }}>
        Price<br />
        <input type="number" {...price} />
      </div>
      <div style={{ marginTop: 10 }}>
        Description<br />
        <input type="text" {...description}/>
      </div>
      <div style={{ marginTop: 10 }}>
        Category<br />
        <select value={category} onChange={(event) => {setCategory(event.target.value);}}>
            <option value="">SELECT A CATEGORY</option>
            <option value={4}>Wedding Rings</option>
            <option value={5}>Engagement Rings</option>
            <option value={6}>Necklaces</option>
            <option value={7}>Bracelets</option>
            <option value={8}>Earrings</option>
          </select>
      </div>
      <div style={{ marginTop: 10 }}>
        Image<br />
        <input type="file" onChange={(e) => {setImage(e.target.files[0]);}}/>
      </div>
      {result && <><small style={{ color: 'green' }}>{result+"\n"}</small></>}
      {error && <><small style={{ color: 'red' }}>{error==226 ? "This product name already exists!\n" : ""}</small></>}
      {error && <><small style={{ color: 'red' }}>{error!=226 && error.error ? error.error : ""}</small><br /></>}<br />
      <input type="button" value={loading ? 'Loading...' : 'Add Product'} onClick={handleSubmit} disabled={loading} /><br />
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