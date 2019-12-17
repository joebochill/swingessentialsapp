import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Body } from '@pxblue/react-native-components';
import { SEHeader } from '../../../components/index';

import { sharedStyles, spaces, purple } from '../../../styles';
import { SettingsState, ApplicationState } from '../../../__types__';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { putSettings } from '../../../redux/actions/SettingsActions';

type SettingType = {
    name: keyof Exclude<SettingsState, 'loading'>;
    label: string;
    description: string;
    values: number[] | string[] | boolean[];
}
const SETTINGS: SettingType[] = [
    {
        name: 'handedness',
        label: 'Handedness',
        description: 'Your dominant hand for golfing',
        values: ['Right', 'Left']
    },
    {
        name: 'duration',
        label: 'Camera Duration',
        description: 'How long to record for each swing',
        values: [5, 8, 10]
    },
    {
        name: 'delay',
        label: 'Camera Delay',
        description: 'How long to wait between pressing record and the start of the recording',
        values: [0, 5, 10]
    },
    {
        name: 'overlay',
        label: 'Camera Overlay',
        description: 'Overlay shows an image of how you should stand while recording your swing',
        values: [true, false]
    },
];
const caseSame = (val1: string | number, val2: string | number): boolean => {
    if (typeof val1 === 'string' && typeof val2 === 'string') {
        return val1.toLowerCase() === val2.toLowerCase();
    }
    return val1 === val2;
}

export const SingleSetting = (props: NavigationStackScreenProps) => {
    const { navigation } = props;
    const settings = useSelector((state: ApplicationState) => state.settings);
    const currentSettingName: keyof SettingsState = navigation.getParam('setting', null);

    const dispatch = useDispatch();

    if (!currentSettingName) {
        navigation.pop();
        return null;
    }
    const currentSetting: SettingType = SETTINGS.filter((setting) => setting.name === currentSettingName)[0];

    const [value, setValue]: [any, Function] = useState(settings[currentSettingName]);

    const _updateSetting = useCallback(() => {
        dispatch(putSettings({
            [currentSettingName]: value
        }))
    }, [value, dispatch]);

    return (
        <View style={sharedStyles.pageContainer}>
            <SEHeader
                mainAction={'back'}
                title={'Settings'}
                subtitle={currentSetting.label}
                showAuth={false}
                onNavigate={() => _updateSetting()}
            />
            <View style={{ marginTop: spaces.medium }}>
                {currentSetting.values.map((val, index) => (
                    <ListItem
                        containerStyle={[sharedStyles.listItem]}
                        contentContainerStyle={sharedStyles.listItemContent}
                        bottomDivider
                        topDivider={index === 0}
                        onPress={(): void => setValue(val)}
                        title={<Body>{`${typeof val === 'boolean' ? (val ? 'On' : 'Off') : val}${typeof val === 'number' ? 's' : ''}`}</Body>}
                        rightIcon={caseSame(value, val)
                            ? { name: 'check', color: purple[500] }
                            : undefined
                        }
                    />
                ))}
                <Body style={[sharedStyles.paddingHorizontalMedium, { marginTop: spaces.medium }]}>{currentSetting.description}</Body>
            </View>
        </View>
    )
};


// import React from 'react';
// import {connect} from 'react-redux';

// import { 
//   View, 
//   Text,
//   ScrollView,
//   StyleSheet,
//   Switch,
//   Platform
// } from 'react-native';
// import {Header} from 'react-native-elements';
// import styles, {colors, spacing} from '../../styles/index';
// import {verticalScale} from '../../styles/dimension';

// import CardRow from '../Card/CardRow';
// import {putSettings} from '../../actions/UserDataActions';

// function mapStateToProps(state){
//   return {
//     token: state.login.token,
//     settings: state.settings
//   };
// }

// function mapDispatchToProps(dispatch){
//   return {
//     updateSettings: (settings, token) => {dispatch(putSettings(settings, token));}
//   };
// }

// class SettingScreen extends React.Component{
//   constructor(props){
//     super(props);
//     this.descriptions = {
//       Overlay: 'Overlay shows an image of how you should stand while recording your swing',
//       Delay: 'How long to wait between pressing record and the start of the recording',
//       Duration: 'How long to record for each swing',
//       Handedness: 'Your dominant hand for golfing'
//     };
//     this.durations = [5,8,10];
//     this.delays = [0,5,10];
//     this.hands = ['Right', 'Left'];
//     this.state={
//       setting: props.navigation.getParam('setting', ''),
//       value: props.settings[props.navigation.getParam('setting', '').toLowerCase()]
//     };
//   }


//   _getNewSettingsObject(){
//     switch(this.state.setting){
//       case 'Handedness':
//         return {handed: this.state.value.toLowerCase()};
//       case 'Duration':
//         return {camera_duration: this.state.value};
//       case 'Delay':
//         return {camera_delay: this.state.value};
//       case 'Overlay':
//         return {camera_overlay: this.state.value}
//       default:
//         return {};
//     }
//   }


//   render(){
//     return (
//       <View style={{backgroundColor: colors.backgroundGrey, flexDirection: 'column', flex: 1}}>
//         <Header
//             style={{flex: 0}}
//             outerContainerStyles={{ 
//               backgroundColor: colors.lightPurple, 
//               height: verticalScale(Platform.OS === 'ios' ? 70 :  70 - 24), 
//               padding: verticalScale(Platform.OS === 'ios' ? 15 : 10)
//             }}
//             //innerContainerStyles={{alignItems: Platform.OS === 'ios' ? 'flex-end' : 'center'}}
//             leftComponent={{ 
//               icon: 'arrow-back',
//               size: verticalScale(26),
//               underlayColor:colors.transparent,
//               containerStyle:styles.headerIcon, 
//               color: colors.white, 
//               onPress: () => {
//                 this.props.updateSettings(this._getNewSettingsObject(),this.props.token);
//                 this.props.navigation.pop();
//               }
//             }}
//             centerComponent={{ text: this.state.setting, style: { color: colors.white, fontSize: verticalScale(18) } }}
//         />
//         <ScrollView contentContainerStyle={{alignItems: 'stretch'}}>
//           {this.state.setting === 'Overlay' && 
//             <View style={{paddingTop: spacing.normal}}>
//               <CardRow 
//                 customStyle={{borderTopWidth: 1}}
//                 primary={this.state.setting} 
//                 secondaryInput={
//                   <Switch 
//                     value={this.state.value} 
//                     onValueChange={(val) => this.setState({value: val})}
//                     trackColor={colors.lightPurple}
//                     onTintColor={colors.lightPurple}
//                   />
//                 } 
//               />
//               <Text style={StyleSheet.flatten([styles.paragraph, {
//                   marginTop: spacing.small,
//                   paddingLeft: spacing.normal, 
//                   paddingRight: spacing.normal
//                 }])}>
//                 {this.descriptions[this.state.setting]}
//               </Text>
//             </View>
//           }
//           {this.state.setting === 'Duration' && 
//             <View style={{paddingTop: spacing.normal}}>
//               {this.durations.map((item,index) => 
//                 <CardRow key={'row_'+index}
//                   customStyle={
//                     index === 0 ? {borderTopWidth: 1} : {}}
//                   primary={item+'s'} 
//                   menuItem
//                   selected={this.state.value === item}
//                   action={()=>this.setState({value: item})}
//                 />
//               )}
//               <Text style={StyleSheet.flatten([styles.paragraph, {
//                   marginTop: spacing.small,
//                   paddingLeft: spacing.normal, 
//                   paddingRight: spacing.normal
//                 }])}>
//                 {this.descriptions[this.state.setting]}
//               </Text>
//             </View>
//           }
//           {this.state.setting === 'Delay' && 
//             <View style={{paddingTop: spacing.normal}}>
//               {this.delays.map((item,index) => 
//                 <CardRow key={'row_'+index}
//                   customStyle={
//                     index === 0 ? {borderTopWidth: 1} : {}}
//                   primary={item+'s'} 
//                   menuItem
//                   selected={this.state.value === item}
//                   action={()=>this.setState({value: item})}
//                 />
//               )}
//               <Text style={StyleSheet.flatten([styles.paragraph, {
//                   marginTop: spacing.small,
//                   paddingLeft: spacing.normal, 
//                   paddingRight: spacing.normal
//                 }])}>
//                 {this.descriptions[this.state.setting]}
//               </Text>
//             </View>
//           }
//           {this.state.setting === 'Handedness' && 
//             <View style={{paddingTop: spacing.normal}}>
//               {this.hands.map((item,index) => 
//                 <CardRow key={'row_'+index}
//                   customStyle={
//                     index === 0 ? {borderTopWidth: 1} : {}}
//                   primary={item} 
//                   menuItem
//                   selected={this.state.value === item}
//                   action={()=>this.setState({value: item})}
//                 />
//               )}
//               <Text style={StyleSheet.flatten([styles.paragraph, {
//                   marginTop: spacing.small,
//                   paddingLeft: spacing.normal, 
//                   paddingRight: spacing.normal
//                 }])}>
//                 {this.descriptions[this.state.setting]}
//               </Text>
//             </View>
//           }

//         </ScrollView>
//       </View>
//     );
//   }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);
