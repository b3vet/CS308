import React, { Component } from 'react'
import { View, TouchableOpacity, TextInput, StyleSheet, Text } from 'react-native'
import axios from 'axios';
import Context from '../../context/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class Login extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            username : '',
            password : '',
            loading : false,
            error: null,
        }
        this.onSignIn = this.onSignIn.bind(this)
    }
    storeData = async (value) => {
      try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('@user', jsonValue)
      } catch (e) {
        // saving error
        console.log("error in saving")
      }
    }
   
    onSignIn() {
        const {
            username, password
        } = this.state;
        this.setState({loading: true})
        this.setState({error: null})
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/user/',
            data: {
              uname: username,
              password: password
            }
          }).then(
            response => {
              this.setState({loading: false})
              this.context.addUser(response.data.user)
              console.log("im logging user in context")
              console.log(this.context.user)
              this.storeData(response.data.user)
              this.props.navigation.navigate("Main")
            }
          ).catch(
            error => {
              console.log("error in axios")
              this.setState({loading: false})
              /*
              if (error.response.status === 401) this.setState({error: error.response.data.message}); 
              else this.setState({error: "Something went wrong. Please try again later."}); */
              this.setState({error: "Something went wrong. Please try again later."});
            }
          )
    }
    
    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    placeholder = "Username"
                    onChangeText = {(username) => this.setState({ username })} 
                    style = {styles.input}
                    />
                
                <TextInput
                    placeholder = "Password"
                    secureTextEntry = {true}
                    onChangeText = {(password) => this.setState({ password })} 
                    style = {styles.input}
                    />
                
                <TouchableOpacity style={styles.button} onPress = {this.onSignIn} disabled={this.state.loading}  >
                  <Text style={{color: 'white'}}>{this.state.loading ? "Loading..." : "Login"}</Text>
                </TouchableOpacity> 
                
            </View>
        )
    }
}
//{this.state.error && <><Text style={{ color: 'red' }}>{this.state.error}</Text></>}
const styles = StyleSheet.create({
  container : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
    backgroundColor : 'darkgrey'
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
  input: {
    height: 40,
    width: 400,
    margin: 12,
    borderWidth: 1,
    backgroundColor: 'white',
  },
});
export default Login
