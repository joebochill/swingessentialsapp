import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Components
import { View, SectionList, RefreshControl } from 'react-native';
import { ListItem, SectionHeader } from '../../components';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
// Constants
import { ROUTES } from '../../constants/routes';
// Styles
import bg from '../../images/banners/tips.jpg';

// Utilities
import { makeGroups } from '../../utilities';
// Redux
import { loadTips } from '../../redux/actions';
// Types
import { ApplicationState } from '../../__types__';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useAppTheme } from '../../theme';
import { useCollapsibleHeader } from '../../components/CollapsibleHeader';
import { Header } from '../../components/CollapsibleHeader/Header';

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
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();

    return (
        <>
            <Header
                title={'Tip of the Month'}
                subtitle={'Keep your game sharp'}
                backgroundImage={bg}
                navigation={props.navigation}
                {...headerProps}
            />
            <SectionList
                {...scrollProps}
                contentContainerStyle={contentProps.contentContainerStyle}
                renderSectionHeader={({ section: { bucketName } }): JSX.Element => (
                    <SectionHeader
                        title={bucketName}
                        style={{ marginTop: theme.spacing.xxl, marginHorizontal: theme.spacing.md }}
                    />
                )}
                sections={sections}
                stickySectionHeadersEnabled={false}
                ListEmptyComponent={
                    <ListItem
                        topDivider
                        bottomDivider
                        style={{ marginTop: theme.spacing.xxl }}
                        title={'No Tips Yet!'}
                    />
                }
                refreshControl={
                    <RefreshControl
                        refreshing={tips.loading}
                        onRefresh={(): void => {
                            // @ts-ignore
                            dispatch(loadTips());
                        }}
                        progressViewOffset={contentProps.contentContainerStyle.paddingTop}
                    />
                }
                renderItem={({ item, index }): JSX.Element => (
                    <ListItem
                        bottomDivider
                        topDivider={index === 0}
                        title={item.title}
                        titleNumberOfLines={2}
                        titleEllipsizeMode={'tail'}
                        // @ts-ignore
                        onPress={(): void => props.navigation.push(ROUTES.TIP, { tip: item })}
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
                )}
                keyExtractor={(item): string => `tip_${item.id}`}
            />
        </>
    );
};
