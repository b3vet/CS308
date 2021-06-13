//home
import React,{Component} from 'react'
import { Text, StyleSheet, View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native'
import Context from '../../context/Context';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
export class DashboardMain extends Component {
    
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: false,
    }
  }
  load() {
      this.setState({loading: true,user: this.context.user})
      this.setState({loading:false})
  }
   componentDidMount() {
    const unsubscribe = this.props.navigation.addListener('focus', e => {
        this.props.navigation.navigate("Dashboard")
        this.load()
      });
      this.setState({user: this.context.user})
      console.log(this.context.user)
      console.log(this.state.user) 
    
  }
  render() {
    if(this.state.loading) {
      return(<SafeAreaView style = {{flex: 1, justifyContent: 'center'}}><ActivityIndicator size="large" color="#000" /></SafeAreaView>)
    }
    return (
      <SafeAreaView style = {styles.container}>
      <View style = {styles.text}><Text style={styles.banner}> {this.state.user ? this.state.user.name+" "+this.state.user.surname : "HATA"}</Text></View>
      <TouchableOpacity 
        style = {styles.button}
        onPress = { () => {
          this.props.navigation.navigate("Orders")
        }}>
        <Entypo name="newsletter" size={36} color="white" />
        <Text style={{fontSize: 20, color:'white'}}>My Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style = {styles.button}
        onPress = {async () => {
          await this.context.removeUser();
          this.props.navigation.navigate("Landing")
        }}>
        <MaterialCommunityIcons name="logout" size={36} color="white" />
        <Text style={{fontSize: 20, color:'white'}}>Sign Out</Text>
      </TouchableOpacity> 
      
      </SafeAreaView>
      )
    }

    
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-evenly",
      paddingHorizontal: 10
    },
    button: {
      alignItems: "center",
      backgroundColor: "#DDDDDD",
      padding: 10
    },
    text: {
      alignItems: "center",
      padding: 10,
    },
    banner: {
      fontSize: 30, fontWeight: 'bold', textAlign: 'left',
    },
    button : {
      width: '100%',
      height: 120,
      backgroundColor: 'black',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      borderRadius: 10,
      marginVertical: -30,
  },
  signOut : {
    width: '100%',
    height: 50,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50
    
    
}
  });

  export default DashboardMain