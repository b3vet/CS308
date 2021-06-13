import React, { Component } from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import { Text, StyleSheet, View, Image, TouchableOpacity,  Modal, Dimensions, TextInput } from 'react-native'
import axios from 'axios';
import Context from '../../context/Context';
import * as WebBrowser from 'expo-web-browser';
class AccordionView extends Component {
  state = {
    
    activeSections: [],
    modalVisible: false,
    returningPid: -1,
    returningOid: -1, 
    reason: '',
  };
  static contextType = Context;
  
  componentDidMount() {
    this.setState({reload: false})
  }
  _renderSectionTitle = (section) => {
    return null
  };
  
  _renderHeader = (order) => {
      console.log(order)
      let total = 0;
      let d = new Date(order.date)

    for (var i = 0; i < order.connection.length; i++) { 
        total+=order.connection[i].orderedPrice
    }
    return (
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <View style={{flex:1, justifyContent: 'space-evenly', flexDirection:'column'}}>
              <Text>Order ID: {order.oid}</Text>
              <Text>Date: {d.toLocaleDateString("en-US")}</Text>
          </View>
        <Text style={{flex: 2, fontSize: 20, fontWeight: 'bold'}}>{total}$</Text>
        </View>
        {
          order.delivery != "Order is completed!" ? 
          <Text style={{flex: 1, color: 'orange'}}>{order.delivery}</Text>
          :
          <Text style={{flex: 1, color: 'green'}}>{order.delivery}</Text>
        }
       
      </View>
    );
  };
  openPDF = async (oooid) => {
       
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/api/invoice/',
      data: {oid: oooid}
    })
        .then(async (response) => {
          console.log(response.data)
        
          let result = await WebBrowser.openBrowserAsync("http://127.0.0.1:8000"+response.data.pdf, {
            controlsColor: "#000",

          });
          
          
        })
        .catch(err => {
          if(err.response) {
            
            console.log(err.response.data)
          }
          else {
            
            console.log(err.message)
          }
          
          
        })
    
  }
  
  _renderContent = (order) => {
    
    return (
        <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput placeholder={"Reason to return"} onChangeText={(reason) => this.setState({reason})} style={styles.input} multiline={true}></TextInput>
              <TouchableOpacity onPress={() => {this.props.returnOrder(this.state.returningPid, this.state.returningOid, this.state.reason);this.setState({modalVisible: false});}} style={styles.submitButton}><Text style={{color: 'white'}}>Submit</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        {
            order.connection.map(ohp => {
                return(
                  
                    <View style={styles.content}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', height: '100%'}}>
                    <View style={{flex:1}}>
                        <Image style={{height: 80, width: 80}} source={{uri: 'http://127.0.0.1:8000'+ohp.product.image,}}/>
                        <Text>{ohp.product.name}</Text>
                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{ohp.orderedPrice}$</Text>
                    </View>
                    {ohp.status !== "DELIVERED" ? (
                        ohp.status !== "CANCELED" && ohp.status !== "RETURNED" ?
                        <View style={{flex:1, backgroundColor: 'rgba(255,128,0, .3)', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                            <Text>Status: {ohp.status}</Text>
                            {ohp.status !== "IN-TRANSIT" ? (ohp.status == "IN-REVIEW" ? <></> : <TouchableOpacity onPress={() => this.props.cancelOrder(ohp.product.pid, ohp.oid)} style={styles.button}><Text>Cancel Order</Text></TouchableOpacity>) : 
                            <TouchableOpacity style={styles.button}><Text>Track Delivery</Text></TouchableOpacity>
                            }  
                        </View> :
                        <View style={{flex:1, height: '100%', backgroundColor: 'rgba(255,0,0, .3)', alignItems: 'center', justifyContent: 'center'}}>
                            <Text>Status: {ohp.status}</Text>
                            
                        </View>
                        )
                        : 
                        <View style={{flex:1, backgroundColor: 'rgba(51,255,51, .3)', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                            <Text>Status: {ohp.status}</Text>
                            <TouchableOpacity onPress={() => this.setState({modalVisible: true, returningPid: ohp.pid, returningOid: order.oid})} style={styles.button}><Text>Return This Product</Text></TouchableOpacity>
                        </View> 
                        
                    }
                    
                    </View>
                    </View>
                    
                    
                )
            })
        }
        <TouchableOpacity onPress={() => this.openPDF(order.oid)} style={styles.invoiceButton}><Text>See Invoice</Text></TouchableOpacity> 
        </View>    
    );
  };

  _updateSections = (activeSections) => {
    this.setState({ activeSections });
  };
 
  render() {
  
      return (
        <Accordion
          sections={this.props.sections}
          activeSections={this.state.activeSections}
          renderSectionTitle={this._renderSectionTitle}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          onChange={this._updateSections}
        />
      );
    }
}
const styles = StyleSheet.create({
    header: {
        width: Dimensions.get('window').width - 10,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    headerWrapper: {
      width: Dimensions.get('window').width - 10,
      height: 130,
      borderRadius: 10,
      shadowColor: 'rgba(0,0,0, .4)', // IOS
      shadowOffset: { height: 1, width: 1 }, // IOS
      shadowOpacity: 1, // IOS
      shadowRadius: 1, //IOS
      flexDirection: 'column',
      elevation: 2,
      alignItems: 'baseline',
      justifyContent: 'space-evenly',
      backgroundColor: '#fff',
      
      
  },
    content: { 
        height: 130,
        width: Dimensions.get('window').width - 10,
        borderRadius: 10,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        flexDirection: 'column',
        elevation: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    button : { 
        backgroundColor: 'white',
        borderRadius: 50,
        borderStyle: 'solid',
        height: 30,
        width: 150, 
        marginTop: 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'black',
        borderWidth: 1,
    },
    invoiceButton : { 
      backgroundColor: 'white',
      borderRadius: 50,
      borderStyle: 'solid',
      height: 30,
      width: 150, 
      marginTop: 3,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: 'black',
      borderWidth: 1,
      alignSelf: 'center',
      marginTop: 10,
      marginBottom: 10
  },
  submitButton : { 
    backgroundColor: 'white',
    borderRadius: 50,
    borderStyle: 'solid',
    height: 30,
    width: 150, 
    marginTop: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'black'
},
  modalView: {
    height: 300,
    width: 350,
    backgroundColor: "white",
    alignSelf: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "column",
    justifyContent: "space-around",
    
  },
  centeredView: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  input: {
    height: 120,
    width: 300,
    borderStyle: "solid",
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 2,
    marginTop: 30,
  }
   
  
  });
  
export default AccordionView

/* <TouchableOpacity onPress={() => this.props.navigation.navigate("DashboardStack", {screen : "PDFInvoice", params: {oid: ohp.oid}})} style={styles.button}><Text>See Invoice</Text></TouchableOpacity> */