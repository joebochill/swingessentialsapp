import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Components
import { View, SectionList } from 'react-native';
import { CollapsibleHeaderLayout, SEButton } from '../../components';
import MatIcon from 'react-native-vector-icons/MaterialIcons';

// Constants
import { ROUTES } from '../../constants/routes';
// Styles
import bg from '../../images/banners/19th.jpg';
import { useSharedStyles, useFlexStyles, useListStyles } from '../../styles';
import { useTheme, Divider, List, Subheading } from 'react-native-paper';

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
    const flexStyles = useFlexStyles(theme);
    const listStyles = useListStyles(theme);

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
                    <View style={[sharedStyles.sectionHeader, index > 0 ? { marginTop: theme.spaces.jumbo } : {}]}>
                        <Subheading style={listStyles.heading}>{bucketName}</Subheading>
                    </View>
                )}
                sections={sections}
                stickySectionHeadersEnabled={false}
                ListEmptyComponent={
                    <>
                        <Divider />
                        <List.Item
                            title={'No Posts Yet!'}
                            style={listStyles.item}
                            titleStyle={{ marginLeft: -8 }}
                        />
                        <Divider />
                    </>
                }
                renderItem={({ item, index }) => (
                    <>
                        {index === 0 && <Divider />}
                        <List.Item
                            title={item.title}
                            titleNumberOfLines={2}
                            titleEllipsizeMode={'tail'}
                            onPress={() => props.navigation.push(ROUTES.BLOG, { blog: item })}
                            style={listStyles.item}
                            titleStyle={{ marginLeft: -8 }}
                            descriptionStyle={{ marginLeft: -8 }}
                            right={({ style, ...rightProps }) => (
                                <View style={[flexStyles.row, style]} {...rightProps}>
                                    <MatIcon name={'chevron-right'} size={theme.sizes.small} style={{marginRight: -1 * theme.spaces.small}}/>
                                </View>
                            )}
                        />
                        <Divider />
                    </>
                )}
                keyExtractor={(item): string => `blog_${item.id}`}
            />
        </CollapsibleHeaderLayout>
    );
};
