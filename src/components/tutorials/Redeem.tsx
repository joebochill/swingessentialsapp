// import React from 'react';

// import {Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
// import {Button, Icon} from 'react-native-elements';

// import styles, {colors, spacing, sizes} from '../../styles/index';
// import {scale, width} from '../../styles/dimension';
// import CardRow from '../Card/CardRow';
// import Tutorial from './Tutorial';
// import {getDate} from '../../utils/utils';

// import downtheline from '../../images/downtheline.png';
// import faceon from '../../images/faceon.png';

// import Carousel, { Pagination } from 'react-native-snap-carousel';

// class RedeemTutorial extends React.Component {
//     constructor(props){
//         super(props);
//         this.state={
//             activeSlide: 0
//         }
//         this.slides = [
//             (
//                 <View>
//                     <Text style={StyleSheet.flatten([styles.headline, {fontSize: scale(28), color: colors.white}])}>{'Submitting Your Swing!'}</Text>
//                     <Text style={StyleSheet.flatten([styles.paragraph, {color: colors.white, textAlign: 'center'}])}>When you're ready to submit your swing, click on the golfer images to upload Face-On and Down-the-Line videos.</Text>
//                     {/* <Text style={StyleSheet.flatten([styles.formLabel, {color: colors.white}])}>Your Swing Videos</Text> */}
//                     <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.small}}>
//                         <View style={{flex: 1, marginRight: spacing.normal}}>
//                             <View style={{flex: 0, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.purple, backgroundColor: colors.white, height: sizes.large}}>
//                                 <View style={{height:'100%', width: '100%'}}> 
//                                     <Image
//                                         resizeMethod='resize'
//                                         style={{height:'100%', width: '100%', resizeMode: 'contain'}}
//                                         source={faceon}
//                                     />
   
//                                 </View>
//                             </View>
//                         </View>
//                         <View style={{flex: 1}}>
//                             <View style={{flex: 0, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.purple, backgroundColor: colors.white, height: sizes.large}}>
//                                 <View style={{height:'100%', width: '100%'}}> 
//                                     <Image
//                                         resizeMethod='resize'
//                                         style={{height:'100%', width: '100%', resizeMode: 'contain'}}
//                                         source={downtheline}
//                                     />
//                                 </View>
//                             </View>
//                         </View>
//                     </View>
//                 </View>  
//             ),
//             (
//                 <View>
//                     <Text style={StyleSheet.flatten([styles.headline, {fontSize: scale(28), color: colors.white}])}>{'Using the Camera'}</Text>
//                     <Text style={StyleSheet.flatten([styles.paragraph, {color: colors.white, textAlign: 'center'}])}>Press the Record button to start recording your swing.</Text>
//                     <View style = {{
//                         flex: 0,
//                         borderColor: colors.white,
//                         borderWidth: spacing.tiny,
//                         borderRadius: sizes.medium,
//                         height: sizes.medium,
//                         width: sizes.medium,
//                         alignSelf: 'center',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         padding: spacing.tiny,
//                         margin: scale(20)}}
//                     >
//                         <View style={{flex: 1, alignSelf: 'stretch', backgroundColor: colors.red, borderRadius: sizes.normal}}/>
//                     </View>
//                     <Text style={StyleSheet.flatten([styles.paragraph, {color: colors.white, textAlign: 'center'}])}>You can adjust settings for recording length and delay by clicking the settings icon.</Text>
//                     <Icon name='settings' color={colors.white} size={sizes.medium}/>
//                     <Button
//                         title="GOT IT"
//                         fontSize={scale(14)}
//                         onPress={() => this.props.close()}
//                         buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.extraLarge}])}
//                         containerViewStyle={styles.buttonContainer}
//                     />            
//                 </View>  
//             )
//         ];
//     }
//     _renderItem ({item, index}) {
//         return this.slides[index];
//     }

//     render() {
//         return (
//             <Tutorial isVisible={this.props.isVisible} close={() => this.props.close()}> 
//                 <Carousel
//                 ref={(c) => { this._carousel = c; }}
//                 data={this.slides}
//                 renderItem={this._renderItem.bind(this)}
//                 sliderWidth={width - 2*spacing.large}
//                 itemWidth={width - 2*spacing.large}
//                 onSnapToItem={(index) => this.setState({ activeSlide: index }) }
//                 />   
//                 <Pagination
//                     dotsLength={this.slides.length}
//                     activeDotIndex={this.state.activeSlide}
//                     dotStyle={{
//                         width: sizes.tiny,
//                         height: sizes.tiny,
//                         borderRadius: sizes.tiny/2,
//                         marginHorizontal: 0,
//                         backgroundColor: 'rgba(255, 255, 255, 0.9)'
//                     }}
//                     inactiveDotOpacity={0.5}
//                     inactiveDotScale={0.8}
//                 />      
//             </Tutorial> 
//         );
//     }
// }

// export default RedeemTutorial;