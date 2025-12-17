import { Header } from '@/components/layout/CollapsibleHeader/Header';
import { COLLAPSED_HEIGHT } from '@/components/layout/CollapsibleHeader/useCollapsibleHeader';
import { Stack } from '@/components/layout/Stack';
import { Paragraph } from '@/components/typography/Paragraph';
import { SectionHeader } from '@/components/typography/SectionHeader';
import { Typography } from '@/components/typography/Typography';
import { useGetBlogByIdQuery } from '@/redux/apiServices/blogsService';
import { useAppTheme } from '@/theme';
import { height } from '@/utilities/dimensions';
import { splitParagraphs } from '@/utilities/text';
import { format, isValid } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SingleBlog() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const blogID = Array.isArray(id) ? id[0] : id;
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();

    const { data: blogDetails, isFetching } = useGetBlogByIdQuery(blogID ?? 0, {
        skip: blogID === null,
    });

    if (blogID === null) {
        router.back();
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
                    title={
                        blogDetails && isValid(new Date(blogDetails.date))
                            ? format(new Date(blogDetails.date), 'MMMM yyyy')
                            : ''
                    }
                    mainAction={'back'}
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
}
