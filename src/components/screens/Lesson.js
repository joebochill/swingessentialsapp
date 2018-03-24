import React from 'react';
import {connect} from 'react-redux';

import { 
  View, 
  Text,
  ScrollView,
  StyleSheet
} from 'react-native';
import {FormLabel, Header} from 'react-native-elements';
import YouTube from 'react-native-youtube'
import styles, {colors, spacing, altStyles} from '../../styles/index';

function mapStateToProps(state){
  return {
    token: state.login.token,
    lessons: state.lessons
  };
}

function mapDispatchToProps(dispatch){
  return {};
}

class Lesson extends React.Component{
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

  _formatText(text){
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
    return (
      <View style={{backgroundColor: colors.backgroundGrey, flexDirection: 'column', flex: 1}}>
        <Header
            style={{flex: 0}}
            outerContainerStyles={{ backgroundColor: colors.lightPurple}}
            leftComponent={{ icon: 'arrow-back',underlayColor:colors.transparent,containerStyle:styles.headerIcon, color: colors.white, 
              onPress: () => this.props.navigation.pop() }}
            centerComponent={{ text: 'Swing Analysis', style: { color: colors.white, fontSize: 18 } }}
        />
        <ScrollView contentContainerStyle={{padding: spacing.normal, alignItems: 'stretch'}}>
          <Text style={styles.headline}>{lesson.request_date}</Text>
          <FormLabel 
            containerStyle={StyleSheet.flatten([styles.formLabelContainer, {marginBottom: spacing.tiny}])}
            labelStyle={StyleSheet.flatten([styles.formLabel])}>
            Video Response
          </FormLabel>
          <YouTube
            apiKey={'YOUR_API_KEY_GOES_HERE'}
            videoId={lesson.response_video}  // The YouTube video ID
            play={false}             // control playback of video with true/false
            fullscreen={false}       // control whether the video should play in fullscreen or inline
            loop={false}             // control whether the video should loop when ended
            showinfo={false}
            modestbranding={true}
            rel={false}
            //onReady={e => this.setState({ isReady: true })}
            //onChangeState={e => this.setState({ status: e.state })}
            //onChangeQuality={e => this.setState({ quality: e.quality })}
            //onError={e => this.setState({ error: e.error })}

            style={{width:'100%', height: 300 , marginTop: spacing.small}}
          />
          {/* <WebView
            style={{height:300, width:'100%', marginTop: spacing.small}}
            source={{uri: `https://www.youtube.com/embed/${lesson.response_video}`}}
          /> */}
          <FormLabel 
            containerStyle={StyleSheet.flatten([styles.formLabelContainer, {marginTop: spacing.normal, marginBottom: spacing.small}])}
            labelStyle={StyleSheet.flatten([styles.formLabel])}>
            Commentsß
          </FormLabel>
          {this._formatText(lesson.response_notes)}
        </ScrollView>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lesson);
