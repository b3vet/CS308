import React,{Component} from 'react'
import { Text, StyleSheet, View, SafeAreaView,Dimensions ,TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import Context from '../../context/Context';
import axios from 'axios';

export default class Purchase extends Component {
  static contextType = Context;
  constructor(props) {
    
    super(props);
    this.scroll =null
    this.state = {
      user: null,
      totalPrice : 0,
      loading: false,
      cardNumber: '',
      cvv: '',
      endMonth: 0,
      endYear: 0,
      address: '',
      name: '',
      surname: '',
      error: '',
      invoiceAddress: '',
    }
    
  }
  isNumeric(value) {
    return /^-?\d+$/.test(value);
  }
  inputCheck = () => {
    if(this.state.cardNumber.length != 16) {
      this.setState({error: "Invalid card number!"})
      console.log("size problem")
      return false;
    }
    else if(!this.isNumeric(this.state.cardNumber)) {
      this.setState({error: "Invalid card number!"})
      console.log("numeric problem")
      return false;
    }
    else if(this.state.endMonth.length != 2) {
      this.setState({error: "Invalid end month!"})
      return false;
    }
    else if(this.state.endYear.length != 4) {
      this.setState({error: "Invalid end year!"})
      return false;
    }
    else if(!this.isNumeric(this.state.endMonth)) {
      this.setState({error: "Invalid end month!"})
      return false;
    }
    else if(!this.isNumeric(this.state.endYear)) {
      this.setState({error: "Invalid end year!"})
      return false;
    }
    else if(!this.isNumeric(this.state.cvv)) {
      this.setState({error: "Invalid CVV!"})
      return false;
    }
    else if(this.state.cvv.length != 3) {
      this.setState({error: "Invalid CVV!"})
      return false;
    }
    else if(this.state.endYear > 2100) {
        this.setState({error: "End Year cannot be greater than 2100"})
        return false;
    }
    else if(this.state.endMonth > 12 || this.state.endMonth < 1) {
      this.setState({error: "Invalid end month!"})
      return false;
    }
    else if(this.state.address.length == 0) {
      this.setState({error: "Please fill all the fields!"})
      return false;
    }
    else if(this.state.name.length == 0) {
      this.setState({error: "Please fill all the fields!"})
      return false;
    }
    else if(this.state.surname.length == 0) {
      this.setState({error: "Please fill all the fields!"})
      return false;
    }
    else if(this.state.invoiceAddress.length == 0) {
      this.setState({error: "Please fill all the fields!"})
      return false;
    }
    else {
      return true;
    }
  }
  componentDidMount() {  
      this.setState({totalPrice: this.props.route.params.total})
  }
  placeOrder = () => {
    if(!this.inputCheck()) {
      this.scroll.scrollToEnd()
      return;
    }
    axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/order/',
        data: {
            uid: this.context.user.uid,
            address: this.state.address,
            afterLogin: false,
            name: this.state.name, 
            surname: this.state.surname,
            invoiceAddress: this.state.invoiceAddress,
        }
    })
      .then(
        response => {
          console.log(response.data)
          this.props.navigation.navigate('PurchaseSuccess');
  
          
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

  render() {
    const totalPrice = this.props.route.params.total;
    if(this.state.loading) {
      return (<SafeAreaView style = {{flex: 1, justifyContent: 'center'}}><ActivityIndicator size="large" color="#000" /></SafeAreaView>)
    }
    return (
      <SafeAreaView style = {styles.container}>
      
      <ScrollView directionalLockEnabled={true} style={styles.scrollView} ref={(scroll) => {this.scroll = scroll}}>
      <View style = {styles.container}>
      <Text style={{marginTop: 20, fontSize: 50, alignSelf: 'left'}}>Total: </Text>
      <View style={{flexDirection: 'row', alignItems: 'flex-start', marginBottom:30}}><Text style={{fontWeight: 'bold', fontSize: 60, alignSelf: 'left'}}>{totalPrice}$</Text><Text style={{fontWeight: 'bold', fontSize: 20, alignSelf: 'left', paddingTop: 40}}>+67$ Shipment Fee</Text></View>
      <Text style={{textAlign: 'left', fontSize: 20, alignSelf: 'baseline', marginBottom: 30, marginLeft: 20}}>Payment and Order Information</Text>
      <Text>16-Digit Card Number</Text>
      <TextInput
                    placeholder = ""
                    onChangeText = {(cardNumber) => this.setState({ cardNumber })} 
                    style = {styles.input}
        />
        <View style={{width: '90%', justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center'}}>
                <Text>Expiration Date</Text>
                <Text>CVV Number</Text>
        </View>
        <View style={{width: '90%', justifyContent: 'flex-begin', flexDirection: 'row', alignItems: 'center'}}>
            
                <TextInput placeholder="MM" onChangeText = {(endMonth) => this.setState({ endMonth })} style={styles.month}/>
                <Text>/</Text>
                <TextInput placeholder="YYYY" onChangeText = {(endYear) => this.setState({ endYear })} style={styles.year}/>
                <TextInput placeholder="CVV1" onChangeText = {(cvv) => this.setState({ cvv })} style={styles.cvv}/>
            

            
        </View>
        <Text>Delivery Address</Text>
        <TextInput
            multiline={true}
            numberOfLines={4}
            onChangeText={(address) => this.setState({address})}
            value={this.state.address}
            style={styles.address}
        />
      <Text style={{textAlign: 'left', fontSize: 20, alignSelf: 'baseline', marginBottom: 30, marginLeft: 20, marginTop: 20}}>Invoice Information</Text>
      <View style={{width: '80%', justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center'}}>
                  <Text>Name</Text>
                  <TextInput onChangeText = {(name) => this.setState({ name })} style = {styles.nameIn}/>
                </View>
                <View style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center'}}>
                  <Text>Surname</Text>
                  <TextInput onChangeText = {(surname) => this.setState({ surname })} style = {styles.nameIn}/>
                </View>
      </View>
      <Text>Invoice Address</Text>
        <TextInput
            multiline={true}
            numberOfLines={4}
            onChangeText={(invoiceAddress) => this.setState({invoiceAddress})}
            value={this.state.invoiceAddress}
            style={styles.address}
        />
      
      </View>
      </ScrollView>
      {this.state.error != '' ? <Text style={{fontSize: 12, color: 'red', position: "absolute", right: 50, bottom: 70, alignSelf: 'center'}}>{this.state.error}</Text> : <></>}
      <TouchableOpacity onPress = {() => this.placeOrder()} style = {styles.button}><Text style={{color: 'white'}}>Place Order</Text></TouchableOpacity>
      </SafeAreaView>
      )
    }

    
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
        marginLeft: 10,
        marginRight: 13,
      },
      input: {
        height: 40,
        width: '80%',
        marginTop: 3,
        marginBottom: 10,
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 3
      },
      nameIn : {
        height: 40,
        width: '80%',
        marginTop: 3,
        marginBottom: 10,
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 3,
        
      },
      address: {
        height: 120,
        width: '80%',
        marginTop: 3,
        marginBottom: 10,
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 3
      },
      month: {
        height: 40,
        width: 30,
        marginTop: 3,
        marginBottom: 10,
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 3,
        marginLeft: 43, 
        marginRight: 5
      },
      year: {
        height: 40,
        width: 60,
        marginTop: 3,
        marginBottom: 10,
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 3,
        marginLeft: 5,
        marginRight: 100
      },
      cvv: {
        height: 40,
        width: 60,
        marginTop: 3,
        marginBottom: 10,
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 3,
        
        
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
      display :'flex',
      justifyContent: 'center',
      alignItems: 'center',
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
        shadowOffset: { height: 3, width: 3 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        backgroundColor: '#fff',
        elevation: 2,
        width: "80%",
        height: 50,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        alignSelf: 'center',
        position: 'absolute',
        right: 40,
     bottom: 10,
    },
    scrollView: {
      width: "100%",
      marginBottom: 90
    },
  });

  