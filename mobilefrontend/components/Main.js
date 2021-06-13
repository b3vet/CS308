import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Entypo } from '@expo/vector-icons';
import Home from './main/Home'
import AllProducts from './main/AllProducts'
import Dashboard from './main/Dashboard'
import CartStack from './main/CartStack';
import Search from './main/Search';
import Context from '../context/Context';
import { FontAwesome } from '@expo/vector-icons'; 

const Tab = createMaterialBottomTabNavigator()
const EmptyScreen = () => {
    return null
}
export class Main extends Component {

    static contextType = Context;
    componentDidMount() {
        //will add stuff here 
    }
    
    render() {
        return (       
            <Tab.Navigator initialRouteName="Home" labeled = {true} barStyle={{ backgroundColor: '#000' }}
                
            >
                <Tab.Screen name = "Home" component={Home} 
                    options={{
                        tabBarIcon: ((color, size) =><Entypo name="home" size={24} color="white" />),
                        tabBarLabel: <Text style={{color: 'white'}}>Home</Text>
                    }}
                    
                />   
                <Tab.Screen name = "Products" component={AllProducts}
                    options={{
                        tabBarIcon: ((color, size) =><Entypo name="shopping-bag" size={24} color="white" />),
                        tabBarLabel: <Text style={{color: 'white'}}>Product</Text>
                    }}
                    
                />
                <Tab.Screen name = "Search" component={Search}
                    initialParams= {{user:this.context.user}}
                    options={{
                        tabBarIcon: ((color, size) =><Entypo name="magnifying-glass" size={24} color="white" />),
                        tabBarLabel: <Text style={{color: 'white'}}>Search</Text>,
                        
                    }}
                    
                />
                <Tab.Screen name = "CartStack" component={CartStack}
                    options={{
                        tabBarIcon: ({color, size}) => ( 
                            <Entypo name="shopping-cart" size={24} color="white" />
                        ),
                        tabBarLabel: <Text style={{color: 'white'}}>Cart</Text>  ,
                        
                    }}
                    navigation={this.props.navigation}
                    
                />
                <Tab.Screen name = "DashboardStack" component={Dashboard}
                    options={{
                        tabBarIcon: ({color, size}) => ( 
                            <FontAwesome name="user" size={24} color="white" />
                        ), 
                        tabBarLabel: <Text style={{color: 'white'}}>Profile</Text> 
                    }}
                    
                />
            </Tab.Navigator>
            
        )
    }
}
export default Main

/* <Tab.Screen name = "Search" component={SearchScreen} navigation = {this.props.navigation}
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name = "magnify" color = {color} size = {26} />
                        ),  
                    }}
                />
                <Tab.Screen name = "AddContainer" component={EmptyScreen} 
                    listeners={({ navigation}) => ({ 
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Add")
                        }
                    })}
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name = "plus-box" color = {color} size = {26} />
                        ),  
                    }}
                />
                <Tab.Screen name = "Profile" component={ProfileScreen}
                    listeners={({ navigation}) => ({ 
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Profile", {uid: firebase.auth().currentUser.uid})
                        }
                    })} 
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name = "account-circle" color = {color} size = {26} />
                        ),  
                    }}
                />
 saving these just in case               */