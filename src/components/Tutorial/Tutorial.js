import React from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modal';

import styles, {colors, sizes, spacing} from '../../styles/index';

import {scale} from '../../styles/dimension';

class TutorialModal extends React.Component {
  render() {
    return (
        <Modal
            isVisible={this.props.isVisible} 
            backdropOpacity={0.5} 
            animationInTiming={500}
            animationOutTiming={500}
            supportedOrientations={['portrait', 'landscape']}
            style={{margin: 0}}
        > 
            <View style={StyleSheet.flatten([{flex: 1, backgroundColor: colors.flatPurple}])}>
                <View style={{
                    flexDirection: 'row', 
                    justifyContent: 'flex-end', 
                    marginTop: ((Platform.OS === 'ios' ? 15 :  10) ),
                    paddingHorizontal: spacing.normal,
                    paddingTop: spacing.normal
                }}>
                    <Button 
                        color={colors.white} 
                        containerViewStyle={{ marginLeft: 0, marginRight: 0}} 
                        buttonStyle={styles.linkButton} 
                        title="Skip" 
                        fontSize={scale(14)}
                        onPress={() => this.props.close()}>
                    </Button> 
                </View>
                <View style={StyleSheet.flatten([styles.centered, {flex: 1}])}>
                    <View style={StyleSheet.flatten([styles.tutorial])}>
                        {this.props.children} 
                    </View>
                </View>
            </View>            
        </Modal> 
    );
  }
}

export default TutorialModal;