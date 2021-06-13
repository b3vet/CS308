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




function Products(props) {
    const [user, setUser] = useState(props.user)
  const [loading, setLoading] = useState(false)
  const [error,setError] = useState(null)
  const [products, setProducts] = useState([])
  const [res, setRes] = useState('')
  
    const remove = (p) => {
        setError(null);
        setLoading(true);    
        axios({
        method: 'delete',
        url: 'http://127.0.0.1:8000/api/products/',
        data: {
            pid: p.pid
        }
        })
        .then(res => {
          setRes(res.data.success)
          setProducts(res.data.products)
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
      url: 'http://127.0.0.1:8000/api/products/',
      
    })
        .then(res => {
          setProducts(res.data.products)
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
      <div style={{fontSize: 22, marginBottom: 40, textAlign: 'left'}}><p style={{fontWeight: 'bold'}}>List of products</p></div>
      <Button href={`/pAdmin/addproduct`} variant = "dark" style={{marginBottom: 30}}>Add Product</Button>
      {res && <><br /><small style={{color: 'green', marginBottom: 30}} >{res}</small></>}
      <Table striped bordered hover>
      <thead>
        <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Material</th>
            <th>Color</th>
            <th>Cost</th>
            <th>Price</th>
            <th>Discount Price</th>
            <th>Category</th>
            <th>Edit</th>
            <th>Remove</th>
        </tr>
     </thead>
     <tbody>
      {
          products.map((p) => {
              return(
                
                  <tr >
                    <td>{p.pid}</td>
                    <td>{p.name}</td>
                    <td>{p.material}</td>
                    <td>{p.color}</td>
                    <td>{p.productionCost}</td>
                    <td>{p.price}</td>
                    <td>{p.discountPrice}</td>
                    <td>{p.caid == 4 ? "Wedding Ring" : (p.caid == 5 ? "Engagement Ring" : (p.caid == 6 ? "Necklace" : (p.caid == 7 ? "Bracelet" : (p.caid == 8 ? "Earring" : "Error"))) )}</td>
                    <td><Button href={`/pAdmin/editproduct/${p.pid}`} variant = "dark">Edit</Button></td>
                    <td><Button onClick = {() => remove(p)} variant = "dark">Remove</Button></td>
                  </tr>
                
              )
          })
      }
      </tbody>
      </Table>
      
    </div>
      )
  

}
export default Products;

