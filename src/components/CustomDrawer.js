import React from 'react'
import { Alert, Text, View, Image, Linking } from 'react-native'
import {connect} from 'react-redux';
import {requestLogout} from '../actions/LoginActions';

import {colors, spacing} from '../styles/index';
import logo from '../images/logo-big.png';

import CardRow from './Card/CardRow';


function mapStateToProps(state){
    return {
        username: state.userData.username,
        token: state.login.token,
        lessons: state.lessons.pending
    };
}

function mapDispatchToProps(dispatch){
    return {
        requestLogout: (token) => dispatch(requestLogout(token))
    }
}

class CustomDrawer extends React.Component {
    
  render() {
    return (
        <View style={{flex: 1, backgroundColor: colors.backgroundGrey}}>
            <View style={{height:80, padding: spacing.normal, paddingTop: spacing.large, paddingBottom: 0, backgroundColor: colors.lightPurple}}>
                <Image
                    //resizeMode='contain'
                    resizeMethod='resize'
                    style={{width: '100%', height: '100%', resizeMode: 'contain'}}
                    source={logo}
                />
            </View>
            <View style={{height: spacing.large, alignItems: 'center', justifyContent:'center', backgroundColor: colors.lightPurple}}>
                <Text style={{color:colors.white, marginTop:-1*spacing.large}}>{this.props.username ? 'Welcome, ' + this.props.username + '!' : ''}</Text>
            </View>
            <View style={{flex: 1, justifyContent:'space-between'}}>
                {this.props.token && 
                    <View style={{marginTop: spacing.normal}}>
                        <CardRow menuItem primary="Your Lessons" 
                            customStyle={{borderTopWidth: 1}}
                            action={() => this.props.navigation.navigate('Lessons')}/>
                        <CardRow menuItem primary="Submit Your Swing" 
                            action={() => {
                                if(this.props.lessons.length < 1){
                                    this.props.navigation.navigate('Redeem');
                                }
                                else{
                                    Alert.alert(
                                        'Swing Analysis Pending',
                                        'You already have a swing analysis in progress. Please wait for that analysis to finish before submitting a new swing. We guarantee a 48-hour turnaround on all lessons.',
                                        [{text: 'OK'}]
                                    );
                                }
                            }}
                        />
                        <CardRow menuItem primary="Order Lessons" 
                            action={() => this.props.navigation.navigate('Order')}/>
                        <CardRow menuItem primary="Sign Out" 
                            action={() => this.props.requestLogout(this.props.token)}/>
                    </View>
                }
                {!this.props.token && <View></View>}
                <View style={{marginBottom: spacing.normal}}>
                    <CardRow menuItem primary="Settings" 
                        customStyle={{borderTopWidth: 1}}
                        action={() => this.props.navigation.navigate('Settings')}/>
                    <CardRow menuItem primary="Help" 
                        action={() => this.props.navigation.navigate('Help')}/>
                    <CardRow menuItem primary="About" secondary="v1.0.1" 
                        action={() => this.props.navigation.navigate('About')}/>
                    <CardRow menuItem primary="View Website" 
                        action={() =>Linking.openURL('https://www.swingessentials.com')}/>
                </View>
            </View>
        </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomDrawer);