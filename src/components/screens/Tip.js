import React from 'react';
import {connect} from 'react-redux';

import { 
  View, 
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Header from '../Header/Header';
import YouTube from 'react-native-youtube'
import styles, {colors, spacing} from '../../styles/index';
import {scale} from '../../styles/dimension';
import {formatText} from '../../utils/utils';

import {YOUTUBE_API_KEY} from '../../constants/index';


function mapStateToProps(state){
  return {
    token: state.login.token,
  };
}

function mapDispatchToProps(dispatch){
  return {
  };
}

class Tip extends React.Component{
  constructor(props){
    super(props);

    const tip = this.props.navigation.getParam('tip', null);
    if(tip === null){this.props.navigation.pop();}

    this.state={
      tip: tip
    }
  }

  render(){
    const tip = this.state.tip;

    if(!tip){return null;}
    return (
      <View style={{backgroundColor: colors.backgroundGrey, flexDirection: 'column', flex: 1}}>
        <Header title={'Tip of the Month'} navigation={this.props.navigation} type={'back'}/>
        <ScrollView contentContainerStyle={{padding: spacing.normal, alignItems: 'stretch'}}>
          <Text style={styles.headline}>{tip.date}</Text>
          <Text style={StyleSheet.flatten([styles.formLabel, {marginBottom: spacing.tiny}])}>
            {tip.title}
          </Text>
          <YouTube
            apiKey={YOUTUBE_API_KEY}
            videoId={tip.video}      // The YouTube video ID
            play={false}             // control playback of video with true/false
            fullscreen={false}       // control whether the video should play in fullscreen or inline
            loop={false}             // control whether the video should loop when ended
            showinfo={false}
            modestbranding={true}
            controls={2}
            rel={false}
            style={{width:'100%', height: scale(168) , marginTop: spacing.small}}
          />
          {tip.comments && tip.comments.length > 0 && 
            <Text style={StyleSheet.flatten([styles.formLabel, {marginBottom: spacing.small, marginTop: spacing.normal}])}>
              Comments
            </Text>
          }
          {formatText(tip.comments)}
        </ScrollView>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tip);
