import React, { JSX, useMemo } from 'react';
import { View, SectionList, RefreshControl } from 'react-native';
import { ROUTES } from '../../constants/routes';
import bg from '../../images/banners/19th.jpg';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppTheme } from '../../theme';
import { useCollapsibleHeader, Header } from '../../components/CollapsibleHeader';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { useNavigation } from '@react-navigation/core';
import { SectionHeader } from '../../components/layout';
import { ListItem } from '../../components/ListItem';
import { BlogDetailsWithYear, useGetBlogsQuery } from '../../redux/apiServices/blogsService';
import { Icon } from '../../components/Icon';

export const Blogs: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();
    const theme = useAppTheme();
    const { data: blogs = [], isFetching, refetch } = useGetBlogsQuery();

    // group the blogs by year
    const blogsByYear = useMemo(() => {
        return blogs.reduce((acc, blog) => {
            const year = blog.year;
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(blog);
            return acc;
        }, {} as Record<number, BlogDetailsWithYear[]>);
    }, [blogs]);

    const sections = Object.entries(blogsByYear).map(([year, blogsData]) => ({
        bucketName: year,
        data: blogsData,
    }));

    return (
        <>
            <Header
                title={'The 19th Hole'}
                subtitle={'Stories from the field'}
                backgroundImage={bg}
                navigation={navigation}
                {...headerProps}
            />
            <SectionList<BlogDetailsWithYear>
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
                        title={'No Posts Yet!'}
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
                        onPress={(): void => navigation.push(ROUTES.BLOG, { blog: item.id })}
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
                keyExtractor={(item): string => `blog_${item.id}`}
            />
        </>
    );
};
