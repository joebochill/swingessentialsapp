import React from 'react';
import {connect} from 'react-redux';

import { 
  View, 
  Text,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import {Header} from 'react-native-elements';
import YouTube from 'react-native-youtube'
import styles, {colors, spacing} from '../../styles/index';
import {scale, verticalScale} from '../../styles/dimension';

import YOUTUBE_API_KEY from '../../constants/index';


function mapStateToProps(state){
  return {};
}

function mapDispatchToProps(dispatch){
  return {};
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

  _formatText(text){
    if(!text){ return null;}
    let arr = text.split('|:::|');
    return arr.map((val, index) => 
      <Text key={'par_'+index} style={styles.paragraph}>{val}</Text>
    );
  }

  render(){
    const tip = this.state.tip;

    if(!tip){return null;}
    return (
      <View style={{backgroundColor: colors.backgroundGrey, flexDirection: 'column', flex: 1}}>
        <Header
            style={{flex: 0}}
            outerContainerStyles={{ 
              backgroundColor: colors.lightPurple, 
              height: verticalScale(Platform.OS === 'ios' ? 70 :  70 - 24), 
              padding: verticalScale(Platform.OS === 'ios' ? 15 : 10)
            }}
            //innerContainerStyles={{alignItems: Platform.OS === 'ios' ? 'flex-end' : 'center'}}
            leftComponent={{ 
              icon: 'arrow-back',
              size: verticalScale(26),
              underlayColor:colors.transparent,
              containerStyle:styles.headerIcon, 
              color: colors.white, 
              onPress: () => this.props.navigation.pop() 
            }}
            centerComponent={{ text: 'Tip of the Month', style: { color: colors.white, fontSize: verticalScale(18) } }}
        />
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
          {this._formatText(tip.comments)}
        </ScrollView>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tip);
