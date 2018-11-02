import React from 'react';
import {connect} from 'react-redux';

import { 
  View, 
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Header from '../Header/Header';
import styles, {colors, spacing} from '../../styles/index';
import {formatText} from '../../utils/utils';

function mapStateToProps(state){
  return {
    token: state.login.token,
  };
}

function mapDispatchToProps(dispatch){
  return {
  };
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
        <Header title={'The 19th Hole'} navigation={this.props.navigation} type={'back'}/>
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
