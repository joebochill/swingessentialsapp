import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Components
import { View, SectionList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { H7, Body, CollapsibleHeaderLayout } from '../../components';
// Constants
import { ROUTES } from '../../constants/routes';
// Styles
import bg from '../../images/bg_4.jpg';
import { sharedStyles } from '../../styles';
import { spaces } from '../../styles/sizes';
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

    return (
        <CollapsibleHeaderLayout
            title={'19th Hole'}
            subtitle={'golf stories and Q&A'}
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
                        chevron={true}
                        onPress={() => props.navigation.push(ROUTES.BLOG, { blog: item })}
                        title={<Body>{item.title}</Body>}
                    />
                )}
                keyExtractor={(item): string => `blog_${item.id}`}
            />
        </CollapsibleHeaderLayout>
    );
};
