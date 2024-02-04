import React from 'react';
// Components
import { ScrollView } from 'react-native';
import { Stack, SectionHeader, YoutubeCard } from '../../components';
// Styles
import { height } from '../../utilities/dimensions';

// Utilities
import { splitParagraphs, getLongDate } from '../../utilities';
// Constants
import { HEADER_COLLAPSED_HEIGHT } from '../../constants';
import { Paragraph } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useAppTheme } from '../../theme';
import { Header } from '../../components/CollapsibleHeader/Header';

export const SingleTip: React.FC<StackScreenProps<RootStackParamList, 'SingleTip'>> = (props) => {
    const { tip } = props.route.params;
    const theme = useAppTheme();

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
                        paddingTop: HEADER_COLLAPSED_HEIGHT,
                    },
                ]}
            >
                <Header title={getLongDate(tip.date)} mainAction={'back'} navigation={props.navigation} />
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
