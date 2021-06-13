import React,{useEffect, useState} from 'react'
import { Text, StyleSheet, View, Modal, Image, TouchableOpacity, SafeAreaView, Picker, TextInput, ActivityIndicator } from 'react-native'
import { FlatGrid } from 'react-native-super-grid';
import axios from 'axios';


  export default function ProductsList({route,navigation}) {
    const [caid, setCaid] = useState(-1);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [selectedValue, setSelectedValue] = useState("old");
    const [maxPrice, setMaxPrice] = useState(50000);
    const [minPrice, setMinPrice] = useState(0);
    const [color, setColor] = useState("all");
    const [material, setMaterial] = useState("all");
    
    const order = () => {
      if(selectedValue == "incPrc") {
        products.sort((a, b) => (a.discountPrice > b.discountPrice) ? 1 : (a.discountPrice === b.discountPrice) ? ((a.name > b.name) ? 1 : -1) : -1 )
      }
      else if (selectedValue == "decPrc") {
        products.sort((a, b) => (a.discountPrice < b.discountPrice) ? 1 : (a.discountPrice === b.discountPrice) ? ((a.name > b.name) ? 1 : -1) : -1 )
      }
      else if(selectedValue == "old") {
        products.sort((a, b) => (a.pid > b.pid) ? 1 : (a.pid === b.pid) ? ((a.name > b.name) ? 1 : -1) : -1 )
      }
      else if(selectedValue == "new") {
        products.sort((a, b) => (a.pid < b.pid) ? 1 : (a.pid === b.pid) ? ((a.name > b.name) ? 1 : -1) : -1 )
      }
      else if(selectedValue == "rating") {
        products.sort((a, b) => (a.totalRating < b.totalRating) ? 1 : (a.totalRating === b.totalRating) ? ((a.name > b.name) ? 1 : -1) : -1 )
      }
      setModalVisible(false)
    }
    const filter = () => {
      setLoading(true)
      console.log("maxprice is " + maxPrice + "min price is " + minPrice)
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/filteredproductsbycategory/',
        data: {
          caid:route.params.caid,
          minPrice: minPrice,
          maxPrice: maxPrice,
          color: color,
          material: material
        },
      })
      .then(
        response => {
          if (response.data.products.length % 2 === 1) {
            setProducts([...response.data.products, {}])
          } 
          else {
            setProducts(response.data.products)
          }
          setLoading(false);
          console.log(products)
      })
      .then(() => order())
      .catch(
        error => {
          setLoading(false);
          if (error.response) {
              console.log(error.response.data);      
          } else {
             console.log('Error', error.message);
            }
        }
      )
      setModalVisible2(false)
    }
    const resetFilters = () => {
      setLoading(true)
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/productsbycategory/',
        data: {caid:route.params.caid},
      }).then(
        response => {
          if (response.data.products.length % 2 === 1) {
            setProducts([...response.data.products, {}])
          } 
          else {
              setProducts(response.data.products)
          }
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
      setModalVisible2(false)
    }
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
          if (response.data.products.length % 2 === 1) {
            setProducts([...response.data.products, {}])
          } 
          else {
              setProducts(response.data.products)
          }
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
      
      return (<SafeAreaView style = {{flex: 1, justifyContent: 'center'}}><ActivityIndicator size="large" color="#000" /></SafeAreaView>)
    }
    return (
      <SafeAreaView style = {styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Picker
                selectedValue={selectedValue}
                style={{ height: 100, width: 300, paddingTop: 30 }}
                onValueChange={(itemValue, itemIndex) => {setSelectedValue(itemValue);}}
              >
                <Picker.Item label="Increasing Price" value="incPrc" />
                <Picker.Item label="Decreasing Price" value="decPrc" />
                <Picker.Item label="Newest First" value="new" />
                <Picker.Item label="Oldest First" value="old" />
                <Picker.Item label="Most Rating" value="rating" />
                
              </Picker>
              <TouchableOpacity onPress={() => order()} style={styles.setSelection}><Text style={{color: 'white'}}>Select</Text></TouchableOpacity>
              
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible2}
          onRequestClose={() => {
            setModalVisible2(false);
          }}
        >
          
          <View style={styles.modalViewFilter}>
            <View style={styles.filterContent}>
              <View style={styles.prices}>
                <TextInput
                          placeholder = "Min Price"
                          keyboardType='numeric'
                          onChangeText = {(min) => setMinPrice(min)} 
                          style = {styles.input}
                  />
                  <Text style={{paddingTop: 20}}>-</Text>
                  <TextInput
                          placeholder = "Max Price"
                          keyboardType='numeric'
                          onChangeText = {(max) => setMaxPrice(max)} 
                          style = {styles.input}
                  />
              </View>
              
              <Picker
                selectedValue={color}
                style={{ height: 100, width: 300}}
                onValueChange={(itemValue, itemIndex) => {setColor(itemValue);}}
              >
                <Picker.Item label="Gold" value="GOLD" />
                <Picker.Item label="Rose" value="ROSE" />
                <Picker.Item label="Silver" value="SILVER" />
                <Picker.Item label="All Colors" value="all" />
              </Picker>
              <Text style={{marginTop: 100,marginBottom: 10}}></Text>
              <Picker
                selectedValue={material}
                style={{ height: 100, width: 300 }}
                onValueChange={(itemValue, itemIndex) => {setMaterial(itemValue);}}
              >
                <Picker.Item label="18K Gold" value="18K GOLD" />
                <Picker.Item label="14K Gold" value="14K GOLD" />
                <Picker.Item label="10K Gold" value="10K GOLD" />
                <Picker.Item label="All Materials" value="all" />
              </Picker>
            </View>
            <View style={styles.filterButtons}>
              <TouchableOpacity onPress={() => filter()} style={styles.filterButton}><Text style={{color: 'white'}}>Filter</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => resetFilters()} style={styles.filterButton}><Text style={{color: 'white'}}>Reset</Text></TouchableOpacity>
            </View>
          </View>
          
        </Modal>
        <View style = {styles.filterContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.filters}><Text style={{color: 'white'}}>Order By</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible2(true)}style={styles.filters}><Text style={{color: 'white'}}>Filters</Text></TouchableOpacity>
        </View>
        
        <FlatGrid
          itemDimension={130}
          data={products}
          renderItem={({ item }) => (<Grid navigation={navigation} route={route} product={item}/>)}
          style={{marginTop: 55, paddingLeft: 7, height: '100%'}}
        />
      
      </SafeAreaView>
    )
    
    
  }
  const Grid = ({product, navigation, route}) => {
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
        {product.discountPrice == product.price ? <Text style={{fontWeight: 'bold', fontSize: 16}}>{product.price}{product != {} ? "$" : ""}</Text> : <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}><Text style={{textDecorationLine: 'line-through', textDecorationStyle: 'solid', color: 'red', fontWeight: 'bold'}}>{product.price}{product != {} ? "$" : ""}</Text><Text style={{fontWeight: 'bold', fontSize: 16}}>    {product.discountPrice}{product != {} ? "$" : ""}</Text></View>}
      </TouchableOpacity>
    </View>
    )
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      marginHorizontal: 10,
      alignItems: "center",
      marginLeft: 5,
      marginRight: 5,
    },
    setSelection: {
      alignSelf: "center",
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      height: 50,
      width: 180,
      backgroundColor: 'black',
      marginBottom: 10
    },
    modalView: {
      height: 300,
      width: 350,
      backgroundColor: "white",
      alignSelf: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      flexDirection: "column",
      justifyContent: "space-between",
      
    },
    filterContainer: {
      flex: 1,
      width: '100%',
      flexDirection: "row",
      justifyContent: "space-evenly",
      marginTop: 10,
      
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
      marginBottom: 10,
    },
    filters : {
      alignItems: 'center',
      alignSelf: "flex-start",
      justifyContent: 'center',
      textAlign: 'center',
      height: 50,
      width: 180,
      backgroundColor: 'black',
      marginBottom: 10
    },
    image : {
      height: 180,
      width:180,
      marginBottom: 5
    },
    input : {
      height: 40,
      width: 150,
      margin: 12,
      borderWidth: 1,
      backgroundColor: 'white',
    },
    prices: {
      flexDirection: "row",
      justifyContent: "center",
    },
    modalViewFilter: {
      height: 650,
      width: 350,
      backgroundColor: "white",
      alignSelf: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      
    },
    filterContent : {
      paddingTop: 60,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",

    },
    filterButton: {
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      height: 50,
      width: 130,
      backgroundColor: 'black',
      marginBottom: 10,
      marginHorizontal: 10,
    },
    filterButtons: {
      flexDirection: "row",
      justifyContent: "space-evenly",
    }
  });
