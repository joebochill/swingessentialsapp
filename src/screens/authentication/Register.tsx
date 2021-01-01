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
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import { TextInput, useTheme } from 'react-native-paper';
import { H7, ErrorBox, SEButton, SEHeader, BackgroundImage } from '../../components';
import RNPickerSelect, { Item } from 'react-native-picker-select';

// Types
import { StackScreenProps } from '@react-navigation/stack';
import { ApplicationState } from '../../__types__';

// Styles
import { useSharedStyles, useFormStyles, useFlexStyles } from '../../styles';
import { transparent, blackOpacity } from '../../styles/colors';

// Utilities
import { height } from '../../utilities/dimensions';

// Redux
import { checkUsernameAvailability, checkEmailAvailability, createAccount, verifyEmail } from '../../redux/actions';

// Constants
import { EMAIL_REGEX, HEADER_COLLAPSED_HEIGHT } from '../../constants';
import { ROUTES } from '../../constants/routes';
import { RootStackParamList } from '../../navigation/MainNavigator';

const getRegistrationErrorMessage = (code: number): string => {
    switch (code) {
        case 400302:
            return 'Oops! Your verification link is invalid. Please check your registration email and try again. If you continue to have problems, please contact us.';
        case 400303:
            return 'Your verification link has expired. You will need to re-register.';
        case 400304:
        case -1:
            return 'Your your email address has already been verified. Sign in to view your account.';
        default:
            return `Unknown Error: ${code}`;
    }
};

type RegistrationKeys = {
    email: string;
    username: string;
    password: string;
    heard: string;
};
const defaultKeys: RegistrationKeys = {
    email: '',
    username: '',
    password: '',
    heard: '',
};
type RegistrationKey = keyof RegistrationKeys;

type RegistrationProperty = {
    property: RegistrationKey;
    ref?: RefObject<typeof TextInput>;
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

const VerifyForm: React.FC<StackScreenProps<RootStackParamList, 'Verify'>> = (props) => {
    const { navigation } = props;
    const { code } = props.route.params;
    const token = useSelector((state: ApplicationState) => state.login.token);
    const verification = useSelector((state: ApplicationState) => state.registration);
    const dispatch = useDispatch();
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);
    const formStyles = useFormStyles(theme);
    const flexStyles = useFlexStyles(theme);

    useEffect(() => {
        if (code) {
            dispatch(verifyEmail(code));
        }
    }, [code, dispatch]);

    return (
        <View style={[sharedStyles.pageContainer, { backgroundColor: theme.colors.primary }]}>
            <SEHeader
                title={'Sign Up'}
                subtitle={'Confirm your email'}
                mainAction={'back'}
                showAuth={false}
                navigation={navigation}
            />
            <BackgroundImage />
            <View
                style={[
                    flexStyles.paddingMedium,
                    { flex: 1, justifyContent: 'center', paddingTop: HEADER_COLLAPSED_HEIGHT },
                ]}
            >
                {verification.pending && (
                    <>
                        <ActivityIndicator size={'large'} color={theme.colors.onPrimary} />
                        <H7 font={'regular'} color={'onPrimary'} style={{ textAlign: 'center' }}>
                            Verifying your email address...
                        </H7>
                    </>
                )}
                {!verification.pending && (
                    <>
                        <MatIcon
                            name={verification.emailVerified ? 'check-circle' : 'error'}
                            size={theme.sizes.jumbo}
                            color={theme.colors.onPrimary}
                            style={{ alignSelf: 'center' }}
                        />
                        <H7 font={'regular'} color={'onPrimary'} style={{ textAlign: 'center' }}>
                            {verification.emailVerified
                                ? `Your email address has been confirmed. ${
                                      token ? "Let's get started!" : 'Please sign in to view your account.'
                                  }`
                                : getRegistrationErrorMessage(verification.error)}
                        </H7>
                        {verification.emailVerified && (
                            <SEButton
                                dark
                                style={formStyles.formField}
                                title={token ? 'GET STARTED' : 'SIGN IN'}
                                onPress={(): void => navigation.replace(ROUTES.LOGIN)}
                            />
                        )}
                    </>
                )}
            </View>
        </View>
    );
};

const RegisterForm: React.FC<StackScreenProps<RootStackParamList, 'Register'>> = (props) => {
    const { navigation } = props;
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);
    const formStyles = useFormStyles(theme);
    const flexStyles = useFlexStyles(theme);
    const [fields, setFields] = useState(defaultKeys);
    const [showPassword, setShowPassword] = useState(false);
    const emailRef = useRef(null);
    const userRef = useRef(null);
    const passRef = useRef(null);
    const [activeField, setActiveField] = useState<RegistrationKey | null>(null);

    const scroller = useRef(null);

    const refs = [userRef, emailRef, passRef];
    const registration = useSelector((state: ApplicationState) => state.registration);
    const previousPendingState = usePrevious(registration.pending);

    const dispatch = useDispatch();

    // Select the first field on load
    useEffect(() => {
        if (userRef && userRef.current) {
            userRef.current.focus();
        }
    }, []);

    useEffect(() => {
        // Registration finished
        if (previousPendingState && !registration.pending) {
            if (registration.success) {
                // Successful
                Alert.alert(
                    'Success!',
                    "We've received your registration request. Check your email to confirm your email address.",
                    [{ text: 'OK' }]
                );
                props.navigation.goBack(ROUTES.LOGIN);
            } else {
                Alert.alert(
                    'Oops:',
                    'Your account registration has failed. Please try again later and contact us if the problem continues.',
                    [{ text: 'OK' }]
                );
            }
        }
    }, [previousPendingState, props.navigation, registration]);

    const canSubmit = useCallback((): boolean => {
        const keys: RegistrationKey[] = Object.keys(fields) as RegistrationKey[];
        for (let i = 0; i < keys.length; i++) {
            if (fields[keys[i]].length <= 0) {
                return false;
            }
        }
        if (!EMAIL_REGEX.test(fields.email)) {
            return false;
        }
        if (!registration.emailAvailable) {
            return false;
        }
        return true;
    }, [fields, registration]);

    const submitRegistration = useCallback((): void => {
        if (!canSubmit()) {
            return;
        }
        dispatch(
            createAccount({
                ...fields,
                platform: Platform.OS,
            })
        );
    }, [canSubmit, dispatch, fields]);

    const regProperties: RegistrationProperty[] = [
        {
            property: 'username',
            label: 'Username',
            errorMessage: !registration.userAvailable ? 'Username is already registered' : '',
            onChange: (value: string): void => {
                setFields({
                    ...fields,
                    username: value.replace(/[^A-Z0-9-_.$#@!+]/gi, '').substr(0, 32),
                });
            },
            onBlur: (): void => dispatch(checkUsernameAvailability(fields.username)),
        },
        {
            property: 'email',
            label: 'Email Address',
            keyboard: 'email-address',
            errorMessage:
                fields.email.length > 0 && !EMAIL_REGEX.test(fields.email)
                    ? 'Invalid Email Address'
                    : !registration.emailAvailable
                    ? 'Email address is already registered'
                    : '',
            onChange: (value): void => {
                setFields({
                    ...fields,
                    email: value.substr(0, 128),
                });
            },
            onBlur: (): void => dispatch(checkEmailAvailability(fields.email)),
        },
        {
            property: 'password',
            label: 'Password',
            secure: !showPassword, //true,
            onSubmit: (): void => Keyboard.dismiss(),
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
            <SEHeader
                title={'Sign Up'}
                subtitle={'Create an account'}
                mainAction={'back'}
                showAuth={false}
                navigation={navigation}
            />
            <KeyboardAvoidingView
                style={[
                    sharedStyles.pageContainer,
                    { paddingTop: HEADER_COLLAPSED_HEIGHT, backgroundColor: theme.colors.primary },
                ]}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <BackgroundImage style={{ top: HEADER_COLLAPSED_HEIGHT }} />
                <ScrollView
                    ref={scroller}
                    contentContainerStyle={[flexStyles.paddingMedium, { paddingBottom: height * 0.5 }]}
                    keyboardShouldPersistTaps={'always'}
                >
                    {regProperties.map((field: RegistrationProperty, index: number) => (
                        <React.Fragment key={`registration_property_${field.property}`}>
                            {field.type === 'select' ? (
                                <RNPickerSelect
                                    ref={refs[index]}
                                    disabled={registration.pending}
                                    placeholder={{ label: 'Choose One...', value: '', color: blackOpacity(0.25) }}
                                    items={field.items || []}
                                    onOpen={(): void => setActiveField(field.property)}
                                    onClose={(): void => setActiveField(null)}
                                    onValueChange={
                                        field.onChange
                                            ? field.onChange
                                            : (value: string): void => {
                                                  setFields({
                                                      ...fields,
                                                      [field.property]: value.replace(/[^A-Z- .]/gi, '').substr(0, 32),
                                                  });
                                              }
                                    }
                                    value={fields[field.property]}
                                    useNativeAndroidPickerStyle={false}
                                >
                                    <TextInput
                                        editable={false}
                                        style={[
                                            index > 0 ? formStyles.formField : {},
                                            activeField === field.property || fields[field.property].length > 0
                                                ? formStyles.active
                                                : formStyles.inactive,
                                        ]}
                                        label={field.label}
                                        underlineColorAndroid={transparent}
                                        value={fields[field.property]}
                                    />
                                </RNPickerSelect>
                            ) : (
                                <View style={[index > 0 ? formStyles.formField : {}]}>
                                    <TextInput
                                        ref={refs[index]}
                                        secureTextEntry={field.secure}
                                        autoCorrect={false}
                                        autoCapitalize={'none'}
                                        style={[
                                            activeField === field.property || fields[field.property].length > 0
                                                ? formStyles.active
                                                : formStyles.inactive,
                                        ]}
                                        onFocus={(): void => setActiveField(field.property)}
                                        onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>): void => {
                                            setActiveField(null);
                                            if (field.onBlur) {
                                                field.onBlur(e);
                                            }
                                        }}
                                        editable={!registration.pending}
                                        error={field.errorMessage !== undefined && field.errorMessage.length > 0}
                                        keyboardType={field.keyboard}
                                        label={field.label}
                                        onChangeText={
                                            field.onChange
                                                ? field.onChange
                                                : (value: string): void => {
                                                      setFields({
                                                          ...fields,
                                                          [field.property]: value
                                                              .replace(/[^A-Z- .]/gi, '')
                                                              .substr(0, 32),
                                                      });
                                                  }
                                        }
                                        onSubmitEditing={
                                            field.onSubmit
                                                ? field.onSubmit
                                                : (): void => {
                                                      if (refs[(index + 1) % refs.length].current) {
                                                          refs[(index + 1) % refs.length].current.focus();
                                                      }
                                                  }
                                        }
                                        returnKeyType={'next'}
                                        underlineColorAndroid={transparent}
                                        value={fields[field.property]}
                                    />
                                    {field.property === 'password' && (
                                        <View
                                            style={{
                                                position: 'absolute',
                                                right: theme.spaces.medium,
                                                bottom: 0,
                                                height: '100%',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <MatIcon
                                                name={field.secure ? 'visibility' : 'visibility-off'}
                                                size={theme.sizes.small}
                                                color={theme.colors.text}
                                                underlayColor={transparent}
                                                onPress={(): void => setShowPassword(!showPassword)}
                                            />
                                        </View>
                                    )}
                                </View>
                            )}

                            <ErrorBox
                                show={field.errorMessage !== undefined && field.errorMessage.length > 0}
                                error={field.errorMessage || `Invalid ${field.label}`}
                            />
                        </React.Fragment>
                    ))}
                    <SEButton
                        dark
                        title={!registration.pending ? 'SUBMIT' : 'SUBMITTING'}
                        // disabled={!canSubmit()}
                        loading={registration.pending}
                        onPress={
                            canSubmit() && !registration.pending
                                ? (): void => {
                                      submitRegistration();
                                      if (scroller.current) {
                                          scroller.current.scrollTo({ x: 0, y: 0, animated: true });
                                      }
                                  }
                                : undefined
                        }
                        style={[formStyles.formField, canSubmit() ? {} : { opacity: 0.6 }]}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

type VerifyStackProps = StackScreenProps<RootStackParamList, 'Verify'>;
type RegisterStackProps = StackScreenProps<RootStackParamList, 'Register'>;
export const Register: React.FC<RegisterStackProps | VerifyStackProps> = (props) =>
    props.route.params && props.route.params.code ? (
        <VerifyForm {...(props as VerifyStackProps)} />
    ) : (
        <RegisterForm {...(props as RegisterStackProps)} />
    );
