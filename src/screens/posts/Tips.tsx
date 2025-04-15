import React, { JSX } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, SectionList, RefreshControl } from 'react-native';
import MatIcon from '@react-native-vector-icons/material-icons';
import { ROUTES } from '../../constants/routes';
import bg from '../../images/banners/tips.jpg';
import { makeGroups } from '../../utilities';
import { StackScreenProps } from '@react-navigation/stack';
import { useAppTheme } from '../../theme';
import { useCollapsibleHeader } from '../../components/CollapsibleHeader';
import { Header } from '../../components/CollapsibleHeader/Header';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { useNavigation } from '@react-navigation/core';
import { SectionHeader } from '../../components/layout';
import { ListItem } from '../../components/ListItem';

type Tip = {
    id: number;
    date: string;
    comments: string;
    title: string;
    video: string;
};

export const Tips: React.FC = () => {
    const navigation = useNavigation<StackScreenProps<RootStackParamList>>();
    const tips = {} as any; //useSelector((state: ApplicationState) => state.tips);
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
                navigation={navigation}
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
                            // dispatch(loadTips());
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
                        // onPress={(): void => navigation.push(ROUTES.TIP, { tip: item })}
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
