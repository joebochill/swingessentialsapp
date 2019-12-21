import React, { useState, useEffect, useCallback } from 'react';
import { spaces, whiteOpacity, purple, sharedStyles } from '../../styles';
import { Modal, StyleSheet, View, ModalProps } from 'react-native';
import { Icon } from 'react-native-elements';
import { H7, Body } from '@pxblue/react-native-components';
import { SEButton } from '../SEButton';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from '../../__types__';
import { atob } from '../../utilities';
import { requestLogout, refreshToken } from '../../redux/actions';

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        padding: spaces.xLarge,
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor: whiteOpacity(0.75),
    },
});

export const TokenModal = (props: ModalProps) => {
    const { ...other } = props;
    const token = useSelector((state: ApplicationState) => state.login.token);
    const [timeRemaining, setTimeRemaining] = useState(-1);
    const [engageCountdown, setEngageCountdown] = useState(false);
    const dispatch = useDispatch();
    const [updateRate, setUpdateRate] = useState(1);

    useEffect(() => {
        if (token) {
            const exp = JSON.parse(atob(token.split('.')[1])).exp;
            setTimeRemaining(exp - Date.now() / 1000);
            setEngageCountdown(true);
        }
        else {
            setTimeRemaining(0);
            setEngageCountdown(false);
        }
    }, [token]);

    useEffect(() => {
        if (!token || !engageCountdown) return;

        let interval: number = 0;
        if (timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(timeRemaining => timeRemaining - updateRate);
            }, updateRate * 1000);
            updateRefreshRate();
        } else {
            dispatch(requestLogout(token || ''))
        }

        return () => clearInterval(interval);
    }, [timeRemaining, engageCountdown, token]);

    const updateRefreshRate = useCallback(() => {
        if (timeRemaining <= 3 * 60) setUpdateRate(1);
        else if (timeRemaining <= 10 * 60) setUpdateRate(1 * 60);
        else if (timeRemaining <= 20 * 60) setUpdateRate(3 * 60);
        else setUpdateRate(30 * 60);
    }, [timeRemaining, setTimeRemaining]);


    return (
        <Modal
            animationType="slide"
            transparent={true}
            onRequestClose={() => { }}
            onDismiss={() => { }}
            visible={token !== null && timeRemaining < 29 * 60 /*&& (timeRemaining < (3 * 60))*/} // TODO update
            {...other}
        >
            <View style={styles.modalBackground}>
                <View
                    style={[
                        sharedStyles.border,
                        {
                            backgroundColor: purple[50],
                            padding: spaces.medium,
                        },
                    ]}>
                    <View style={{ flexDirection: 'row', marginBottom: spaces.medium }}>
                        <Icon name={'clock-alert-outline'} type={'material-community'} color={purple[500]} containerStyle={{ marginRight: spaces.small }} />
                        <H7 style={{ flex: 1 }}>{`Session Expiring`}</H7>
                        <Body>{_formatTime(timeRemaining)}</Body>
                    </View>
                    <Body>{`Your current session is about to expire. Click below to stay signed in.`}</Body>

                    <SEButton
                        title="KEEP ME SIGNED IN"
                        style={{ marginTop: spaces.medium }}
                        onPress={() => dispatch(refreshToken())}
                    />
                </View>
            </View>
        </Modal>
    );
};

const _formatTime = (remaining: number): string => {
    if (!remaining || remaining <= 0) {
        return '00:00';
    }

    const min = Math.floor(remaining / 60);
    const sec = Math.floor(remaining - min * 60);

    return ((min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec));
}


// import React from 'react';
// import { Text, View, TouchableHighlight, StyleSheet, Modal } from 'react-native';
// import {Button} from 'react-native-elements';
// import styles, {colors, spacing} from '../../styles/index';
// import {connect} from 'react-redux';
// import {atob} from '../../utils/base64';
// import {refreshToken, requestLogout, showLogoutWarning} from '../../actions/LoginActions';

// import MaterialIcons from 'react-native-vector-icons/Ionicons';
// import { REFRESH_TOKEN } from '../../actions/LoginActions';

// function mapStateToProps(state){
//     return {
//         token: state.login.token
//     };
// }
// function mapDispatchToProps(dispatch){
//     return {
//         dispatch: action => action,
//         refreshToken: (token) => {dispatch(refreshToken(token))},
//         logout: (token) => {dispatch(requestLogout(token))},
//         showLogoutWarning: (show) => dispatch(showLogoutWarning(show))
//     };
// }

// class TokenExpireModal extends React.Component {
//     constructor(props){
//         super(props);
//         this.state={
//             visible: true,
//             time: ''
//         };
//     }
//     componentWillMount(){
//         if(this.props.token){
//             this.exp = JSON.parse(atob(this.props.token.split('.')[1])).exp;
//             this._checkTokenTimeout();
//             this.tokenTimer = setInterval(() => this._checkTokenTimeout(), 1000);
//         }
//     }
//     componentWillUnmount(){
//         if(this.tokenTimer){clearInterval(this.tokenTimer);}
//     }
//     _cancel(){
//         this.props.showLogoutWarning(false);
//     }

//     _okay(){
//         this.props.refreshToken(this.props.token);
//         this._cancel();
//     }
//       // Periodically checks the token timeout and will show a renew dialog if the time is < 5 minutes, < 2 minutes
//     _checkTokenTimeout(){
//         if(!this.props.token){
//             if(this.tokenTimer){clearInterval(this.tokenTimer);}
//             return;
//         }
//         let remaining = this.exp - Date.now()/1000;

//         if(remaining <= 0){
//             if(this.tokenTimer){clearInterval(this.tokenTimer);}
//             this.props.logout();
//             return;
//         }

//         let min = Math.floor(remaining/60);
//         min = (min < 10) ? '0' + min : min;
//         let sec = Math.floor(remaining-min*60);
//         sec = (sec < 10) ? '0' + sec : sec;

//         remaining = min + ':' + sec;
//         this.setState({time: remaining});
//     }
//     render() {
//         return (
//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={this.state.visible}
//                 onRequestClose={this._cancel.bind(this)}
//             >
//                 <View style={{
//                     flex: 1, 
//                     padding: spacing.normal, 
//                     alignItems: 'center', 
//                     justifyContent: 'center',
//                     backgroundColor: 'rgba(255,255,255,0.55)'
//                 }}>
//                     <View style={{
//                         flex: 0, 
//                         alignItems: 'stretch', 
//                         backgroundColor: colors.backgroundGrey,
//                         borderWidth: 1,
//                         borderColor: colors.purple
//                     }}>
//                         <View style={{padding: spacing.normal, paddingBottom: 0}}>
//                             <Text style={{fontWeight: 'bold', color: colors.purple}}>{'Session Expiration In: ' + this.state.time}</Text>
//                         </View>
//                         <View style={{padding: spacing.normal}}>
//                             <Text style={{color: colors.purple}}>Your session is about to expire. Click below to stay signed in.</Text>
//                             <Button
//                                 title="KEEP ME SIGNED IN"
//                                 onPress={this._okay.bind(this)}
//                                 buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal, marginLeft: 0}])}
//                                 containerViewStyle={StyleSheet.flatten([styles.buttonContainer, {marginLeft: 0, marginRight: 0, alignSelf: 'center'}])}
//                             />
//                         </View>
//                     </View>
//                 </View>
//             </Modal>
//         );
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(TokenExpireModal);