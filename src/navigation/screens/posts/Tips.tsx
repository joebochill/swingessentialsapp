import React from 'react';
import { useSelector } from 'react-redux';

import { View, SectionList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { H7, Body} from '@pxblue/react-native-components';
import { CollapsibleHeaderLayout } from '../../../components';

import { ROUTES } from '../../../constants/routes';

import bg from '../../../images/bg_6.jpg';
import { spaces } from '../../../styles/sizes';
import { sharedStyles } from '../../../styles';
import { makeGroups } from '../../../utilities/general';

type Tip = {
    id: number;
    date: string;
    comments: string;
    title: string;
    video: string;
}

export const Tips = (props) => {
    const tips = useSelector(state => state.tips.tipList);
    // console.log(tips);
    const sections = makeGroups(tips, (tip: Tip) => new Date(tip.date).getUTCFullYear().toString());

    return (
        <CollapsibleHeaderLayout
            title={'Tip of the Month'}
            subtitle={'...small adjustments, big difference'}
            backgroundImage={bg}
            // renderScroll={false}
        >
            <SectionList
                renderSectionHeader={({ section: { bucketName, index } }) => (
                    <View style={[sharedStyles.sectionHeader, index > 0 ? { marginTop: spaces.large } : {}]}>
                        <H7>{bucketName}</H7>
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