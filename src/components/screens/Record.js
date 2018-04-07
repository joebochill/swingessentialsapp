import React, { Component } from 'react';
import {connect} from 'react-redux';

import { RNCamera } from 'react-native-camera';
import styles, {sizes, colors, spacing, altStyles} from '../../styles/index';
import {FormInput, FormLabel, FormValidationMessage, Button, Icon, Header} from 'react-native-elements';
import {/*StatusBar,*/ ActivityIndicator, Keyboard, Alert, Image, Text, Platform, TouchableOpacity, View, ScrollView, StyleSheet} from 'react-native';
import downtheline from '../../images/downtheline.png';
import faceonLH from '../../images/overlay-fo-lh.png';
import faceonRH from '../../images/overlay-fo-rh.png';
import downthelineLH from '../../images/overlay-dtl-lh.png';
import downthelineRH from '../../images/overlay-dtl-rh.png';

function mapStateToProps(state){
    return {
        settings: state.settings
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
            // flash: 0,
            camera: 0,
            recording: false,
            duration: 0,
            delay: 0,
            uri: null
        };
        this.cameras = ['back', 'front'];
        // this.flashes = ['flash-off', 'flash-on', 'flash-auto'];
        this.start = 0;
        this.timer = null;
    }
    componentWillMount(){
        //StatusBar.setHidden(true);
    }
    componentWillUnmount(){
        //StatusBar.setHidden(false);
        if(this.timer){clearInterval(this.timer)};
        this._endRecording();
    }
    _startRecording(){
        if(!this.camera){ return;}

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
        const options = { maxFileSize: 9.5*1024*1024, maxDuration: parseInt(this.props.settings.duration, 10), quality: RNCamera.Constants.VideoQuality['480p'] };
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
                    
                    // return the uri and go back to the redeem screen
                    this.props.navigation.state.params.returnFunc(result.uri);
                    this.props.navigation.pop();
                })
                .catch((err)=>{
                    if(this.timer){clearInterval(this.timer)}
                    this.setState({uri: null, recording: false, duration: 0, recordLive: false});
                    console.log(err);
                })
            }, parseInt(this.props.settings.delay, 10)*1000);
    }
    _endRecording(){
        if(!this.camera){return;}
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
        return (
            <View style={{backgroundColor: colors.backgroundGrey, flex: 1, flexDirection: 'column', alignItems: 'stretch'}}>
                <RNCamera
                    ref={ref => {this.camera = ref;}}
                    style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                    type={RNCamera.Constants.Type[this.cameras[this.state.camera]]}
                    flashMode={(this.state.recording && !this.state.recordLive) ? RNCamera.Constants.FlashMode['torch'] : RNCamera.Constants.FlashMode['off']}
                    // flashMode={RNCamera.Constants.FlashMode[this.flashes[this.state.flash].split('-')[1]]}
                >
                    {this.props.settings.overlay && 
                        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
                            <Image
                                resizeMethod='resize'
                                style={{height:'100%', width: '100%', opacity: 0.35, resizeMode: 'contain'}}
                                source={
                                    this.props.navigation.state.params.swing === 'dtl' ? 
                                        (this.props.settings.handedness === 'Left' ? downthelineLH : downthelineRH) : 
                                        (this.props.settings.handedness === 'Left' ? faceonLH : faceonRH)
                                }
                            />
                        </View>
                    }
                    {this.state.delay > 0 && 
                        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.25)'}}>
                            <Text style={{color: colors.white, fontSize: 72}}>{this.state.delay}</Text>
                        </View>
                    }
                </RNCamera>
                <Header
                    outerContainerStyles={{ 
                        backgroundColor: 'rgba(0,0,0,0.25)',//colors.transparent, 
                        height: Platform.OS === 'ios' ? 70 :  70 - 24, 
                        padding: Platform.OS === 'ios' ? 15 : 10,
                        position: 'absolute',
                        borderBottomWidth: 0,
                        top:0, right: 0, left: 0
                    }}
                    //innerContainerStyles={{alignItems: Platform.OS === 'ios' ? 'flex-end' : 'center'}}
                    // leftComponent={{ 
                    //     icon: this.flashes[this.state.flash],
                    //     underlayColor:colors.transparent, 
                    //     color: colors.white, 
                    //     containerStyle:styles.headerIcon, 
                    //     onPress: () => this.setState({flash: (this.state.flash+1)%this.flashes.length}) 
                    // }}
                    // centerComponent={{ 
                    //     text: '00:00:'+(this.state.duration < 10 ? '0' : '')+this.state.duration, 
                    //     style: { color: colors.white} 
                    // }}
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
                            <Text style={{color: colors.white}}>{'00:00:'+(this.state.duration < 10 ? '0' : '')+this.state.duration}</Text>
                        </View>
                    }
                    rightComponent={this.state.recording ? null : { 
                        icon: 'settings',
                        underlayColor:colors.transparent, 
                        color: colors.white, 
                        containerStyle:styles.headerIcon, 
                        onPress: () => {this.props.navigation.push('Settings')}
                    }}
                />
                <View style={{
                    position: 'absolute', 
                    backgroundColor: this.state.recording ? colors.tranparent : 'rgba(0,0,0,0.35)', 
                    bottom: 0, left: 0, right: 0,
                    flexDirection: 'row', 
                    alignItems: 'center',
                }}>
                    <TouchableOpacity
                        onPress={()=> this.props.navigation.pop()}
                        disabled={this.state.recording}
                        style={{flex: 1, padding: spacing.normal}}
                    >
                        {!this.state.recording && <Text style={{color: colors.white, textAlign: 'left'}}>Cancel</Text>}
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
                                    margin: 20}}
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
                                name={'ios-reverse-camera-outline'} 
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
    }

    takePicture = async function() {
        if (this.camera) {
        const options = { quality: 0.5, base64: true };
        const data = await this.camera.takePictureAsync(options)
        console.log(data.uri);
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Record);