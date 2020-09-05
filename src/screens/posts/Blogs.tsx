import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Components
import { View, SectionList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { H7, Body, CollapsibleHeaderLayout } from '../../components';
// Constants
import { ROUTES } from '../../constants/routes';
// Styles
import bg from '../../images/banners/19th.jpg';
import { useSharedStyles } from '../../styles';
import { spaces, sizes } from '../../styles/sizes';
import { useTheme } from 'react-native-paper';

// Utilities
import { makeGroups } from '../../utilities';
// Redux
import { loadBlogs } from '../../redux/actions';
// Types
import { ApplicationState } from '../../__types__';

type Blog = {
    id: number;
    date: string;
    body: string;
    title: string;
};

export const Blogs = props => {
    const blogs = useSelector((state: ApplicationState) => state.blogs);
    const sections = makeGroups(blogs.blogList, (blog: Blog) => new Date(blog.date).getUTCFullYear().toString());
    const dispatch = useDispatch();
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);

    return (
        <CollapsibleHeaderLayout
            title={'The 19th Hole'}
            subtitle={'Stories from the field'}
            backgroundImage={bg}
            refreshing={blogs.loading}
            onRefresh={() => {
                dispatch(loadBlogs());
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
                        title={<Body>No Posts Yet!</Body>}
                    />
                }
                renderItem={({ item, index }) => (
                    <ListItem
                        containerStyle={sharedStyles.listItem}
                        contentContainerStyle={sharedStyles.listItemContent}
                        bottomDivider
                        topDivider={index === 0}
                        onPress={() => props.navigation.push(ROUTES.BLOG, { blog: item })}
                        title={<Body>{item.title}</Body>}
                        rightIcon={{
                            name: 'chevron-right',
                            color: theme.colors.text,
                            size: sizes.small,
                        }}
                    />
                )}
                keyExtractor={(item): string => `blog_${item.id}`}
            />
        </CollapsibleHeaderLayout>
    );
};
