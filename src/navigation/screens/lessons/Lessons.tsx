import React from 'react';
import { useSelector } from 'react-redux';
import { View, SafeAreaView, SectionList } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { wrapIcon, H7, Body } from '@pxblue/react-native-components';
import { SEHeader, CollapsibleHeaderLayout } from '../../../components';
import bg from '../../../images/bg_2.jpg';
import { withNavigation } from 'react-navigation';
import { ROUTES } from '../../../constants/routes';

import { spaces } from '../../../styles/sizes';
const MoreIcon = wrapIcon({ IconClass: Icon, name: 'more-vert' });
import { sharedStyles } from '../../../styles';
import { MONTHS, getLongDate } from '../../../utilities/general';

type Lesson = {
    request_id: number;
    dtl_swing: string;
    fo_swing: string;
    request_date: string;
    request_notes: string;
    request_url: string;
    response_notes: string;
    response_status: string; //TODO: update to enum
    username: string;
    viewed: boolean;
}
type LessonSection = {
    index: number,
    date: string,
    data: Array<Lesson>
}
type LessonData = {
    [key: string]:LessonSection
}
const makeGroups = (list: Array<Lesson>): Array<LessonSection> => {
    let sections: LessonData = {};
    let ind = 0;
    for(let i = 0; i < list.length; i++){
        const dateBucket: string = getLongDate(list[i].request_date);
        if(!sections[dateBucket]){
            sections[dateBucket] = {
                index: ind++,
                date: dateBucket,
                data: []
            };
        }
        sections[dateBucket].data.push(list[i]);
    }
    // return Object.values(sections);
    return Object.keys(sections).map(i => sections[i])
    // const currentYear = (new Date(Date.now())).getUTCFullYear() + 1;
    // let ind = 0;
    // for (let i = 0; i <= currentYear - 2017; i++) {
    //     const data = list.filter((item) => new Date(item.request_date).getUTCFullYear() === currentYear - i);
    //     if (data.length > 0) {
    //         sections.push({
    //             index: ind++,
    //             year: currentYear - i,
    //             data: data
    //         });
    //     }
    // }
    // return sections
}

export const Lessons = withNavigation(props => {
    const lessons = useSelector(state => state.lessons);
    const myLessons = lessons.pending.concat(lessons.closed);
    const sections = makeGroups(myLessons);
   
    return (
        <CollapsibleHeaderLayout
        title={'Your Lessons'}
                subtitle={"...see how far you've come"}
        backgroundImage={bg}
    >
            <SectionList
                // contentContainerStyle={{ paddingTop: spaces.medium, paddingBottom: spaces.jumbo }}
                renderSectionHeader={({ section: { date, index } }) => (
                    <View style={[sharedStyles.sectionHeader, index > 0 ? { marginTop: spaces.large } : {}]}>
                        <H7>{date}</H7>
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
                        onPress={() => props.navigation.push(ROUTES.LESSON, {lesson: null})}
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
                            onPress={() => props.navigation.push(ROUTES.LESSON, {lesson: item})}
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
            {/* <SafeAreaView /> */}
        {/* </View> */}
        </CollapsibleHeaderLayout>
    )
});