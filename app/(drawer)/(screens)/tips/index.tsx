import bg from '@/assets/images/banners/tips.jpg';
import { Icon } from '@/components/common/Icon';
import { ListItem } from '@/components/common/ListItem';
import { Header } from '@/components/layout/CollapsibleHeader/Header';
import { useCollapsibleHeader } from '@/components/layout/CollapsibleHeader/useCollapsibleHeader';
import { SectionHeader } from '@/components/typography/SectionHeader';
import { TipDetailsWithYear, useGetTipsQuery } from '@/redux/apiServices/tipsService';
import { useAppTheme } from '@/theme';
import { useRouter } from 'expo-router';
import React, { JSX, useMemo } from 'react';
import { RefreshControl, SectionList, View } from 'react-native';

export default function TipsScreen() {
    // const navigation = useNavigation();
    const router = useRouter();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();
    const theme = useAppTheme();
    const { data: tips = [], isFetching, refetch } = useGetTipsQuery();

    // group the tips by year
    const tipsByYear = useMemo(() => {
        return tips.reduce(
            (acc, blog) => {
                const year = blog.year;
                if (!acc[year]) {
                    acc[year] = [];
                }
                acc[year].push(blog);
                return acc;
            },
            {} as Record<number, TipDetailsWithYear[]>
        );
    }, [tips]);

    const sections = Object.entries(tipsByYear)
        .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA)) // Sort by year descending
        .map(([year, tipsData]) => ({
            bucketName: year,
            data: tipsData,
        }));

    return (
        <>
            <Header
                title={'Tip of the Month'}
                subtitle={'Keep your game sharp'}
                backgroundImage={bg}
                {...headerProps}
            />
            <SectionList<TipDetailsWithYear>
                {...scrollProps}
                style={{ backgroundColor: theme.colors.background }}
                contentContainerStyle={contentProps.contentContainerStyle}
                renderSectionHeader={({ section: { bucketName } }): JSX.Element => (
                    <SectionHeader
                        title={bucketName}
                        style={{
                            marginTop: theme.spacing.xxl,
                            marginHorizontal: theme.spacing.md,
                        }}
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
                        tintColor={theme.dark ? theme.colors.onBackground : theme.colors.primary}
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
                        onPress={(): void => {
                            router.push({ pathname: '/[id]', params: { id: item.id } });
                        }}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <View style={[style]} {...rightProps}>
                                <Icon
                                    name={'chevron-right'}
                                    size={theme.size.md}
                                    color={theme.colors.onPrimaryContainer}
                                    style={{ marginRight: -1 * theme.spacing.sm }}
                                />
                            </View>
                        )}
                    />
                )}
                keyExtractor={(item): string => `tip_${item.id}`}
            />
        </>
    );
}
