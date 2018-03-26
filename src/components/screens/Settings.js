import React from 'react';
import {connect} from 'react-redux';

import { 
  View, 
  Text,
  ScrollView,
  StyleSheet,
  Platform
} from 'react-native';
import {FormLabel, Header} from 'react-native-elements';
import styles, {colors, spacing, altStyles} from '../../styles/index';
import CardRow from '../Card/CardRow';

function mapStateToProps(state){
  return {
    token: state.login.token,
    settings: state.settings
  };
}
function mapDispatchToProps(dispatch){
  return {};
}

class SettingsScreen extends React.Component{
  constructor(props){
    super(props);
    this.state={};
  }

  componentDidMount(){
    if(!this.props.token){
        this.props.navigation.navigate('Login');
    }
  }
  componentWillReceiveProps(nextProps){
    if(!nextProps.token){
        this.props.navigation.navigate('Login');
    }
  }

  render(){
    return (
      <View style={{backgroundColor: colors.backgroundGrey, flexDirection: 'column', flex: 1}}>
        <Header
            style={{flex: 0}}
            outerContainerStyles={{ 
              backgroundColor: colors.lightPurple, 
              height: Platform.OS === 'ios' ? 70 :  70 - 24, 
              padding: Platform.OS === 'ios' ? 15 : 10
            }}
            innerContainerStyles={{alignItems: Platform.OS === 'ios' ? 'flex-end' : 'center'}}
            leftComponent={{ icon: 'arrow-back',underlayColor:colors.transparent,containerStyle:styles.headerIcon, color: colors.white, 
              onPress: () => this.props.navigation.pop()}}//this.props.navigation.dispatch(NavigationActions.back({key:this.props.navigation.state.key})) }}
            centerComponent={{ text: 'Settings', style: { color: colors.white, fontSize: 18 } }}
        />
        <ScrollView contentContainerStyle={{alignItems: 'stretch'}}>
          <FormLabel 
            containerStyle={StyleSheet.flatten([styles.formLabelContainer, {
              marginTop: spacing.normal,
              marginBottom: spacing.small, 
              paddingLeft: spacing.normal, 
              paddingRight: spacing.normal
            }])}
            labelStyle={StyleSheet.flatten([styles.formLabel])}>
            User Settings
          </FormLabel>
          <CardRow 
            customStyle={{borderTopWidth: 1}}
            primary="Handedness" 
            secondary={this.props.settings.handedness} 
            action={() => {
              this.props.navigation.dispatch({type:'SELECT_SETTING', data:{setting:'Handedness'}});
              this.props.navigation.push('Setting')
            }}
          />
          <FormLabel 
            containerStyle={StyleSheet.flatten([styles.formLabelContainer, {
              marginTop: spacing.normal, 
              marginBottom: spacing.small,
              paddingLeft: spacing.normal, 
              paddingRight: spacing.normal
            }])}
            labelStyle={StyleSheet.flatten([styles.formLabel])}>
            Camera Settings
          </FormLabel>
          <CardRow 
            customStyle={{borderTopWidth: 1}}
            primary="Duration" 
            secondary={this.props.settings.duration + 's'} 
            action={() => {
              this.props.navigation.dispatch({type:'SELECT_SETTING', data:{setting:'Duration'}});
              this.props.navigation.push('Setting')
            }}
          />
          <CardRow 
            primary="Delay" 
            secondary={this.props.settings.delay + 's'} 
            action={() => {
              this.props.navigation.dispatch({type:'SELECT_SETTING', data:{setting:'Delay'}});
              this.props.navigation.push('Setting')
            }}
          />
          <CardRow 
            primary="Overlay" 
            secondary={this.props.settings.overlay ? 'On':'Off'} 
            action={() => {
              this.props.navigation.dispatch({type:'SELECT_SETTING', data:{setting:'Overlay'}});
              this.props.navigation.push('Setting')
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
