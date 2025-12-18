import React, { JSX, useMemo } from 'react';
import { RefreshControl, SectionList, View } from 'react-native';
// import { StackNavigationProp } from "@react-navigation/stack";
import bg from '@/assets/images/banners/19th.jpg';
import { Icon } from '@/components/common/Icon';
import { ListItem } from '@/components/common/ListItem';
import { Header } from '@/components/layout/CollapsibleHeader/Header';
import { useCollapsibleHeader } from '@/components/layout/CollapsibleHeader/useCollapsibleHeader';
import { SectionHeader } from '@/components/typography/SectionHeader';
import { BlogDetailsWithYear, useGetBlogsQuery } from '@/redux/apiServices/blogsService';
import { useAppTheme } from '@/theme';
import { useRouter } from 'expo-router';

export default function BlogsScreen() {
    // const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const router = useRouter();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();
    const theme = useAppTheme();
    const { data: blogs = [], isFetching, refetch } = useGetBlogsQuery();

    // group the blogs by year
    const blogsByYear = useMemo(() => {
        return blogs.reduce(
            (acc, blog) => {
                const year = blog.year;
                if (!acc[year]) {
                    acc[year] = [];
                }
                acc[year].push(blog);
                return acc;
            },
            {} as Record<number, BlogDetailsWithYear[]>
        );
    }, [blogs]);

    const sections = Object.entries(blogsByYear)
        .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA)) // Sort by year descending
        .map(([year, blogsData]) => ({
            bucketName: year,
            data: blogsData,
        }));

    return (
        <>
            <Header
                title={'The 19th Hole'}
                subtitle={'Stories from the field'}
                backgroundImage={bg}
                // navigation={navigation}
                {...headerProps}
            />
            <SectionList<BlogDetailsWithYear>
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
                        title={'No Posts Yet!'}
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
                        onPress={(): void => router.push(`/(drawer)/(screens)/19th-hole/${item.id}`)}
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
                keyExtractor={(item): string => `blog_${item.id}`}
            />
        </>
    );
}
