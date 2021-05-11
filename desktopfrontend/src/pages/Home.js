import React, { useState, useEffect } from 'react';
import axios from 'axios';
import first_banner from '../assets/banner.jpg';
import second_banner from '../assets/diamonds-header.jpeg';
import '../assets/FontAwesome/css/fontawesome.css';
import '../assets/FontAwesome/css/solid.css';

import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginRight: "200px",
    marginLeft: "200px"
  },
}));
function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [engagement, setEngagement] = useState([]);
  const [wedding, setWedding] = useState([]);
  const classes = useStyles();
  
  useEffect(() => {
    setLoading(true);
    axios({
      method: 'get',
      url: 'http://127.0.0.1:8000/api/home/',
      data: {
      }
    }).then(
      response => {
        console.log(response.data)
        setEngagement(response.data.engagement)
        setWedding(response.data.wedding)
        console.log("wedding budur")
        console.log(wedding)
        console.log("engagement budur")
        console.log(engagement)
        setLoading(false);
      }
      ).catch(
        error => {
          setLoading(false);
          if (error.response) {
            console.log(error.response.status)
          }
          else {
            console.log(error.message)
          }
        }
        )
        
      }, [])
      

      
      if (loading) {
        return (<div>Loading...</div>)
      }
      
      
      return (

        <div id="home-background">

        <div>
          <img src={first_banner} style={{width: '100%'}}></img>
        </div>
        <div style={{backgroundColor: 'white', width: "100%"}}>
        <p class = "home-header">WEDDING RINGS TOP 8</p><br></br>
        
        
        <div className={classes.root}>
          <Grid container spacing={10}>
          {
          wedding.map((product) => (

            <Grid item xs={3}>

              <img src={"http://127.0.0.1:8000"+product.image} alt = "Product's Image" style={{maxWidth:200, maxHeight:200, width:'auto', height:'auto'}}></img>
              <Link to={`/product/${product.pid}`}>{product.name}</Link>
              <p>{product.price} ₺</p>

            </Grid>

          ))
          }
            </Grid>
          </div>
          <div style={{marginTop: '80px'}}>
          <img src={second_banner} style={{width: '100%'}}></img>
          </div>
          <br></br><p class = "home-header">ENGAGEMENT RINGS TOP 8</p><br></br>
          
          <div className={classes.root}>
          <Grid container spacing={10}>
          {
          engagement.map((product) => (

            <Grid item xs={3} style={{alignItems: 'center', justifyContent: 'center'}}> 

              <img src={"http://127.0.0.1:8000"+product.image} alt = "Product's Image" style={{maxWidth:200, maxHeight:200, width:'auto', height:'auto'}}></img>
              <Link to={`/product/${product.pid}`}>{product.name}</Link>
              <p>{product.price} ₺</p>

            </Grid>

          ))
          }
            </Grid>
          </div>
            </div>
            </div>
            );
          }
          
          export default Home;