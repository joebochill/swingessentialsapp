import React from 'react';
import {connect} from 'react-redux';

import { 
  View, 
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity
} from 'react-native';
import {Header, Icon} from 'react-native-elements';
import YouTube from 'react-native-youtube'
import styles, {colors, spacing, sizes, altStyles} from '../../styles/index';
import {scale, verticalScale} from '../../styles/dimension';

import { markLessonViewed } from '../../actions/LessonActions';
import Video from 'react-native-video';


function mapStateToProps(state){
  return {
    token: state.login.token,
    lessons: state.lessons
  };
}

function mapDispatchToProps(dispatch){
  return {
    markViewed: (id, token) => {dispatch(markLessonViewed(id, token))}
  };
}

class Lesson extends React.Component{
  constructor(props){
    super(props);
    this.state={
      foPlaying: false,
      dtlPlaying: false
    };
  }

  componentWillMount(){
    if(!this.props.token){
        this.props.navigation.navigate('Auth');
    }
    else{
      const lesson = this._getLessonById(this.props.lessons.selected);
      if(parseInt(lesson.viewed, 10) === 0){
        this.props.markViewed({id: this.props.lessons.selected}, this.props.token);
      }
    }
  }

  componentWillReceiveProps(nextProps){
    if(!nextProps.token){
        this.props.navigation.navigate('Auth');
    }
    if(nextProps.lessons.selected !== this.props.lessons.selected){
      const lesson = this._getLessonById(nextProps.lessons.selected);
      if(parseInt(lesson.viewed, 10) === 0){
        this.props.markViewed({id: nextProps.lessons.selected}, this.props.token);
      }
    }
  }

  _formatText(text){
    if(!text){ return null;}
    let arr = text.split(':::');
    return arr.map((val, index) => 
      <Text key={'par_'+index} style={styles.paragraph}>{val}</Text>
    );
  }

  _getLessonById(id){
    if(this.props.lessons.closed.length < 1){return null;}
    for(let i = 0; i < this.props.lessons.closed.length; i++){
      if(this.props.lessons.closed[i].request_id === id){
        return this.props.lessons.closed[i];
      }
    }
    return null;
  }

  render(){
    const lesson = this._getLessonById(this.props.lessons.selected);
    if(!lesson){return null;}
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
            centerComponent={{ text: 'Swing Analysis', style: { color: colors.white, fontSize: verticalScale(18) } }}
        />
        <ScrollView contentContainerStyle={{padding: spacing.normal, alignItems: 'stretch'}}>
          <Text style={styles.headline}>{lesson.request_date}</Text>
          <Text style={StyleSheet.flatten([styles.formLabel, {marginBottom: spacing.tiny}])}>
            Video Response
          </Text>
          <YouTube
            apiKey={'YOUR_API_KEY_GOES_HERE'}
            videoId={lesson.response_video}  // The YouTube video ID
            play={false}             // control playback of video with true/false
            fullscreen={false}       // control whether the video should play in fullscreen or inline
            loop={false}             // control whether the video should loop when ended
            showinfo={false}
            modestbranding={true}
            rel={false}
            style={{width:'100%', height: scale(168) , marginTop: spacing.small}}
          />
          <Text style={StyleSheet.flatten([styles.formLabel, {marginBottom: spacing.small, marginTop: spacing.normal}])}>
            Comments
          </Text>
          {this._formatText(lesson.response_notes)}
          {Platform.OS === 'ios' &&
            <View>
              <Text style={StyleSheet.flatten([styles.formLabel, {marginBottom: spacing.small, marginTop: spacing.normal}])}>
                Your Swing Videos
              </Text>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <View style={{flex: 1, marginRight: spacing.normal, backgroundColor: colors.black, height: scale(267)}}>
                    <TouchableOpacity style={{height:'100%', width: '100%'}} 
                        underlayColor={colors.black}
                        onPress={()=>this.setState({foPlaying: !this.state.foPlaying})}> 
                        <View style={StyleSheet.flatten([styles.absolute, styles.centered])}>
                            <Icon 
                                name={'play-arrow'} 
                                size={sizes.medium} 
                                color={colors.white}
                                underlayColor={colors.transparent}
                            />
                        </View>
                        <Video 
                          source={{uri:'https://www.josephpboyle.com/video_links/'+lesson.request_url+'/'+lesson.fo_swing}}    // Can be a URL or a local file.
                          ref={(ref) => {this.foplayer = ref}}    // Store reference
                          rate={1.0}                              // 0 is paused, 1 is normal.
                          volume={1.0}                            // 0 is muted, 1 is normal.
                          muted={false}                           // Mutes the audio entirely.
                          paused={!this.state.foPlaying}                          // Pauses playback entirely.
                          onEnd={()=>this.setState({foPlaying: false})}
                          resizeMode="contain"                    // Fill the whole screen at aspect ratio.*
                          repeat={true}                           // Repeat forever.
                          playInBackground={false}                // Audio continues to play when app entering background.
                          playWhenInactive={false}                // [iOS] Video continues to play when control or notification center are shown.
                          ignoreSilentSwitch={"ignore"}           // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual.
                          style={{height:'100%', width: '100%'}}
                        />
                    </TouchableOpacity>    
                  </View>
                  <View style={{flex: 1, backgroundColor: colors.black, height: scale(267)}}>
                    <TouchableOpacity style={{height:'100%', width: '100%'}} 
                        underlayColor={colors.black}
                        onPress={()=>this.setState({dtlPlaying: !this.state.dtlPlaying})}> 
                        <View style={StyleSheet.flatten([styles.absolute, styles.centered])}>
                            <Icon 
                                name={'play-arrow'} 
                                size={sizes.medium} 
                                color={colors.white}
                                underlayColor={colors.transparent}
                            />
                        </View>
                        <Video 
                          source={{uri:'https://www.josephpboyle.com/video_links/'+lesson.request_url+'/'+lesson.dtl_swing}}    // Can be a URL or a local file.
                          ref={(ref) => {this.dtlplayer = ref}}    // Store reference
                          rate={1.0}                              // 0 is paused, 1 is normal.
                          volume={1.0}                            // 0 is muted, 1 is normal.
                          muted={false}                           // Mutes the audio entirely.
                          paused={!this.state.dtlPlaying}                          // Pauses playback entirely.
                          onEnd={()=>this.setState({dtlPlaying: false})}
                          resizeMode="contain"                    // Fill the whole screen at aspect ratio.*
                          repeat={true}                           // Repeat forever.
                          playInBackground={false}                // Audio continues to play when app entering background.
                          playWhenInactive={false}                // [iOS] Video continues to play when control or notification center are shown.
                          ignoreSilentSwitch={"ignore"}           // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual.
                          style={{height:'100%', width: '100%'}}
                        />
                    </TouchableOpacity>    
                  </View>
              </View>
              {lesson.request_notes.length > 0 && 
                <View>
                  <Text style={StyleSheet.flatten([styles.formLabel, {marginBottom: spacing.small, marginTop: spacing.normal}])}>
                    Special Requests
                  </Text>
                  {this._formatText(lesson.request_notes)}
                </View>
              }
            </View>
          }
        </ScrollView>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lesson);
