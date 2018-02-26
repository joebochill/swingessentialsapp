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
        // username: state.userData.username
    };
}
function mapDispatchToProps(dispatch){
    return {

    };
}

class Home extends React.Component{
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
                            {key: 'Individual Lessons', sub: '5 Left', action: ()=>alert('redeem individual')}, 
                            {key: 'Activate Unlimited', sub: '1 Left', action: ()=>alert('activate unlimited')}, 
                            {key: 'Order More', action: ()=>alert('order more')}]}
                        renderItem={({item}) => 
                            <CardRow 
                                primary={item.key} 
                                secondary={item.sub}
                                action={item.action}
                                keyExtractor={(item, index) => item.key}
                            />
                        }
                    />
                    <FlatList
                        style={{marginTop: spacing.normal}}
                        scrollEnabled= {false}
                        ListHeaderComponent={
                            <View style={styles.cardHeader}>
                                <Text style={{color: colors.white}}>In Progress</Text>
                            </View>
                        }
                        data={[]}
                        ListEmptyComponent={
                            <CardRow primary={'No Lessons In Progress'}/>
                        }
                        renderItem={({item}) => 
                            <CardRow primary={item.key} action={() => alert('lesson')} />
                        }
                    />
                    <FlatList
                        style={{marginTop: spacing.normal}}
                        scrollEnabled= {false}
                        ListHeaderComponent={
                            <View style={styles.cardHeader}>
                                <Text style={{color: colors.white}}>Completed</Text>
                            </View>
                        }
                        data={[{key: '2018-02-12', new: true}, {key: '2018-01-30', new: false}]}
                        ListEmptyComponent={
                            <CardRow primary={'No Completed Lessons'}/>
                        }
                        renderItem={({item}) => 
                            <CardRow primary={item.key} secondary={item.new ? "NEW" : null} action={() => alert('lesson')} />
                        }
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