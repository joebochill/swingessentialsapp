import React from 'react';
// Components
import { ScrollView } from 'react-native';
import { Stack, SectionHeader, YoutubeCard } from '../../components';
// Styles
import { height } from '../../utilities/dimensions';

// Utilities
import { splitParagraphs, getLongDate } from '../../utilities';
// Constants
import { Paragraph } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useAppTheme } from '../../theme';
import { Header } from '../../components/CollapsibleHeader/Header';
import { COLLAPSED_HEIGHT } from '../../components/CollapsibleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SingleTip: React.FC<StackScreenProps<RootStackParamList, 'SingleTip'>> = (props) => {
    const { tip } = props.route.params;
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();

    if (tip === null) {
        props.navigation.pop();
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
                <Header title={getLongDate(tip.date)} mainAction={'back'} navigation={props.navigation} fixed />
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
                    <Stack space={theme.spacing.md}>
                        {splitParagraphs(tip.comments).map((p, ind) => (
                            <Paragraph key={`${tip.id}_p_${ind}`}>{p}</Paragraph>
                        ))}
                    </Stack>
                </ScrollView>
            </Stack>
        )
    );
};
