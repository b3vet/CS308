import React, { Component } from 'react'
import { View, TouchableOpacity, TextInput, Text, StyleSheet, SafeAreaView } from 'react-native'
import Context from '../../context/Context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export class UserInfo extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            email : '',
            password : '',
            name : '',
            surname : '',
            taxID : '',
            phoneNumber : '',
            loading : false,
            error: null,
            user: null,
            result: '',
        }
        this.onSignUp = this.onSubmit.bind(this)
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
    componentDidMount() {
        
      
    }
    
    onSubmit() {
        const {
            email, password, name, taxID, phoneNumber, surname
        } = this.state;
        if (password == '') {
            this.setState({error: "Please enter your old password if you do not want to change your password."})
        }
        else {
        this.setState({loading: true})
        this.setState({error: null})
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/changeuserinfo/',
            data: {
                password: password,
                name: name == '' ? this.context.user.name : name,
                surname: surname == '' ? this.context.user.surname : surname,
                taxID: taxID == '' ? this.context.user.taxID : taxID,
                email: email == '' ? this.context.user.email : email,
                phone: phoneNumber == '' ? this.context.user.phoneNumber : phoneNumber,
                uid: this.context.user.uid
            }
          }).then(
            response => {
              this.setState({loading: false, result: response.data.success})
              this.context.addUser(response.data.user)
              this.storeData(response.data.user)
            }
          ).catch(
            error => {
                this.setState({loading: false})
                if (error.response) {
                  this.setState({error: error.response.data.error})
                  console.log(error.response)
                }
                else this.setState({error: error.message})
              }
          )
        }
    }
    render() {
        const user = this.context.user;
        return (
            <SafeAreaView style = {styles.container}>
                <TextInput 
                    placeholder = "name"
                    onChangeText = {(name) => this.setState({ name })}
                    style = {styles.input}
                    defaultValue={user.name}>
                </TextInput>
                <TextInput 
                    placeholder = "surname"
                    onChangeText = {(surname) => this.setState({ surname })}
                    style = {styles.input}
                    defaultValue={user.surname}>
                </TextInput>
                <TextInput 
                    placeholder = "email"
                    onChangeText = {(email) => this.setState({ email })}
                    style = {styles.input}
                    defaultValue={user.email}>
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
                    style = {styles.input}
                    defaultValue={user.taxID}>
                </TextInput>
                <TextInput 
                    placeholder = "phone number"
                    onChangeText = {(phoneNumber) => this.setState({ phoneNumber })}
                    style = {styles.input}
                    defaultValue={user.phoneNumber}>
                </TextInput>
                <TouchableOpacity style={styles.button} onPress = {() => this.onSubmit()} disabled={this.state.loading}  >
                  <Text style={{color: 'white'}}>{this.state.loading ? "Loading..." : "Change Info"}</Text>
                </TouchableOpacity> 
                {this.state.error ? <><Text style={{color: 'red', fontSize: 12}}>{this.state.error}</Text></> : <></>}
                {this.state.result ? <><Text style={{color: 'green', fontSize: 12}}>{this.state.result}</Text></> : <></>}
                
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
      borderRadius: 10,
    },
  });
export default UserInfo
