import React,{useEffect, useState} from 'react'
import { Text, StyleSheet, View, Button, ScrollView, TouchableOpacity, Image } from 'react-native'
import axios from 'axios';


  export default function Product({route,navigation}) {

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState(null);
    useEffect(() => {
      
      
      setLoading(true);

      axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/singleproduct/',
        data: {pid:route.params.pid},
      }).then(
        response => {
          setProduct(response.data.product);
          setComments(response.data.comments)
          console.log("comments")
          console.log(comments)
          setLoading(false);
          
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
    if(product == null) {
        return (<View><Text>Error..</Text></View>)
    }
    return (
      <View style = {styles.container}>
      
      <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'flex-start'
      }}>
      <Image 
        style = {styles.image}
        source={{
          uri: 'http://127.0.0.1:8000'+product[0].image,
        }} 
        
      />
        <Text style={{fontSize: 30, fontWeight: 'bold'}}>{product[0].name}</Text>
        <Text style={{fontSize: 27, fontWeight: 'bold', textAlign: "right"}}>{product[0].price}$</Text>
        <Text style={{fontSize: 15, fontWeight: 'bold'}}>Color: {product[0].color}</Text>
        <Text style={{fontSize: 15, fontWeight: 'bold'}}>Material: {product[0].material}</Text>
        <Text style={{fontSize: 15, fontWeight: 'bold'}}>Stock: {product[0].stock}{"\n"}</Text>
        <TouchableOpacity style={styles.button}>
            <Text style={{color: 'white'}}>Add to Cart</Text>
        </TouchableOpacity>  
        <Text style={{marginTop: 40, fontSize: 20, fontWeight: 'bold'}}>Description: </Text>
        <Text style={{fontSize: 12}}>{product[0].description}</Text>
        <Text style={{marginTop: 40, fontSize: 20, fontWeight: 'bold'}}>Comments:{"\n"} </Text>
        <View>
        {
            comments.map((comment) => 
              <Text>{comment.comment + "\n"}</Text>
            )
        }
        </View>
    </ScrollView>
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
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    image : {
        height: 400,
        width: 400
    },
    button : {
        width: 400,
        height: 50,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    }
  });
