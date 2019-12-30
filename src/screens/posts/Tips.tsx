import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Components
import { View, SectionList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { H7, Body, CollapsibleHeaderLayout } from '../../components';
// Constants
import { ROUTES } from '../../constants/routes';
// Styles
import bg from '../../images/bg_4.jpg';
import { sharedStyles } from '../../styles';
import { spaces, sizes } from '../../styles/sizes';
import { useTheme } from '../../styles/theme';

// Utilities
import { makeGroups } from '../../utilities';
// Redux
import { loadTips } from '../../redux/actions';
// Types
import { ApplicationState } from '../../__types__';

type Tip = {
    id: number;
    date: string;
    comments: string;
    title: string;
    video: string;
};

export const Tips = props => {
    const tips = useSelector((state: ApplicationState) => state.tips);
    const sections = makeGroups(tips.tipList, (tip: Tip) => new Date(tip.date).getUTCFullYear().toString());
    const dispatch = useDispatch();
    const theme = useTheme();

    return (
        <CollapsibleHeaderLayout
            title={'Tip of the Month'}
            subtitle={'small adjustments, big difference'}
            backgroundImage={bg}
            refreshing={tips.loading}
            onRefresh={() => {
                dispatch(loadTips());
            }}>
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
                renderItem={({ item, index }) => (
                    <ListItem
                        containerStyle={sharedStyles.listItem}
                        contentContainerStyle={sharedStyles.listItemContent}
                        bottomDivider
                        topDivider={index === 0}
                        onPress={() => props.navigation.push(ROUTES.TIP, { tip: item })}
                        title={<Body>{item.title}</Body>}
                        rightIcon={{
                            name: 'chevron-right',
                            color: theme.colors.text[500],
                            size: sizes.small
                        }}
                    />
                )}
                keyExtractor={(item): string => `tip_${item.id}`}
            />
        </CollapsibleHeaderLayout>
    );
};
