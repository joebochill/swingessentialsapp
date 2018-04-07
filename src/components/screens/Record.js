import React, { Component } from 'react';
import {connect} from 'react-redux';

import { RNCamera } from 'react-native-camera';
import styles, {sizes, colors, spacing, altStyles} from '../../styles/index';
import {FormInput, FormLabel, FormValidationMessage, Button, Icon, Header} from 'react-native-elements';
import {/*StatusBar,*/ ActivityIndicator, Keyboard, Alert, Image, Text, Platform, TouchableOpacity, View, ScrollView, StyleSheet} from 'react-native';


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
        this.setState({recording: true});
        const options = { maxFileSize: 9.5*1024*1024, maxDuration: parseInt(this.props.settings.duration, 10), quality: RNCamera.Constants.VideoQuality['480p'] };
        setTimeout(()=>{
            this.start = Date.now();
            this.timer = setInterval(()=> this.setState({duration:Math.floor((Date.now()-this.start)/1000-1)}), 1000);
            this.camera.recordAsync(options)
            .then((result) => {
                if(this.timer){clearInterval(this.timer)}
                this.start = 0;
                this.setState({uri: result.uri, recording: false, duration: 0});
                this.props.navigation.state.params.returnFunc(result.uri);
                this.props.navigation.pop();
            })
            .catch((err)=>{
                if(this.timer){clearInterval(this.timer)}
                this.start = 0;
                this.setState({uri: result.uri, recording: false, duration: 0});
                console.log(err);
            })
        }, parseInt(this.props.settings.delay, 10)*1000);
    }
    _endRecording(){
        if(!this.camera){return;}
        this.camera.stopRecording();
    }

    render() {
        return (
            <View style={{backgroundColor: colors.backgroundGrey, flex: 1, flexDirection: 'column', alignItems: 'stretch'}}>
                <RNCamera
                    ref={ref => {this.camera = ref;}}
                    style = {{flex: 1}}
                    type={RNCamera.Constants.Type[this.cameras[this.state.camera]]}
                    // flashMode={RNCamera.Constants.FlashMode[this.flashes[this.state.flash].split('-')[1]]}
                />
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
                    centerComponent={{ 
                        text: '00:00:'+(this.state.duration < 10 ? '0' : '')+this.state.duration, 
                        style: { color: colors.white} 
                    }}
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
                    backgroundColor: 'rgba(0,0,0,0.35)', 
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