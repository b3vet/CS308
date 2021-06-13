import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import DateTimePicker from 'react-datetime-picker'
import { Ripple } from 'react-spinners-css';

import { Link } from 'react-router-dom';
function AddDiscount(props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ratio, setRatio] = useState(null);
    const [allProducts, setAllProducts] = useState([])
    const [selectedProducts, setSelectedProducts] = useState([])
    const [discount, setDiscount] = useState(null)
    const [result, setResult] = useState('')
    const [start, setStart] = useState(new Date())
    const [end, setEnd] = useState(new Date())
    const addOrRemoveProduct = (e, pid) => {
        if (selectedProducts.includes(pid)) {
            setSelectedProducts(selectedProducts.filter(item => item !== pid))
        }
        else {
            setSelectedProducts([ ...selectedProducts, pid ])
        }
        console.log(selectedProducts)
    }
    const submit = (e) => {
        setLoading(true);
        console.log(selectedProducts)
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/adddiscount/',
            data: {
                startDateTime: start, 
                products: selectedProducts,
                endDateTime: end,
                ratio: ratio
            },
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
            method: 'get',
            url: 'http://127.0.0.1:8000/api/products/',
            
        }).then(
            response => {
                setAllProducts(response.data.products)
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
                
                
            }, [])
            
            if(loading) {
                return(
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 150}}>
                  <Ripple color="#111" />
                </div>
                )
              }
    return (
        <div style={{textAlign: 'center', padding: 10, width: '100%'}}> 
            <div style={{fontSize: 22, marginBottom: 40, textAlign: 'left'}}><p style={{fontWeight: 'bold'}}>Select products to apply to your new discount.</p></div>
            <Form>
                <Form.Group>
                {
                    allProducts.map((product) => {
                        return(
                            <><Form.Check type="checkbox" onChange={(e) => addOrRemoveProduct(e, product.pid)} label={product.name + "   " + product.price + "$"} /><br /></>
                        )
                    })
                }
                </Form.Group>
                <InputGroup>
                    <Form.Label>Ratio</Form.Label>
                    <Form.Control type="text" onChange={(event) => setRatio(event.target.value)}/>
                    <InputGroup.Append>
                        <InputGroup.Text>%</InputGroup.Text>
                    </InputGroup.Append>
                </InputGroup>

                <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <DateTimePicker value={start} onChange={setStart}/>
                </Form.Group>
                
                
                <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <DateTimePicker value={end} onChange={setEnd}/>
                </Form.Group>
                
                
                <Button onClick = {(e) => submit(e)} variant = "dark">Save Discount</Button>
                
            </Form>
            {result && <><small style={{ color: 'green' }}>{result}</small><br /></>}<br />
            {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
        </div>
    )
                
                
}
                 
export default AddDiscount;
 