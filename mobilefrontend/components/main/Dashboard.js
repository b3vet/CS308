//home
import React,{Component} from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Button } from 'react-native'
import Context from '../../context/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
export class Home extends Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
      user: '',
    }
  }
  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user')
      if(value !== null) {
        // value previously stored
        return value
      }
      else {
        return 'not stored'
      }
    } catch(e) {
      // error reading value
      console.log("could not get user")
    }
  }
  async componentDidMount() {
    const data = await this.getData()
    if (data != 'not stored') {
      this.context.addUser(JSON.parse(data))
      this.setState({user: this.context.user[0].name})
      console.log("adim budur")
      console.log(this.context.user[0].name)
    } 
    else {
      console.log("not stored")
    }
  }
  /*
  getUsersName() { //not exactly name but still okay
    this.setState({user: this.context.user[0].name}) 
  }
  componentDidMount() {
    this.getUsersName()
  }
  */
 removeValue = async () => {
  try {
    await AsyncStorage.removeItem('@user')
  } catch(e) {
    // remove error
    console.log("cannot remove")
  }

  console.log('Done.')
}
  render() {
    return (
      <View style = {styles.container}>
      <View style = {styles.text}><Text > Welcome {this.state.user}</Text></View>
      <TouchableOpacity 
        style = {styles.button}
        onPress = {() => {
          this.context.removeUser();
          this.removeValue();
          this.props.navigation.navigate("Landing")
        }}>
        <Text>Sign Out</Text>
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

  export default Home