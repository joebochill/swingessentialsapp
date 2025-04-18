import React, { JSX, useMemo } from 'react';
import { View, SectionList, RefreshControl } from 'react-native';
import bg from '../../images/banners/tips.jpg';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppTheme } from '../../theme';
import { useCollapsibleHeader } from '../../components/CollapsibleHeader';
import { Header } from '../../components/CollapsibleHeader/Header';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { useNavigation } from '@react-navigation/core';
import { SectionHeader } from '../../components/layout';
import { ListItem } from '../../components/ListItem';
import { TipDetailsWithYear, useGetTipsQuery } from '../../redux/apiServices/tipsService';
import { ROUTES } from '../../constants/routes';
import { Icon } from '../../components/Icon';

export const Tips: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();
    const theme = useAppTheme();
    const { data: tips = [], isFetching, refetch } = useGetTipsQuery();

    // group the tips by year
    const tipsByYear = useMemo(() => {
        return tips.reduce((acc, blog) => {
            const year = blog.year;
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(blog);
            return acc;
        }, {} as Record<number, TipDetailsWithYear[]>);
    }, [tips]);

    const sections = Object.entries(tipsByYear).map(([year, tipsData]) => ({
        bucketName: year,
        data: tipsData,
    }));

    return (
        <>
            <Header
                title={'Tip of the Month'}
                subtitle={'Keep your game sharp'}
                backgroundImage={bg}
                navigation={navigation}
                {...headerProps}
            />
            <SectionList<TipDetailsWithYear>
                {...scrollProps}
                style={{ backgroundColor: theme.colors.background }}
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
                        refreshing={isFetching}
                        onRefresh={(): void => {
                            refetch();
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
                        onPress={(): void => navigation.push(ROUTES.TIP, { tip: item.id })}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <View style={[style]} {...rightProps}>
                                <Icon
                                    name={'chevron-right'}
                                    size={theme.size.md}
                                    color={theme.colors.onPrimaryContainer}
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
