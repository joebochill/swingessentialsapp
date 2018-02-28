import React from 'react';
import {connect} from 'react-redux';

import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  FlatList, 
  StatusBar, 
  TouchableOpacity 
} from 'react-native';
import {Header} from 'react-native-elements';
import { NavigationActions } from 'react-navigation';

import styles, {colors, spacing, altStyles} from '../../styles/index';


function mapStateToProps(state){
  return {};
}

function mapDispatchToProps(dispatch){
  return {};
}

class Settings extends React.Component{
  constructor(props){
    super(props);
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
            centerComponent={{ text: 'Settings', style: { color: colors.white, fontSize: 18 } }}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
