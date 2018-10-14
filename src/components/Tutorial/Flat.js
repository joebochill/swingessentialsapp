import React from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import {Button} from 'react-native-elements';

import styles, {colors, spacing} from '../../styles/index';
import {scale} from '../../styles/dimension';
import CardRow from '../Card/CardRow';
import Tutorial from './Tutorial';
import {getDate} from '../../utils/utils';

import {APP_VERSION} from '../../constants/index';

class LessonsTutorial extends React.Component {
    doneWithTutorial(){
        AsyncStorage.setItem('@SwingEssentials:tutorial_lessons', APP_VERSION);
        this.props.close();
    }
    render() {
        return (
            <Tutorial isVisible={this.props.isVisible} close={() => this.doneWithTutorial()}> 
                <View>
                    <Text style={StyleSheet.flatten([styles.headline, {fontSize: scale(28), color: colors.white}])}>{'Welcome to Swing Essentials!'}</Text>
                    <Text style={StyleSheet.flatten([styles.paragraph, {color: colors.white, textAlign: 'center'}])}>When you have submitted your golf swing for analysis, your lessons will appear in this list.</Text>
                    <FlatList
                        style={{marginTop: spacing.normal,flex: 0}}
                        scrollEnabled= {false}
                        ListHeaderComponent={
                            <View style={styles.cardHeader}>
                                <Text style={{fontSize: scale(14), color: colors.white}}>Lesson History</Text>
                            </View>
                        }
                        data={[
                            {date: getDate(Date.now())},{date: getDate(Date.now()-24*60*60*1000)},{date: getDate(Date.now()-7*24*60*60*1000)}
                        ]}
                        renderItem={({item, index}) => 
                            <CardRow primary={item.date} secondary={index === 0 ? 'IN PROGRESS' : ''} action={index !== 0} />
                        }
                        keyExtractor={(item, index) => index}
                    />
                    <Button
                        title="GOT IT"
                        fontSize={scale(14)}
                        onPress={() => this.props.close()}
                        buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.extraLarge}])}
                        containerViewStyle={styles.buttonContainer}
                    />                  
                </View>                
            </Tutorial> 
        );
    }
}

export default LessonsTutorial;