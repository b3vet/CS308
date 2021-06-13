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




function Comments(props) {
    const [user, setUser] = useState(props.user)
  const [loading, setLoading] = useState(false)
  const [error,setError] = useState(null)
  const [comments, setComments] = useState([])
  const [result, setResult] = useState('')
  
    const submit = (comment, stat) => {
        let dataa = {}
        if(stat == "app") {
            dataa = {
                coid: comment.coid,
                status: "Approved"
            }
        }
        else {
            dataa = {
                coid: comment.coid,
                status: "Declined"
            }
        }
        
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/changecommentstatus/',
            data: dataa
          })
              .then(res => {
                setResult(res.data.success)
                setComments(res.data.comments)
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
      url: 'http://127.0.0.1:8000/api/getpendingcomments/',
      
    })
        .then(res => {
          setComments(res.data.comments)
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
    if(comments.length == 0) {
        return(
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 150}}>
           <h1>There is no undecided comment at the moment.</h1>
          </div>
          )
       }
    
    
    return(
    <div style={{textAlign: 'center', padding: 10, width: '100%'}}> 
      <div style={{fontSize: 22, marginBottom: 40, textAlign: 'left'}}><p style={{fontWeight: 'bold'}}>List of every discount active at the moment.</p></div>
      {result && <><small style={{color: 'green'}}>{result}</small><br /></>}
      <Table striped bordered hover>
      <thead>
        <tr>
            <th>Comment ID</th>
            <th>Username</th>
            <th>Product Name</th>
            <th>Comment</th>
            <th>Rating</th>
            <th>Date</th>
            <th>Approve</th>
            <th>Decline</th>
        </tr>
     </thead>
     <tbody>
      {
          comments.map((comment) => {
                let d = new Date(comment.date)
              return(
                
                  <tr >
                    <td>{comment.coid}</td>
                    <td>{comment.username}</td>
                    <td>{comment.product.name}</td>
                    <td>{comment.comment}</td>
                    <td>{comment.rating}</td>
                    <td>{d.toLocaleDateString("en-US")}</td>
                    <td><Button onClick={() => submit(comment, "app")} variant = "dark">Approve</Button></td>
                    <td><Button onClick={() => submit(comment, "dec")} variant = "dark">Decline</Button></td>
                  </tr>
                
              )
          })
      }
      </tbody>
      </Table>
      
    </div>
      )
  

}
export default Comments;

