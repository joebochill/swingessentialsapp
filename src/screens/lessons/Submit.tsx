import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePrevious } from '../../utilities';
import { useSelector, useDispatch } from 'react-redux';

// Components
import {
    Platform,
    View,
    KeyboardAvoidingView,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    StyleSheet,
    Alert,
    Keyboard,
} from 'react-native';
import {
    H7,
    Label,
    CollapsibleHeaderLayout,
    SEVideo,
    SEVideoPlaceholder,
    SEButton,
    ErrorBox,
    UploadProgressModal,
    SubmitTutorial,
} from '../../components';
import { Icon } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';

// Styles
import { sharedStyles } from '../../styles';
import { transparent } from '../../styles/colors';
import { spaces, sizes, fonts, unit } from '../../styles/sizes';
import { useTheme } from '../../styles/theme';
import bg from '../../images/bg_6.jpg';
import page_bg from '../../images/golf_bg.png';
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
import color from 'color';
const RNFS = require('react-native-fs');

export const Submit = props => {
    const { navigation } = props;
    const [fo_video, setFO] = useState('');
    const [dtl_video, setDTL] = useState('');
    const [useNotes, setUseNotes] = useState(false);
    const [notes, setNotes] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const credits = useSelector((state: ApplicationState) => state.credits.count);
    const lessons = useSelector((state: ApplicationState) => state.lessons);
    const role = useSelector((state: ApplicationState) => state.login.role);
    const scroller = useRef(null);
    const dispatch = useDispatch();
    const theme = useTheme();

    const roleError =
        role === 'anonymous'
            ? 'You must be signed in to submit lessons.'
            : role === 'pending'
            ? 'You must validate your email address before you can submit lessons'
            : '';

    const previousPendingStatus = usePrevious(lessons.redeemPending);

    const _clearFields = useCallback(() => {
        setFO('');
        setDTL('');
        setNotes('');
        setUseNotes(false);
        setUploadProgress(0);
    }, [setFO, setDTL, setNotes, setUseNotes, setUploadProgress]);

    useEffect(() => {
        let timeout: number = 0;
        // Submission finished
        if (previousPendingStatus && !lessons.redeemPending) {
            if (lessons.redeemSuccess) {
                // Successful redeem
                _clearFields();
                timeout = setTimeout(() => {
                    Alert.alert(
                        'Success!',
                        'Your lesson request was submitted successfully. We are working on your analysis.',
                        [{ text: 'OK', onPress: () => navigation.navigate(ROUTES.LESSONS) }],
                        { cancelable: false },
                    );
                }, 700);
                // return () => clearTimeout(timeout);
            } else {
                // Fail redeem
                Logger.logError({
                    code: 'SUB100',
                    description: 'Failed to submit lesson.',
                    rawErrorCode: lessons.redeemError,
                });
                // 400701 means files were stripped for size
                // 400702 too large
                setUploadProgress(0);
                timeout = setTimeout(() => {
                    Alert.alert(
                        'Oops:',
                        lessons.redeemError === 400701 || lessons.redeemError === 400703
                            ? 'The videos you have submitted are too large. Please edit the videos to be smaller and/or avoid the use of slow-motion video. If this error persists, please contact us.'
                            : 'There was an unexpected error while submitting your swing videos. Please try again later or contact us if the problem persists.',
                        [{ text: 'OK' }],
                    );
                }, 700);
                // return () => clearTimeout(timeout);
            }
        }
    }, [
        lessons.redeemPending,
        previousPendingStatus,
        lessons.redeemError,
        lessons.redeemSuccess,
        _clearFields,
        navigation,
    ]);

    const _submitLesson = useCallback(() => {
        Keyboard.dismiss();
        if (role !== 'customer' && role !== 'administrator') {
            Logger.logError({
                code: 'SUB200',
                description: 'Unverified users cannot submit lessons.',
            });
            return;
        }
        if (lessons.pending.length > 0) {
            Logger.logError({
                code: 'SUB300',
                description: 'You may not submit a new lesson with a current lesson pending.',
            });
            return;
        }
        if (credits < 1) {
            Logger.logError({
                code: 'SUB350',
                description: 'You may not submit a new lesson without any credits.',
            });
            return;
        }
        if (!fo_video || !dtl_video) {
            Logger.logError({
                code: 'SUB400',
                description: 'Missing required video in lesson submission.',
            });
            return;
        }
        const data = new FormData();
        data.append('fo', {
            name: 'fo.mov',
            uri: fo_video,
            type: Platform.OS === 'android' ? 'video/mp4' : 'video/mov',
        });
        data.append('dtl', {
            name: 'dtl.mov',
            uri: dtl_video,
            type: Platform.OS === 'android' ? 'video/mp4' : 'video/mov',
        });
        data.append('notes', notes);

        dispatch(
            submitLesson(data, (event: ProgressEvent) => {
                setUploadProgress((event.loaded / event.total) * 100);
            }),
        );
    }, [role, credits, lessons.pending.length, fo_video, dtl_video, notes, dispatch]);

    const _setVideoURI = useCallback(
        async (swing: 'fo' | 'dtl', uri: string) => {
            try {
                const stats = await RNFS.stat(uri);
                if (stats.size > 10 * 1024 * 1024) {
                    Alert.alert(
                        `The video you have selected is too large (${(stats.size / (1024 * 1024)).toFixed(
                            1,
                        )} MB). The maximum allowable file size is 10MB.`,
                    );
                    return;
                }
            } catch (err) {
                Logger.logError({
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
                Logger.logError({
                    code: 'SUB500',
                    description: 'Invalid video type selection.',
                });
            }
        },
        [setFO, setDTL],
    );

    const _showPicker = useCallback(
        (swing: 'fo' | 'dtl') => {
            ImagePicker.showImagePicker(
                {
                    title: undefined,
                    takePhotoButtonTitle: undefined,
                    chooseFromLibraryButtonTitle: 'Choose From Library',
                    customButtons: [{ name: 'record', title: 'Record a New Video' }],
                    videoQuality: 'high',
                    mediaType: 'video',
                    durationLimit: 10,
                    storageOptions: {
                        skipBackup: true,
                        path: 'images',
                    },
                },
                response => {
                    if (response.didCancel) {
                        /*do nothing*/
                    } else if (response.error) {
                        Alert.alert('There was an error choosing a video. Try again later.');
                    } else if (response.customButton === 'record') {
                        navigation.push(ROUTES.RECORD, {
                            swing,
                            onReturn: (uri: string) => _setVideoURI(swing, uri),
                        });
                    } else {
                        _setVideoURI(swing, response.uri);
                    }
                },
            );
        },
        [_setVideoURI, navigation],
    );

    return (
        <CollapsibleHeaderLayout
            title={'Submit Your Swing'}
            subtitle={'create a new lesson'}
            backgroundImage={bg}
            pageBackground={page_bg}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView
                    keyboardShouldPersistTaps={'always'}
                    contentContainerStyle={sharedStyles.paddingHorizontalMedium}
                    ref={scroller}>
                    <ErrorBox show={roleError !== ''} error={roleError} style={{ marginBottom: spaces.medium }} />
                    <ErrorBox
                        show={lessons.pending.length > 0}
                        error={
                            'You already have a swing analysis in progress. Please wait for that analysis to finish before submitting a new swing. We guarantee a 48-hour turnaround on all lessons.'
                        }
                        style={{ marginBottom: spaces.medium }}
                    />
                    <ErrorBox
                        show={roleError.length === 0 && lessons.pending.length === 0 && credits < 1}
                        error={"You don't have any credits left. Head over to the Order page to get more."}
                        style={{ marginBottom: spaces.medium }}
                    />
                    <View style={[sharedStyles.sectionHeader, { marginHorizontal: 0 }]}>
                        <H7>Your Swing Videos</H7>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {!fo_video ? (
                            <SEVideoPlaceholder
                                title={'Face-On'}
                                icon={<Image source={fo} resizeMethod={'resize'} style={sharedStyles.image} />}
                                editIcon={<Icon name={'add-a-photo'} color={theme.colors.primary[500]} />}
                                onPress={() => _showPicker('fo')}
                            />
                        ) : (
                            <SEVideo editable source={fo_video} onEdit={() => _showPicker('fo')} />
                        )}
                        {!dtl_video ? (
                            <SEVideoPlaceholder
                                title={'Down-the-Line'}
                                icon={<Image source={dtl} resizeMethod={'resize'} style={sharedStyles.image} />}
                                editIcon={<Icon name={'add-a-photo'} color={theme.colors.primary[500]} />}
                                onPress={() => _showPicker('dtl')}
                            />
                        ) : (
                            <SEVideo
                                editable
                                source={dtl_video}
                                style={{ marginLeft: spaces.medium }}
                                onEdit={() => _showPicker('dtl')}
                            />
                        )}
                    </View>
                    <View style={[sharedStyles.sectionHeader, { marginHorizontal: 0, marginTop: spaces.large }]}>
                        <H7>Special Requests / Comments</H7>
                    </View>
                    {!useNotes && (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                                sharedStyles.dashed,
                                styles.dashButton,
                                { backgroundColor: color(theme.colors.primary[500]).fade(0.85) },
                            ]}
                            onPress={() => setUseNotes(true)}>
                            <Icon name={'add-circle'} color={theme.colors.primary[500]} size={24} />
                        </TouchableOpacity>
                    )}
                    {useNotes && (
                        <>
                            <TextInput
                                autoCapitalize={'sentences'}
                                autoFocus
                                blurOnSubmit={true}
                                caretHidden
                                editable={!lessons.redeemPending}
                                maxLength={500}
                                multiline
                                onChangeText={val => setNotes(val)}
                                onFocus={() => {
                                    if (scroller.current) {
                                        scroller.current.scrollTo({ x: 0, y: 350, animated: true });
                                    }
                                }}
                                returnKeyType={'done'}
                                spellCheck
                                textAlignVertical={'top'}
                                underlineColorAndroid={transparent}
                                value={notes}
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: theme.colors.background,
                                        color: theme.colors.text[500],
                                        borderColor: theme.colors.primary[800],
                                    },
                                ]}
                            />
                            <Label style={{ alignSelf: 'flex-end' }}>{`${500 - notes.length} Characters Left`}</Label>
                        </>
                    )}
                    {roleError.length === 0 &&
                        !lessons.redeemPending &&
                        fo_video !== '' &&
                        dtl_video !== '' &&
                        lessons.pending.length <= 0 && (
                            <SEButton
                                containerStyle={{ marginTop: spaces.large }}
                                title={'SUBMIT'}
                                onPress={() => _submitLesson()}
                            />
                        )}
                </ScrollView>
            </KeyboardAvoidingView>
            {lessons.redeemPending && <UploadProgressModal progress={uploadProgress} visible={lessons.redeemPending} />}
            <SubmitTutorial />
        </CollapsibleHeaderLayout>
    );
};

const styles = StyleSheet.create({
    dashButton: {
        padding: spaces.medium,
        minHeight: sizes.xLarge,
        justifyContent: 'center',
    },
    input: {
        minHeight: sizes.xLarge,
        paddingHorizontal: spaces.medium,
        paddingTop: spaces.medium,
        paddingBottom: spaces.medium,
        fontFamily: 'SFCompactDisplay-Regular',
        fontSize: fonts[14],
        borderRadius: unit(5),
        borderWidth: unit(2),
    },
});
