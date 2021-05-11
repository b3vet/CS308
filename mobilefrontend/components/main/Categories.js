//home
import React,{Component} from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Button } from 'react-native'
import Context from '../../context/Context';

export class Categories extends Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount() {
    
  }
  
  render() {
    return (
      <View style = {styles.container}>
      
      <TouchableOpacity 
        style = {styles.button}
        onPress = {() => {
          this.props.navigation.navigate("ProductsList", {caid:4, name: "Wedding Rings"})
        }}>
        <Text>Wedding Rings</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style = {styles.button}
        onPress = {() => {
          
          this.props.navigation.navigate("ProductsList", {caid:5, name: "Engagement Rings"})
        }}>
        <Text>Engagement Rings</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style = {styles.button}
        onPress = {() => {
          this.props.navigation.navigate("ProductsList", {caid:6, name : "Necklaces"})
        }}>
        <Text>Necklaces</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style = {styles.button}
        onPress = {() => {
          
          this.props.navigation.navigate("ProductsList",{caid:7, name :"Bracelets"})
        }}>
        <Text>Bracelets</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style = {styles.button}
        onPress = {() => {
          this.props.navigation.navigate("ProductsList", {caid:8, name : "Earrings"})
        }}>
        <Text>Earrings</Text>
      </TouchableOpacity>
      
      </View>
      )
    }

    
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 10
    },
    button: {
      alignItems: "center",
      backgroundColor: "#DDDDDD",
      padding: 10
    },
    text: {
      alignItems: "center",
      padding: 10
    }
  });

  export default Categories