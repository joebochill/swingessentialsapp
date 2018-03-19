import React from 'react';
import {connect} from 'react-redux';

import {Text, View, ScrollView, FlatList, RefreshControl} from 'react-native';
import {Button, Header} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles, {colors, spacing, altStyles} from '../../styles/index';
import {getLessons, getCredits} from '../../actions/LessonActions';

import CardRow from '../Card/CardRow';
import {NavigationActions} from 'react-navigation';

// import Icon from 'react-native-vector-icons/FontAwesome';

function mapStateToProps(state){
    return {
        token: state.login.token,
        username: state.userData.username,
        lessons: state.lessons,
        credits: state.credits
    };
}
function mapDispatchToProps(dispatch){
    return {
        getLessons: (token) => {dispatch(getLessons(token))},
        getCredits: (token) => {dispatch(getCredits(token))}
    };
}

class Lessons extends React.Component{
    constructor(props){
        super(props);
        this.state={
            refreshing: false
        }
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
        else if(!nextProps.lessons.loading && !nextProps.credits.inProgress){
            this.setState({refreshing: false});
        }
    }

    _onRefresh(){
        this.setState({refreshing: true});
        this.props.getCredits(this.props.token);
        this.props.getLessons(this.props.token);
    }

    render(){
        return(
            <View style={{backgroundColor: colors.backgroundGrey, flexDirection: 'column', flex: 1}}>
                <Header
                    style={{flex: 0}}
                    outerContainerStyles={{ backgroundColor: colors.lightPurple}}
                    leftComponent={{ icon: 'menu',underlayColor:colors.transparent, color: colors.white, containerStyle:styles.headerIcon, onPress: () => this.props.navigation.navigate('DrawerOpen') }}
                    centerComponent={{ text: 'Your Lessons', style: { color: colors.white, fontSize: 18 } }}
                    rightComponent={{ icon: 'settings',underlayColor:colors.transparent, color: colors.white, containerStyle:styles.headerIcon, 
                        onPress: () => {this.props.navigation.push('Settings')}}}
                />
                <ScrollView 
                    contentContainerStyle={{padding: spacing.normal, alignItems: 'stretch'}}
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={()=>this._onRefresh()}/>}
                >
                    <FlatList
                        scrollEnabled= {false}
                        ListHeaderComponent={
                            <View style={styles.cardHeader}>
                                <Text style={{color: colors.white}}>Redeem a Lesson</Text>
                            </View>
                        }
                        data={[
                            {primary: 'Individual Lessons', secondary: (this.props.credits && !this.props.credits.inProgress) ? this.props.credits.count+' Left':'', action: ()=>alert('redeem individual')}, 
                            {primary: 'Activate Unlimited', secondary: (this.props.credits && !this.props.credits.inProgress) ? this.props.credits.unlimited+' Left':'', action: ()=>alert('activate unlimited')}, 
                            {primary: 'Order More', action: ()=> this.props.navigation.navigate('Order')}]}
                        renderItem={({item}) => 
                            <CardRow 
                                primary={item.primary} 
                                secondary={item.secondary}
                                action={item.action}
                            />
                        }
                        keyExtractor={(item, index) => item.primary}
                    />
                    <FlatList
                        style={{marginTop: spacing.normal}}
                        scrollEnabled= {false}
                        ListHeaderComponent={
                            <View style={styles.cardHeader}>
                                <Text style={{color: colors.white}}>In Progress</Text>
                            </View>
                        }
                        data={this.props.lessons.pending}
                        ListEmptyComponent={!this.props.lessons.loading ?
                            <CardRow primary={'No Lessons In Progress'}/>
                            : <CardRow primary={'Loading Lessons...'}/>
                        }
                        renderItem={({item}) => 
                            <CardRow primary={item.request_date} />
                        }
                        keyExtractor={(item, index) => item.request_id}
                    />
                    <FlatList
                        style={{marginTop: spacing.normal}}
                        scrollEnabled= {false}
                        ListHeaderComponent={
                            <View style={styles.cardHeader}>
                                <Text style={{color: colors.white}}>Completed</Text>
                            </View>
                        }
                        data={this.props.lessons.closed}
                        ListEmptyComponent={!this.props.lessons.loading ?
                            <CardRow primary={'No Completed Lessons'}/>
                            :<CardRow primary={'Loading Lessons...'}/>
                        }
                        renderItem={({item}) => 
                            <CardRow 
                                primary={item.request_date} 
                                secondary={item.new ? "NEW" : null} 
                                action={() => {
                                    this.props.navigation.dispatch({type:'SELECT_LESSON', data:{id:item.request_id}});
                                    this.props.navigation.push('Lesson');
                                }}/>
                        }
                        keyExtractor={(item, index) => item.request_id}
                    />
                </ScrollView>                
            </View>

        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Lessons);