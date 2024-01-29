import React from 'react';
// Components
import { ScrollView } from 'react-native';
import { SEHeader, YouTube, Stack, SectionHeader } from '../../components';
// Styles
import { width, height, aspectHeight } from '../../utilities/dimensions';

// Utilities
import { splitParagraphs, getLongDate } from '../../utilities';
// Constants
import { HEADER_COLLAPSED_HEIGHT } from '../../constants';
import { Paragraph } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useAppTheme } from '../../theme';

export const SingleTip: React.FC<StackScreenProps<RootStackParamList, 'SingleTip'>> = (props) => {
    const { tip } = props.route.params;
    const theme = useAppTheme();

    if (tip === null) {
        props.navigation.pop();
    }
    const videoWidth = width - 2 * theme.spacing.md;
    const videoHeight = aspectHeight(videoWidth);

    return (
        tip && (
            <Stack
                style={[
                    {
                        flex: 1,
                        backgroundColor: theme.colors.background,
                        paddingTop: HEADER_COLLAPSED_HEIGHT,
                    },
                ]}
            >
                {/* @ts-ignore */}
                <SEHeader title={getLongDate(tip.date)} mainAction={'back'} navigation={props.navigation} />
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
                    <YouTube videoId={tip.video} style={{ width: videoWidth, height: videoHeight }} />
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
