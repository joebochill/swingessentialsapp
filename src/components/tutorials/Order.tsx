// import React from 'react';
// import {connect} from 'react-redux';

// import {Text, View, FlatList, StyleSheet } from 'react-native';
// import {Button} from 'react-native-elements';
// import styles, {colors, spacing} from '../../styles/index';
// import {scale} from '../../styles/dimension';
// import CardRow from '../Card/CardRow';
// import Tutorial from './Tutorial';

// function mapStateToProps(state){
//     return {
//         packages: state.packages.list
//     };
// }

// class OrderTutorial extends React.Component {
//     render() {
//         return (
//             <Tutorial isVisible={this.props.isVisible} close={() => this.props.close()}> 
//                 <View>
//                     <Text style={StyleSheet.flatten([styles.headline, {fontSize: scale(28), color: colors.white}])}>{'Lesson Packages'}</Text>
//                     <Text style={StyleSheet.flatten([styles.paragraph, {color: colors.white, textAlign: 'center'}])}>We offer a variety of lesson packages at different price points.</Text>
//                     <FlatList
//                         scrollEnabled= {false}
//                         keyboardShouldPersistTaps = {'always'}
//                         ListHeaderComponent={
//                             <View style={styles.cardHeader}>
//                                 <Text style={{fontSize: scale(14), color: colors.white}}>Select a Package</Text>
//                             </View>
//                         }
//                         data={this.props.packages}
//                         renderItem={({item, index}) => 
//                             <CardRow 
//                                 primary={item.name} 
//                                 subtitle={item.description}
//                                 secondary={item.price}
//                                 menuItem
//                             />
//                         }
//                         keyExtractor={(item, index) => ('package_'+item.id)}
//                     />
//                     <Text style={StyleSheet.flatten([styles.paragraph, {marginTop: spacing.normal, color: colors.white, textAlign: 'center'}])}>Make sure you have a payment method linked to your phone before purchasing.</Text>
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

// export default connect(mapStateToProps)(OrderTutorial);