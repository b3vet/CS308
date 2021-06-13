import React,{Component} from 'react'
import { Text, StyleSheet, View, SafeAreaView, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import Context from '../../context/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';

export class CartScreen extends Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      cartItems: [],
      loading: false,
      dum: 0,
      totalPrice: 0
    }
    this.navigationWillFocusListener = props.navigation.addListener('focus', () => {
      console.log("event")
      this.getData()
    })
    
  }
  getData() {
    this.setState({loading: true})
    axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/cart/', 
        data: {
            uid:this.context.user.uid,
        },
      }).then(
        response => {
          this.setState({cartItems: response.data.products, loading: false, totalPrice: response.data.total});
          
          console.log(this.state.cartItems)
        }
        ).catch(
          error => {
            this.setState({loading: false});
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
  removeProduct = (productHere, user, cartItems) => {
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/api/removefromcart/',
      data: {
          cart: {
            pid:productHere.pid,
            quantity: 1,
            uid: user.uid,
            totalPrice: 0
          }
        },
    }).then(
      response => {
        console.log(response.data)
        if(productHere.quantity == 1) {
          this.setState({cartItems: cartItems.filter(product => product.pid !== productHere.pid)})
        }
        else {
          let items = this.state.cartItems;
          let idx = items.findIndex(item => item.pid === productHere.pid)
          let change = {...items[idx]}
          change.quantity -= 1;
          items[idx] = change;
          this.setState({cartItems: items})

        }
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

  componentDidMount() {
    this.setState({loading: true})
    axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/cart/',
        data: {
            uid:this.context.user.uid,
        },
      }).then(
        response => {
          this.setState({cartItems: response.data.products, loading: false, totalPrice: response.data.total});
          
        }
        ).catch(
          error => {
            this.setState({loading: false});
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else {
                console.log('Error', error.message);
            }
          }
    )
    console.log(this.state.totalPrice)
    
  }

  render() {
    const cartItems = this.state.cartItems;
    
    console.log(this.state.totalPrice)
    if(this.state.loading) {
      return (<SafeAreaView style = {{flex: 1, justifyContent: 'center'}}><ActivityIndicator size="large" color="#000" /></SafeAreaView>)
    }
    if(cartItems.length === 0) {
      return (<SafeAreaView style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text style={{color: "#111", fontSize: 30, fontWeight: 'bold', marginBottom: 80}}>Your cart is empty. You can add products to your cart.</Text><Text style={{color: "#111", fontSize: 30, fontWeight: 'bold', marginHorizontal: 20}}>If you want to join the magical world of Bandora, go ahead and start shopping our fine quality jewelry!</Text></SafeAreaView>)
    }
    return (
      <SafeAreaView style = {styles.container}>
      <FlatList
        
        data={cartItems}
        renderItem={({ item }) => (<Grid navigation={this.props.navigation} product={item} user={this.context.user} cartItems={cartItems} removeProduct={this.removeProduct}/>)}
        style={{paddingLeft: 7}}
          
      />

      <TouchableOpacity onPress={() => {this.props.navigation.navigate("Purchase",{ total: this.state.totalPrice})}} style = {styles.button}><Text style={{color: 'white'}}>Purchase</Text></TouchableOpacity>
      </SafeAreaView>
      )
    }

    
  }
  const Grid = ({product, navigation, user, cartItems, removeProduct}) => {
    return(
    <View style={styles.row} >
      <TouchableOpacity style = {styles.iteminfo} onPress={() => navigation.navigate('Products', {screen: "SingleProductPage", params:{pid: product.pid, name: product.name, uid: user.uid}})}>
        <Image 
          style = {styles.image}
          source={{
            uri: 'http://127.0.0.1:8000'+product.image,
          }}   
        />
        <View style={{flex:5, justifyContent: 'space-between'}}>
        <Text style={{fontWeight: 'bold'}}>{product.name}</Text>
        <Text style={{fontSize: 22}}>{product.discountPrice}$      Quantity: {product.quantity}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.remove} onPress={() => removeProduct(product, user, cartItems)}><Feather name="x-circle" size={30} color="black" /></TouchableOpacity>
    </View>
    )
  }
  
  const styles = StyleSheet.create({
    iteminfo: {
      flex: 7, 
      flexDirection: 'row',
    },
    remove : {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
      list : {
        flex: 1,
        marginHorizontal: 10,
      },
    image : {
        height: 60,
        width:60,
        margin: 5,
        flex: 2,
    },
    row : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderColor: 'black',
        borderRadius: 5,
        borderStyle: 'solid',
        borderWidth: 3,
        marginLeft: 10,
        marginRight: 13,
        flex: 1
        
    },
    container: {
      flex: 1,
      justifyContent: "center",
      
    },
    
    text: {
      alignItems: "center",
      padding: 10
    },
    item: {
        backgroundColor: '#000',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
      },
      title: {
        fontSize: 32,
      },
      button : {
        shadowColor: 'rgba(0,0,0, .4)', // IOS
      shadowOffset: { height: 1, width: 1 }, // IOS
      shadowOpacity: 1, // IOS
      shadowRadius: 1, //IOS
      backgroundColor: '#fff',
      elevation: 2,
        width: "50%",
        height: 50,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50,
        borderRadius: 50,
        alignSelf: 'center'
    }
  });

  export default CartScreen