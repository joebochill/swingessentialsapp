import React from 'react';
import { useSelector } from 'react-redux';
import { View, SafeAreaView, SectionList } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { wrapIcon, H7, Body } from '@pxblue/react-native-components';
import { SEHeader } from '../../../components';
import bg from '../../../images/bg_2.jpg';
import { withNavigation } from 'react-navigation';
import { ROUTES } from '../../../constants/routes';

import { spaces } from '../../../styles/sizes';
const MoreIcon = wrapIcon({ IconClass: Icon, name: 'more-vert' });
import { sharedStyles } from '../../../styles';
import { MONTHS } from '../../../utilities/general';

export const Lessons = withNavigation(props => {
    const lessons = useSelector(state => state.lessons);
    const myLessons = lessons.pending.concat(lessons.closed);
    const groups = Math.ceil(myLessons.length / 3);
    const sections = [];
    for (let i = 0; i < groups; i++) {
        sections.push({
            index: i,
            title: MONTHS[11 - (i % 12)],
            data: myLessons.slice(i * 3, i * 3 + 3)
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
            />
            <SectionList
                contentContainerStyle={{ paddingTop: spaces.medium, paddingBottom: spaces.jumbo }}
                renderSectionHeader={({ section: { title, index } }) => (
                    <View style={[sharedStyles.sectionHeader, index > 0 ? { marginTop: spaces.large } : {}]}>
                        <H7>{title}</H7>
                    </View>
                )}
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
            <SafeAreaView />
        </View>
    )
});