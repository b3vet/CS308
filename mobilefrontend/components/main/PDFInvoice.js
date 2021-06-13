import React,{useEffect, useState} from 'react'
import { Text, StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
  export default function PDFInvoice({route,navigation}) {

    const [pdf, setPDF] = useState(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    
    useEffect(() => {
      
      
      setLoading(true);

      axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/invoice/',
        data: { oid: route.params.oid},
      }).then(
        response => {
          setPDF("http://127.0.0.1:8000"+response.data.pdf);
          setLoading(false);
          console.log("success on server")
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
    
    return (
      
      <View style = {styles.container}>
      <WebView source={{ uri: 'https://reactnative.dev/' }} />
      </View>
    
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
    }
  });
