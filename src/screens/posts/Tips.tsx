import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Components
import { View, SectionList } from 'react-native';
import { CollapsibleHeaderLayout, ListItem, SectionHeader, Stack } from '../../components';
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
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useAppTheme } from '../../styles/theme';

type Tip = {
    id: number;
    date: string;
    comments: string;
    title: string;
    video: string;
};

export const Tips: React.FC<StackScreenProps<RootStackParamList, 'Tips'>> = (props) => {
    const tips = useSelector((state: ApplicationState) => state.tips);
    const sections = makeGroups(tips.tipList, (tip: Tip) => new Date(tip.date).getUTCFullYear().toString());
    const dispatch = useDispatch();
    const theme = useAppTheme();
    const sharedStyles = useSharedStyles(theme);
    const flexStyles = useFlexStyles(theme);
    const listStyles = useListStyles(theme);

    return (
        <CollapsibleHeaderLayout
            title={'Tip of the Month'}
            subtitle={'Keep your game sharp'}
            backgroundImage={bg}
            refreshing={tips.loading}
            onRefresh={(): void => {
                // @ts-ignore
                dispatch(loadTips());
            }}
            navigation={props.navigation}
        >
            <SectionList
                renderSectionHeader={({ section: { bucketName } }): JSX.Element => (
                    <SectionHeader
                        title={bucketName}
                        style={{ marginTop: theme.spacing.xxl, marginHorizontal: theme.spacing.md }}
                    />
                )}
                sections={sections}
                stickySectionHeadersEnabled={false}
                ListEmptyComponent={
                    <Stack style={{ marginTop: theme.spacing.xxl }}>
                        <Divider />
                        <ListItem title={'No Tips Yet!'} titleStyle={{ marginLeft: -1 * theme.spacing.md }} />
                        <Divider />
                    </Stack>
                }
                renderItem={({ item, index }): JSX.Element => (
                    <>
                        {index === 0 && <Divider />}
                        <ListItem
                            title={item.title}
                            titleNumberOfLines={2}
                            titleEllipsizeMode={'tail'}
                            // @ts-ignore
                            onPress={(): void => props.navigation.push(ROUTES.TIP, { tip: item })}
                            titleStyle={{ marginLeft: -1 * theme.spacing.md }}
                            descriptionStyle={{ marginLeft: -1 * theme.spacing.md }}
                            right={({ style, ...rightProps }): JSX.Element => (
                                <View style={[style]} {...rightProps}>
                                    <MatIcon
                                        name={'chevron-right'}
                                        size={theme.size.md}
                                        color={theme.colors.primary}
                                        style={{ marginRight: -1 * theme.spacing.md }}
                                    />
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
