import React from 'react';
import {connect} from 'react-redux';

import { 
  View, 
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {Button} from 'react-native-elements';
import Mailer from 'react-native-mail';

import Header from '../Header/Header';
import KeyboardView from '../Keyboard/KeyboardView';

import styles, {colors, spacing} from '../../styles/index';
import {scale} from '../../styles/dimension';

import { formatText } from '../../utils/utils';

var RNFS = require('react-native-fs');
const path = RNFS.DocumentDirectoryPath + '/error.txt';

function mapStateToProps(state){
  return {
    token: state.login.token
  };
}
function mapDispatchToProps(dispatch){
  return {
  };
}

class LogsScreen extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      content: ''
    }
    RNFS.readFile(path, 'utf8').then((content) => {
      this.setState({content: content});
    });
  }
  sendErrorMail(){
    Mailer.mail({
      subject: 'Error Report',
      recipients: 'boyle.p.joseph@gmail.com',
      body: 'I have received an error',
      isHTML: true,
      attachment: {
        path: path,
        type: 'txt',
        name: 'ErrorLog.txt'
      }
    }, (error, event) => {
      alert('error');
    });
  }
  render(){
    return (
      <View style={{backgroundColor: colors.backgroundGrey, flexDirection: 'column', flex: 1}}>
        <Header title={'Error Log'} navigation={this.props.navigation}/>
        <KeyboardView
          fixed={
              <Button
                  title={'SEND ERROR REPORT'}
                  fontSize={scale(14)}
                  disabled={this.state.content.length < 1}
                  disabledStyle={styles.disabledButton}
                  // onPress={()=>this._purchaseLesson({
                  //     package: this.state.selected.shortcode,
                  //     sku: this.state.products[this.state.selectedIndex].productId
                  // })}
                  onPress={() => this.sendErrorMail()}
                  buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal}])}
                  containerViewStyle={styles.buttonContainer}
              /> 
          }
        >
          <ScrollView contentContainerStyle={{padding: spacing.normal, alignItems: 'stretch'}}>
            {formatText(this.state.content)}
            {this.state.content.length < 1 &&
              <Text style={StyleSheet.flatten([styles.paragraph, {fontSize: 36, textAlign: 'center'}])}>No Errors</Text>
            }
          </ScrollView>
        </KeyboardView>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogsScreen);
