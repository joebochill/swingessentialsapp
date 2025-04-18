import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Platform, KeyboardAvoidingView, ScrollView, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { Paragraph } from 'react-native-paper';
import bg from '../../images/banners/submit.jpg';
import { ROUTES } from '../../constants/routes';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppTheme } from '../../theme';
import { SwingVideo } from '../../components/videos/SwingVideo';
import { Header, useCollapsibleHeader } from '../../components/CollapsibleHeader';
import { useNavigation } from '@react-navigation/core';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { ErrorBox, UploadProgressModal } from '../../components/feedback';
import { SectionHeader, Stack } from '../../components/layout';
import { Typography } from '../../components/typography/Typography';
import { SEButton } from '../../components/SEButton';
import { SubmitTutorial } from '../../components/tutorials';
import { StyledTextInput } from '../../components/inputs/StyledTextInput';

import RNFS from 'react-native-fs';
import { useGetCreditsQuery } from '../../redux/apiServices/creditsService';
import { RootState } from '../../redux/store';
import { useAddLessonRequestMutation, useGetPendingLessonsQuery } from '../../redux/apiServices/lessonsService';
import { Icon } from '../../components/Icon';
import { LOG } from '../../utilities/logs';

export const Submit: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const theme = useAppTheme();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();
    const scroller = useRef<ScrollView>(null);

    const token = useSelector((state: RootState) => state.auth.token);
    const role = useSelector((state: RootState) => state.auth.role);

    const { data: { count: credits = 0 } = {} } = useGetCreditsQuery(undefined, { skip: !token });
    const { data: { data: pendingLessons = [] } = {}, isSuccess: lessonsLoaded } = useGetPendingLessonsQuery('');
    const [redeemLesson, { isSuccess, isError, error, isLoading: redeeming }] = useAddLessonRequestMutation();

    const [foVideo, setFOVideo] = useState('');
    const [dtlVideo, setDTLVideo] = useState('');
    const [useNotes, setUseNotes] = useState(false);
    const [notes, setNotes] = useState('');
    const [videoSize, setVideoSize] = useState({ fo: 0, dtl: 0 });
    const [uploadProgress, setUploadProgress] = useState(0);

    const roleError =
        role === 'anonymous'
            ? 'You must be signed in to submit lessons.'
            : role === 'pending'
            ? 'You must validate your email address before you can submit lessons'
            : '';

    const clearAllFields = useCallback(() => {
        setFOVideo('');
        setDTLVideo('');
        setNotes('');
        setUseNotes(false);
        setUploadProgress(0);
    }, [setFOVideo, setDTLVideo, setNotes, setUseNotes, setUploadProgress]);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isSuccess) {
            clearAllFields();
            timeout = setTimeout(() => {
                Alert.alert(
                    'Success!',
                    'Your lesson request was submitted successfully. We are working on your analysis.',
                    [{ text: 'OK', onPress: (): void => navigation.navigate(ROUTES.LESSONS) }],
                    { cancelable: false }
                );
            }, 700);
            return () => clearTimeout(timeout);
        }
    }, [isSuccess, clearAllFields, navigation]);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isError) {
            const err = error as { data: { message: string } };
            LOG.error(`Failed to submit lesson: ${err.data.message}`, { zone: 'LESS' });
            setUploadProgress(0);
            timeout = setTimeout(() => {
                Alert.alert('Oops:', err.data.message as string, [{ text: 'OK' }]);
            }, 700);
            return () => clearTimeout(timeout);
        }
    }, [isError, error]);

    const canSubmit = useCallback(
        () =>
            roleError.length === 0 &&
            !redeeming &&
            foVideo !== '' &&
            dtlVideo !== '' &&
            lessonsLoaded &&
            pendingLessons.length <= 0,
        [roleError, redeeming, foVideo, dtlVideo, lessonsLoaded, pendingLessons]
    );

    const submitLesson = useCallback(() => {
        Keyboard.dismiss();
        if (role !== 'customer' && role !== 'administrator') {
            LOG.error('Unverified users cannot submit lessons', { zone: 'LESS' });
            return;
        }
        if (pendingLessons.length > 0) {
            LOG.error('You may not submit a new lesson with a current lesson pending', { zone: 'LESS' });
            return;
        }
        if (credits < 1) {
            LOG.error('You may not submit a new lesson without any credits', { zone: 'LESS' });
            return;
        }
        if (!foVideo || !dtlVideo) {
            LOG.error('Missing required video in lesson submission', { zone: 'LESS' });
            return;
        }
        const data = new FormData();
        data.append('fo', {
            name: 'fo.mov',
            uri: foVideo,
            type: Platform.OS === 'android' ? 'video/mp4' : 'video/mov',
        });
        data.append('dtl', {
            name: 'dtl.mov',
            uri: dtlVideo,
            type: Platform.OS === 'android' ? 'video/mp4' : 'video/mov',
        });
        data.append('notes', notes);

        redeemLesson({
            data,
            progressCallback: (event: ProgressEvent) => {
                setUploadProgress((event.loaded / event.total) * 100);
            },
        });
    }, [role, pendingLessons, credits, foVideo, dtlVideo, notes, redeemLesson]);

    const setVideoURI = useCallback(
        async (swing: 'fo' | 'dtl', uri: string): Promise<void> => {
            let sizeMB: number = 0;
            let platformURI: string = uri;
            if (Platform.OS === 'android' && uri[0] === '/') {
                platformURI = `file://${uri}`;
                platformURI = platformURI.replace(/%/g, '%25');
            }
            try {
                const stats = await RNFS.stat(platformURI);
                sizeMB = stats.size / (1024 * 1024);
                if (sizeMB > 50) {
                    Alert.alert(
                        `The video you have selected is too large (${sizeMB.toFixed(
                            1
                        )} MB). The maximum allowable file size is 50 MB.`
                    );
                    return;
                }
            } catch (err: any) {
                LOG.error(`Error while reading local file size: ${err.message}`, { zone: 'SUB' });
            }

            if (swing === 'fo') {
                setFOVideo(platformURI);
                setVideoSize((v) => ({ ...v, fo: sizeMB }));
            } else if (swing === 'dtl') {
                setDTLVideo(platformURI);
                setVideoSize((v) => ({ ...v, dtl: sizeMB }));
            } else {
                LOG.error(`Invalid video type selection: ${swing}`, { zone: 'SUB' });
            }
        },
        [setFOVideo, setDTLVideo]
    );

    return (
        <>
            <Header
                title={'Submit Your Swing'}
                subtitle={'Request a personalized lesson'}
                backgroundImage={bg}
                navigation={navigation}
                {...headerProps}
            />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView
                    {...scrollProps}
                    style={{ backgroundColor: theme.colors.background }}
                    contentContainerStyle={{
                        ...contentProps.contentContainerStyle,
                        paddingHorizontal: theme.spacing.md,
                    }}
                    keyboardShouldPersistTaps={'always'}
                    ref={scroller}
                >
                    <ErrorBox show={roleError !== ''} error={roleError} style={{ marginTop: theme.spacing.md }} />
                    <ErrorBox
                        show={pendingLessons.length > 0}
                        error={
                            'You already have a swing analysis in progress. Please wait for that analysis to finish before submitting a new swing. We guarantee a 48-hour turnaround on all lessons.'
                        }
                        style={{ marginTop: theme.spacing.md }}
                    />
                    <ErrorBox
                        show={roleError.length === 0 && pendingLessons.length === 0 && credits < 1}
                        error={"You don't have any credits left. Head over to the Order page to get more."}
                        style={{ marginTop: theme.spacing.md }}
                    />

                    <SectionHeader title={'Your Swing Videos'} style={{ marginTop: theme.spacing.md }} />
                    <Stack direction={'row'} justify={'space-between'}>
                        <Stack align={'center'}>
                            <SwingVideo
                                navigation={navigation}
                                type={'fo'}
                                source={foVideo ? { uri: foVideo } : undefined}
                                editable
                                onSourceChange={(src) => {
                                    setVideoURI('fo', src.uri || '');
                                }}
                            />
                            {!!videoSize.fo && (
                                <Paragraph style={{ fontSize: 10 }}>{`${videoSize.fo.toFixed(1)} MB`}</Paragraph>
                            )}
                        </Stack>
                        <Stack align={'center'}>
                            <SwingVideo
                                navigation={navigation}
                                type={'dtl'}
                                source={dtlVideo ? { uri: dtlVideo } : undefined}
                                editable
                                onSourceChange={(src) => {
                                    setVideoURI('dtl', src.uri || '');
                                }}
                            />
                            {!!videoSize.dtl && (
                                <Paragraph style={{ fontSize: 10 }}>{`${videoSize.dtl.toFixed(1)} MB`}</Paragraph>
                            )}
                        </Stack>
                    </Stack>

                    <Stack
                        style={{
                            marginTop: theme.spacing.sm,
                            padding: theme.spacing.md,
                            borderWidth: 1,
                            borderRadius: theme.roundness,
                            borderColor: theme.colors.outline,
                            backgroundColor: theme.dark ? `${theme.colors.primary}4C` : theme.colors.primaryContainer,
                        }}
                    >
                        <Typography variant={'bodySmall'} color={theme.dark ? 'onPrimary' : 'onPrimaryContainer'}>
                            <Typography fontWeight={'semiBold'}>{'TIP: '}</Typography>
                            {'Avoid slo-mo videos to stay below the file size limit.'}
                        </Typography>
                    </Stack>

                    <SectionHeader title={'Special Requests / Comments'} style={{ marginTop: theme.spacing.xl }} />
                    {!useNotes && (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                                {
                                    borderWidth: 1,
                                    borderRadius: theme.roundness,
                                    borderStyle: 'dashed',
                                    borderColor: theme.colors.outline,
                                    backgroundColor: theme.dark
                                        ? `${theme.colors.primary}4C`
                                        : theme.colors.primaryContainer,
                                    padding: theme.spacing.md,
                                    minHeight: 2 * theme.size.xl,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                },
                            ]}
                            onPress={(): void => setUseNotes(true)}
                        >
                            <Icon
                                name={'add-circle'}
                                color={theme.dark ? theme.colors.onPrimary : theme.colors.onPrimaryContainer}
                                size={theme.size.md}
                            />
                        </TouchableOpacity>
                    )}
                    {useNotes && (
                        <>
                            <StyledTextInput
                                autoCapitalize={'sentences'}
                                autoFocus
                                submitBehavior={'blurAndSubmit'}
                                editable={!redeeming}
                                maxLength={500}
                                multiline
                                onChangeText={(val): void => setNotes(val)}
                                onFocus={(): void => {
                                    if (scroller.current) {
                                        scroller.current.scrollTo({ x: 0, y: 350, animated: true });
                                    }
                                }}
                                returnKeyType={'done'}
                                spellCheck
                                textAlignVertical={'top'}
                                underlineColorAndroid={'transparent'}
                                value={notes}
                                style={{
                                    minHeight: 2 * theme.size.xl,
                                    backgroundColor: theme.colors.surface,
                                }}
                                placeholder={'e.g., Help me with my slice!'}
                            />
                            <Typography style={{ alignSelf: 'flex-end', marginTop: theme.spacing.sm }}>{`${
                                500 - notes.length
                            } Characters Left`}</Typography>
                        </>
                    )}
                    <SEButton
                        style={[{ marginTop: theme.spacing.md }, canSubmit() ? {} : { opacity: 0.6 }]}
                        title={'SUBMIT'}
                        onPress={canSubmit() ? (): void => submitLesson() : undefined}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
            {redeeming && <UploadProgressModal progress={uploadProgress} visible={redeeming} />}
            <SubmitTutorial />
        </>
    );
};
