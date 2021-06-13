import React,{useEffect, useState} from 'react'
import { Text, StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Image, ActivityIndicator, TextInput } from 'react-native'
import axios from 'axios';
import { Rating, AirbnbRating } from 'react-native-ratings';


  export default function Product({route,navigation}) {

    const [product, setProduct] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState(null);
    const [comment, setComment] = useState(null);
    const [rating, setRating] = useState(null);
    const [res, setRes] = useState('');
    const [added, setAdded] = useState('');
    const addComment = () => {
        
      
      const data = {
          comment: {
            pid: route.params.pid,
            comment: comment,
            uid: route.params.uid,
            approved: false,
            rating: rating,
          },
          pid: route.params.pid
        };
        console.log(data);
      axios({
          method: 'post',
          url: 'http://127.0.0.1:8000/api/addcommentandrating/',
          data: {
            comment: {
              pid: route.params.pid,
              comment: comment,
              uid: route.params.uid,
              approved: false,
              rating: rating,
            },
            pid: route.params.pid
          }
        }).then(
          response => {
            setLoading(false);
            setRes("Your comment will appear here when it is approved.");
          }
        ).catch(
          error => {
            setLoading(false);
            if (error.response) {
              setError(error.response.data.error)
              console.log(error.response)
            }
            else {
                setError(error.message);
                console.log(error.message)
            }
          }
        )
        getData();
  }
    const getData = () => {
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
    }
    const addToCart = () => {
      
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/addtocart/',
        data: {
            cart: {
              pid:route.params.pid,
              quantity: 1,
              uid: route.params.uid,
            }
          },
      }).then(
        response => {
          console.log(response.data)
          setAdded("Added to cart!")
        }
        ).catch(
          error => {
            
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else {
                console.log('Error', error.message);
            }
          }
        )
    }
    const rateComplete = (rating) => {
      setRating(rating)
    }
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
    }, [route.params.pid])
    
    if(loading) {
      return (<SafeAreaView style = {{flex: 1, justifyContent: 'center'}}><ActivityIndicator size="large" color="#000" /></SafeAreaView>)
    }
    if(product == null) {
        return (<SafeAreaView style = {styles.container}><Text>Error..</Text></SafeAreaView>)
    }
    return (
      <SafeAreaView style={{flex:1}}>
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
        {product[0].price === product[0].discountPrice ? <Text style={{fontSize: 27, fontWeight: 'bold', textAlign: "right"}}>{product[0].price}$</Text> : <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}><Text style={{textDecorationLine: 'line-through', textDecorationStyle: 'solid', color: 'red', fontWeight: 'bold', fontSize: 24}}>{product[0].price}$</Text><Text style={{fontWeight: 'bold', fontSize: 27}}>    {product[0].discountPrice}$</Text></View>}
        <Text style={{fontSize: 15, fontWeight: 'bold'}}>Color: {product[0].color}</Text>
        <Text style={{fontSize: 15, fontWeight: 'bold'}}>Material: {product[0].material}</Text>
        <Text style={{fontSize: 15, fontWeight: 'bold'}}>Stock: {product[0].stock}{"\n"}</Text>
        <TouchableOpacity style={styles.button} onPress={() => addToCart()}>
            <Text style={{color: 'white'}}>Add to Cart</Text>
        </TouchableOpacity>  
        {added != '' ? <Text style={{color: 'green', fontWeight: 'bold', fontSize: 14, textAlign: 'center', marginTop: 10}}>{added}</Text> : <></>}
        <Text style={{marginTop: 40, fontSize: 20, fontWeight: 'bold'}}>Description</Text>
        <Text style={{fontSize: 12}}>{product[0].description}</Text>
        <Text style={{marginTop: 40, fontSize: 20, fontWeight: 'bold'}}>Comments{"\n"} </Text>
        <View>
        {
            comments.map((comment) => {
              return (
                <View style={{borderRadius: 10,borderWidth: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: 100}}>
                  
                  <Text style= {{marginTop: 10, marginLeft: 10}}>Comment: {"\n" + comment.comment}</Text>
                  <Rating
                    showRating={false}
                    type='custom'
                    ratingBackgroundColor='#f2f2f2'
                    ratingColor="black"
                    ratingTextColor="black"
                    readOnly={true}
                    startingValue={comment.rating}
                    imageSize={20}
                    style= {{marginTop: 10}}
                  />
                </View>
              )}
            )
            
        }
        </View>
        <Text style={{marginTop: 40, fontSize: 20, fontWeight: 'bold'}}>Add Comment{"\n"} </Text>
        <View style={{display:"flex", flexDirection: "column",alignItems: "center", justifyContent:"center"}}> 
          <Text style={{marginTop: 10, fontSize: 15, fontWeight: 'bold'}}>Comment:</Text>
          <TextInput
              multiline={true}
              numberOfLines={3}
              onChangeText={(comment) => setComment(comment)}
              value={comment}
              style={styles.address}
          />
          <Rating
            showRating
            type='custom'
            onFinishRating={rateComplete}
            style={{ paddingVertical: 10 }}
            ratingBackgroundColor='#f2f2f2'
            ratingColor="black"
            ratingTextColor="black"
          />
          <TouchableOpacity onPress={() => addComment()} style={styles.SubButton}><Text style={{color: 'white'}}>Submit Comment</Text></TouchableOpacity>
          {res != '' ? <Text style={{color: 'green', fontWeight: 'bold', fontSize: 10, marginBottom: 10}}>{res}</Text> : <></>}
          </View>
    </ScrollView>
    </View>
    </SafeAreaView>
    )
    
    
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 10,
      alignItems: "center",
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
    },
    SubButton : {
      width: 200,
      height: 50,
      backgroundColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      marginBottom: 20, 
      borderRadius: 2
  },
    address: {
      height: 80,
      width: '80%',
      marginTop: 3,
      marginBottom: 10,
      borderWidth: 1,
      backgroundColor: 'white',
      borderRadius: 3
    },
  });
