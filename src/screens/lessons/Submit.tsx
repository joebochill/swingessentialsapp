import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePrevious } from '../../utilities';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { Platform, KeyboardAvoidingView, ScrollView, TouchableOpacity, Image, Alert, Keyboard } from 'react-native';
import {
    CollapsibleHeaderLayout,
    SEVideo,
    SEVideoPlaceholder,
    SEButton,
    ErrorBox,
    UploadProgressModal,
    SubmitTutorial,
    SectionHeader,
    Stack,
    Typography,
} from '../../components';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';

// Styles
import { transparent } from '../../styles/colors';
import { TextInput } from 'react-native-paper';
import bg from '../../images/banners/submit.jpg';
import dtl from '../../images/down-the-line.png';
import fo from '../../images/face-on.png';

// Constants
import { ROUTES } from '../../constants/routes';

// Types
import { ApplicationState } from '../../__types__';

// Redux
import { submitLesson } from '../../redux/actions';

// Utilities
import { Logger } from '../../utilities/logging';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useAppTheme } from '../../styles/theme';

const RNFS = require('react-native-fs');

const getErrorMessage = (code: number | null): string => {
    switch (code) {
        // Missing or corrupt video
        case 400701:
            return 'One or more of the videos are missing or corrupted. If this error persists, please contact us.';

        // Size too large
        case 400702:
            return 'The videos you have submitted are too large. Please edit the videos to be smaller and/or avoid the use of slow-motion video. If this error persists, please contact us.';

        // Invalid video format
        case 400703:
            return 'The videos you have submitted are in an unsupported format. We support .mov, .mp4, and .mpeg files. If you continue to see this error, please contact us.';

        // Unknown
        default:
            return 'There was an unexpected error while submitting your swing videos. Please try again later or contact us if the problem persists.';
    }
};

export const Submit: React.FC<StackScreenProps<RootStackParamList, 'Submit'>> = (props) => {
    const { navigation } = props;
    const [foVideo, setFO] = useState('');
    const [dtlVideo, setDTL] = useState('');
    const [useNotes, setUseNotes] = useState(false);
    const [notes, setNotes] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const credits = useSelector((state: ApplicationState) => state.credits.count);
    const lessons = useSelector((state: ApplicationState) => state.lessons);
    const role = useSelector((state: ApplicationState) => state.login.role);
    const scroller = useRef(null);
    const dispatch = useDispatch();
    const theme = useAppTheme();

    const roleError =
        role === 'anonymous'
            ? 'You must be signed in to submit lessons.'
            : role === 'pending'
            ? 'You must validate your email address before you can submit lessons'
            : '';

    const previousPendingStatus = usePrevious(lessons.redeemPending);

    const clearAllFields = useCallback(() => {
        setFO('');
        setDTL('');
        setNotes('');
        setUseNotes(false);
        setUploadProgress(0);
    }, [setFO, setDTL, setNotes, setUseNotes, setUploadProgress]);

    useEffect(() => {
        // let timeout = 0;
        // Submission finished
        if (previousPendingStatus && !lessons.redeemPending) {
            if (lessons.redeemSuccess) {
                // Successful redeem
                clearAllFields();
                /*timeout = */ setTimeout(() => {
                    Alert.alert(
                        'Success!',
                        'Your lesson request was submitted successfully. We are working on your analysis.',
                        // @ts-ignore
                        [{ text: 'OK', onPress: (): void => navigation.navigate(ROUTES.LESSONS) }],
                        { cancelable: false }
                    );
                }, 700);
                // return () => clearTimeout(timeout);
            } else {
                // Fail redeem
                void Logger.logError({
                    code: 'SUB100',
                    description: 'Failed to submit lesson.',
                    rawErrorCode: lessons.redeemError,
                });
                // 400701 means files were stripped for size
                // 400702 too large
                setUploadProgress(0);
                /*timeout = */ setTimeout(() => {
                    Alert.alert('Oops:', getErrorMessage(lessons.redeemError), [{ text: 'OK' }]);
                }, 700);
                // return () => clearTimeout(timeout);
            }
        }
    }, [
        lessons.redeemPending,
        previousPendingStatus,
        lessons.redeemError,
        lessons.redeemSuccess,
        clearAllFields,
        navigation,
    ]);

    const canSubmit = useCallback(
        () =>
            roleError.length === 0 &&
            !lessons.redeemPending &&
            foVideo !== '' &&
            dtlVideo !== '' &&
            lessons.pending.length <= 0,
        [roleError, lessons, foVideo, dtlVideo]
    );

    const dispatchSubmitLesson = useCallback(() => {
        Keyboard.dismiss();
        if (role !== 'customer' && role !== 'administrator') {
            void Logger.logError({
                code: 'SUB200',
                description: 'Unverified users cannot submit lessons.',
            });
            return;
        }
        if (lessons.pending.length > 0) {
            void Logger.logError({
                code: 'SUB300',
                description: 'You may not submit a new lesson with a current lesson pending.',
            });
            return;
        }
        if (credits < 1) {
            void Logger.logError({
                code: 'SUB350',
                description: 'You may not submit a new lesson without any credits.',
            });
            return;
        }
        if (!foVideo || !dtlVideo) {
            void Logger.logError({
                code: 'SUB400',
                description: 'Missing required video in lesson submission.',
            });
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

        dispatch(
            // @ts-ignore
            submitLesson(data, (event: ProgressEvent) => {
                setUploadProgress((event.loaded / event.total) * 100);
            })
        );
    }, [role, credits, lessons.pending.length, foVideo, dtlVideo, notes, dispatch]);

    const setVideoURI = useCallback(
        async (swing: 'fo' | 'dtl', uri: string): Promise<void> => {
            try {
                const stats = await RNFS.stat(uri);
                if (stats.size > 50 * 1024 * 1024) {
                    Alert.alert(
                        `The video you have selected is too large (${(stats.size / (1024 * 1024)).toFixed(
                            1
                        )} MB). The maximum allowable file size is 50MB.`
                    );
                    return;
                }
            } catch (err: any) {
                void Logger.logError({
                    code: 'SUB450',
                    description: 'Error while reading local file size. ',
                    rawErrorCode: err.code,
                    rawErrorMessage: err.message,
                });
            }

            if (swing === 'fo') {
                setFO(uri);
            } else if (swing === 'dtl') {
                setDTL(uri);
            } else {
                void Logger.logError({
                    code: 'SUB500',
                    description: 'Invalid video type selection.',
                });
            }
        },
        [setFO, setDTL]
    );
    const showPickerMenu = useCallback(
        (swing: 'fo' | 'dtl') => {
            // @ts-ignore
            navigation.push(ROUTES.RECORD, {
                swing,
                onReturn: (uri: string) => setVideoURI(swing, uri),
            });
        },
        [navigation]
    );
    // const showPickerMenu = useCallback(
    //     (swing: 'fo' | 'dtl'): void => {
    //         // @ts-ignore
    //         ImagePicker.showImagePicker(
    //             {
    //                 title: undefined,
    //                 takePhotoButtonTitle: undefined,
    //                 chooseFromLibraryButtonTitle: 'Choose From Library',
    //                 customButtons: [{ name: 'record', title: 'Record a New Video' }],
    //                 videoQuality: 'high',
    //                 mediaType: 'video',
    //                 durationLimit: 10,
    //                 storageOptions: {
    //                     skipBackup: true,
    //                     path: 'images',
    //                 },
    //             },
    //             (response: any) => {
    //                 if (response.didCancel) {
    //                     /*do nothing*/
    //                 } else if (response.error) {
    //                     Alert.alert('There was an error choosing a video. Try again later.');
    //                 } else if (response.customButton === 'record') {
    //                     // @ts-ignore
    //                     navigation.push(ROUTES.RECORD, {
    //                         swing,
    //                         onReturn: (uri: string) => setVideoURI(swing, uri),
    //                     });
    //                 } else {
    //                     void setVideoURI(swing, response.uri);
    //                 }
    //             }
    //         );
    //     },
    //     [setVideoURI, navigation]
    // );

    return (
        <CollapsibleHeaderLayout
            title={'Submit Your Swing'}
            subtitle={'Request a personalized lesson'}
            backgroundImage={bg}
            navigation={navigation}
        >
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView
                    keyboardShouldPersistTaps={'always'}
                    contentContainerStyle={{ paddingHorizontal: theme.spacing.md }}
                    ref={scroller}
                >
                    <ErrorBox show={roleError !== ''} error={roleError} style={{ marginTop: theme.spacing.md }} />
                    <ErrorBox
                        show={lessons.pending.length > 0}
                        error={
                            'You already have a swing analysis in progress. Please wait for that analysis to finish before submitting a new swing. We guarantee a 48-hour turnaround on all lessons.'
                        }
                        style={{ marginTop: theme.spacing.md }}
                    />
                    <ErrorBox
                        show={roleError.length === 0 && lessons.pending.length === 0 && credits < 1}
                        error={"You don't have any credits left. Head over to the Order page to get more."}
                        style={{ marginTop: theme.spacing.md }}
                    />

                    <SectionHeader title={'Your Swing Videos'} style={{ marginTop: theme.spacing.md }} />
                    <Stack direction={'row'} justify={'space-between'}>
                        {!foVideo ? (
                            <SEVideoPlaceholder
                                title={'Face-On'}
                                icon={
                                    <Image
                                        source={fo}
                                        resizeMethod={'resize'}
                                        style={{
                                            height: '100%',
                                            width: '100%',
                                            resizeMode: 'contain',
                                        }}
                                    />
                                }
                                editIcon={
                                    <MatIcon
                                        name={'add-a-photo'}
                                        color={theme.colors.onPrimaryContainer}
                                        size={theme.size.md}
                                    />
                                }
                                onPress={(): void => showPickerMenu('fo')}
                            />
                        ) : (
                            <SEVideo editable source={foVideo} onEdit={(): void => showPickerMenu('fo')} />
                        )}
                        {!dtlVideo ? (
                            <SEVideoPlaceholder
                                title={'Down-the-Line'}
                                icon={
                                    <Image
                                        source={dtl}
                                        resizeMethod={'resize'}
                                        style={{
                                            height: '100%',
                                            width: '100%',
                                            resizeMode: 'contain',
                                        }}
                                    />
                                }
                                editIcon={
                                    <MatIcon
                                        name={'add-a-photo'}
                                        color={theme.colors.onPrimaryContainer}
                                        size={theme.size.md}
                                    />
                                }
                                onPress={(): void => showPickerMenu('dtl')}
                            />
                        ) : (
                            <SEVideo
                                editable
                                source={dtlVideo}
                                style={{ marginLeft: theme.spacing.md }}
                                onEdit={(): void => showPickerMenu('dtl')}
                            />
                        )}
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
                                    // borderColor: theme.colors.dark,
                                    backgroundColor: theme.colors.surface,
                                    padding: theme.spacing.md,
                                    minHeight: 2 * theme.size.xl,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                },
                            ]}
                            onPress={(): void => setUseNotes(true)}
                        >
                            <MatIcon name={'add-circle'} color={theme.colors.onPrimaryContainer} size={theme.size.md} />
                        </TouchableOpacity>
                    )}
                    {useNotes && (
                        <>
                            <TextInput
                                autoCapitalize={'sentences'}
                                autoFocus
                                blurOnSubmit={true}
                                editable={!lessons.redeemPending}
                                maxLength={500}
                                multiline
                                onChangeText={(val): void => setNotes(val)}
                                onFocus={(): void => {
                                    if (scroller.current) {
                                        // @ts-ignore
                                        scroller.current.scrollTo({ x: 0, y: 350, animated: true });
                                    }
                                }}
                                returnKeyType={'done'}
                                spellCheck
                                textAlignVertical={'top'}
                                underlineColorAndroid={transparent}
                                value={notes}
                                style={{
                                    minHeight: 2 * theme.size.xl,
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
                        onPress={canSubmit() ? (): void => dispatchSubmitLesson() : undefined}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
            {lessons.redeemPending && (
                <UploadProgressModal progress={uploadProgress} visible={true /*lessons.redeemPending*/} />
            )}
            <SubmitTutorial />
        </CollapsibleHeaderLayout>
    );
};
