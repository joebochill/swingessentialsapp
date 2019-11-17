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
import Header from '../Header/Header';
import {Icon} from 'react-native-elements';
import YouTube, {YouTubeStandaloneAndroid} from 'react-native-youtube';
import { Thumbnail } from 'react-native-thumbnail-video';
import {YOUTUBE_API_KEY} from '../../constants/index';
import styles, {colors, spacing, sizes} from '../../styles/index';
import {scale} from '../../styles/dimension';
import {formatText, getDate, logLocalError} from '../../utils/utils';
import Tutorial from '../Tutorial/Lesson';

import { markLessonViewed } from '../../actions/LessonActions';

import {TUTORIALS} from '../../constants/index';
import { tutorialViewed } from '../../actions/TutorialActions';

import Video from 'react-native-video';

function mapStateToProps(state){
  return {
    token: state.login.token,
    lessons: state.lessons,
    links: state.links,
    showTutorial: state.tutorial[TUTORIALS.LESSON]
  };
}

function mapDispatchToProps(dispatch){
  return {
    markViewed: (id, token) => {dispatch(markLessonViewed(id, token))},
    closeTutorial: () => {dispatch(tutorialViewed(TUTORIALS.LESSON))}
  };
}

class Lesson extends React.Component{
  constructor(props){
    super(props);
    this.state={
      foPlaying: false,
      dtlPlaying: false
    };


    const lesson_id = this.props.navigation.getParam('id', null);
    const lesson_url = this.props.navigation.getParam('url', null);

    let lesson;

    if(!lesson_id && !lesson_url){this.props.navigation.pop();}
    
    if(lesson_id){
      lesson = this._getLessonById(parseInt(lesson_id, 10));

      if(lesson === null){
        this.props.navigation.pop();
      }
      if(parseInt(lesson.viewed, 10) === 0){
        this.props.markViewed({id: lesson_id}, this.props.token);
      }
    }
    else if(lesson_url){
      lesson = this._getLessonByURL(lesson_url);

      if(lesson === null){
        this.props.navigation.pop();
      }

      if(parseInt(lesson.viewed, 10) === 0){
        this.props.markViewed({id: lesson.request_id}, this.props.token);
      }
    }
    this.state.lesson = lesson;
  }

  componentWillReceiveProps(nextProps){
    if(this.props.token && !nextProps.token){
        this.props.navigation.pop();
    }
  }

  _getLessonById(id){
    // check for the placeholder lesson
    if(id === -1){
      return {
        request_date: getDate(Date.now()),
        response_video: 'l3Y3iJa6DvE',
        response_notes: 'Welcome to the Swing Essentials™ family! We\'re super excited to have you aboard.|:::|Upload a video of your golf swing and we\'ll have a PGA-certified professional analyze your swing and provide a custom-tailored breakdown video highlighting what you\'re doing well, as well as areas you can work on to improve your game.',
        request_notes: '',
        fo_swing: '',
        dtl_swing: ''
      }
    }

    if(this.props.lessons.closed.length < 1){return null;}
    for(let i = 0; i < this.props.lessons.closed.length; i++){
      if(this.props.lessons.closed[i].request_id === id){
        return this.props.lessons.closed[i];
      }
    }
    return null;
  }
 
  _getLessonByURL(url){
    if(this.props.lessons.closed.length < 1){return null;}
    for(let i = 0; i < this.props.lessons.closed.length; i++){
      if(this.props.lessons.closed[i].request_url === url){
        return this.props.lessons.closed[i];
      }
    }
    return null;
  }

  openStandaloneAndroidPlayer(id){
    YouTubeStandaloneAndroid.playVideo({
        apiKey: YOUTUBE_API_KEY,     // Your YouTube Developer API Key
        videoId: id,     // YouTube video ID
        autoplay: true,             // Autoplay the video
        startTime: 0,             // Starting point of video (in seconds)
      })
        .catch(errorMessage => {
          logLocalError('127: Youtube Standalone: ' + errorMessage);
        });
  }



  render(){
    const lesson = this.state.lesson;
    if(!lesson){return null;}
    return (
      <View style={{backgroundColor: colors.backgroundGrey, flexDirection: 'column', flex: 1}}>
        <Header title={'Swing Analysis'} navigation={this.props.navigation} type={'back'}/>
        <ScrollView contentContainerStyle={{padding: spacing.normal, alignItems: 'stretch'}}>
          <Text style={styles.headline}>{lesson.request_date}</Text>
          <Text style={StyleSheet.flatten([styles.formLabel, {marginBottom: spacing.tiny}])}>
            Video Response
          </Text>
          {Platform.OS === 'ios' &&
            <YouTube
              apiKey={YOUTUBE_API_KEY}
              videoId={lesson.response_video}  // The YouTube video ID
              play={false}             // control playback of video with true/false
              fullscreen={false}       // control whether the video should play in fullscreen or inline
              loop={false}             // control whether the video should loop when ended
              showinfo={false}
              modestbranding={true}
              controls={2}
              rel={false}
              style={{width:'100%', height: scale(168) , marginTop: spacing.small}}
            />
          }
          {Platform.OS === 'android' &&
            <View style={{width:'100%', height: scale(168) , marginTop: spacing.small}}>
              <Thumbnail
                url={`https://www.youtube.com/watch?v=${lesson.response_video}`}
                onPress={() => this.openStandaloneAndroidPlayer(lesson.response_video)}
                imageHeight="100%"
                imageWidth="100%"
                showPlayIcon={true}
                type="maximum"
              />
            </View>
          }
          {lesson.response_notes && lesson.response_notes.length > 0 && 
            <Text style={StyleSheet.flatten([styles.formLabel, {marginBottom: spacing.small, marginTop: spacing.normal}])}>
              Comments
            </Text>
          }
          {formatText(lesson.response_notes)}
          {(Platform.OS === 'ios' && lesson.fo_swing !== '' && lesson.dtl_swing !== '') &&
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
                          source={{uri:'https://www.swingessentials.com/video_links/'+lesson.request_url+'/'+lesson.fo_swing}}    // Can be a URL or a local file.
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
                          source={{uri:'https://www.swingessentials.com/video_links/'+lesson.request_url+'/'+lesson.dtl_swing}}    // Can be a URL or a local file.
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
                  {formatText(lesson.request_notes)}
                </View>
              }
            </View>
          }
        </ScrollView>
        <Tutorial isVisible={this.props.showTutorial} close={()=>this.props.closeTutorial()}/>       
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lesson);