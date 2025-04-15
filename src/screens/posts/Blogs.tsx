import React, { JSX } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, SectionList, RefreshControl } from 'react-native';
import MatIcon from '@react-native-vector-icons/material-icons';
import { ROUTES } from '../../constants/routes';
import bg from '../../images/banners/19th.jpg';
import { makeGroups } from '../../utilities';
import { StackScreenProps } from '@react-navigation/stack';
import { useAppTheme } from '../../theme';
import { useCollapsibleHeader, Header } from '../../components/CollapsibleHeader';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { useNavigation } from '@react-navigation/core';
import { SectionHeader } from '../../components/layout';
import { ListItem } from '../../components/ListItem';

type Blog = {
    id: number;
    date: string;
    body: string;
    title: string;
};

export const Blogs: React.FC = () => {
    const navigation = useNavigation<StackScreenProps<RootStackParamList>>();
    const blogs = {} as any; //useSelector((state: ApplicationState) => state.blogs);
    const sections = makeGroups(blogs.blogList, (blog: Blog) => new Date(blog.date).getUTCFullYear().toString());
    const dispatch = useDispatch();
    const theme = useAppTheme();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();

    return (
        <>
            <Header
                title={'The 19th Hole'}
                subtitle={'Stories from the field'}
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
                        title={'No Posts Yet!'}
                    />
                }
                refreshControl={
                    <RefreshControl
                        refreshing={blogs.loading}
                        onRefresh={(): void => {
                            // dispatch(loadBlogs());
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
                        // onPress={(): void => navigation.push(ROUTES.BLOG, { blog: item })}
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
                keyExtractor={(item): string => `blog_${item.id}`}
            />
        </>
    );
};
