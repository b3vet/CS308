
import axios from 'axios';
import React,{Component} from 'react'
import { Text, StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import Context from '../../context/Context';
import AccordionView from './OrderAccordion'

export class MyOrders extends Component { 
    static contextType = Context;
    constructor(props) {
      super(props);
      this.state = {
        user: null,
        totalPrice : 0,
        loading: false,
        error: '',
        result: '',
        orders: [],
        reload: false,
      }
      
    }
    returnOrder = (pid, oid, reason) => {
        this.setState({loading: true})
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/refundrequest/',
            data: {
                pid: pid,
                oid: oid,
                reason: reason,
            }
        })
          .then(
            response => {
              console.log(response.data)
              this.setState({orders: response.data.orders, loading: false})
            }
            ).catch(
              error => {
                
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else {
                    console.log('Error', error.message);
                }
                this.setState({loading: false})
              }
            )
      }
      cancelOrder = (pid, oid) => {
        this.setState({loading: true})
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/cancelproductinorder/',
            data: {
                uid: this.context.user.uid,
                pid: pid,
                oid: oid
            }
        })
          .then(
            response => {
              console.log(response.data)
              this.setState({orders: response.data.orders, loading: false})
            }
            ).catch(
              error => {
                
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else {
                    console.log('Error', error.message);
                }
                this.setState({loading: false})
              }
            )
      }
  componentDidMount() {
    
    this.setState({loading: true})
    
    axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/usersorders/',
        data: {uid: this.context.user.uid},
    }).then(
        response => {
            this.setState({orders: response.data, loading: false});
            console.log(orders)
        }).catch(
            error => {
               this.setState({loading: false})
                if (error.response) {
                    console.log(error.response.status);
                    console.log(error.response.data.error);
                } else {
                    console.log('Error', error.message);
                }
            }
            )
  }
    
  

    
render() {
    if(this.state.loading) {
        return (<SafeAreaView style = {{flex: 1, justifyContent: 'center'}}><ActivityIndicator size="large" color="#000" /></SafeAreaView>)
    }
    const orders = this.state.orders
    return(
        <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 5}}>
            <ScrollView horizontal={false}><AccordionView navigation={this.props.navigation} sections={orders} returnOrder={(pid, oid, reason) => this.returnOrder(pid, oid, reason)} cancelOrder={(pid, oid) => this.cancelOrder(pid, oid)}/></ScrollView>
        </View>
             
        
        
    )
}
}
export default MyOrders;

