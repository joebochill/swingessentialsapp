import React from 'react';
import {connect} from 'react-redux';

import {Text, View, FlatList} from 'react-native';
import {Button, Header} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

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
            <View style={{backgroundColor: '#f0f0f0'}}>
                <Header
                    outerContainerStyles={{ backgroundColor: '#231f61'}}
                    leftComponent={{ icon: 'menu', color: '#ffffff', onPress: () => this.props.navigation.navigate('DrawerOpen') }}
                    centerComponent={{ text: 'Swing Essentials', style: { color: '#ffffff', fontSize: 18 } }}
                    rightComponent={{ icon: 'settings', color: '#ffffff' }}
                />
                <FlatList
                    scrollEnabled= {false}
                    ListHeaderComponent={<View style={{height: 50, marginTop: 15, paddingLeft: 15, borderColor:'#231f61', borderTopWidth: 2, borderBottomWidth: 2, flexDirection:'row', alignItems:'center', backgroundColor:'rgba(35,31,97,0.8)'}}><Text style={{color: '#ffffff'}}>Recent Lessons</Text></View>}
                    data={[]}//{[{key: '2018-02-12'}, {key: '2018-01-30'}]}
                    ListEmptyComponent={<View style={{height: 50, paddingLeft: 15, flexDirection:'row', borderBottomColor:'#c1c1c1', borderBottomWidth:1, alignItems:'center', backgroundColor:'#ffffff'}}><Text style={{color:'#231f61'}}>{'No Lessons Yet - Submit Your Swing'}</Text></View>}
                    renderItem={({item}) => <View style={{height: 50, paddingLeft: 15, flexDirection:'row', borderBottomColor:'#c1c1c1', borderBottomWidth:1, alignItems:'center', backgroundColor:'#ffffff'}}><Text style={{color:'#231f61'}}>{item.key}</Text></View>}
                />
                <FlatList
                    scrollEnabled= {false}
                    ListHeaderComponent={<View style={{height: 50, marginTop: 15, paddingLeft: 15, borderColor:'#231f61', borderTopWidth: 2, borderBottomWidth: 2, flexDirection:'row', alignItems:'center', backgroundColor:'rgba(35,31,97,0.8)'}}><Text style={{color: '#ffffff'}}>Available Credits</Text></View>}
                    data={[{key: 'Individual Lessons'}, {key: 'Unlimited Rounds'}]}
                    renderItem={({item}) => <View style={{height: 50, paddingLeft: 15, flexDirection:'row', borderBottomColor:'#c1c1c1', borderBottomWidth:1, alignItems:'center', backgroundColor:'#ffffff'}}><Text style={{color:'#231f61'}}>{item.key}</Text></View>}
                />
                <Button
                    title="Order Lessons"
                    icon={
                        {
                          name:'attach-money',
                          size:24,
                          color:'white',
                          style:{marginRight: 0}
                        }
                    }
                    onPress={() => this.props.navigation.navigate('OrderDetails')}
                    buttonStyle={{
                        backgroundColor: "rgba(35,31,97,0.8)",
                        width: '100%',
                        height: 50,
                        borderColor: "#231f61",
                        borderWidth: 2,
                        borderRadius: 5,
                        marginTop: 15
                    }}
                />    
                <Button
                    title="Submit Your Swing"
                    icon={
                        {
                          name:'camera-alt',
                          size:24,
                          color:'white',
                          style:{marginRight: 5}
                        }
                    }
                    onPress={() => this.props.navigation.navigate('Redeem')}
                    buttonStyle={{
                        backgroundColor: "rgba(35,31,97,0.8)",
                        width: '100%',
                        height: 50,
                        borderColor: "#231f61",
                        borderWidth: 2,
                        borderRadius: 5,
                        marginTop: 15
                    }}
                />                   
            </View>

        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);