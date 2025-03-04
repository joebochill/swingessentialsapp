import React from 'react';
// Components
import { ScrollView } from 'react-native';
import { Stack, SectionHeader, Paragraph } from '../../components';

// Utilities
import { splitParagraphs, getLongDate } from '../../utilities';
import { height } from '../../utilities/dimensions';

// Constants
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useAppTheme } from '../../theme';
import { Header } from '../../components/CollapsibleHeader/Header';
import { COLLAPSED_HEIGHT } from '../../components/CollapsibleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SingleBlog: React.FC<StackScreenProps<RootStackParamList, 'SingleBlog'>> = (props) => {
    const { blog } = props.route.params;
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();

    if (blog === null) {
        props.navigation.pop();
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
                <Header title={getLongDate(blog.date)} mainAction={'back'} navigation={props.navigation} fixed />
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
                    <Stack space={theme.spacing.md}>
                        {splitParagraphs(blog.body).map((p, ind) => (
                            <Paragraph key={`${blog.id}_p_${ind}`}>{p}</Paragraph>
                        ))}
                    </Stack>
                </ScrollView>
            </Stack>
        )
    );
};
