import React from 'react';
import {connect} from 'react-redux';

import { 
    Alert,
    Platform
  } from 'react-native';
import {Header} from 'react-native-elements';

import styles, {colors} from '../../styles/index';
import {verticalScale} from '../../styles/dimension';

import {requestLogout} from '../../actions/LoginActions';

function mapStateToProps(state){
    return {
        token: state.login.token
    };
  }
function mapDispatchToProps(dispatch){
    return {
        logout: (token) => {dispatch(requestLogout(token))}
    };
}

class CustomHeader extends React.Component {
    render() {
        return (
            <Header
            style={{flex: 0}}
            outerContainerStyles={{ 
                backgroundColor: colors.lightPurple, 
                height: verticalScale(Platform.OS === 'ios' ? 70 :  70 - 24), 
                padding: verticalScale(Platform.OS === 'ios' ? 15 : 10)
            }}
            //innerContainerStyles={{alignItems: Platform.OS === 'ios' ? 'flex-end' : 'center'}}
            leftComponent={{ 
                icon: this.props.type === 'back' ? 'arrow-back' : 'menu',
                size: verticalScale(26),
                underlayColor:colors.transparent,
                containerStyle:styles.headerIcon, 
                color: colors.white, 
                onPress: this.props.type === 'back' ? 
                    () => this.props.navigation.pop() :
                    () => this.props.navigation.openDrawer()
            }}
            centerComponent={{ 
                text: this.props.title, 
                style: { color: colors.white, fontSize: verticalScale(18) } 
            }}
            rightComponent={{ 
                icon: (this.props.type === 'refresh') ? 'refresh' : this.props.token ? 'exit-to-app' : 'person',
                size: verticalScale(26),
                underlayColor:colors.transparent, 
                color: colors.white, 
                containerStyle:styles.headerIcon, 
                onPress: (this.props.type === 'refresh') ? () => this.props.onRefresh() : (!this.props.token ? 
                    () => this.props.navigation.push('Auth') : 
                    () => Alert.alert(
                        'Log Out',
                        'Are you sure you want to log out?',
                        [
                            {text: 'Cancel'},
                            {text: 'Log Out', 
                                onPress: () => {
                                    this.props.logout(this.props.token);
                                }
                            }
                        ]
                    ))
                }}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomHeader);
