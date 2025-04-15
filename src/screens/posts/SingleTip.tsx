import React from 'react';
import { ScrollView } from 'react-native';
import { height } from '../../utilities/dimensions';

// Utilities
import { splitParagraphs, getLongDate } from '../../utilities';
// Constants
import { Paragraph } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { useAppTheme } from '../../theme';
import { Header } from '../../components/CollapsibleHeader/Header';
import { COLLAPSED_HEIGHT } from '../../components/CollapsibleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/core';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { SectionHeader, Stack } from '../../components/layout';
import { YoutubeCard } from '../../components/videos';

export const SingleTip: React.FC = () => {
    const navigation = useNavigation<StackScreenProps<RootStackParamList>>();
    const route = useRoute();
    // TODO
    const { tip } = route.params as any;
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();

    if (tip === null) {
        // navigation.pop();
    }

    return (
        tip && (
            <Stack
                style={[
                    {
                        flex: 1,
                        backgroundColor: theme.colors.background,
                        paddingTop: COLLAPSED_HEIGHT + insets.top,
                    },
                ]}
            >
                <Header title={getLongDate(tip.date)} mainAction={'back'} navigation={navigation} fixed />
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
                    <SectionHeader title={tip.title} />
                    <YoutubeCard video={tip.video} />
                    <SectionHeader title={'Summary'} style={{ marginTop: theme.spacing.xl }} />
                    <Stack gap={theme.spacing.md}>
                        {splitParagraphs(tip.comments).map((p, ind) => (
                            <Paragraph key={`${tip.id}_p_${ind}`}>{p}</Paragraph>
                        ))}
                    </Stack>
                </ScrollView>
            </Stack>
        )
    );
};
