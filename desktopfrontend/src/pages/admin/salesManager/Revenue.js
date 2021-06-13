import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios';
import Chart from "react-apexcharts";
import { Ripple } from 'react-spinners-css';



function Revenue(props) {
    const [user, setUser] = useState(props.user)
  const [loading, setLoading] = useState(false)
  const [error,setError] = useState(null)
  const [start, setStart] = useState(null)
  const [end, setEnd] = useState(null)
  const [gain, setGain] = useState(0);
  const [loss, setLoss] = useState(0);
  const [chartSeen, setChartSeen] = useState(false);
  const [chartOptions, setChartOptions] = useState(null);
  const [chartSeries, setChartSeries] = useState([])

  
  const handleSubmit = (e) => {
    e.preventDefault();
    

        setError(null);
        setLoading(true);
        
    console.log('sending request')
    
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/api/wowimrich/',
      data: {
          startDateTime: start,
          endDateTime: end,
      }
    })
        .then(res => {
          console.log(res.data);
          
          setGain(res.data.gain);
          setLoss(res.data.loss);
          console.log(res.data);
          setChartOptions({
            chart: {
              id: "basic-bar"
            },
            xaxis: {
              categories: ["Incomes","Expenses", "Utility Expenses"]
            }
          });
          setChartSeries(
          [
            {
              name: "$",
              data: [res.data.gain, res.data.loss, 2000]
            }
          ])
          setChartSeen(true)
          
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
    
  

    if(loading) {
      return(
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 150}}>
        <Ripple color="#111" />
      </div>
      )
    }
    
    
    return(
    <div style={{textAlign: 'center', padding: 10, width: '100%'}}> 
      <div style={{fontSize: 22, marginBottom: 40, textAlign: 'left'}}><p style={{fontWeight: 'bold'}}>Please pick the date range to calculate the revenue of the company.</p></div>
      <Form>
      <Form.Row>
        <Col>
          <Form.Group>
            <Form.Label>Start Date</Form.Label>
            <Form.Control value={start} type="date" onChange={(event) => setStart(event.target.value)}/>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>End Date</Form.Label>
            <Form.Control type="date" value={end} onChange={(event) => setEnd(event.target.value)}/>
          </Form.Group>
        </Col>
      </Form.Row>
      
      <Form.Row>
      <Col>
        <Button type="submit" style = {{marginTop: 40, alignSelf: 'center', marginBottom: 40}} onClick={handleSubmit} variant="dark">Calculate Expenses</Button><br />
      </Col>
      </Form.Row>
      </Form>
      
      {chartSeen ? 
        <Container>
            <Row>
                <Col xs = {6}>
                <Chart
                    options={chartOptions}
                    series={chartSeries}
                    type="bar"
                    width={500}
                />
                </Col>
                <Col xs ={6}>
                    <p style ={{fontWeight: 'bold'}}>Total Income: {gain}$</p><br />
                    <p style ={{fontWeight: 'bold'}}>Total Loss: {loss + 2000}$</p><br />
                    <p style ={{fontWeight: 'bold'}}>Total Revenue Between Given Dates: {gain-loss-2000}$</p>
                </Col>
            </Row>
        </Container>
        : <></>
      }
      
  
    </div>
      )
  

}
export default Revenue;

