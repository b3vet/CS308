import React from 'react';
import Context from './Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class GlobalState extends React.Component{
    state = {
        user: [],
        tokens: []
    }
    
    addUser = (user) => {
        const list = [user];
        this.setState({user: list});
    };
    
    addTokens = (refresh,access) => {
        const list = [refresh,access];
        this.setState({tokens: list});
    }
    removeValue = async () => {
        try {
          await AsyncStorage.removeItem('@user')
        } catch(e) {
          // remove error
        }
    }
    removeUser = () => {
        this.setState({user : []});
        this.removeValue();

    };
    render(){
        return (
            <Context.Provider 
            value={{
                user: this.state.user,
                tokens: this.state.tokens,
                addTokens: this.addTokens,
                addUser: this.addUser,
                removeUser: this.removeUser
            }}
            >
            {this.props.children}
            </Context.Provider>
            );
        }
    }