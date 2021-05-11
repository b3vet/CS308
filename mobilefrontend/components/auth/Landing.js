import React from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
export class Landing extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          loaded: true,
        }
      } 
    getData = async () => {
        try {
          const value = await AsyncStorage.getItem('@user')
          if(value !== null) {
            // value previously stored
            return value
          }
          else {
            return 'not stored'
          }
        } catch(e) {
          // error reading value
          console.log("could not get user")
        }
      }

    async componentDidMount() {
          const data = await this.getData()
          if (data != 'not stored') {
            this.props.navigation.navigate("Main")
          }

      }
    
    render() {
        return (
            <View style = {{ flex:1, justifyContent: 'center', backgroundColor: 'darkgray', alignItems: 'center'}}>
              <View style= {styles.logocontainer}><Image style = {styles.logo} source = {require('../../assets/logo_inverted.png')} /></View>
                <TouchableOpacity style={styles.button} onPress = {() => this.props.navigation.navigate("Register")} >
                  <Text style={{color: 'white'}}>Register</Text>
                </TouchableOpacity> 
                <TouchableOpacity style={styles.button} onPress = {() => this.props.navigation.navigate("Login")} >
                  <Text style={{color: 'white'}}>Login</Text>
                </TouchableOpacity> 
            </View>
        )
    }
    
}

const styles = StyleSheet.create({
  
  logocontainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 50
  },
  button : {
    width: 400,
    height: 50,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
},
logo: { 
  height : 40,
  width : 200,
  margin: 10,
  justifyContent: 'center',
  alignSelf:'center' 
},
});
export default Landing