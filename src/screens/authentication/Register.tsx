import React, { useState, useRef, RefObject, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { usePrevious } from '../../utilities';

// Components
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    KeyboardType,
    NativeSyntheticEvent,
    Platform,
    ScrollView,
    TextInputFocusEventData,
    TextInputSubmitEditingEventData,
    View,
} from 'react-native';
import { Icon, Input } from 'react-native-elements';
import { H7, ErrorBox, SEButton, SEHeader } from '../../components';
import RNPickerSelect, { Item } from 'react-native-picker-select';

// Types
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { ApplicationState } from '../../__types__';

// Styles
import { sharedStyles } from '../../styles';
import { transparent, blackOpacity } from '../../styles/colors';
import { sizes, spaces } from '../../styles/sizes';
import { useTheme } from '../../styles/theme';

// Utilities
import { height } from '../../utilities/dimensions';

// Redux
import { checkUsernameAvailability, checkEmailAvailability, createAccount, verifyEmail } from '../../redux/actions';

// Constants
import { EMAIL_REGEX, HEADER_COLLAPSED_HEIGHT } from '../../constants';
import { ROUTES } from '../../constants/routes';
import { ThemeColors } from 'react-navigation';


type RegistrationKeys = {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    confirm: string;
    heard: string;
};
const defaultKeys: RegistrationKeys = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirm: '',
    heard: '',
};
type RegistrationKey = keyof RegistrationKeys;

type RegistrationProperty = {
    property: RegistrationKey;
    ref?: RefObject<Input>;
    label: string;
    type?: 'text' | 'select';
    keyboard?: KeyboardType;
    secure?: boolean;
    onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    onChange?: (value: string) => void;
    onSubmit?: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
    hasError?: boolean;
    errorMessage?: string;
    items?: Item[];
};

export const Register = (props: NavigationStackScreenProps) => {
    const code = props.navigation.getParam('code', null);
    return code ? <VerifyForm {...props} code={code} /> : <RegisterForm {...props} />;
};

type VerifyProps = NavigationStackScreenProps & {
    code: string;
};
const VerifyForm = (props: VerifyProps) => {
    const { code, navigation } = props;
    const verification = useSelector((state: ApplicationState) => state.registration);
    const dispatch = useDispatch();
    const theme = useTheme();

    useEffect(() => {
        if (code) {
            dispatch(verifyEmail(code));
        }
    }, [code, dispatch]);

    return (
        <View style={sharedStyles.pageContainer}>
            <SEHeader
                title={'Sign Up'}
                subtitle={'confirm your email'}
                mainAction={'back'}
                showAuth={false}
            />
            <View style={[sharedStyles.paddingMedium, { flex: 1, justifyContent: 'center', paddingTop: HEADER_COLLAPSED_HEIGHT }]}>
                {verification.pending && (
                    <>
                        <ActivityIndicator size={'large'} color={theme.colors.primary[800]} />
                        <H7 font={'regular'} style={{ textAlign: 'center' }}>
                            Verifying your email address...
                        </H7>
                    </>
                )}
                {!verification.pending && (
                    <>
                        <Icon
                            name={verification.emailVerified ? 'check-circle' : 'error'}
                            size={sizes.jumbo}
                            color={verification.emailVerified ? theme.colors.primary[400] : theme.colors.error[500]}
                        />
                        <H7 font={'regular'} style={{ textAlign: 'center' }}>
                            {verification.emailVerified
                                ? 'Your email address has been confirmed. Please sign in to view your account.'
                                : _getRegistrationErrorMessage(verification.error)}
                        </H7>
                        {verification.emailVerified && (
                            <SEButton
                                style={{ marginTop: spaces.medium }}
                                buttonStyle={{ backgroundColor: theme.colors.primary[400] }}
                                title={'SIGN IN'}
                                onPress={() => navigation.popToTop()}
                            />
                        )}
                    </>
                )}
            </View>
        </View>
    );
};

const RegisterForm = (props: NavigationStackScreenProps) => {
    const [fields, setFields] = useState(defaultKeys);
    const firstRef = useRef(null);
    const lastRef = useRef(null);
    const emailRef = useRef(null);
    const userRef = useRef(null);
    const passRef = useRef(null);
    const confirmRef = useRef(null);

    const scroller = useRef(null);

    const refs = [firstRef, lastRef, emailRef, userRef, passRef, confirmRef];
    const registration = useSelector((state: ApplicationState) => state.registration);
    const previousPendingState = usePrevious(registration.pending);

    const dispatch = useDispatch();
    const theme = useTheme();

    useEffect(() => {
        // Registration finished
        if (previousPendingState && !registration.pending) {
            if (registration.success) {
                // Successful
                props.navigation.goBack(ROUTES.AUTH_GROUP);
            } else {
                Alert.alert(
                    'Oops:',
                    'Your account registration has failed. Please try again later and contact us if the problem continues.',
                    [{ text: 'OK' }],
                );
            }
        }
    }, [previousPendingState, props.navigation, registration]);

    const _canSubmit = useCallback((): boolean => {
        const keys: RegistrationKey[] = Object.keys(fields) as RegistrationKey[];
        for (let i = 0; i < keys.length; i++) {
            if (fields[keys[i]].length <= 0) {
                return false;
            }
        }
        if (fields.password !== fields.confirm) {
            return false;
        }
        if (!fields.email.match(EMAIL_REGEX)) {
            return false;
        }
        if (!registration.emailAvailable) {
            return false;
        }
        return true;
    }, [fields, registration]);

    const _submitRegistration = useCallback((): void => {
        if (!_canSubmit()) {
            return;
        }
        dispatch(
            createAccount({
                ...fields,
                phone: '',
                platform: Platform.OS,
            }),
        );
    }, [_canSubmit, dispatch, fields]);

    const regProperties: RegistrationProperty[] = [
        { property: 'firstName', label: 'First Name' },
        { property: 'lastName', label: 'Last Name' },
        {
            property: 'email',
            label: 'Email Address',
            keyboard: 'email-address',
            errorMessage:
                fields.email.length > 0 && !fields.email.match(EMAIL_REGEX)
                    ? 'Invalid Email Address'
                    : !registration.emailAvailable
                        ? 'Email Address is already registered'
                        : '',
            onChange: value => {
                setFields({
                    ...fields,
                    email: value.substr(0, 128),
                });
            },
            onBlur: () => dispatch(checkEmailAvailability(fields.email)),
        },
        {
            property: 'username',
            label: 'Username',
            errorMessage: !registration.userAvailable ? 'Username is already registered' : '',
            onChange: (value: string) => {
                setFields({
                    ...fields,
                    username: value.replace(/[^A-Z0-9-_.$#@!+]/gi, '').substr(0, 32),
                });
            },
            onBlur: () => dispatch(checkUsernameAvailability(fields.username)),
        },
        { property: 'password', label: 'Password', secure: true },
        {
            property: 'confirm',
            label: 'Confirm Password',
            secure: true,
            errorMessage: fields.password !== fields.confirm ? 'Passwords do not match' : '',
            onSubmit: () => Keyboard.dismiss(),
        },
        {
            property: 'heard',
            type: 'select',
            label: 'How did you hear about us?',
            items: [
                { label: 'In-person Lesson', value: 'In-person Lesson' },
                { label: 'From a Friend', value: 'From a Friend' },
                { label: 'Google Search', value: 'Google Search' },
                { label: 'Online Ad', value: 'Online Ad' },
                { label: 'Golf Course Ad', value: 'Golf Course Ad' },
                { label: 'Social Media', value: 'Social Media' },
                { label: 'Youtube', value: 'Youtube' },
                { label: 'Other', value: 'Other' },
            ],
        },
    ];

    return (
        <View style={sharedStyles.pageContainer}>
            <SEHeader title={'Sign Up'} subtitle={'create an account'} mainAction={'back'} showAuth={false} />
            <KeyboardAvoidingView
                style={[sharedStyles.pageContainer, { paddingTop: HEADER_COLLAPSED_HEIGHT }]}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView
                    ref={scroller}
                    contentContainerStyle={[sharedStyles.paddingMedium, { paddingBottom: height * 0.5 }]}
                    keyboardShouldPersistTaps={'always'}>
                    {registration.pending && <ActivityIndicator size={'large'} />}
                    {regProperties.map((field: RegistrationProperty, index: number) => (
                        <React.Fragment key={`registration_property_${field.property}`}>
                            {field.type === 'select' ? (
                                <RNPickerSelect
                                    ref={refs[index]}
                                    placeholder={{ label: 'Choose One...', value: '', color: blackOpacity(0.25) }}
                                    items={field.items || []}
                                    onValueChange={
                                        field.onChange
                                            ? field.onChange
                                            : (value: string) => {
                                                setFields({
                                                    ...fields,
                                                    [field.property]: value.replace(/[^A-Z- .]/gi, '').substr(0, 32),
                                                });
                                            }
                                    }
                                    value={fields[field.property]}
                                    useNativeAndroidPickerStyle={false}>
                                    <Input
                                        editable={false}
                                        containerStyle={{
                                            paddingHorizontal: 0,
                                            marginTop: index > 0 ? spaces.medium : 0,
                                        }}
                                        inputContainerStyle={sharedStyles.inputContainer}
                                        inputStyle={sharedStyles.input}
                                        label={field.label}
                                        labelStyle={[sharedStyles.formLabel]}
                                        underlineColorAndroid={transparent}
                                        value={fields[field.property]}
                                    />
                                </RNPickerSelect>
                            ) : (
                                    <Input
                                        ref={refs[index]}
                                        secureTextEntry={field.secure}
                                        autoCorrect={false}
                                        autoCapitalize={'none'}
                                        containerStyle={{ paddingHorizontal: 0, marginTop: index > 0 ? spaces.medium : 0 }}
                                        editable={!registration.pending}
                                        inputContainerStyle={sharedStyles.inputContainer}
                                        inputStyle={sharedStyles.input}
                                        keyboardType={field.keyboard}
                                        label={field.label}
                                        labelStyle={[sharedStyles.formLabel]}
                                        onChangeText={
                                            field.onChange
                                                ? field.onChange
                                                : (value: string) => {
                                                    setFields({
                                                        ...fields,
                                                        [field.property]: value.replace(/[^A-Z- .]/gi, '').substr(0, 32),
                                                    });
                                                }
                                        }
                                        onBlur={field.onBlur}
                                        onSubmitEditing={
                                            field.onSubmit
                                                ? field.onSubmit
                                                : () => {
                                                    if (refs[(index + 1) % refs.length].current) {
                                                        refs[(index + 1) % refs.length].current.focus();
                                                    }
                                                }
                                        }
                                        returnKeyType={'next'}
                                        underlineColorAndroid={transparent}
                                        value={fields[field.property]}
                                    />
                                )}
                            <ErrorBox
                                style={{ marginTop: spaces.small }}
                                show={field.errorMessage !== undefined && field.errorMessage.length > 0}
                                error={field.errorMessage || `Invalid ${field.label}`}
                            />
                        </React.Fragment>
                    ))}
                    {_canSubmit() && !registration.pending && (
                        <SEButton
                            containerStyle={{ marginTop: spaces.large }}
                            buttonStyle={{ backgroundColor: theme.colors.primary[400] }}
                            title={<H7 style={{color: theme.colors.onPrimary[50]}}>SUBMIT</H7>}
                            onPress={() => {
                                _submitRegistration();
                                if (scroller.current) {
                                    scroller.current.scrollTo({ x: 0, y: 0, animated: true });
                                }
                            }}
                        />
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const _getRegistrationErrorMessage = (code: number): string => {
    switch (code) {
        case 400302:
            return 'Oops! Your verification link is invalid. Please check your registration email and try again. If you continue to have problems, please contact us.';
        case 400303:
            return 'Your verification link has expired. You will need to re-register.';
        case 400304:
        case -1:
            return 'Your your email address has already been verified. Sign in to view your account.';
        default:
            return 'Unknown Error: ' + code;
    }
};
