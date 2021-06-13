import React,{useEffect, useState} from 'react'
import { Text, StyleSheet, View, SafeAreaView, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import axios from 'axios';
import { Searchbar } from 'react-native-paper';
import { FlatGrid } from 'react-native-super-grid';



  export default function Search({route,navigation}) {

    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState([]);
    
    const onChangeSearch = (q) => {
        setQuery(q);
    }
    const searchQuery = () => {
      setLoading(true);
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/search/',
        data: {
            query: query
          },
      }).then(
        response => {
          

          if (response.data.results.length % 2 === 1) {
            setResults([...response.data.results, {}])
          } 
          else {
              setResults(response.data.results)
          }
          setLoading(false);
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
    
    
    if(loading) {
      return (<SafeAreaView style = {{flex: 1, justifyContent: 'center'}}><ActivityIndicator size="large" color="#000" /></SafeAreaView>)
    }
    
    return (
      <SafeAreaView style={{flex:1}}>
      <View style = {styles.container}>
        <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={query}
            onIconPress={() => searchQuery()}
        />
        <FlatGrid
          itemDimension={130}
          data={results}
          renderItem={({ item }) => (<Grid navigation={navigation} route={route} product={item} user={route.params.user}/>)}
          style={{marginTop: 55, paddingLeft: 7}}
        />
      </View>
      </SafeAreaView>
    )
    
    
  }
  const Grid = ({product, navigation, route, user}) => {
    return(
      <View >
      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('SingleProductPage', {pid: product.pid, name: product.name, uid: route.params.user.uid})}>
        <Image 
          style = {styles.image}
          source={{
            uri: 'http://127.0.0.1:8000'+product.image,
          }}   
        />
        <Text>{product.name}</Text>
        {product.discountPrice == product.price ? <Text style={{fontWeight: 'bold', fontSize: 16}}>{product.price}$</Text> : <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}><Text style={{textDecorationLine: 'line-through', textDecorationStyle: 'solid', color: 'red', fontWeight: 'bold'}}>{product.price}$</Text><Text style={{fontWeight: 'bold', fontSize: 16}}>    {product.discountPrice}$</Text></View>}
      </TouchableOpacity>
    </View>
    )
  }
  const styles = StyleSheet.create({
    row : {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        marginBottom: 10,
      },
    container: {
        flex: 1,
        justifyContent: "flex-start",
        marginHorizontal: 10,
        alignItems: "center",
        marginLeft: 5,
        marginRight: 5,
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
    image : {
        height: 180,
        width:180,
        marginBottom: 5
      },
    
  });
