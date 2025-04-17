import React from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { height } from '../../utilities/dimensions';
import { splitParagraphs, getLongDate } from '../../utilities';
import { Paragraph } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppTheme } from '../../theme';
import { Header } from '../../components/CollapsibleHeader/Header';
import { COLLAPSED_HEIGHT } from '../../components/CollapsibleHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { SectionHeader, Stack } from '../../components/layout';
import { YoutubeCard } from '../../components/videos';
import { useGetTipByIdQuery } from '../../redux/apiServices/tipsService';
import { Typography } from '../../components/typography';

export const SingleTip: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'TIP'>>();
    const { tip: tipID } = route.params;
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();

    const { data: tipDetails, isFetching } = useGetTipByIdQuery(tipID ?? 0, {
        skip: tipID === null,
    });

    if (tipID === null) {
        navigation.pop();
    }

    return (
        tipID && (
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
                    title={tipDetails ? getLongDate(tipDetails.date) : ''}
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
                    {tipDetails && (
                        <>
                            <SectionHeader title={tipDetails.title} />
                            <YoutubeCard video={tipDetails.video} />
                            <SectionHeader title={'Summary'} style={{ marginTop: theme.spacing.xl }} />
                            <Stack gap={theme.spacing.md}>
                                {splitParagraphs(tipDetails.comments).map((p, ind) => (
                                    <Paragraph key={`${tipDetails.id}_p_${ind}`}>{p}</Paragraph>
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
