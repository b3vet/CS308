import React,{Component} from 'react'
import { Text, StyleSheet, View, SafeAreaView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import Context from '../../context/Context';


export class PurchaseSuccess extends Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
  }
}
  

  componentDidMount() {  
      
  }
  

  render() {
    return (
      <SafeAreaView style = {styles.container}>
        <Image style = {styles.success} source = {require('../../assets/success.png')} />
      <Text style={{marginTop: 20, fontSize: 30}}>Purchase Successful</Text>
      <Text style={{marginTop: 20, fontSize: 30, marginBottom: 30}}>You can track your order from My Orders section in your profile!</Text>
      <TouchableOpacity onPress= {() => this.props.navigation.navigate('DashboardStack', {screen: 'Orders'})} style={styles.button}><Text style={{color: 'white'}}>Go To My Orders</Text></TouchableOpacity>
      </SafeAreaView>
      )
    }

    
  }
  const styles = StyleSheet.create({
    
    container: {
      flex: 1,
      justifyContent: "center",
      marginHorizontal: 10,
      alignItems: 'center'
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

  export default PurchaseSuccess