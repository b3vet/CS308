import React,{Component} from 'react'
import { Text, StyleSheet, View, Button } from 'react-native'
import Context from '../../context/Context';
import AsyncStorage from '@react-native-async-storage/async-storage'; //temporary
import axios from 'axios';
import { createStackNavigator } from '@react-navigation/stack';
import ProductsList from './ProductsList'
import Categories from './Categories'
import Product from './Product'
const productsStack = createStackNavigator();
const EmptyScreen = () => {
    return null
}

export default function AllProducts({navigation}) {
    return (
      <productsStack.Navigator initialRouteName = "Categories">
        <productsStack.Screen 
            name="Categories"
            component={Categories}  
            navigation={navigation}
            initialParams= {{caid:-1}}
            options={{
                headerTitle: <Text>Products</Text>,
                headerLeft: () => <></>
        }} />
        <productsStack.Screen 
            name="ProductsList" 
            component={ProductsList}  
            navigation={navigation}
            initialParams= {{caid:-1}}
            options={
              ({ route }) => ({ 
                title: route.params.name ,
                headerLeft: () => (
                <Button
                    onPress={() => navigation.navigate('Products', {screen: "Categories"})}
                    title="Categories"
                    color="#000" //will change these parts
                />),
              
              
            })
            }
        />
        <productsStack.Screen 
          name="SingleProductPage" 
          component={Product} 
          options={
            ({ route }) => ({ title: route.params.name }),
            { headerShown: false }
          }  
        />
      </productsStack.Navigator>
    );
}
