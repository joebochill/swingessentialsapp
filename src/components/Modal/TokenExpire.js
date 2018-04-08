import React from 'react';
import { Text, View, TouchableHighlight, StyleSheet, Modal } from 'react-native';
import {Button} from 'react-native-elements';
import styles, {colors, spacing} from '../../styles/index';
import {connect} from 'react-redux';
import {atob} from '../../utils/base64';
import {refreshToken, requestLogout, showLogoutWarning} from '../../actions/LoginActions';

import MaterialIcons from 'react-native-vector-icons/Ionicons';
import { REFRESH_TOKEN } from '../../actions/LoginActions';

function mapStateToProps(state){
    return {
        token: state.login.token
    };
}
function mapDispatchToProps(dispatch){
    return {
        dispatch: action => action,
        refreshToken: (token) => {dispatch(refreshToken(token))},
        logout: (token) => {dispatch(requestLogout(token))},
        showLogoutWarning: (show) => dispatch(showLogoutWarning(show))
    };
}

class TokenExpireModal extends React.Component {
    constructor(props){
        super(props);
        this.state={
            visible: true,
            time: ''
        };
    }
    componentWillMount(){
        if(this.props.token){
            this.exp = JSON.parse(atob(this.props.token.split('.')[1])).exp;
            this._checkTokenTimeout();
            this.tokenTimer = setInterval(() => this._checkTokenTimeout(), 1000);
        }
    }
    componentWillUnmount(){
        if(this.tokenTimer){clearInterval(this.tokenTimer);}
    }
    _cancel(){
        this.props.showLogoutWarning(false);
    }
    
    _okay(){
        this.props.refreshToken(this.props.token);
        this._cancel();
    }
      // Periodically checks the token timeout and will show a renew dialog if the time is < 5 minutes, < 2 minutes
    _checkTokenTimeout(){
        if(!this.props.token){
            if(this.tokenTimer){clearInterval(this.tokenTimer);}
            return;
        }
        let remaining = this.exp - Date.now()/1000;

        if(remaining <= 0){
            if(this.tokenTimer){clearInterval(this.tokenTimer);}
            this.props.logout();
            return;
        }

        let min = Math.floor(remaining/60);
        min = (min < 10) ? '0' + min : min;
        let sec = Math.floor(remaining-min*60);
        sec = (sec < 10) ? '0' + sec : sec;

        remaining = min + ':' + sec;
        this.setState({time: remaining});
    }
    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.visible}
                onRequestClose={this._cancel.bind(this)}
            >
                <View style={{
                    flex: 1, 
                    padding: spacing.normal, 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.55)'
                }}>
                    <View style={{
                        flex: 0, 
                        alignItems: 'stretch', 
                        backgroundColor: colors.backgroundGrey,
                        borderWidth: 1,
                        borderColor: colors.purple
                    }}>
                        <View style={{padding: spacing.normal, paddingBottom: 0}}>
                            <Text style={{fontWeight: 'bold', color: colors.purple}}>{'Session Expiration In: ' + this.state.time}</Text>
                        </View>
                        <View style={{padding: spacing.normal}}>
                            <Text style={{color: colors.purple}}>Your session is about to expire. Click below to stay logged in.</Text>
                            <Button
                                title="KEEP ME LOGGED IN"
                                onPress={this._okay.bind(this)}
                                buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal, marginLeft: 0}])}
                                containerViewStyle={StyleSheet.flatten([styles.buttonContainer, {marginLeft: 0, marginRight: 0, alignSelf: 'center'}])}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TokenExpireModal);