// import React from 'react';
// import { Text, View, Image, StyleSheet } from 'react-native';
// import {Button} from 'react-native-elements';

// import styles, {colors, spacing} from '../../styles/index';
// import {scale, width} from '../../styles/dimension';
// import Tutorial from './Tutorial';

// class LessonTutorial extends React.Component {
//     render() {
//         return (
//             <Tutorial isVisible={this.props.isVisible} close={() => this.props.close()}> 
//                 <View>
//                     <Text style={StyleSheet.flatten([styles.headline, {fontSize: scale(28), color: colors.white}])}>{'Swing Analysis'}</Text>
//                     <Text style={StyleSheet.flatten([styles.paragraph, {color: colors.white, textAlign: 'center'}])}>This is where you will see your personalized swing analysis videos.</Text>
//                     <Image
//                         style={{width: '100%', height: (width - 2*spacing.large)*(9/16)}}
//                         source={{uri: 'https://img.youtube.com/vi/l3Y3iJa6DvE/0.jpg'}}
//                     />
//                     <Text style={StyleSheet.flatten([styles.paragraph, {marginTop: spacing.normal, color: colors.white, textAlign: 'center'}])}>Your analysis will also include comments and recommended tips to improve your game.</Text>
//                     <Button
//                         title="GOT IT"
//                         fontSize={scale(14)}
//                         onPress={() => this.props.close()}
//                         buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.extraLarge}])}
//                         containerViewStyle={styles.buttonContainer}
//                     />                  
//                 </View>                
//             </Tutorial> 
//         );
//     }
// }

// export default LessonTutorial;