import React,{Component} from 'react'
import { Text, StyleSheet, View, Button } from 'react-native'
import Context from '../../context/Context';
import AsyncStorage from '@react-native-async-storage/async-storage'; //temporary
import axios from 'axios';
import { createStackNavigator } from '@react-navigation/stack';
import CartScreen from './Cart'
import Purchase from './Purchase'
import PurchaseSuccess from './PurchaseSuccess'

const cartStack = createStackNavigator();

export default function CartStack({navigation}) {
    return (
      <cartStack.Navigator initialRouteName = "Cart">
        <cartStack.Screen 
            name="Cart"
            component={CartScreen}  
            navigation={navigation}
            options={{
                headerTitle: <Text style={{fontSize: 20}}>Cart</Text>,
                headerLeft: () => <></>
        }} />
        <cartStack.Screen 
            name="Purchase" 
            component={Purchase}  
            navigation={navigation}
            options={
              { 
                headerTitle: <Text style={{fontSize: 20}}>Purchase</Text> ,
                headerLeft: () => (
                <Button
                    onPress={() => navigation.navigate('CartStack', {screen: "Cart"})}
                    title="Cart"
                    color="#000" //will change these parts
                />),
              
              
            }
            }
        />
        <cartStack.Screen 
          name="PurchaseSuccess" 
          component={PurchaseSuccess} 
          options={
            { headerShown: false }
          }  
        />
      </cartStack.Navigator>
    );
}
