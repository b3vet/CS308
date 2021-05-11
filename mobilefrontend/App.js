import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';


import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';
import LoginScreen from './components/auth/Login';
import MainScreen from './components/Main';
import GlobalState from './context/GlobalState';

const Stack = createStackNavigator();
  export class App extends Component {
    
    constructor(props) {
      super(props);
      this.state = {
        loaded: true,
      }
    } 

  
    componentDidMount() {
      //console.log("anana selam soyleeee")
    }
      
    
    
    render() {
      const { loggedIn, loaded } = this.state;
      
      if(!loaded) {
        return(
          <View>
          <Text style = {{ flex:1, justifyContent: 'center'}}> LOADING </Text>
          </View>
          )
      }
      //if(!loggedIn) {
        return (
          <GlobalState>
          <NavigationContainer>
          <Stack.Navigator initialRouteName ="Landing" >
          <Stack.Screen name ="Landing" component={LandingScreen} navigation ={this.props.navigation} options={{headerShown: false}} />
          <Stack.Screen name ="Register" component={RegisterScreen} navigation={this.props.navigation} options={{headerShown: false}}/>
          <Stack.Screen name ="Login" component={LoginScreen} navigation ={this.props.navigation} options={{headerShown: false}}/>
          <Stack.Screen name ="Main" component={MainScreen} options={{headerShown: false}} />
          </Stack.Navigator>
          </NavigationContainer>
          </GlobalState>
          );
          
          }
        }
        
        export default App
        
        
        
