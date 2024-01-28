import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Components
import { View, SectionList } from 'react-native';
import { CollapsibleHeaderLayout, ListItem, SectionHeader, Stack } from '../../components';
import MatIcon from 'react-native-vector-icons/MaterialIcons';

// Constants
import { ROUTES } from '../../constants/routes';
// Styles
import bg from '../../images/banners/19th.jpg';
import { Divider } from 'react-native-paper';

// Utilities
import { makeGroups } from '../../utilities';
// Redux
import { loadBlogs } from '../../redux/actions';
// Types
import { ApplicationState } from '../../__types__';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useAppTheme } from '../../styles/theme';

type Blog = {
    id: number;
    date: string;
    body: string;
    title: string;
};

export const Blogs: React.FC<StackScreenProps<RootStackParamList, 'Blogs'>> = (props) => {
    const blogs = useSelector((state: ApplicationState) => state.blogs);
    const sections = makeGroups(blogs.blogList, (blog: Blog) => new Date(blog.date).getUTCFullYear().toString());
    const dispatch = useDispatch();
    const theme = useAppTheme();

    return (
        <CollapsibleHeaderLayout
            title={'The 19th Hole'}
            subtitle={'Stories from the field'}
            backgroundImage={bg}
            refreshing={blogs.loading}
            onRefresh={(): void => {
                // @ts-ignore
                dispatch(loadBlogs());
            }}
            navigation={props.navigation}
        >
            <SectionList
                renderSectionHeader={({ section: { bucketName } }): JSX.Element => (
                    <SectionHeader
                        title={bucketName}
                        style={{ marginTop: theme.spacing.xxl, marginHorizontal: theme.spacing.md }}
                    />
                )}
                sections={sections}
                stickySectionHeadersEnabled={false}
                ListEmptyComponent={
                    <Stack style={{ marginTop: theme.spacing.xxl }}>
                        <Divider />
                        <ListItem title={'No Posts Yet!'} />
                        <Divider />
                    </Stack>
                }
                renderItem={({ item, index }): JSX.Element => (
                    <>
                        {index === 0 && <Divider />}
                        <ListItem
                            title={item.title}
                            titleNumberOfLines={2}
                            titleEllipsizeMode={'tail'}
                            // @ts-ignore
                            onPress={(): void => props.navigation.push(ROUTES.BLOG, { blog: item })}
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
                        <Divider />
                    </>
                )}
                keyExtractor={(item): string => `blog_${item.id}`}
            />
        </CollapsibleHeaderLayout>
    );
};
