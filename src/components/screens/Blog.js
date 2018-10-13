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
import {formatText} from '../../utils/utils';

import YOUTUBE_API_KEY from '../../constants/index';


function mapStateToProps(state){
  return {};
}

function mapDispatchToProps(dispatch){
  return {};
}

class Blog extends React.Component{
  constructor(props){
    super(props);

    const blog = this.props.navigation.getParam('blog', null);
    if(blog === null){this.props.navigation.pop();}

    this.state={
      blog: blog
    }
  }

  render(){
    const blog = this.state.blog;

    if(!blog){return null;}
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
            centerComponent={{ text: 'The 19th Hole', style: { color: colors.white, fontSize: verticalScale(18) } }}
        />
        <ScrollView contentContainerStyle={{padding: spacing.normal, alignItems: 'stretch'}}>
          <Text style={styles.headline}>{blog.date}</Text>
          <Text style={StyleSheet.flatten([styles.formLabel, {marginBottom: spacing.tiny}])}>
            {blog.title}
          </Text>
          {formatText(blog.body)}
        </ScrollView>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Blog);
