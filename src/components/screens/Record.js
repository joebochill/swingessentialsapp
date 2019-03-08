import React, { Component } from 'react';
import {connect} from 'react-redux';

import { RNCamera } from 'react-native-camera';
import Video from 'react-native-video';
import styles, {sizes, colors, spacing} from '../../styles/index';
import {scale, verticalScale} from '../../styles/dimension';

import {Icon, Header} from 'react-native-elements';
import {Image, Text, Platform, TouchableOpacity, View, StyleSheet} from 'react-native';
import faceonLH from '../../images/overlay-fo-lh.png';
import faceonRH from '../../images/overlay-fo-rh.png';
import downthelineLH from '../../images/overlay-dtl-lh.png';
import downthelineRH from '../../images/overlay-dtl-rh.png';
import { logLocalError } from '../../utils/utils';

function mapStateToProps(state){
    return {
        settings: state.settings,
        token: state.login.token
    };
}
function mapDispatchToProps(dispatch){
    return {

    };
}

class Record extends Component {
    constructor(props){
        super(props);
        this.state = {
            camera: 0,
            recording: false,
            duration: 0,
            delay: 0,
            uri: null,
            playing: false
        };
        this.cameras = ['back', 'front'];
        this.start = 0;
        this.timer = null;
    }
    componentWillUnmount(){
        if(this.timer){clearInterval(this.timer)};
        this._endRecording();
    }
    _startRecording(){
        if(!this.camera){ 
            logLocalError('138: Camera Recording Error: no camera object');
            return;
        }

        // check if the user has a recording delay configured in settings
        const delay = parseInt(this.props.settings.delay, 10);
        if(delay){
            // start a countdown timer that will display over the camera
            this.setState({delay: delay});
            this.countdown = setInterval(()=>this.setState({delay: this.state.delay -1}), 1000);
        }

        // Change the controls to recording mode
        this.setState({recording: true});

        // Set the recording constraints and start the recording
        const options = {   maxFileSize: 9.5*1024*1024, 
                            maxDuration: parseInt(this.props.settings.duration, 10), 
                            quality: RNCamera.Constants.VideoQuality['720p']
                        };
        // delay the start of the recording if a delay is set
        this.delayTimer = 
            setTimeout(()=>{
                // Stop the countdown timer
                if(this.countdown){clearInterval(this.countdown)}
                
                // start the timer that will show the recording duration - subtract 1s for the focus delay at start
                this.start = Date.now();
                this.timer = setInterval(()=> this.setState({duration:Math.floor((Date.now()-this.start)/1000-1)}), 1000);
                
                // turn on the recording light and start recording
                this.setState({recordLive: true, delay: 0});
                this.camera.recordAsync(options)
                .then((result) => {
                    if(this.timer){clearInterval(this.timer)}
                    this.setState({uri: result.uri, recording: false, duration: 0, recordLive: false});
                })
                .catch((err)=>{
                    logLocalError('135: Camera Recording Error: ' + err.toString())
                    if(this.timer){clearInterval(this.timer)}
                    this.setState({uri: null, recording: false, duration: 0, recordLive: false});
                })
            }, parseInt(this.props.settings.delay, 10)*1000);
    }
    _endRecording(){
        if(!this.camera){
            logLocalError('139: Camera Recording Error: no camera object');
            return;
        }
        if(this.state.recordLive){
            this.camera.stopRecording();
        }
        else if(this.delayTimer){
            clearTimeout(this.delayTimer);
            clearInterval(this.countdown);
            this.setState({uri: null, recording: false, duration: 0, delay: 0, recordLive: false});
        }
    }

    render() {
        let recorder = (
            <View style={{backgroundColor: colors.backgroundGrey, flex: 1, flexDirection: 'column', alignItems: 'stretch'}}>
                <RNCamera
                    ref={ref => {this.camera = ref;}}
                    style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                    type={RNCamera.Constants.Type[this.cameras[this.state.camera]]}
                    flashMode={(this.props.settings.delay > 0 && this.state.recording && !this.state.recordLive) ? RNCamera.Constants.FlashMode['torch'] : RNCamera.Constants.FlashMode['off']}
                    permissionDialogTitle={'Permission to use camera'}
                    permissionDialogMessage={'We need your permission to use your camera phone'}
                />
                {this.props.settings.overlay && 
                    <View style={StyleSheet.flatten([styles.absolute, styles.centered])}>
                        <Image
                            resizeMethod='resize'
                            style={{height:'100%', width: '100%', opacity: 0.35, resizeMode: 'contain'}}
                            source={ // front-camera will mirror the overlay
                                this.props.navigation.state.params.swing === 'dtl' ? 
                                    (this.props.settings.handedness === 'Left' ? 
                                        (this.cameras[this.state.camera] === 'back' ? downthelineLH : downthelineRH) 
                                        :(this.cameras[this.state.camera] === 'back' ? downthelineRH : downthelineLH))
                                    :(this.props.settings.handedness === 'Left' ? 
                                        (this.cameras[this.state.camera] === 'back' ? faceonLH : faceonRH) 
                                        :(this.cameras[this.state.camera] === 'back' ? faceonRH : faceonLH))
                            }
                        />
                    </View>
                }
                {this.state.delay > 0 && 
                    <View style={StyleSheet.flatten([styles.absolute, styles.centered, {backgroundColor: 'rgba(0,0,0,0.25)'}])}>
                        <Text style={{color: colors.white, fontSize: scale(128)}}>{this.state.delay}</Text>
                    </View>
                }
                <Header
                    outerContainerStyles={{ 
                        backgroundColor: 'rgba(0,0,0,0.25)',
                        height: verticalScale(Platform.OS === 'ios' ? 70 :  70 - 24), 
                        padding: verticalScale(Platform.OS === 'ios' ? 15 : 10),
                        position: 'absolute',
                        borderBottomWidth: 0,
                        top:0, right: 0, left: 0
                    }}
                    leftComponent={this.state.recording ? null : { 
                        icon: 'arrow-back',
                        size: verticalScale(26),
                        containerStyle: StyleSheet.flatten([styles.headerIcon, {opacity: 0}]) //hidden, for centering only
                    }}
                    centerComponent={
                        <View>
                            {this.state.recordLive &&
                                <View style={{
                                    alignItems: 'flex-start', 
                                    justifyContent: 'center', 
                                    position: 'absolute', 
                                    top: 0, left:-2*sizes.tiny, bottom: 0, right: 0
                                }}>
                                    <View style={{
                                        height: sizes.tiny, 
                                        width: sizes.tiny, 
                                        borderRadius: sizes.tiny, 
                                        backgroundColor: colors.red
                                    }}/>
                                </View>
                            }
                            <Text style={{fontSize: scale(14), color: colors.white}}>{'00:00:'+(this.state.duration < 10 ? '0' : '')+this.state.duration}</Text>
                        </View>
                    }
                    rightComponent={this.state.recording || !this.props.token ? null : { 
                        icon: 'settings',
                        size: verticalScale(26),
                        underlayColor:colors.transparent, 
                        color: colors.white, 
                        containerStyle:styles.headerIcon, 
                        onPress: () => {this.props.navigation.push('Settings')}
                    }}
                />
                <View style={{
                    position: 'absolute', 
                    backgroundColor: this.state.recording ? colors.transparent : 'rgba(0,0,0,0.35)', 
                    bottom: 0, left: 0, right: 0,
                    flexDirection: 'row', 
                    alignItems: 'center',
                    height: sizes.medium + scale(2*20)
                }}>
                    <TouchableOpacity
                        onPress={()=> this.props.navigation.pop()}
                        disabled={this.state.recording}
                        style={{flex: 1, padding: spacing.normal}}
                    >
                        {!this.state.recording && <Text style={{fontSize: scale(14), color: colors.white, textAlign: 'left'}}>Cancel</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>{
                            if(!this.state.recording){
                                this._startRecording();
                            }
                            else{
                                this._endRecording();
                            }
                        }}
                        style = {{flex: 0,
                                    borderColor: colors.white,
                                    borderWidth: spacing.tiny,
                                    borderRadius: sizes.medium,
                                    height: sizes.medium,
                                    width: sizes.medium,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: spacing.tiny,
                                    margin: scale(20)}}
                    >
                        {!this.state.recording ?
                            <View style={{flex: 1, alignSelf: 'stretch', backgroundColor: colors.red, borderRadius: sizes.normal}}/>
                            :
                            <View style={{height: sizes.mediumSmall, width: sizes.mediumSmall, backgroundColor: colors.red, borderRadius: 2}}/>
                        }
                    </TouchableOpacity>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', padding: spacing.normal}}>
                        {!this.state.recording &&
                            <Icon 
                                type={'ionicon'}
                                name={'ios-reverse-camera'} 
                                size={sizes.normal} 
                                color={colors.white}
                                underlayColor={colors.transparent}
                                onPress={() => this.setState({camera: (this.state.camera+1)%this.cameras.length})}
                            />
                        }
                    </View>
                </View>
            </View>
        );
        let player = !this.state.uri ? null : (
            <View style={{backgroundColor: colors.black, flex: 1, flexDirection: 'column', alignItems: 'stretch'}}>
                <Video source={{uri:this.state.uri}}    // Can be a URL or a local file.
                    ref={(ref) => {
                        this.player = ref
                    }}                                      // Store reference
                    rate={1.0}                              // 0 is paused, 1 is normal.
                    volume={1.0}                            // 0 is muted, 1 is normal.
                    muted={false}                           // Mutes the audio entirely.
                    paused={!this.state.playing}                          // Pauses playback entirely.
                    onEnd={()=>this.setState({playing: false})}
                    resizeMode="contain"                    // Fill the whole screen at aspect ratio.*
                    repeat={false}                           // Repeat forever.
                    playInBackground={false}                // Audio continues to play when app entering background.
                    playWhenInactive={false}                // [iOS] Video continues to play when control or notification center are shown.
                    ignoreSilentSwitch={"ignore"}           // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual.
                    style={{height:'100%', width: '100%'}}
                />
                <View style={{
                    position: 'absolute', 
                    backgroundColor: 'rgba(0,0,0,0.35)', 
                    bottom: 0, left: 0, right: 0,
                    flexDirection: 'row', 
                    alignItems: 'center',
                    height: sizes.medium + scale(2*20)
                }}>
                    <TouchableOpacity onPress={()=> this.setState({uri: null})} style={{flex: 1, padding: spacing.normal}}>
                        <Text style={{fontSize: scale(14), color: colors.white, textAlign: 'left'}}>Retake</Text>
                    </TouchableOpacity>
                    <Icon 
                        name={this.state.playing ? 'pause' : 'play-arrow'} 
                        size={sizes.medium} 
                        color={colors.white}
                        underlayColor={colors.transparent}
                        iconStyle={{flex: 0}}
                        onPress={()=>this.setState({playing: !this.state.playing})}
                    />
                    <TouchableOpacity style={{flex: 1, padding: spacing.normal}} 
                        onPress={()=> {
                            this.props.navigation.state.params.returnFunc(this.state.uri);
                            this.props.navigation.pop();
                        }}
                    >
                        <Text style={{fontSize: scale(14), color: colors.white, textAlign: 'right'}}>Use Video</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
        return (this.state.uri ? player : recorder);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Record);