import bg from '@/assets/images/banners/submit.jpg';
import { SEButton } from '@/components/common/SEButton';
import { ErrorBox } from '@/components/feedback/ErrorBox';
import { UploadProgressModal } from '@/components/feedback/UploadProgressModal';
import { StyledTextInput } from '@/components/inputs/StyledTextInput';
import { Header } from '@/components/layout/CollapsibleHeader/Header';
import { useCollapsibleHeader } from '@/components/layout/CollapsibleHeader/useCollapsibleHeader';
import { Stack } from '@/components/layout/Stack';
import { Paragraph } from '@/components/typography/Paragraph';
import { SectionHeader } from '@/components/typography/SectionHeader';
import { Typography } from '@/components/typography/Typography';
import { SwingVideo } from '@/components/videos/SwingVideo';
import { useAppTheme } from '@/theme';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

import { Icon } from '@/components/common/Icon';
import { SubmitTutorial } from '@/components/tutorials/Submit';
import { useRecordedVideo } from '@/components/videos/RecordedVideoProvider';
import { LOG } from '@/logger';
import { useGetCreditsQuery } from '@/redux/apiServices/creditsService';
import { useAddLessonRequestMutation, useGetPendingLessonsQuery } from '@/redux/apiServices/lessonsService';
import { RootState } from '@/redux/store';
import { File } from 'expo-file-system';
import { useRouter } from 'expo-router';

export default function SubmitScreen() {
    const router = useRouter();
    const theme = useAppTheme();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();
    const scroller = useRef<ScrollView>(null);

    const token = useSelector((state: RootState) => state.auth.token);
    const role = useSelector((state: RootState) => state.auth.role);

    const { data: { count: credits = 0 } = {} } = useGetCreditsQuery(undefined, {
        skip: !token,
    });
    const { data: { data: pendingLessons = [] } = {}, isSuccess: lessonsLoaded } = useGetPendingLessonsQuery('');
    const [redeemLesson, { isSuccess, isError, error, isLoading: redeeming }] = useAddLessonRequestMutation();

    const {
        videos: { dtl, fo },
        setFoVideo,
        setDtlVideo,
        resetVideos,
    } = useRecordedVideo();
    const [useNotes, setUseNotes] = useState(false);
    const [notes, setNotes] = useState('');
    const [videoSize, setVideoSize] = useState({ fo: 0, dtl: 0 });
    const [uploadProgress, setUploadProgress] = useState(0);

    const showTip = !fo || !dtl;

    const roleError =
        role === 'anonymous'
            ? 'You must be signed in to submit lessons.'
            : role === 'pending'
              ? 'You must validate your email address before you can submit lessons'
              : '';

    const clearAllFields = useCallback(() => {
        resetVideos();
        setNotes('');
        setUseNotes(false);
        setUploadProgress(0);
    }, [resetVideos, setNotes, setUseNotes, setUploadProgress]);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        if (isSuccess) {
            clearAllFields();
            timeout = setTimeout(() => {
                Alert.alert(
                    'Success!',
                    'Your lesson request was submitted successfully. We are working on your analysis.',
                    [
                        {
                            text: 'OK',
                            onPress: (): void => {
                                router.push('/lessons');
                            },
                        },
                    ],
                    { cancelable: false }
                );
            }, 700);
            return () => clearTimeout(timeout);
        }
    }, [isSuccess, clearAllFields, router]);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        if (isError) {
            const err = error as { data: { message: string } };
            LOG.error(`Failed to submit lesson: ${err.data.message}`, {
                zone: 'LESS',
            });
            setUploadProgress(0);
            timeout = setTimeout(() => {
                Alert.alert('Oops:', err.data.message as string, [{ text: 'OK' }]);
            }, 700);
            return () => clearTimeout(timeout);
        }
    }, [isError, error]);

    const canSubmit = useCallback(
        () => roleError.length === 0 && !redeeming && fo && dtl && lessonsLoaded && pendingLessons.length <= 0,
        [roleError, redeeming, fo, dtl, lessonsLoaded, pendingLessons]
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
            LOG.error('You may not submit a new lesson without any credits', {
                zone: 'LESS',
            });
            return;
        }
        if (!fo || !dtl) {
            LOG.error('Missing required video in lesson submission', {
                zone: 'LESS',
            });
            return;
        }
        const data = new FormData();
        data.append('fo', {
            name: 'fo.mov',
            uri: fo,
            type: Platform.OS === 'android' ? 'video/mp4' : 'video/mov',
        } as any);
        data.append('dtl', {
            name: 'dtl.mov',
            uri: dtl,
            type: Platform.OS === 'android' ? 'video/mp4' : 'video/mov',
        } as any);
        data.append('notes', notes);

        redeemLesson({
            data,
            progressCallback: (event: ProgressEvent) => {
                setUploadProgress(Math.min((event.loaded / ((videoSize.fo + videoSize.dtl) * 1024 * 1024)) * 100, 100));
            },
        });
    }, [role, pendingLessons, credits, fo, dtl, notes, redeemLesson, videoSize]);

    const setVideoURI = useCallback(
        async (swing: 'fo' | 'dtl', uri: string): Promise<void> => {
            let sizeMB: number = 0;
            let platformURI: string = uri;
            if (Platform.OS === 'android' && uri[0] === '/') {
                platformURI = `file://${uri}`;
                platformURI = platformURI.replace(/%/g, '%25');
            }
            try {
                const file = new File(platformURI);
                sizeMB = file.size / (1024 * 1024);
                if (sizeMB > 50) {
                    Alert.alert(
                        `The video you have selected is too large (${sizeMB.toFixed(
                            1
                        )} MB). The maximum allowable file size is 50 MB.`
                    );
                    return;
                }
            } catch (err: any) {
                LOG.error(`Error while reading local file size: ${err.message}`, {
                    zone: 'SUB',
                });
            }

            if (swing === 'fo') {
                setFoVideo(platformURI);
                setVideoSize((v) => ({ ...v, fo: sizeMB }));
            } else if (swing === 'dtl') {
                setDtlVideo(platformURI);
                setVideoSize((v) => ({ ...v, dtl: sizeMB }));
            } else {
                LOG.error(`Invalid video type selection: ${swing}`, { zone: 'SUB' });
            }
        },
        [setFoVideo, setDtlVideo]
    );

    return (
        <>
            <Header
                title={'Submit Your Swing'}
                subtitle={'Request a personalized lesson'}
                backgroundImage={bg}
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
                        error={`You don't have any credits left. Head over to the Order page to get more.`}
                        style={{ marginTop: theme.spacing.md }}
                    />

                    <SectionHeader title={'Your Swing Videos'} style={{ marginTop: theme.spacing.md }} />
                    <Stack direction={'row'} justify={'space-between'}>
                        <Stack align={'center'}>
                            <SwingVideo
                                type={'fo'}
                                source={fo}
                                editable
                                onSourceChange={(src) => {
                                    setVideoURI('fo', src ?? '');
                                }}
                            />
                            {!!videoSize.fo && (
                                <Paragraph style={{ fontSize: 10 }}>{`${videoSize.fo.toFixed(1)} MB`}</Paragraph>
                            )}
                        </Stack>
                        <Stack align={'center'}>
                            <SwingVideo
                                type={'dtl'}
                                source={dtl}
                                editable
                                onSourceChange={(src) => {
                                    setVideoURI('dtl', src ?? '');
                                }}
                            />
                            {!!videoSize.dtl && (
                                <Paragraph style={{ fontSize: 10 }}>{`${videoSize.dtl.toFixed(1)} MB`}</Paragraph>
                            )}
                        </Stack>
                    </Stack>

                    {showTip && (
                        <Stack
                            align={'center'}
                            style={{
                                marginTop: theme.spacing.sm,
                                padding: theme.spacing.lg,
                                borderWidth: 1,
                                borderRadius: theme.roundness,
                                borderColor: theme.colors.outline,
                            }}
                            gap={theme.spacing.sm}
                        >
                            <Typography
                                variant={'titleLarge'}
                                fontWeight={'semiBold'}
                                style={{ lineHeight: theme.fonts.titleLarge.fontSize }}
                            >
                                {'TIP:'}
                            </Typography>
                            <Typography variant={'bodySmall'} style={{ textAlign: 'center' }}>
                                {'Avoid slo-mo videos to stay below the file size limit.'}
                            </Typography>
                        </Stack>
                    )}

                    <SectionHeader title={'Special Requests / Comments'} style={{ marginTop: theme.spacing.xl }} />
                    {!useNotes && (
                        <Pressable
                            style={({ pressed }) => [
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
                                    opacity: pressed ? 0.7 : 1,
                                },
                            ]}
                            onPress={(): void => setUseNotes(true)}
                        >
                            <Icon
                                name={'add-circle'}
                                color={theme.dark ? theme.colors.onPrimary : theme.colors.onPrimaryContainer}
                                size={theme.size.md}
                            />
                        </Pressable>
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
                            <Typography
                                style={{ alignSelf: 'flex-end', marginTop: theme.spacing.sm }}
                            >{`${500 - notes.length} Characters Left`}</Typography>
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
}
