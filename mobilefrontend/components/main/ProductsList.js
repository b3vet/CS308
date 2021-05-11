import React,{useEffect, useState} from 'react'
import { Text, StyleSheet, View, Button, Image, TouchableOpacity } from 'react-native'
import { FlatGrid } from 'react-native-super-grid';
import axios from 'axios';


  export default function ProductsList({route,navigation}) {
    const [caid, setCaid] = useState(-1);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
      try {
        setCaid(route.params.caid)
      } catch (error) {
        console.log('caid is not defined so all products are here')
      }
      setLoading(true)
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/productsbycategory/',
        data: {caid:route.params.caid},
      }).then(
        response => {
          setProducts(response.data.products);
          setLoading(false);
          console.log(products)
        }
        ).catch(
          error => {
            setLoading(false);
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else {
                console.log('Error', error.message);
            }
          }
          )
    
    }, [route.params.caid])
    
    
    if(loading) {
      
      return (<View><Text>Loading..</Text></View>)
    }
    return (
      <View style = {styles.container}>
      <TouchableOpacity style={styles.filters}><Text style={{color: 'white'}}>FILTERS WILL COME HERE</Text></TouchableOpacity>
      <FlatGrid
        itemDimension={130}
        data={products}
        renderItem={({ item }) => (<Grid navigation={navigation} product={item}/>)}
      />
      
    </View>
    )
    
    
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
      <Text>{product.name}</Text>
      <Text>{product.price}$</Text>
      </TouchableOpacity>
    </View>
    )
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 10
    },
    item: {
      alignItems: "center",
      backgroundColor: "#DDDDDD",
      padding: 10
    },
    name: {
      alignItems: "center",
      padding: 10
    }, 
    row : {
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      margin: 10
    },
    filters : {
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      height: 50,
      width: 400,
      backgroundColor: 'black',
      marginBottom: 10
    },
    image : {
      height: 180,
      width:180,
      marginBottom: 5
    }
  });
