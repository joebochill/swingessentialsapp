import React from 'react';
import {connect} from 'react-redux';

import {Alert, Text, View, ScrollView, FlatList, RefreshControl, Platform} from 'react-native';
import {Button, Header} from 'react-native-elements';
import styles, {colors, spacing, altStyles} from '../../styles/index';
import {getLessons, getCredits, activateUnlimited} from '../../actions/LessonActions';
import CardRow from '../Card/CardRow';

function mapStateToProps(state){
    return {
        token: state.login.token,
        admin: state.login.admin,
        username: state.userData.username,
        lessons: state.lessons,
        credits: state.credits
    };
}
function mapDispatchToProps(dispatch){
    return {
        getLessons: (token) => {dispatch(getLessons(token))},
        getCredits: (token) => {dispatch(getCredits(token))},
        activateUnlimited: (token) => {dispatch(activateUnlimited(token))}
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
            this.props.navigation.navigate('Auth');
        }
    }
    componentWillReceiveProps(nextProps){
        if(!nextProps.token){
            this.props.navigation.navigate('Auth');
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

    _formatUnlimited(){
        let unlimitedRemaining = (this.props.credits.unlimitedExpires - (Date.now()/1000));
        let countdown;
    
        if(unlimitedRemaining > 24*60*60){
          countdown = Math.ceil(unlimitedRemaining/(24*60*60)) + " Days Left";
        }
        else if(unlimitedRemaining > 60*60){
          countdown =  Math.ceil(unlimitedRemaining/(60*60)) + " Hours Left";
        }
        else if(unlimitedRemaining > 0){
          const min = Math.ceil(unlimitedRemaining/60);
          countdown =  min + (min > 1 ? " Minutes Left" : " Minute Left");
        }
        else{ 
          countdown = '';
          this.props.getCredits(this.props.token);
        }

        return countdown;
    }

    render(){
        return(
            <View style={{backgroundColor: colors.backgroundGrey, flexDirection: 'column', flex: 1}}>
                <Header
                    style={{flex: 0}}
                    outerContainerStyles={{ 
                        backgroundColor: colors.lightPurple, 
                        height: Platform.OS === 'ios' ? 70 :  70 - 24, 
                        padding: Platform.OS === 'ios' ? 15 : 10
                    }}
                    //innerContainerStyles={{alignItems: Platform.OS === 'ios' ? 'flex-end' : 'center'}}
                    leftComponent={{ icon: 'menu',underlayColor:colors.transparent, color: colors.white, containerStyle:styles.headerIcon, onPress: () => this.props.navigation.navigate('DrawerOpen') }}
                    centerComponent={{ text: 'Your Lessons', style: { color: colors.white, fontSize: 18 } }}
                    //rightComponent={{ icon: 'settings',underlayColor:colors.transparent, color: colors.white, containerStyle:styles.headerIcon, 
                    //   onPress: () => {this.props.navigation.push('Settings')}}}
                />
                <ScrollView 
                    contentContainerStyle={{padding: spacing.normal, alignItems: 'stretch'}}
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={()=>this._onRefresh()}/>}
                >
                    {!this.props.admin && this.props.credits.unlimitedExpires <= Date.now()/1000 &&
                        <FlatList
                            scrollEnabled= {false}
                            ListHeaderComponent={
                                <View style={styles.cardHeader}>
                                    <Text style={{color: colors.white}}>Redeem a Lesson</Text>
                                </View>
                            }
                            data={[
                                {primary: 'Individual Lessons', 
                                    secondary: (this.props.credits && !this.props.credits.inProgress) ? this.props.credits.count+' Left':'', 
                                    disabled: this.props.credits.count < 1,
                                    action: this.props.credits.count < 1 ? null : ()=>{
                                        if(this.props.lessons.pending.length < 1){
                                            this.props.navigation.navigate('RedeemTop');
                                        }
                                        else{
                                            Alert.alert(
                                                'Swing Analysis Pending',
                                                'You already have a swing analysis in progress. Please wait for that analysis to finish before submitting a new swing. We guarantee a 48-hour turnaround on all lessons.',
                                                [{text: 'OK'}]
                                            );
                                        }
                                    }
                                }, 
                                {primary: 'Activate Unlimited', 
                                    secondary: (this.props.credits && !this.props.credits.inProgress) ? this.props.credits.unlimited+' Left':'', 
                                    disabled: this.props.credits.unlimited < 1,
                                    action: this.props.credits.unlimited < 1 ? null : ()=>{
                                        Alert.alert(
                                            'Activate Unlimited',
                                            'Activating your unlimited lessons deal will give you access to unlimited lessons for 30 days. The clock starts when you click Activate.',
                                            [
                                                {text: 'Cancel'},
                                                {text: 'Activate', 
                                                    onPress: () => {
                                                        this.setState({refreshing: true});
                                                        this.props.activateUnlimited(this.props.token);
                                                    }
                                                }
                                            ]
                                        )
                                    }
                                },
                                {primary: 'Order More', action: ()=> this.props.navigation.navigate('Order')}]}
                            renderItem={({item}) => 
                                <CardRow 
                                    primary={item.primary} 
                                    secondary={item.secondary}
                                    action={item.action}
                                    customStyle={item.customStyle}
                                    disabled={item.disabled}
                                />
                            }
                            keyExtractor={(item, index) => item.primary}
                        />
                    }

                    {!this.props.admin && this.props.credits.unlimitedExpires > Date.now()/1000 &&
                        <FlatList
                            scrollEnabled= {false}
                            ListHeaderComponent={
                                <View style={styles.cardHeader}>
                                    <Text style={{flex: 1, color: colors.white}}>Unlimited Lessons</Text>
                                    <Text style={{flex: 0, color: colors.white, textAlign: 'right'}}>{this._formatUnlimited()}</Text>
                                </View>
                            }
                            data={[
                                {primary: 'Submit a Swing', action: () => {
                                    if(this.props.lessons.pending.length < 1){
                                        this.props.navigation.navigate('RedeemTop');
                                    }
                                    else{
                                        Alert.alert(
                                            'Swing Analysis Pending',
                                            'You already have a swing analysis in progress. Please wait for that analysis to finish before submitting a new swing. We guarantee a 48-hour turnaround on all lessons.',
                                            [{text: 'OK'}]
                                        );
                                    }
                                }},
                                {primary: 'Individual Lessons', secondary: (this.props.credits && !this.props.credits.inProgress) ? this.props.credits.count+' Left':'', disabled: true}, 
                                {primary: 'Unlimited Rounds', secondary: (this.props.credits && !this.props.credits.inProgress) ? this.props.credits.unlimited+' Left':'', disabled: true}, 
                                {primary: 'Order More', action: ()=> this.props.navigation.navigate('Order')}]}
                            renderItem={({item}) => 
                                <CardRow 
                                    primary={item.primary} 
                                    secondary={item.secondary}
                                    action={item.action}
                                    customStyle={item.customStyle}
                                    disabled={item.disabled}
                                />
                            }
                            keyExtractor={(item, index) => item.primary}
                        />
                    }
                    {this.props.admin &&
                        <FlatList
                            style={{marginTop: spacing.normal}}
                            scrollEnabled= {false}
                            ListHeaderComponent={
                                <View style={styles.cardHeader}>
                                    <Text style={{color: colors.white}}>Active Lessons</Text>
                                </View>
                            }
                            data={this.props.lessons.pending}
                            ListEmptyComponent={!this.props.lessons.loading ?
                                <CardRow primary={'No Active Lessons'}/>
                                : <CardRow primary={'Loading Lessons...'}/>
                            }
                            renderItem={({item}) => 
                                <CardRow primary={item.request_date} secondary={item.username} />
                            }
                            keyExtractor={(item, index) => item.request_id}
                        />
                    }
                    <FlatList
                        style={{marginTop: spacing.normal}}
                        scrollEnabled= {false}
                        ListHeaderComponent={
                            <View style={styles.cardHeader}>
                                <Text style={{color: colors.white}}>Lesson History</Text>
                            </View>
                        }
                        data={this.props.admin ? this.props.lessons.closed : this.props.lessons.pending.concat(this.props.lessons.closed)}
                        ListEmptyComponent={!this.props.lessons.loading ?
                            <CardRow primary={'No Lessons'}/>
                            :<CardRow primary={'Loading Lessons...'}/>
                        }
                        renderItem={({item}) => 
                            item.response_video ? 
                                <CardRow 
                                    primary={item.request_date} 
                                    secondary={this.props.admin ? item.username : (parseInt(item.viewed, 10) === 0 ? "NEW" : null)} 
                                    action={() => {
                                        this.props.navigation.dispatch({type:'SELECT_LESSON', data:{id:item.request_id}});
                                        this.props.navigation.push('Lesson');
                                    }}
                                />
                                :
                                <CardRow primary={item.request_date} secondary={'in progress'} />
                        }
                        keyExtractor={(item, index) => item.request_id}
                    />
                </ScrollView>                
            </View>

        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Lessons);