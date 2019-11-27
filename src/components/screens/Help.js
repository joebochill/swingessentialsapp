import React from 'react';
import {connect} from 'react-redux';

import { 
  View, 
  Text,
  ScrollView,
  StyleSheet,
  Platform
} from 'react-native';
import Header from '../Header/Header';
import styles, {colors, spacing} from '../../styles/index';
import {width} from '../../styles/dimension';

import YouTube from 'react-native-youtube';
import {YOUTUBE_API_KEY} from '../../constants/index';

function mapStateToProps(state){
  return {
    token: state.login.token
  };
}
function mapDispatchToProps(dispatch){
  return {};
}

class HelpScreen extends React.Component{
  render(){
    return (
      <View style={{backgroundColor: colors.backgroundGrey, flexDirection: 'column', flex: 1}}>
        <Header title={'Help'} navigation={this.props.navigation}/>
        <ScrollView contentContainerStyle={{padding: spacing.normal, alignItems: 'stretch'}}>
          <Text style={styles.headline}>Frequently Asked Questions</Text>
          <Text style={StyleSheet.flatten([styles.formLabel, {marginTop: spacing.normal, marginBottom: spacing.small}])}>
            How does it work?
          </Text>
          <Text style={styles.paragraph}>Once you have downloaded the app, head over to the Redeem page from the menu. There you will be able to use your device's camera to record two videos of your swing (one face-on view and one down-the-line view). Once you are satisfied with the recording, you can submit your videos for expert analysis. Our PGA professional will build a custom swing analysis video for you comparing your swing side by side with a professional golfer. This analysis will highlight some of the things you are doing well and give you some things to work on in your next session to help you continue to improve your game.</Text>
          <YouTube
            apiKey={YOUTUBE_API_KEY}
            videoId={'e8QozoBJfF8'}  // The YouTube video ID
            play={false}             // control playback of video with true/false
            fullscreen={false}       // control whether the video should play in fullscreen or inline
            loop={false}             // control whether the video should loop when ended
            showinfo={false}
            modestbranding={true}
            controls={2}
            rel={false}
            style={{
              width:'100%', 
              height: (width - 2*spacing.large)*(9/16), 
              marginBottom: spacing.normal + spacing.small
            }}
          />
          <Text style={StyleSheet.flatten([styles.formLabel, {marginTop: spacing.normal, marginBottom: spacing.small}])}>
            How fast will I receive my swing analysis?
          </Text>
          <Text style={styles.paragraph}>We guarantee a 48-hour turnaround time on all swing analyses. However, most lessons are completed within 24 hours.</Text>
          <Text style={StyleSheet.flatten([styles.formLabel, {marginTop: spacing.normal, marginBottom: spacing.small}])}>
            How much does it cost?
          </Text>
          <Text style={styles.paragraph}>We offer multiple different lesson packages at different price points. Generally, you'll save more by purchasing a larger package, but we also offer single lesson packages if you don't want to commit. We also offer an unlimited package which will let you submit as many lessons as you like for 30 days.</Text>
          <Text style={StyleSheet.flatten([styles.formLabel, {marginTop: spacing.normal, marginBottom: spacing.small}])}>
            Who does the swing analysis?
          </Text>
          <Text style={styles.paragraph}>Our swing analyses are conducted by AJ Nelson, a Class A Member of the PGA. He has worked in the golf industry for seventeen years and has given thousands of lessons (online and in person). AJ has a Masters Degree from the University of Maryland, College Park and graduated from the PGA-sponsored Professional Golf Management Program.</Text>
          <Text style={StyleSheet.flatten([styles.formLabel, {marginTop: spacing.normal, marginBottom: spacing.small}])}>
            How do I pay?
          </Text>
          {Platform.OS === 'ios' &&
            <Text style={styles.paragraph}>Payment through the app are handled by Apple's In-App Purchase mechanism. You'll need to have a valid Apple ID with a connected payment method. If you need to add a payment method, visit your Apple ID settings.</Text>
          }
          {Platform.OS !== 'ios' &&
            <Text style={styles.paragraph}>Payment through the app are handled by Google's In-App Payments mechanism. You'll need to have a valid Google account with a connected payment method. If you need to add a payment method, check your device settings.</Text>
          }
          <Text style={StyleSheet.flatten([styles.formLabel, {marginTop: spacing.normal, marginBottom: spacing.small}])}>
            What do I need in order to use Swing Essentials™?
          </Text>
          <Text style={styles.paragraph}>All you need to get started with Swing Essentials™ is an iPhone or Android smartphone with a camera capable of recording video. If you don't have a smartphone, you can also upload your swing videos on our website..</Text>
          <Text style={StyleSheet.flatten([styles.formLabel, {marginTop: spacing.normal, marginBottom: spacing.small}])}>
            Why go I get an error when trying to submit my videos?
          </Text>
          <Text style={styles.paragraph}>The most common cause for errors during video submission is oversized videos (our maximum supported file size is 9MB). Make sure your swing video includes only your swing - use the video trimming capabilities of your device to crop extra footage at the beginning or end.</Text>
          <Text style={styles.paragraph}>Slow-motion videos are not recommended as they take up significantly more space than regular video. If you continue to have problems after these adjustments, please contact us.</Text>
          <Text style={StyleSheet.flatten([styles.formLabel, {marginTop: spacing.normal, marginBottom: spacing.small}])}>
            What if I have technical problems?
          </Text>
          <Text style={styles.paragraph}>If you experience any problems while using the Swing Essentials™ app, please reach out to us and let us know. We strive to provide you with the best experience possible and we welcome all of your feedback. We can be reached for questions and comments at info@swingessentials.com.</Text>
        </ScrollView>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HelpScreen);
