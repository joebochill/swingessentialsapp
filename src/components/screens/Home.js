import React from 'react';
import {connect} from 'react-redux';

import {Text, View, ScrollView, FlatList} from 'react-native';
import {Button, Header} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles, {colors, spacing, altStyles} from '../../styles/index';

import CardRow from '../Card/CardRow';

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

    };
}

class Home extends React.Component{
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
    render(){
        return(
            <View style={{backgroundColor: colors.backgroundGrey, flexDirection: 'column', flex: 1}}>
                <Header
                    style={{flex: 0}}
                    outerContainerStyles={{ backgroundColor: colors.lightPurple}}
                    leftComponent={{ icon: 'menu',underlayColor:'transparent', color: colors.white, onPress: () => this.props.navigation.navigate('DrawerOpen') }}
                    centerComponent={{ text: 'Your Lessons', style: { color: colors.white, fontSize: 18 } }}
                    rightComponent={{ icon: 'settings', color: colors.white }}
                />
                <ScrollView contentContainerStyle={{padding: spacing.normal, alignItems: 'stretch'}}>
                    <FlatList
                        scrollEnabled= {false}
                        ListHeaderComponent={
                            <View style={styles.cardHeader}>
                                <Text style={{color: colors.white}}>Redeem a Lesson</Text>
                            </View>
                        }
                        data={[
                            {primary: 'Individual Lessons', secondary: this.props.credits?this.props.credits.count+' Left':'', action: ()=>alert('redeem individual')}, 
                            {primary: 'Activate Unlimited', secondary: this.props.credits?this.props.credits.unlimited+' Left':'', action: ()=>alert('activate unlimited')}, 
                            {primary: 'Order More', action: ()=>alert('order more')}]}
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
                        ListEmptyComponent={
                            <CardRow primary={'No Lessons In Progress'}/>
                        }
                        renderItem={({item}) => 
                            <CardRow primary={item.request_date} action={() => alert('lesson')} />
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
                        ListEmptyComponent={
                            <CardRow primary={'No Completed Lessons'}/>
                        }
                        renderItem={({item}) => 
                            <CardRow primary={item.request_date} secondary={item.new ? "NEW" : null} action={() => alert('lesson')} />
                        }
                        keyExtractor={(item, index) => item.request_id}
                    />
                    
                    {/* <Button
                        title="Order Lessons"
                        icon={{...altStyles.buttonIcon,
                            name:'attach-money',
                        }}
                        onPress={() => this.props.navigation.navigate('OrderDetails')}
                        buttonStyle={styles.purpleButton}
                        containerViewStyle={{width: '100%', flex: 0, marginLeft: 0}}
                    />    
                    <Button
                        title="Submit Your Swing"
                        icon={{...altStyles.buttonIcon,
                            name:'camera-alt',
                            style: {marginRight: 5}
                        }}
                        onPress={() => this.props.navigation.navigate('Redeem')}
                        buttonStyle={styles.purpleButton}
                        containerViewStyle={{width: '100%', flex: 0, marginLeft: 0}}
                    />    */}
                </ScrollView>                
            </View>

        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);