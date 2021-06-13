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
          this.props.navigation.navigate("ProductsList", {caid:4, name: "Wedding Rings", user: this.context.user})
        }}>
        <Text style={styles.text}>Wedding Rings</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style = {styles.button}
        onPress = {() => {
          
          this.props.navigation.navigate("ProductsList", {caid:5, name: "Engagement Rings", user: this.context.user})
        }}>
        <Text style={styles.text}>Engagement Rings</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style = {styles.button}
        onPress = {() => {
          this.props.navigation.navigate("ProductsList", {caid:6, name : "Necklaces", user: this.context.user})
        }}>
        <Text style={styles.text}>Necklaces</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style = {styles.button}
        onPress = {() => {
          
          this.props.navigation.navigate("ProductsList",{caid:7, name :"Bracelets", user: this.context.user})
        }}>
        <Text style={styles.text}>Bracelets</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style = {styles.button}
        onPress = {() => {
          this.props.navigation.navigate("ProductsList", {caid:8, name : "Earrings", user: this.context.user})
        }}>
        <Text style={styles.text}>Earrings</Text>
      </TouchableOpacity>
      
      </View>
      )
    }

    
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-evenly",
      alignItems: "center",
      paddingHorizontal: 10
    },
    button: {
      alignItems: "center",
      backgroundColor: "#DDDDDD",
      padding: 10
    },
    button : {
      width: '100%',
      height: 120,
      backgroundColor: 'black',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      borderRadius: 10,
      
  },
    text: {
      alignItems: "center",
      padding: 10, 
      color: 'white',
      fontSize: 20
    }
  });

  export default Categories