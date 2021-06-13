//home
import React,{Component} from 'react'
import { Text, StyleSheet, View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native'
import Context from '../../context/Context';

export class UserSettings extends Component {

  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: false,
    } 
  }
    
   componentDidMount() {
      this.setState({user: this.context.user})
      console.log(this.context.user)
      console.log(this.state.user) 
    
  }
  render() {
    const handleAccountDelete = () => {
        //BACKENDI YOK EKLENECEK
    }
    if(this.state.loading) {
      return(<SafeAreaView style = {{flex: 1, justifyContent: 'center'}}><ActivityIndicator size="large" color="#000" /></SafeAreaView>)
    }
    return (
      <SafeAreaView style = {styles.container}>
      <View style = {styles.text}><Text style={styles.banner}> WHY ARE YOU LEAVING US? ARE YOU SURE?</Text></View>
      <TouchableOpacity 
        style = {styles.button}
        onPress = {handleAccountDelete}>
        <Text style={{fontSize: 20, color:'white'}}>YES</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style = {styles.button}
        onPress = {() => {this.props.navigation.navigate("Home")}
        }>
        <Text style={{fontSize: 20, color:'white'}}>NO</Text>
      </TouchableOpacity>
      
      
      </SafeAreaView>
      )
    }

    
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-evenly",
      paddingHorizontal: 10
    },
    button: {
      alignItems: "center",
      backgroundColor: "#DDDDDD",
      padding: 10
    },
    text: {
      alignItems: "center",
      padding: 10,
    },
    banner: {
      fontSize: 30, fontWeight: 'bold', textAlign: 'left',
    },
    button : {
      width: '100%',
      height: 120,
      backgroundColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      marginVertical: -30,
  },
  signOut : {
    width: '100%',
    height: 50,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end'
}
  });

  export default UserSettings