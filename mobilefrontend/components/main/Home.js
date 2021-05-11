//home
import React,{Component} from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Button, Image, ScrollView,SafeAreaView } from 'react-native'
import Context from '../../context/Context';
import axios from 'axios';
import { FlatGrid } from 'react-native-super-grid';


export class Home extends Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      wedding:[],
      engagement:[]     
    }
  }
  
  componentDidMount() {
    this.setState({loading: true})
    /*
    axios({
      method: 'get',
      url: 'http://127.0.0.1:8000/api/home/',
      data: {},
    }).then(
      response => {
        this.setState({wedding: response.data.wedding,engagement: response.data.engagement})
        this.setState({loading: true})
        
      }
      ).catch(
        error => {
          this.setState({loading: true})
          if (error.response) {
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
          } else {
              console.log('Error', error.message);
          }
        }
        )
        
       this.setState({loading: false})
    */
  }
  
 
  render() {
    return (
      <SafeAreaView style = {styles.container}>
      <View style= {styles.logocontainer}><Image style = {styles.logo} source = {require('../../assets/logo_inverted.png')} /></View>
      
      <Image style = {styles.banner} source = {require('../../assets/banner.jpg')} />
      <Text style = {{marginTop: 50, marginBottom: 50,fontSize:30, fontWeight:'bold', textAlign: 'center', color: 'white'}}>
        CREATED FOR PERFECTION
      </Text>
      
      <Image style = {styles.banner} source = {require('../../assets/homepage_banner.jpg')} />
      
      </SafeAreaView>
      )
    }

    
  }
  const Grid = ({product, navigation}) => {
    return(
    <View >
      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('SingleProductPage', {pid: product.pid, name: product.name})}>
      <Image 
        style = {styles.image}
        source={{
          uri: 'http://127.0.0.1:8000'+product.image,
        }}   
      />
      <Text style = {{color:'white'}}>{product.name}</Text>
      <Text style = {{color:'white'}}>{product.price}$</Text>
      </TouchableOpacity>
    </View>
    )
  }
  const styles = StyleSheet.create({
    row : {
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      margin: 10
    },
    image : {
      height: 180,
      width:180,
      marginBottom: 5
    },
    container: {
      flex: 1,
      justifyContent: "space-evenly",
      backgroundColor: 'black',
      flexDirection: 'column',
      
    },
    button: {
      alignItems: "center",
      backgroundColor: "#DDDDDD",
      padding: 10
    },
    text: {
      alignItems: "center",
      padding: 10
    },
    banner: { 
      height : 200,
      width : '100%'      
    },
    logo: { 
      height : 40,
      width : 200,
      margin: 10,
      justifyContent: 'center',
      alignSelf:'center' 
    },
    logocontainer: {
      display: 'flex',
      justifyContent: 'center',
       

    }
  });

  export default Home