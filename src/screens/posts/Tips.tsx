import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Components
import { View, SectionList } from 'react-native';
import { CollapsibleHeaderLayout, SEButton } from '../../components';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
// Constants
import { ROUTES } from '../../constants/routes';
// Styles
import bg from '../../images/banners/tips.jpg';
import { useSharedStyles, useFlexStyles, useListStyles } from '../../styles';
import { useTheme, Divider, List, Subheading } from 'react-native-paper';

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
    const sharedStyles = useSharedStyles(theme);
    const flexStyles = useFlexStyles(theme);
    const listStyles = useListStyles(theme);

    return (
        <CollapsibleHeaderLayout
            title={'Tip of the Month'}
            subtitle={'Keep your game sharp'}
            backgroundImage={bg}
            refreshing={tips.loading}
            onRefresh={() => {
                dispatch(loadTips());
            }}>
            <SectionList
                renderSectionHeader={({ section: { bucketName, index } }) => (
                    <View style={[sharedStyles.sectionHeader, index > 0 ? { marginTop: theme.spaces.jumbo } : {}]}>
                        <Subheading style={listStyles.heading}>{bucketName}</Subheading>
                    </View>
                )}
                sections={sections}
                stickySectionHeadersEnabled={false}
                ListEmptyComponent={
                    <>
                        <Divider />
                        <List.Item
                            title={'No Tips Yet!'}
                            style={listStyles.item}
                            titleStyle={{ marginLeft: -8 }}
                        />
                        <Divider />
                    </>
                }
                renderItem={({ item, index }) => (
                    <>
                        {index === 0 && <Divider />}
                        <List.Item
                            title={item.title}
                            titleNumberOfLines={2}
                            titleEllipsizeMode={'tail'}
                            onPress={() => props.navigation.push(ROUTES.TIP, { tip: item })}

                            style={listStyles.item}
                            titleStyle={{ marginLeft: -8 }}
                            descriptionStyle={{ marginLeft: -8 }}
                            right={({ style, ...rightProps }) => (
                                <View style={[flexStyles.row, style]} {...rightProps}>
                                    <MatIcon name={'chevron-right'} size={theme.sizes.small} style={{ marginRight: -1 * theme.spaces.small }} />
                                </View>
                            )}
                        />
                        <Divider />
                    </>
                )}
                keyExtractor={(item): string => `tip_${item.id}`}
            />
        </CollapsibleHeaderLayout>
    );
};
