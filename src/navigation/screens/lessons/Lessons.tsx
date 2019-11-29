import React from 'react';
import { useSelector } from 'react-redux';
import { View, StyleSheet, SafeAreaView, FlatList, SectionList } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { wrapIcon, H7, Body, Label, H6, InfoListItem } from '@pxblue/react-native-components';
import { VideoCard, SEHeader } from '../../../components';
import { ScrollView } from 'react-native-gesture-handler';
import { purple } from '../../../styles/colors';
import Carousel from 'react-native-snap-carousel';
import bg from '../../../images/bg_2.jpg';
import { withNavigation } from 'react-navigation';
import { ROUTES } from '../../../constants/routes';
import { width } from '../../../utilities/dimensions';

import { spaces } from '../../../styles/sizes';
const MoreIcon = wrapIcon({ IconClass: Icon, name: 'more-vert' });
import { sharedStyles } from '../../../styles';
import { MONTHS } from '../../../utilities/general';

export const Lessons = withNavigation(props => {
    const lessons = useSelector(state => state.lessons);
    // const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const myLessons = lessons.pending.concat(lessons.closed);
    const groups = Math.ceil(myLessons.length/3);
    const sections = [];
    for (let i = 0; i < groups; i++){
        sections.push({
            index: i,
            title: MONTHS[11-(i%12)],
            data: myLessons.slice(i*3, i*3+3)
        });
    }
    return (
        <View style={sharedStyles.pageContainer}>
            <SEHeader
                expandable
                backgroundImage={bg}
                startExpanded={true}
                title={'Your Lessons'}
                subtitle={"...see how far you've come"}
                actionItems={[{ icon: MoreIcon, onPress: () => { } }]}
            />
            {/* <ScrollView contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: spaces.medium }}> */}
                <SectionList
                    // scrollEnabled={false
                    contentContainerStyle={{paddingVertical: spaces.medium}}
                    renderSectionHeader={({ section: {title, index} }) => (
                        <View style={[sharedStyles.sectionHeader, index > 0 ? {marginTop: spaces.large} : {}]}>
                            <H7>{title}</H7>
                        </View>
                      )}
                    // ListHeaderComponent={
                    //     <View style={[sharedStyles.sectionHeader]}>
                    //         <H7>November 2019</H7>
                    //     </View>
                    // }
                    sections={sections}
                    stickySectionHeadersEnabled={false}
                    ListEmptyComponent={
                        <ListItem
                            containerStyle={sharedStyles.listItem}
                            contentContainerStyle={sharedStyles.listItemContent}
                            bottomDivider
                            topDivider
                            chevron={true}
                            onPress={() => props.navigation.push(ROUTES.LESSON)}
                            title={<Body>Welcome to Swing Essentials!</Body>}
                        />
                    }
                    renderItem={({ item, index }) =>
                        item.response_video ?
                            <ListItem
                                containerStyle={sharedStyles.listItem}
                                contentContainerStyle={sharedStyles.listItemContent}
                                bottomDivider
                                topDivider={index === 0}
                                chevron={true}
                                onPress={() => props.navigation.push(ROUTES.LESSON)}
                                title={<Body>{item.request_date}</Body>}
                                rightTitle={!item.viewed ? <H7>NEW</H7> : undefined}
                            />
                            :
                            <ListItem
                                containerStyle={sharedStyles.listItem}
                                contentContainerStyle={sharedStyles.listItemContent}
                                bottomDivider
                                topDivider={index === 0}
                                title={<Body>2018-09-28</Body>}
                                rightTitle={<H7>IN PROGRESS</H7>}
                            />
                    }
                    keyExtractor={(item, index): string => ('complete_' + item.request_id)}
                />
                {/* <FlatList
                    scrollEnabled={false}
                    ListHeaderComponent={
                        <View style={[sharedStyles.sectionHeader]}>
                            <H7>November 2019</H7>
                        </View>
                    }
                    data={lessons.pending.concat(lessons.closed)}
                    ListEmptyComponent={
                        <ListItem
                            containerStyle={sharedStyles.listItem}
                            contentContainerStyle={sharedStyles.listItemContent}
                            bottomDivider
                            topDivider
                            chevron={true}
                            onPress={() => props.navigation.push(ROUTES.LESSON)}
                            title={<Body>Welcome to Swing Essentials!</Body>}
                        />
                    }
                    renderItem={({ item, index }) =>
                        item.response_video ?
                            <ListItem
                                containerStyle={sharedStyles.listItem}
                                contentContainerStyle={sharedStyles.listItemContent}
                                bottomDivider
                                topDivider={index === 0}
                                chevron={true}
                                onPress={() => props.navigation.push(ROUTES.LESSON)}
                                title={<Body>{item.request_date}</Body>}
                                rightTitle={!item.viewed ? <H7>NEW</H7> : undefined}
                            />
                            :
                            <ListItem
                                containerStyle={sharedStyles.listItem}
                                contentContainerStyle={sharedStyles.listItemContent}
                                bottomDivider
                                topDivider={index === 0}
                                title={<Body>2018-09-28</Body>}
                                rightTitle={<H7>IN PROGRESS</H7>}
                            />
                    }
                    keyExtractor={(item, index): string => ('complete_' + item.request_id)}
                /> */}
                <SafeAreaView />
            {/* </ScrollView> */}
        </View>
    )
});