import React from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { splitParagraphs } from '../../../utilities/text';
import { height } from '../../../utilities/dimensions';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppTheme } from '../../../theme';
import { Header } from '../../layout/CollapsibleHeader/Header';
import { COLLAPSED_HEIGHT } from '../../layout/CollapsibleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { RootStackParamList } from '../../../navigation/MainNavigation';
import { SectionHeader } from '../../typography/SectionHeader';
import { Stack } from '../../layout/Stack';
import { Paragraph, Typography } from '../../typography';
import { useGetBlogByIdQuery } from '../../../redux/apiServices/blogsService';
import { format, parse } from 'date-fns';

export const SingleBlog: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'BLOG'>>();
    const { blog: blogID } = route.params;
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();

    const { data: blogDetails, isFetching } = useGetBlogByIdQuery(blogID ?? 0, {
        skip: blogID === null,
    });

    if (blogID === null) {
        navigation.pop();
    }
    return (
        blogID && (
            <Stack
                style={[
                    {
                        flex: 1,
                        backgroundColor: theme.colors.background,
                        paddingTop: COLLAPSED_HEIGHT + insets.top,
                    },
                ]}
            >
                <Header
                    title={blogDetails ? format(parse(blogDetails.date, 'yyyy-MM-dd', new Date()), 'MMMM yyyy') : ''}
                    mainAction={'back'}
                    navigation={navigation}
                    backgroundColor={theme.dark ? theme.colors.surface : undefined}
                    fixed
                />
                <ScrollView
                    contentContainerStyle={[
                        {
                            paddingHorizontal: theme.spacing.md,
                            paddingTop: theme.spacing.md,
                            paddingBottom: height * 0.5,
                        },
                    ]}
                    keyboardShouldPersistTaps={'always'}
                >
                    {blogDetails && (
                        <>
                            <SectionHeader title={blogDetails.title} />
                            <Stack gap={theme.spacing.md}>
                                {splitParagraphs(blogDetails.body).map((p, ind) => (
                                    <Paragraph key={`${blogDetails.id}_p_${ind}`}>{p}</Paragraph>
                                ))}
                            </Stack>
                        </>
                    )}
                    {isFetching && (
                        <>
                            <ActivityIndicator size={'large'} color={theme.colors.onSurface} />
                            <Typography variant={'bodyLarge'} align={'center'} color={'onSurface'}>
                                Loading post...
                            </Typography>
                        </>
                    )}
                </ScrollView>
            </Stack>
        )
    );
};
