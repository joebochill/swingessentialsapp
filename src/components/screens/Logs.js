import React from 'react';
import {connect} from 'react-redux';

import { 
  Alert, 
  View, 
  Platform,
  Text,
  StyleSheet
} from 'react-native';
import {Button} from 'react-native-elements';
import Mailer from 'react-native-mail';

import Header from '../Header/Header';
import KeyboardView from '../Keyboard/KeyboardView';

import styles, {colors, spacing} from '../../styles/index';
import {scale} from '../../styles/dimension';

import { formatText, logLocalError, clearErrorLog } from '../../utils/utils';

var RNFS = require('react-native-fs');
const path = RNFS.DocumentDirectoryPath + '/error.txt';

function mapStateToProps(state){
  return {
    token: state.login.token,
    username: state.userData.username,
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
      content: '',
      refreshing: false
    };
    RNFS.exists(path)
    .then((exists) => {
      if(exists){
        this.readErrorLog();
      }
    });
  }

  readErrorLog(){
    return RNFS.readFile(path, 'utf8')
    .then((content) => {
      this.setState({content: content});
    })
    .catch(err => {
      //alert('error');
    })
  }
  refresh(){
    this.setState(
      {refreshing: true}, 
      () => this.readErrorLog().then(() => this.setState({refreshing: false}))
    )
  }

  sendErrorMail(){
    if(Platform.OS === 'android'){this.refresh();}

    Mailer.mail({
      subject: 'Swing Essentials Error Report (' + this.props.username + ')',
      recipients: ['info@swingessentials.com'],
      body: 'My Swing Essentials app has been encountering errors. ' + (Platform.OS === 'ios' ? 'Please see the attached error log.' : 'Please see the following:\r\n\r\n\r\n' + this.state.content),
      isHTML: false,
      attachment: Platform.OS === 'ios' ? {
        path: path,
        type: 'doc',
        name: 'ErrorLog.txt'
      } : null
    }, (error, event) => {
      if(error && error === 'canceled'){
        // Do nothing
      }
      else if(error){
        logLocalError('129: Error sending error report: ' + error);
      }
      else if(event && event === 'sent'){
        // message sent successfully
        clearErrorLog();
        Alert.alert(
          'Error Report Sent',
          'Your error report has been submitted successfully. Thank you for helping us improve the app!',
          [{text: 'DONE', onPress: () => this.refresh()}]
        );
      }
      else if(event && (event === 'canceled' || event === 'cancelled' || event === 'cancel')){
        // logLocalError('130: Error sending error report: ' + event);
      }
      else if(event){
        logLocalError('131: Error sending error report: ' + event);
      }
    });
  }
  render(){
    return (
      <View style={{backgroundColor: colors.backgroundGrey, flexDirection: 'column', flex: 1}}>
        <Header type="refresh" onRefresh={() => this.refresh()} title={'Error Log'} navigation={this.props.navigation}/>
        <KeyboardView
          onRefresh={() => this.refresh()}
          refreshing={this.state.refreshing}
          fixed={
            <React.Fragment>
              {Platform.OS === 'android' && 
                <Button
                  title={'CLEAR LOG'}
                  fontSize={scale(14)}
                  disabled={this.state.content.length < 1}
                  disabledStyle={{opacity: 0.5}}
                  onPress={() => {
                    Alert.alert(
                      'Clear Error Log',
                      'Are you sure you want to clear the log?',
                      [ 
                        {text: 'CANCEL'},
                        {text: 'CLEAR', onPress: () => clearErrorLog().then(() => this.refresh())}, 
                      ]
                    );}
                  }
                  color={'#333333'}
                  buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal, borderColor: '#c1c1c1', backgroundColor: '#efefef'}])}
                  containerViewStyle={styles.buttonContainer}
                /> 
              }
              <Button
                title={'SEND ERROR REPORT'}
                fontSize={scale(14)}
                disabled={this.state.content.length < 1}
                disabledStyle={styles.disabledButton}
                onPress={() => this.sendErrorMail()}
                buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal}])}
                containerViewStyle={styles.buttonContainer}
              />
            </React.Fragment>
          }
        >
          <View style={(Platform.OS === 'android') ? {paddingLeft: spacing.small, paddingRight: spacing.small} : {}}>
            {formatText(this.state.content)}
            {this.state.content.length < 1 &&
              <Text style={StyleSheet.flatten([styles.paragraph, {fontSize: 24, textAlign: 'center'}])}>No Logs Since Last Report</Text>
            }
          </View>
        </KeyboardView>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogsScreen);
