import React,{Component} from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Button } from 'react-native'
import Context from '../../context/Context';
import AsyncStorage from '@react-native-async-storage/async-storage'; //temporary
import axios from 'axios';
import { createStackNavigator } from '@react-navigation/stack';
import UserInfo from './UserInfo'
import DashboardMain from './DashboardMain'
import UserSettings from './UserSettings'
import MyOrders from './MyOrders'
import { MaterialCommunityIcons } from '@expo/vector-icons';
const dashboardStack = createStackNavigator();
const EmptyScreen = () => {
    return null
}

export default function Dashboard({navigation}) {
    return (
      <dashboardStack.Navigator initialRouteName = "Dashboard">
        <dashboardStack.Screen 
            name="Dashboard"
            component={DashboardMain}  
            navigation={navigation}
            options={{
                headerTitle: <Text style={{fontSize: 20}}>Profile</Text>,
                headerLeft: () => <></>,           
                headerRight: () => <><TouchableOpacity style={{marginRight: 10}} onPress={() => navigation.navigate("UserInfo")}><MaterialCommunityIcons name="pencil-plus" size={28} color="black" /></TouchableOpacity></>
        }} />
        
        <dashboardStack.Screen 
            name="UserInfo" 
            component={UserInfo}  
            navigation={navigation}
            options={{
                headerTitle: <Text style={{fontSize: 20}}>Change Info</Text>,
                          
                headerRight: () => <></>
        }}
        />
        <dashboardStack.Screen 
            name="Orders" 
            component={MyOrders}  
            navigation={navigation}
            options={
              { 
                headerTitle: <Text style={{fontSize: 20}}>My Orders</Text> ,
                headerLeft: () => (
                <Button
                    onPress={() => navigation.navigate('DashboardStack', {screen: "Dashboard"})}
                    title="Profile"
                    color="#000" //will change these parts
                />),
              
              
            }
            }
        />
        <dashboardStack.Screen 
          name="Settings" 
          component={UserSettings} 
          navigation={navigation}
        />
        
      </dashboardStack.Navigator>
    );
}
