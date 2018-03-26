import React from 'react';
import {connect} from 'react-redux';

import { 
  View, 
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  Platform
} from 'react-native';
import {FormLabel, Header} from 'react-native-elements';
import styles, {colors, spacing, altStyles} from '../../styles/index';
import CardRow from '../Card/CardRow';
import {putSettings} from '../../actions/UserDataActions';

function mapStateToProps(state){
  return {
    token: state.login.token,
    setting: state.settings.selected,
    settings: state.settings
  };
}
function mapDispatchToProps(dispatch){
  return {
    updateSettings: (settings, token) => {dispatch(putSettings(settings, token));}
  };
}

class SettingScreen extends React.Component{
  constructor(props){
    super(props);
    this.descriptions = {
      Overlay: 'Overlay shows an image of how you should stand while recording your swing',
      Delay: 'How long to wait between pressing record and the start of the recording',
      Duration: 'How long to record for each swing',
      Handedness: 'Your dominant hand for golfing'
    };
    this.durations = [3,4,5,6,7,8,9,10];
    this.delays = [0,1,2,3,4,5,6,7];
    this.hands = ['Right', 'Left'];
    this.state={
      value: props.settings[props.setting.toLowerCase()]
    };
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

  _getNewSettingsObject(){
    switch(this.props.setting){
      case 'Handedness':
        return {handed: this.state.value.toLowerCase()};
      case 'Duration':
        return {camera_duration: this.state.value};
      case 'Delay':
        return {camera_delay: this.state.value};
      case 'Overlay':
        return {camera_overlay: this.state.value}
      default:
        return {};
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
            //innerContainerStyles={{alignItems: Platform.OS === 'ios' ? 'flex-end' : 'center'}}
            leftComponent={{ icon: 'arrow-back',underlayColor:colors.transparent,containerStyle:styles.headerIcon, color: colors.white, 
              onPress: () => {
                this.props.updateSettings(this._getNewSettingsObject(),this.props.token);
                this.props.navigation.pop();
              }
            }}
            centerComponent={{ text: this.props.setting, style: { color: colors.white, fontSize: 18 } }}
        />
        <ScrollView contentContainerStyle={{alignItems: 'stretch'}}>
          {this.props.setting === 'Overlay' && 
            <View style={{paddingTop: spacing.normal}}>
              <CardRow 
                customStyle={{borderTopWidth: 1}}
                primary={this.props.setting} 
                secondaryInput={
                  <Switch 
                    value={this.state.value} 
                    onValueChange={(val) => this.setState({value: val})}
                    onTintColor={colors.lightPurple}
                  />
                } 
              />
              <Text style={StyleSheet.flatten([styles.paragraph, {
                  marginTop: spacing.small,
                  paddingLeft: spacing.normal, 
                  paddingRight: spacing.normal
                }])}>
                {this.descriptions[this.props.setting]}
              </Text>
            </View>
          }
          {this.props.setting === 'Duration' && 
            <View style={{paddingTop: spacing.normal}}>
              {this.durations.map((item,index) => 
                <CardRow key={'row_'+index}
                  customStyle={
                    index === 0 ? {borderTopWidth: 1} : {}}
                  primary={item+'s'} 
                  menuItem
                  selected={this.state.value === item}
                  action={()=>this.setState({value: item})}
                />
              )}
              <Text style={StyleSheet.flatten([styles.paragraph, {
                  marginTop: spacing.small,
                  paddingLeft: spacing.normal, 
                  paddingRight: spacing.normal
                }])}>
                {this.descriptions[this.props.setting]}
              </Text>
            </View>
          }
          {this.props.setting === 'Delay' && 
            <View style={{paddingTop: spacing.normal}}>
              {this.delays.map((item,index) => 
                <CardRow key={'row_'+index}
                  customStyle={
                    index === 0 ? {borderTopWidth: 1} : {}}
                  primary={item+'s'} 
                  menuItem
                  selected={this.state.value === item}
                  action={()=>this.setState({value: item})}
                />
              )}
              <Text style={StyleSheet.flatten([styles.paragraph, {
                  marginTop: spacing.small,
                  paddingLeft: spacing.normal, 
                  paddingRight: spacing.normal
                }])}>
                {this.descriptions[this.props.setting]}
              </Text>
            </View>
          }
          {this.props.setting === 'Handedness' && 
            <View style={{paddingTop: spacing.normal}}>
              {this.hands.map((item,index) => 
                <CardRow key={'row_'+index}
                  customStyle={
                    index === 0 ? {borderTopWidth: 1} : {}}
                  primary={item} 
                  menuItem
                  selected={this.state.value === item}
                  action={()=>this.setState({value: item})}
                />
              )}
              <Text style={StyleSheet.flatten([styles.paragraph, {
                  marginTop: spacing.small,
                  paddingLeft: spacing.normal, 
                  paddingRight: spacing.normal
                }])}>
                {this.descriptions[this.props.setting]}
              </Text>
            </View>
          }
          
        </ScrollView>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);
