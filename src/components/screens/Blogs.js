import React from 'react';
import {connect} from 'react-redux';

import {Text, View, ScrollView, FlatList, RefreshControl} from 'react-native';
import Header from '../Header/Header';
import styles, {colors, spacing} from '../../styles/index';
import {scale} from '../../styles/dimension';

import {getBlogs} from '../../actions/BlogActions';

import CardRow from '../Card/CardRow';

function mapStateToProps(state){
    return {
        token: state.login.token,
        admin: state.login.admin,
        blogs: state.blogs
    };
}
function mapDispatchToProps(dispatch){
    return {
        getBlogs: (token = null) => dispatch(getBlogs(token))
    };
}

class Blogs extends React.Component{
    constructor(props){
        super(props);
        this.state={
            refreshing: false
        }
    }
    componentWillReceiveProps(nextProps){
        if(!nextProps.blogs.loading){
            this.setState({refreshing: false});
        }
    }

    _onRefresh(){
        this.setState({refreshing: true});
        this.props.getBlogs(this.props.token);
    }

    // returns the blogs list categorized by year
    blogsByYear() {
        return this.props.blogs.blogList.reduce(function(newBlogs, blog) {
            const year = blog.date.split('-',3)[0];
            if (!newBlogs[year]) { newBlogs[year] = []; }
            newBlogs[year].push(blog);
            return newBlogs;
        }, {});
    }

    render(){
        const splitBlogs = this.blogsByYear();
        return(
            <View style={{backgroundColor: colors.backgroundGrey, flexDirection: 'column', flex: 1}}>
                <Header title={'The 19th Hole'} navigation={this.props.navigation}/>
                <ScrollView 
                    contentContainerStyle={{padding: spacing.normal, alignItems: 'stretch'}}
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={()=>this._onRefresh()}/>}
                >
                    {Object.keys(splitBlogs).sort().reverse().map((year, index) =>
                        <FlatList
                            key={'yearList_'+year}
                            style={{marginTop: index === 0 ? 0 : spacing.normal}}
                            // style={{marginTop: spacing.normal}}
                            scrollEnabled= {false}
                            ListHeaderComponent={
                                <View style={styles.cardHeader}>
                                    <Text style={{fontSize: scale(14), color: colors.white}}>{year}</Text>
                                </View>
                            }
                            data={splitBlogs[year]}
                            ListEmptyComponent={!this.props.blogs.loading ?
                                <CardRow primary={'No Posts'}/>
                                :<CardRow primary={'Loading Posts...'}/>
                            }
                            renderItem={({item}) => 
                                <CardRow 
                                    primary={item.title} 
                                    action={() => this.props.navigation.push('Blog', {blog: item})}
                                />
                            }
                            keyExtractor={(item, index) => ('blog_'+item.id)}
                        />
                    )}
                </ScrollView>                
            </View>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Blogs);