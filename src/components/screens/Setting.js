import React from 'react';
import {connect} from 'react-redux';

import { 
  View, 
  Text,
  ScrollView,
  StyleSheet,
  Switch, Picker
} from 'react-native';
import {FormLabel, Header} from 'react-native-elements';
import styles, {colors, spacing, altStyles} from '../../styles/index';
import CardRow from '../Card/CardRow';

function mapStateToProps(state){
  return {
    setting: state.settings.selected
  };
}
function mapDispatchToProps(dispatch){
  return {};
}

class SettingScreen extends React.Component{
  constructor(props){
    super(props);
    this.descriptions = {
      Overlay: 'Overlay shows an image of how you should stand while recording your swing',
      Delay: 'How many seconds to wait between pressing record and the start of the recording',
      Duration: 'How many seconds to record for your swing',
      Handedness: 'Which is your dominant hand for golfing'
    };
    this.state={
      value: true
    };
  }

  componentWillReceiveProps(nextProps){

  }

  render(){
    return (
      <View style={{backgroundColor: colors.backgroundGrey, flexDirection: 'column', flex: 1}}>
        <Header
            style={{flex: 0}}
            outerContainerStyles={{ backgroundColor: colors.lightPurple}}
            leftComponent={{ icon: 'arrow-back',underlayColor:colors.transparent,containerStyle:styles.headerIcon, color: colors.white, 
              onPress: () => this.props.navigation.pop()}}//this.props.navigation.dispatch(NavigationActions.back({key:this.props.navigation.state.key})) }}
            // leftComponent={
            //   <TouchableOpacity style={{backgroundColor: colors.red}} onPress={()=>this.props.navigation.pop()}>
            //     <Text style={{color: colors.white, fontSize: 18}}>Backwards Oy</Text>
            //   </TouchableOpacity>
            // }
            centerComponent={{ text: this.props.setting, style: { color: colors.white, fontSize: 18 } }}
        />
        <ScrollView contentContainerStyle={{alignItems: 'stretch'}}>
          {this.props.setting === 'Overlay' && 
            <View>
              <CardRow 
                customStyle={{marginTop: spacing.normal, marginBottom: spacing.small, borderTopWidth: 1}}
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
                  paddingLeft: spacing.normal, 
                  paddingRight: spacing.normal
                }])}>
                {this.descriptions[this.props.setting]}
              </Text>
            </View>
          }
          {this.props.setting === 'Duration' && 
            <View>
              <CardRow 
                customStyle={{marginTop: spacing.normal, marginBottom: spacing.small, borderTopWidth: 1}}
                primary={this.props.setting} 
                secondaryInput={
                  <Picker
                    selectedValue={this.state.value}
                    onValueChange={(itemValue, itemIndex) => this.setState({value: itemValue})}>
                    <Picker.Item label="3s" value={3} />
                    <Picker.Item label="4s" value={4} />
                    <Picker.Item label="5s" value={5} />
                    <Picker.Item label="6s" value={6} />
                    <Picker.Item label="7s" value={7} />
                    <Picker.Item label="8s" value={8} />
                    <Picker.Item label="9s" value={9} />
                    <Picker.Item label="10s" value={10} />
                  </Picker>
                } 
              />
              <Text style={StyleSheet.flatten([styles.paragraph, {
                  paddingLeft: spacing.normal, 
                  paddingRight: spacing.normal
                }])}>
                {this.descriptions[this.props.setting]}
              </Text>
            </View>
          }
          {this.props.setting === 'Delay' && 
            <View>
              <CardRow 
                customStyle={{marginTop: spacing.normal, marginBottom: spacing.small, borderTopWidth: 1}}
                primary={this.props.setting} 
                secondaryInput={
                  <Picker
                    selectedValue={this.state.value}
                    onValueChange={(itemValue, itemIndex) => this.setState({value: itemValue})}>
                    <Picker.Item label="0s" value={0} />
                    <Picker.Item label="1s" value={1} />
                    <Picker.Item label="2s" value={2} />
                    <Picker.Item label="3s" value={3} />
                    <Picker.Item label="4s" value={4} />
                    <Picker.Item label="5s" value={5} />
                    <Picker.Item label="6s" value={6} />
                    <Picker.Item label="7s" value={7} />
                    <Picker.Item label="8s" value={8} />
                    <Picker.Item label="9s" value={9} />
                    <Picker.Item label="10s" value={10} />
                  </Picker>
                } 
              />
              <Text style={StyleSheet.flatten([styles.paragraph, {
                  paddingLeft: spacing.normal, 
                  paddingRight: spacing.normal
                }])}>
                {this.descriptions[this.props.setting]}
              </Text>
            </View>
          }
          {this.props.setting === 'Handedness' && 
            <View>
              <CardRow 
                customStyle={{marginTop: spacing.normal, marginBottom: spacing.small, borderTopWidth: 1}}
                primary={this.props.setting} 
                secondaryInput={
                  <Picker
                    selectedValue={this.state.value}
                    onValueChange={(itemValue, itemIndex) => this.setState({value: itemValue})}>
                    <Picker.Item label="Right" value={'Right'} />
                    <Picker.Item label="Left" value={'Left'} />
                  </Picker>
                } 
              />
              <Text style={StyleSheet.flatten([styles.paragraph, {
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
