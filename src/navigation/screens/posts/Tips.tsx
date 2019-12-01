import React from 'react';
import { useSelector } from 'react-redux';
import { withNavigation } from 'react-navigation';

import { View, SectionList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { H7, Body} from '@pxblue/react-native-components';
import { CollapsibleHeaderLayout } from '../../../components';

import { ROUTES } from '../../../constants/routes';

import bg from '../../../images/bg_4.jpg';
import { spaces } from '../../../styles/sizes';
import { sharedStyles } from '../../../styles';

type Tip = {
    id: number;
    date: string;
    comments: string;
    title: string;
    video: string;
}
type TipSection = {
    index: number,
    year: number,
    data: Array<Tip>
}
const makeGroups = (list: Array<Tip>): Array<TipSection> => {
    let sections = [];
    const currentYear = (new Date(Date.now())).getUTCFullYear() + 1;
    let ind = 0;
    for (let i = 0; i <= currentYear - 2017; i++) {
        const data = list.filter((item) => new Date(item.date).getUTCFullYear() === currentYear - i);
        if (data.length > 0) {
            sections.push({
                index: ind++,
                year: currentYear - i,
                data: data
            });
        }
    }
    return sections
}

export const Tips = (props) => {
    const tips = useSelector(state => state.tips.tipList);
    const sections = makeGroups(tips);

    return (
        <CollapsibleHeaderLayout
            title={'Tip of the Month'}
            subtitle={'...small adjustments, big difference'}
            backgroundImage={bg}
            // renderScroll={false}
        >
            <SectionList
                renderSectionHeader={({ section: { year, index } }) => (
                    <View style={[sharedStyles.sectionHeader, index > 0 ? { marginTop: spaces.large } : {}]}>
                        <H7>{year}</H7>
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
                        title={<Body>No Tips Yet!</Body>}
                    />
                }
                renderItem={({ item, index }) =>
                    <ListItem
                        containerStyle={sharedStyles.listItem}
                        contentContainerStyle={sharedStyles.listItemContent}
                        bottomDivider
                        topDivider={index === 0}
                        chevron={true}
                        onPress={() => props.navigation.push(ROUTES.TIP, {tip: item})}
                        title={<Body>{item.title}</Body>}
                    />
                }
                keyExtractor={(item, index): string => `tip_${item.id}`}
            />
        </CollapsibleHeaderLayout>
    )
};