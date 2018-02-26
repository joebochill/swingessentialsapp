import React from 'react'
import { Text, View, Image } from 'react-native'
import { DrawerItems } from 'react-navigation'
import {connect} from 'react-redux';

import {colors, spacing} from '../styles/index';
import logo from '../images/logo-big.png';

import CardRow from './Card/CardRow';


function mapStateToProps(state){
    return {
        // username: state.userData.username
    };
}

class CustomDrawer extends React.Component {
  render() {
    return (
        <View style={{flex: 1, backgroundColor: colors.backgroundGrey}}>
            <View style={{height:80, padding: spacing.normal, paddingTop: spacing.large, paddingBottom: 0, backgroundColor: colors.purple}}>
                <Image
                    //resizeMode='contain'
                    resizeMethod='resize'
                    style={{width: '100%', height: '100%', resizeMode: 'contain'}}
                    source={logo}
                />
            </View>
            <View style={{height: spacing.large, alignItems: 'center', justifyContent:'center', backgroundColor: colors.purple}}><Text style={{color:colors.white}}>{'Welcome, joebochill!'}</Text></View>
            <View style={{flex: 1, justifyContent:'space-between'}}>
                <View style={{marginTop: spacing.normal}}>
                    <CardRow menuItem primary="Your Lessons" action={() => alert('menu navigation')}/>
                    <CardRow menuItem primary="Submit Your Swing" action={() => alert('menu navigation')}/>
                    <CardRow menuItem primary="Order Lessons" action={() => alert('menu navigation')}/>
                    <CardRow menuItem primary="Settings" action={() => alert('menu navigation')}/>
                </View>
                <View style={{marginBottom: spacing.normal}}>
                    <CardRow menuItem primary="About" secondary="v1.0.1" action={() => alert('menu navigation')}/>
                    <CardRow menuItem primary="Contact Us" action={() => alert('menu navigation')}/>
                    <CardRow menuItem primary="View Website" action={() => alert('menu navigation')}/>
                </View>
            </View>
        </View>
    )
  }
}

export default connect(mapStateToProps)(CustomDrawer);