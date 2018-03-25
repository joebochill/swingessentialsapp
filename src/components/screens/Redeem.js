import React from 'react';
import {connect} from 'react-redux';

import {ActivityIndicator, Keyboard, Alert, Image, Text, Platform, TouchableOpacity, View, ScrollView, StyleSheet} from 'react-native';
import styles, {sizes, colors, spacing, altStyles} from '../../styles/index';
import {FormInput, FormLabel, FormValidationMessage, Button, Icon, Header} from 'react-native-elements';
import {redeemCredit} from '../../actions/LessonActions';
import KeyboardView from '../Keyboard/KeyboardView';
import Video from 'react-native-video';

var ImagePicker = require('react-native-image-picker');

import {atob} from '../../utils/base64';

import downtheline from '../../images/downtheline.png';
import faceon from '../../images/faceon.png';

function mapStateToProps(state){
    return {
        token: state.login.token,
        credits: state.credits,
        lessons: state.lessons.pending,
        redeemPending: state.lessons.redeemPending,
        redeemSuccess: state.lessons.redeemSuccess
    };
}
function mapDispatchToProps(dispatch){
    return {
        redeemCredit: (data, token, onProgress) => {dispatch(redeemCredit(data, token, onProgress))}
    };
}

class Redeem extends React.Component{
    constructor(props){
        super(props);
        this.state={
            foSource: null,
            dtlSource: null,
            foPlaying: false,
            dtlPlaying: false,
            notes: '',
            progress: 0,
            role: 'pending'
        }
    }
    componentWillMount(){
        if(!this.props.token){
            this.props.navigation.navigate('Login');
        }
        else{
            if(this.props.lessons.length > 0){
                Alert.alert(
                    'Swing Analysis Pending',
                    'You already have a swing analysis in progress. Please wait for that analysis to finish before submitting a new swing. We guarantee a 48-hour turnaround on all lessons.',
                    [{text: 'OK'}]
                );
                this.props.navigation.navigate('Lessons')
            }
            const role = JSON.parse(atob(this.props.token.split('.')[1])).role;
            if(role === 'pending'){
                this.setState({role: 'pending'});
                // Alert.alert(
                //     'Email Verification',
                //     'You must verify your email address before you can submit lessons.',
                //     [{text: 'OK'}]
                // );
            }
            else{
                this.setState({role: role});
            }
        }
    }

    componentWillReceiveProps(nextProps){
        if(!nextProps.token){
            this.props.navigation.navigate('Login');
        }
        if(nextProps.redeemSuccess && !this.props.redeemSuccess){
            Alert.alert(
                'Success!',
                'Your lesson request was submitted successfully. We are working on your analysis.',
                [{text: 'OK'}]
            );
            this.props.navigation.navigate('Lessons');
        }
        else if(nextProps.credits.count < 1 && nextProps.credits.unlimitedExpires < Date.now()/1000){
            Alert.alert(
                'Out of Credits',
                'Looks like you\'re all out of lesson credits. Head over to the Order page to stock up.',
                [
                    {text: 'Order More', onPress: () => this.props.navigation.navigate('Order')},
                    {text: 'Back to Lessons', onPress: () => this.props.navigation.navigate('Lessons')}
                ],
                {onDismiss: () => this.props.navigation.navigate('Lessons')}
            );
        }
        else if(nextProps.lessons.length > 0 && !nextProps.redeemSuccess){
            Alert.alert(
                'Swing Analysis Pending',
                'You already have a swing analysis in progress. Please wait for that analysis to finish before submitting a new swing. We guarantee a 48-hour turnaround on all lessons.',
                [{text: 'OK'}]
            );
            this.props.navigation.navigate('Lessons')
        }
        else if(this.props.redeemPending && !nextProps.redeemPending && !nextProps.redeemSuccess){
            Alert.alert(
                'Oops',
                'There was an unexpected error while submitting your swing videos. Please try again later or contact us if the problem persists.',
                [
                    {text: 'Back to Lessons', onPress: () => this.props.navigation.navigate('Lessons')}
                ],
                {onDismiss: () => this.props.navigation.navigate('Lessons')}
            );
        }
    }

    // Shows the picker option for recording a new swing video or choosing one from the library
    _showPicker(swing){
        ImagePicker.showImagePicker(
            {
                title: 'Select a Swing Video',
                takePhotoButtonTitle: 'Record a New Video',
                chooseFromLibraryButtonTitle: 'Choose From Library',
                videoQuality: 'low',
                mediaType: 'video',//video
                durationLimit: 10,
                storageOptions: {
                    skipBackup: true,
                    path: 'images'
                }
            }, 
            (response) => {
           
                if (response.didCancel) {
                    //do nothing
                }
                else if (response.error) {
                    alert('There was an error choosing a video. Try again later.');//response.error
                }
                else {
                    this.setState({
                        [swing]: { uri: response.uri }
                    });
                }
            }
        );
    }

    _redeemLesson(){
        Keyboard.dismiss();
        if(this.props.redeemPending){ return;}
        if(Platform.OS === 'ios' && (!this.foplayer || !this.dtlplayer)){
            return;
        }
        if(!this.state.foSource || !this.state.dtlSource){
            this.setState({error: 'Missing Required Videos'});
            return;
        }

        let data = new FormData();
        data.append('fo', {
            name: 'fo.mov', 
            uri: this.state.foSource.uri, 
            type:(Platform.OS === 'android' ? 'video/mp4' :'video/mov')
        });
        data.append('dtl', {
            name: 'dtl.mov', 
            uri: this.state.dtlSource.uri, 
            type:(Platform.OS === 'android' ? 'video/mp4' :'video/mov')
        });
        data.append('notes', this.state.notes);

        this.props.redeemCredit(data, this.props.token, this._updateProgress.bind(this));
        this.scroller.scrollTo({x: 0, y: 0, animated: true});
    }

    _updateProgress(event){
        this.setState({progress: (event.loaded/event.total)*100});
    }

    render(){
        return(
            <View style={{backgroundColor: colors.backgroundGrey, flexDirection: 'column', flex: 1}}>
                <Header
                    style={{flex: 0}}
                    outerContainerStyles={{ backgroundColor: colors.lightPurple}}
                    leftComponent={{ icon: 'menu',underlayColor:colors.transparent, color: colors.white, containerStyle:styles.headerIcon, onPress: () => this.props.navigation.navigate('DrawerOpen') }}
                    centerComponent={{ text: 'Submit Your Swing', style: { color: colors.white, fontSize: 18 } }}
                />

                <KeyboardView
                    fixed={
                        <Button
                            title="SUBMIT"
                            disabled={this.props.redeemPending || this.state.role === 'pending' || !this.state.foSource || !this.state.dtlSource}
                            disabledStyle={styles.disabledButton}
                            onPress={()=>this._redeemLesson()}
                            buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.normal}])}
                            containerViewStyle={styles.buttonContainer}
                        />
                    }
                >
                    <ScrollView 
                        ref={(ref) => this.scroller = ref}
                        //keyboardShouldPersistTaps={'always'}
                        >
                        {this.state.role === 'pending' && 
                            <FormValidationMessage 
                                containerStyle={StyleSheet.flatten([styles.formValidationContainer, {marginTop: 0, marginBottom: spacing.normal}])} 
                                labelStyle={styles.formValidation}>
                                {'You must verify your email address before you can submit lessons.'}
                            </FormValidationMessage>
                        }
                        {this.props.redeemPending && 
                            <View style={{marginBottom: spacing.normal}}>
                                <ActivityIndicator color={colors.purple}/>
                                <Text style={{color: colors.purple, textAlign: 'center', width: '100%'}}>
                                    {this.state.progress < 100 ?
                                        ('Uploading Video Files... ' + this.state.progress.toFixed(2)+'%')
                                        : 'Creating lesson...'
                                    }
                                </Text>
                            </View>
                        }
                        <FormLabel 
                            containerStyle={styles.formLabelContainer} 
                            labelStyle={StyleSheet.flatten([styles.formLabel])}>
                            Your Swing Videos
                        </FormLabel>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.small}}>
                            <View style={{flex: 1, marginRight: spacing.normal}}>
                                <View style={{flex: 0, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.purple, backgroundColor: this.state.foSource && Platform.OS === 'ios' ? colors.black: colors.white, height: sizes.large}}>
                                    {this.state.foSource && (Platform.OS === 'ios') &&
                                        <TouchableOpacity style={{height:'100%', width: '100%'}} 
                                            underlayColor={colors.black}
                                            onPress={()=>this.setState({foPlaying: !this.state.foPlaying})}> 
                                            <Video source={this.state.foSource}    // Can be a URL or a local file.
                                                //poster="https://baconmockup.com/300/200/" // uri to an image to display until the video plays
                                                ref={(ref) => {
                                                    this.foplayer = ref
                                                }}                                      // Store reference
                                                rate={1.0}                              // 0 is paused, 1 is normal.
                                                volume={1.0}                            // 0 is muted, 1 is normal.
                                                muted={false}                           // Mutes the audio entirely.
                                                paused={!this.state.foPlaying}                          // Pauses playback entirely.
                                                onEnd={()=>this.setState({foPlaying: false})}
                                                resizeMode="contain"                    // Fill the whole screen at aspect ratio.*
                                                repeat={true}                           // Repeat forever.
                                                playInBackground={false}                // Audio continues to play when app entering background.
                                                playWhenInactive={false}                // [iOS] Video continues to play when control or notification center are shown.
                                                ignoreSilentSwitch={"ignore"}           // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual.
                                                style={{height:'100%', width: '100%'}}
                                            />
                                        </TouchableOpacity>    
                                    }
                                    {(!this.state.foSource || (this.state.foSource && Platform.OS==='android')) && 
                                        <TouchableOpacity style={{height:'100%', width: '100%'}} 
                                            onPress={()=>this._showPicker('foSource')}> 
                                            <Image
                                                resizeMethod='resize'
                                                style={{height:'100%', width: '100%', resizeMode: 'contain'}}
                                                source={faceon}
                                            />
                                            {Platform.OS === 'android' && this.state.foSource &&
                                                <Icon 
                                                    containerStyle={{position: 'absolute', bottom: spacing.tiny, left: spacing.tiny}}
                                                    name={'check-circle'} 
                                                    size={sizes.normal} 
                                                    color={'#4caf50'}
                                                />
                                            }
                                        </TouchableOpacity>
                                    }
                                </View>
                                <Button
                                    containerViewStyle={{flex: 0}}
                                    onPress={() => this._showPicker('foSource')}
                                    title={'Face-On'}
                                    icon={{name: 'camera-alt', color: colors.purple}}
                                    backgroundColor={colors.transparent}
                                    textStyle={{color: colors.purple}}
                                />
                            </View>
                            <View style={{flex: 1}}>
                                <View style={{flex: 0, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.purple, backgroundColor: this.state.dtlSource && (Platform.OS === 'ios') ? colors.black : colors.white, height: sizes.large}}>
                                    {this.state.dtlSource && (Platform.OS === 'ios') &&
                                        <TouchableOpacity style={{height:'100%', width: '100%'}} 
                                            underlayColor={colors.black}
                                            onPress={()=>this.setState({dtlPlaying: !this.state.dtlPlaying})}> 
                                            <Video source={this.state.dtlSource}    // Can be a URL or a local file.
                                                //poster="https://baconmockup.com/300/200/" // uri to an image to display until the video plays
                                                ref={(ref) => {
                                                    this.dtlplayer = ref
                                                }}                                      // Store reference
                                                rate={1.0}                              // 0 is paused, 1 is normal.
                                                volume={1.0}                            // 0 is muted, 1 is normal.
                                                muted={false}                           // Mutes the audio entirely.
                                                paused={!this.state.dtlPlaying}                          // Pauses playback entirely.
                                                onEnd={()=>this.setState({dtlPlaying: false})}
                                                resizeMode="contain"                    // Fill the whole screen at aspect ratio.*
                                                repeat={true}                           // Repeat forever.
                                                playInBackground={false}                // Audio continues to play when app entering background.
                                                playWhenInactive={false}                // [iOS] Video continues to play when control or notification center are shown.
                                                ignoreSilentSwitch={"ignore"}           // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual.
                                                style={{height:'100%', width: '100%'}}
                                            />
                                        </TouchableOpacity>    
                                    }
                                    {(!this.state.dtlSource || (this.state.dtlSource && Platform.OS==='android')) && 
                                        <TouchableOpacity style={{height:'100%', width: '100%'}} 
                                            onPress={()=>this._showPicker('dtlSource')}> 
                                            <Image
                                                resizeMethod='resize'
                                                style={{height:'100%', width: '100%', resizeMode: 'contain'}}
                                                source={downtheline}
                                            />
                                            {Platform.OS === 'android' && this.state.dtlSource &&
                                                <Icon 
                                                    containerStyle={{position: 'absolute', bottom: spacing.tiny, left: spacing.tiny}}
                                                    name={'check-circle'} 
                                                    size={sizes.normal} 
                                                    color={'#4caf50'}
                                                />
                                            }
                                        </TouchableOpacity>
                                    }
                                </View>
                                <Button
                                    containerViewStyle={{flex: 0}}
                                    onPress={() => this._showPicker('dtlSource')}
                                    title={'Down-the-Line'}
                                    icon={{name: 'camera-alt', color: colors.purple}}
                                    textStyle={{color: colors.purple}}
                                    backgroundColor={colors.transparent}
                                />
                            </View>
                        </View>
                        <FormLabel 
                            containerStyle={StyleSheet.flatten([styles.formLabelContainer, {marginTop: spacing.normal}])} 
                            labelStyle={StyleSheet.flatten([styles.formLabel])}>
                            Special Requests
                        </FormLabel>
                        <FormInput
                            autoCapitalize={'sentences'}
                            multiline={true}
                            returnKeyType={'done'}
                            blurOnSubmit={true}
                            containerStyle={StyleSheet.flatten([styles.formInputContainer, {height: sizes.large, marginTop: spacing.small}])}
                            inputStyle={styles.formInput}
                            underlineColorAndroid={colors.transparent}
                            onFocus={() => this.scroller.scrollTo({x: 0, y: 150, animated: true})}
                            value={this.state.notes}
                            editable={!this.props.redeemPending}
                            //keyboardType={item.property==='email'?'email-address':'default'}
                            //secureTextEntry={item.property==='password' || item.property ==='passwordConfirm'}
                            onChangeText={(val)=>this.setState({notes: val})}
                            //onBlur={item.blur}
                        />
                    </ScrollView>    
                </KeyboardView> 
            </View>

        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Redeem);