import React, { Component } from 'react'
import { View, TouchableOpacity, TextInput, Text, StyleSheet, SafeAreaView } from 'react-native'
import axios from 'axios';
export class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email : '',
            password : '',
            name : '',
            surname : '',
            uname : '',
            taxID : '',
            phoneNumber : '',
            loading : false,
            error: null,
        }
        this.onSignUp = this.onSignUp.bind(this)
    }
    onSignUp() {
        const {
            email, password, name, taxID, phoneNumber, surname, uname
        } = this.state;
        this.setState({loading: true})
        this.setState({error: null})
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/register/',
            data: {
                uname: uname,
                password: password,
                name: name,
                surname: surname,
                taxID: taxID,
                email: email,
                phoneNumber: phoneNumber
            }
          }).then(
            response => {
              this.setState({loading: false})
              this.props.navigation.navigate("Login")
              console.log(response.data.user)
              //props.history.push('/dashboard'); no need for sth like this bc app.js will make us go to dashboard
            }
          ).catch(
            error => {
              this.setState({loading: false})
              if (error.response.status === 401) this.setState({error: error.response.data.message});
              else this.setState({error: "Something went wrong. Please try again later."});
            }
          )

    }
    render() {
        return (
            <SafeAreaView style = {styles.container}>
                <TextInput 
                    placeholder = "name"
                    onChangeText = {(name) => this.setState({ name })}
                    style = {styles.input}>
                </TextInput>
                <TextInput 
                    placeholder = "surname"
                    onChangeText = {(surname) => this.setState({ surname })}
                    style = {styles.input}>
                </TextInput>
                <TextInput 
                    placeholder = "username"
                    onChangeText = {(uname) => this.setState({ uname })}
                    style = {styles.input}>
                </TextInput>
                <TextInput 
                    placeholder = "email"
                    onChangeText = {(email) => this.setState({ email })}
                    style = {styles.input}>
                </TextInput>
                <TextInput 
                    placeholder = "password"
                    secureTextEntry = {true}
                    onChangeText = {(password) => this.setState({ password })}
                    style = {styles.input}>
                </TextInput>
                <TextInput 
                    placeholder = "taxID"
                    onChangeText = {(taxID) => this.setState({ taxID })}
                    style = {styles.input}>
                </TextInput>
                <TextInput 
                    placeholder = "phone number"
                    onChangeText = {(phoneNumber) => this.setState({ phoneNumber })}
                    style = {styles.input}>
                </TextInput>
                <TouchableOpacity style={styles.button} onPress = {() => this.onSignUp()} disabled={this.state.loading}  >
                  <Text style={{color: 'white'}}>{this.state.loading ? "Loading..." : "Register"}</Text>
                </TouchableOpacity> 
                
            </SafeAreaView>
        )
    }
}
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
export default Register
