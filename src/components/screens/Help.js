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

function mapStateToProps(state){
  return {
    token: state.login.token
  };
}
function mapDispatchToProps(dispatch){
  return {};
}

class HelpScreen extends React.Component{
  constructor(props){
    super(props);
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
          //innerContainerStyles={{alignItems: Platform.OS === 'ios' ? 'flex-end' : 'center'}}
          leftComponent={{ 
            icon: 'menu',
            underlayColor:colors.transparent, 
            color: colors.white, 
            containerStyle:styles.headerIcon, 
            onPress: () => this.props.navigation.navigate('DrawerOpen') 
          }}
          centerComponent={{ 
            text: 'Help', 
            style: { color: colors.white, fontSize: 18 } 
          }}
          rightComponent={{ 
            icon: 'settings',
            underlayColor:colors.transparent, 
            color: colors.white, 
            containerStyle:styles.headerIcon, 
            onPress: () => {this.props.navigation.push('Settings')}
          }}
        />
        <ScrollView contentContainerStyle={{padding: spacing.normal, alignItems: 'stretch'}}>
          <Text style={styles.headline}>Frequently Asked Questions</Text>
          <FormLabel 
            containerStyle={StyleSheet.flatten([styles.formLabelContainer, {marginTop: spacing.normal, marginBottom: spacing.small}])}
            labelStyle={StyleSheet.flatten([styles.formLabel])}>
            How does it work?
          </FormLabel>
          <Text style={styles.paragraph}>Once you have downloaded the app, head over to the Redeem page from the menu. There you will be able to use your device's camera to record two videos of your swing (one face-on view and one down-the-line view). Once you are satisfied with the recording, you can submit your videos for expert analysis. Our PGA professional will build a custom swing analysis video for you comparing your swing side by side with a professional golfer. This analysis will highlight some of the things you are doing well and give you some things to work on in your next session to help you continue to improve your game.</Text>
          <FormLabel 
            containerStyle={StyleSheet.flatten([styles.formLabelContainer, {marginTop: spacing.normal, marginBottom: spacing.small}])}
            labelStyle={StyleSheet.flatten([styles.formLabel])}>
            How fast will I receive my swing analysis?
          </FormLabel>
          <Text style={styles.paragraph}>We guarantee a 48-hour turnaround time on all swing analyses. However, most lessons are completed within 24 hours.</Text>
          <FormLabel 
            containerStyle={StyleSheet.flatten([styles.formLabelContainer, {marginTop: spacing.normal, marginBottom: spacing.small}])}
            labelStyle={StyleSheet.flatten([styles.formLabel])}>
            How much does it cost?
          </FormLabel>
          <Text style={styles.paragraph}>We offer multiple different lesson packages at different price points. Generally, you'll save more by purchasing a larger package, but we also offer single lesson packages if you don't want to commit. We also offer an unlimited package which will let you submit as many lessons as you like for 30 days.</Text>
          <FormLabel 
            containerStyle={StyleSheet.flatten([styles.formLabelContainer, {marginTop: spacing.normal, marginBottom: spacing.small}])}
            labelStyle={StyleSheet.flatten([styles.formLabel])}>
            Who does the swing analysis?
          </FormLabel>
          <Text style={styles.paragraph}>Our swing analyses are conducted by AJ Nelson, a Class A Member of the PGA. He has worked in the golf industry for seventeen years and has given thousands of lessons (online and in person). AJ has a Masters Degree from the University of Maryland, College Park and graduated from the PGA-sponsored Professional Golf Management Program.</Text>
          <FormLabel 
            containerStyle={StyleSheet.flatten([styles.formLabelContainer, {marginTop: spacing.normal, marginBottom: spacing.small}])}
            labelStyle={StyleSheet.flatten([styles.formLabel])}>
            How do I pay?
          </FormLabel>
          <Text style={styles.paragraph}>We try to keep payments simple and straightforward. We utilize PayPal to handle our payment processing, so you are free to use any payment method accepted by PayPal to pay for Swing Essentials lessons (credit card, bank transfer, etc.)</Text>
          <FormLabel 
            containerStyle={StyleSheet.flatten([styles.formLabelContainer, {marginTop: spacing.normal, marginBottom: spacing.small}])}
            labelStyle={StyleSheet.flatten([styles.formLabel])}>
            What do I need in order to use Swing Essentials?
          </FormLabel>
          <Text style={styles.paragraph}>All you need to get started with Swing Essentials is an iPhone or Android smartphone with a camera capable of recording video. If you don't have a smartphone, you can also upload your swing videos on our website if you've recorded them on another device. You will also need to have a PayPal account in order to purchase more lessons.</Text>
          <FormLabel 
            containerStyle={StyleSheet.flatten([styles.formLabelContainer, {marginTop: spacing.normal, marginBottom: spacing.small}])}
            labelStyle={StyleSheet.flatten([styles.formLabel])}>
            What if I have technical problems?
          </FormLabel>
          <Text style={styles.paragraph}>If you experience any problems while using the Swing Essentials app, please reach out to us and let us know. We strive to provide you with the best experience possible and we welcome all of your feedback. We can be reached for questions and comments at info@swingessentials.com.</Text>
        </ScrollView>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HelpScreen);
