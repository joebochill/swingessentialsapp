import React from 'react';

import {Text, View, FlatList, StyleSheet } from 'react-native';
import {Button, Icon} from 'react-native-elements';

import styles, {colors, spacing, sizes} from '../../styles/index';
import {scale, width} from '../../styles/dimension';
import CardRow from '../Card/CardRow';
import Tutorial from './Tutorial';
import {getDate} from '../../utils/utils';

import Carousel, { Pagination } from 'react-native-snap-carousel';

class LessonsTutorial extends React.Component {
    constructor(props){
        super(props);
        this.state={
            activeSlide: 0
        }
        this.slides = [
            (
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
                </View>  
            ),
            (
                <View>
                    <Text style={StyleSheet.flatten([styles.headline, {fontSize: scale(28), color: colors.white}])}>{'Sign Up Today'}</Text>
                    <Text style={StyleSheet.flatten([styles.paragraph, {color: colors.white, textAlign: 'center'}])}>You can sign in or register for an account by clicking the account icon in the header.</Text>
                    <Icon name='person' color={colors.white} size={sizes.medium}/>
                    <Button
                        title="GOT IT"
                        fontSize={scale(14)}
                        onPress={() => this.props.close()}
                        buttonStyle={StyleSheet.flatten([styles.purpleButton, {marginTop: spacing.extraLarge}])}
                        containerViewStyle={styles.buttonContainer}
                    />            
                </View>  
            )
        ];
    }
    _renderItem ({item, index}) {
        return this.slides[index];
    }

    render() {
        return (
            <Tutorial isVisible={this.props.isVisible} close={() => this.props.close()}> 
                <Carousel
                ref={(c) => { this._carousel = c; }}
                data={this.slides}
                renderItem={this._renderItem.bind(this)}
                sliderWidth={width - 2*spacing.large}
                itemWidth={width - 2*spacing.large}
                onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                />   
                <Pagination
                    dotsLength={this.slides.length}
                    activeDotIndex={this.state.activeSlide}
                    dotStyle={{
                        width: sizes.tiny,
                        height: sizes.tiny,
                        borderRadius: sizes.tiny/2,
                        marginHorizontal: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }}
                    inactiveDotOpacity={0.5}
                    inactiveDotScale={0.8}
                />      
            </Tutorial> 
        );
    }
}

export default LessonsTutorial;