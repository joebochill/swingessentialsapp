import React from 'react';
// Components
import { ScrollView } from 'react-native';

// Utilities
import { splitParagraphs, getLongDate } from '../../utilities';
import { height } from '../../utilities/dimensions';

// Constants
import { StackScreenProps } from '@react-navigation/stack';
import { useAppTheme } from '../../theme';
import { Header } from '../../components/CollapsibleHeader/Header';
import { COLLAPSED_HEIGHT } from '../../components/CollapsibleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/core';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { SectionHeader, Stack } from '../../components/layout';
import { Paragraph } from '../../components/typography';

export const SingleBlog: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation<StackScreenProps<RootStackParamList>>();
    // TODO
    const { blog } = route.params as any;
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();

    if (blog === null) {
        // navigation.pop();
    }
    return (
        blog && (
            <Stack
                style={[
                    {
                        flex: 1,
                        backgroundColor: theme.colors.background,
                        paddingTop: COLLAPSED_HEIGHT + insets.top,
                    },
                ]}
            >
                <Header title={getLongDate(blog.date)} mainAction={'back'} navigation={navigation} fixed />
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
                    <SectionHeader title={blog.title} />
                    <Stack gap={theme.spacing.md}>
                        {splitParagraphs(blog.body).map((p, ind) => (
                            <Paragraph key={`${blog.id}_p_${ind}`}>{p}</Paragraph>
                        ))}
                    </Stack>
                </ScrollView>
            </Stack>
        )
    );
};
