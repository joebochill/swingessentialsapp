import React from 'react';
import {connect} from 'react-redux';

import {Text, View, ScrollView, FlatList, RefreshControl} from 'react-native';
import Header from '../Header/Header';
import styles, {colors, spacing} from '../../styles/index';
import {scale} from '../../styles/dimension';

import {getTips} from '../../actions/TipActions';

import CardRow from '../Card/CardRow';

function mapStateToProps(state){
    return {
        token: state.login.token,
        admin: state.login.admin,
        tips: state.tips
    };
}
function mapDispatchToProps(dispatch){
    return {
        getTips: (token = null) => dispatch(getTips(token)),
    };
}

class Tips extends React.Component{
    constructor(props){
        super(props);
        this.state={
            refreshing: false
        }
    }
    componentWillReceiveProps(nextProps){

        if(!nextProps.tips.loading){
            this.setState({refreshing: false});
        }
    }

    _onRefresh(){
        this.setState({refreshing: true});
        this.props.getTips(this.props.token);
    }

    // returns the tips list categorized by year
    tipsByYear() {
        return this.props.tips.tipList.reduce(function(newTips, tip) {
            const year = tip.date.split('-',3)[0];
            if (!newTips[year]) { newTips[year] = []; }
            newTips[year].push(tip);
            return newTips;
        }, {});
    }

    render(){
        const splitTips = this.tipsByYear();
        return(
            <View style={{backgroundColor: colors.backgroundGrey, flexDirection: 'column', flex: 1}}>
                <Header title={'Tip of the Month'} navigation={this.props.navigation}/>
                <ScrollView 
                    contentContainerStyle={{padding: spacing.normal, alignItems: 'stretch'}}
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={()=>this._onRefresh()}/>}
                >
                    {Object.keys(splitTips).sort().reverse().map((year, index) =>
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
                            data={splitTips[year]}
                            ListEmptyComponent={!this.props.tips.loading ?
                                <CardRow primary={'No Tips'}/>
                                :<CardRow primary={'Loading Tips...'}/>
                            }
                            renderItem={({item}) => 
                                <CardRow 
                                    primary={item.title} 
                                    action={() => this.props.navigation.push('Tip', {tip: item})}
                                />
                            }
                            keyExtractor={(item, index) => ('tip_'+item.id)}
                        />
                    )}
                </ScrollView>                
            </View>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Tips);