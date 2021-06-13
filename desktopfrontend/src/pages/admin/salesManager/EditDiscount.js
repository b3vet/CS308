import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Form'
import Form from 'react-bootstrap/Form'

import { Link } from 'react-router-dom';
import { Ripple } from 'react-spinners-css';
function EditDiscount(props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [did, setDid] = useState(null);
    const [allProducts, setAllProducts] = useState([])
    const [selectedProducts, setSelectedProducts] = useState([])
    const [discount, setDiscount] = useState(null)
    const [result, setResult] = useState('')
    const addOrRemoveProduct = (e, pid) => {
        if (selectedProducts.includes(pid)) {
            setSelectedProducts(selectedProducts.filter(item => item !== pid))
        }
        else {
            setSelectedProducts([ ...selectedProducts, pid ])
        }
    }
    const submit = (e) => {
        setLoading(true);
        
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/addproductstodiscount/',
            data: {did: props.match.params.did, products: selectedProducts},
        }).then(
            response => {
                setResult(response.data.success)
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
    }
    useEffect(() => {
        
        setLoading(true);
        
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/getadiscount/',
            data: {did: props.match.params.did},
        }).then(
            response => {
                console.log(response.data)
                setDiscount(response.data.discount)
                setAllProducts(response.data.allproducts)
                setSelectedProducts(response.data.selectedproducts)
                setLoading(false);
            }
            ).catch(
                error => {
                    setLoading(false);
                    if (error.response) {
                        console.log(error.response.status);
                        setError(error.response.data.error);
                    } else {
                        console.log('Error', error.message);
                    }
                }
                )
                setDid(props.match.params.did)
                
            }, [props.match.params.did])
            
            if(loading) {
                return(
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 150}}>
                  <Ripple color="#111" />
                </div>
                )
              }
    return (
        <div style={{textAlign: 'center', padding: 10, width: '100%'}}> 
            <div style={{fontSize: 22, marginBottom: 40, textAlign: 'left'}}><p style={{fontWeight: 'bold'}}>You can add new products to apply the discount or remove some products from the range of this discount.</p></div>
            <Form>
                {
                    allProducts.map((product) => {
                        return(
                            <><Form.Check type="checkbox" defaultChecked={selectedProducts.includes(product.pid)} onChange={(e) => addOrRemoveProduct(e, product.pid)} label={product.name + "   " + product.price + "$"} /><br /></>
                        )
                    })
                }
                <Button onClick = {(e) => submit(e)} variant = "dark">Save Discount</Button>
                {result && <><small style={{ color: 'green' }}>{result}</small><br /></>}<br />
                {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
            </Form>
        </div>
    )
                
                
}
                        
                        
                        
                        
export default EditDiscount;
