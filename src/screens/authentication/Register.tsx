import React, { useState, useRef, RefObject, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

// Components
import {
    ActivityIndicator,
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
import MatIcon from '@react-native-vector-icons/material-icons';
import { TextInput } from 'react-native-paper';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import { height } from '../../utilities/dimensions';
import { EMAIL_REGEX } from '../../constants';
import { ROUTES } from '../../constants/routes';
import { useAppTheme } from '../../theme';
import { Header } from '../../components/CollapsibleHeader/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLLAPSED_HEIGHT } from '../../components/CollapsibleHeader';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { Stack } from '../../components/layout';
import { BackgroundImage } from '../../components/BackgroundImage';
import { ErrorBox } from '../../components/feedback';
import { SEButton } from '../../components/SEButton';
import { StyledTextInput } from '../../components/inputs/StyledTextInput';
import {
    useCheckEmailAvailabilityMutation,
    useCheckUsernameAvailabilityMutation,
    useCreateNewUserAccountMutation,
    UserRegistrationDetails,
    useVerifyUserEmailMutation,
} from '../../redux/apiServices/registrationService';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { RootState } from '../../redux/store';
import { Typography } from '../../components/typography';
import { Picker } from '@react-native-picker/picker';
import { Icon } from '../../components/Icon';

const defaultKeys: UserRegistrationDetails = {
    email: '',
    username: '',
    password: '',
    acquisition: '',
};
type RegistrationKey = keyof UserRegistrationDetails;

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

const VerifyForm: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'REGISTER'>>();
    const { code } = route.params ?? {};

    const token = useSelector((state: RootState) => state.auth.token);
    const [verifyUserEmail, { isLoading, error, isUninitialized, isSuccess }] = useVerifyUserEmailMutation();

    const theme = useAppTheme();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (code) {
            verifyUserEmail(code);
        }
    }, [code]);

    return (
        <Stack style={[{ flex: 1 }]}>
            <Header
                title={'Sign Up'}
                subtitle={'Confirm your email'}
                mainAction={'back'}
                showAuth={false}
                navigation={navigation}
                backgroundColor={theme.dark ? theme.colors.surface : undefined}
                fixed
            />
            <BackgroundImage>
                <Stack
                    justify={'center'}
                    style={[
                        {
                            flex: 1,
                            padding: theme.spacing.md,
                            paddingTop: COLLAPSED_HEIGHT + insets.top,
                        },
                    ]}
                >
                    {isLoading && (
                        <>
                            <ActivityIndicator size={'large'} color={theme.colors.onPrimary} />
                            <Typography variant={'bodyLarge'} align={'center'} color={'onPrimary'}>
                                Verifying your email address...
                            </Typography>
                        </>
                    )}
                    {!isUninitialized && !isLoading && isSuccess && (
                        <>
                            <MatIcon
                                name={'check-circle'}
                                size={theme.size.xxl}
                                color={theme.colors.onPrimary}
                                style={{ alignSelf: 'center' }}
                            />
                            <Typography variant={'bodyLarge'} color={'onPrimary'} align={'center'}>
                                {`Your email address has been confirmed. ${
                                    token ? "Let's get started!" : 'Please sign in to view your account.'
                                }`}
                            </Typography>
                            <SEButton
                                buttonColor={theme.colors.secondary}
                                title={token ? 'GET STARTED' : 'SIGN IN'}
                                onPress={(): void => navigation.replace(ROUTES.LOGIN)}
                                style={{ marginTop: theme.spacing.md }}
                            />
                        </>
                    )}
                    {!isUninitialized && !isLoading && error && (
                        <>
                            <MatIcon
                                name={'error'}
                                size={theme.size.xxl}
                                color={theme.colors.onPrimary}
                                style={{ alignSelf: 'center' }}
                            />
                            <Typography variant={'bodyLarge'} color={'onPrimary'} align={'center'}>
                                {error as string}
                            </Typography>
                        </>
                    )}
                </Stack>
            </BackgroundImage>
        </Stack>
    );
};

const RegisterForm: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();
    const scroller = useRef(null);

    const [checkUsernameAvailability, { data: usernameAvailable, reset: resetUsernameCheck }] =
        useCheckUsernameAvailabilityMutation();
    const [checkEmailAvailability, { data: emailAvailable, reset: resetEmailCheck }] =
        useCheckEmailAvailabilityMutation();
    const [
        createNewUserAccount,
        { isSuccess: registeredSuccessfully, isUninitialized, isLoading, reset: resetRegistration },
    ] = useCreateNewUserAccountMutation();

    const [fields, setFields] = useState(defaultKeys);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const emailRef = useRef(null);
    const userRef = useRef(null);
    const passRef = useRef(null);

    const usernameTaken = fields.username !== '' && usernameAvailable === false;
    const emailTaken = fields.email !== '' && emailAvailable === false;

    const refs = [userRef, emailRef, passRef];

    const resetForm = useCallback(() => {
        setFields(defaultKeys);
        setShowPassword(false);
        setErrorMessage('');
    }, []);

    // Select the first field on load
    useEffect(() => {
        if (userRef && userRef.current) {
            // @ts-expect-error we know userRef isn't null inside this block
            userRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (isUninitialized || isLoading) {
            return;
        }
        if (!registeredSuccessfully) {
            setErrorMessage(
                'Your account registration has failed. Please try again later and contact us if the problem continues.'
            );
        } else if (registeredSuccessfully) {
            navigation.replace(ROUTES.HOME);
            resetForm();
            resetEmailCheck();
            resetUsernameCheck();
            resetRegistration();
        }
    }, [registeredSuccessfully, isUninitialized, isLoading, resetForm]);

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
        if (emailTaken || usernameTaken) {
            return false;
        }
        return true;
    }, [fields, emailTaken, usernameTaken]);

    const submitRegistration = useCallback((): void => {
        if (!canSubmit()) {
            return;
        }
        createNewUserAccount(fields);
    }, [canSubmit, fields]);

    const regProperties: RegistrationProperty[] = [
        {
            property: 'username',
            label: 'Username',
            errorMessage: usernameTaken ? 'Username is already registered' : '',
            onChange: (value: string): void => {
                setFields({
                    ...fields,
                    username: value.replace(/[^A-Z0-9-_.$#@!+]/gi, '').substring(0, 32),
                });
                resetUsernameCheck();
            },
            onBlur: (): void => {
                if (fields.username) checkUsernameAvailability(fields.username);
            },
        },
        {
            property: 'email',
            label: 'Email Address',
            keyboard: 'email-address',
            errorMessage:
                fields.email.length > 0 && !EMAIL_REGEX.test(fields.email)
                    ? 'Invalid Email Address'
                    : emailTaken
                    ? 'Email address is already registered'
                    : '',
            onChange: (value): void => {
                setFields({
                    ...fields,
                    email: value.substring(0, 128),
                });
                resetEmailCheck();
            },
            onBlur: (): void => {
                if (fields.email) checkEmailAvailability(fields.email);
            },
        },
        {
            property: 'password',
            label: 'Password',
            secure: !showPassword,
            onSubmit: (): void => Keyboard.dismiss(),
        },
        {
            property: 'acquisition',
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
        <Stack style={{ flex: 1 }}>
            <Header
                title={'Sign Up'}
                subtitle={'Create an account'}
                mainAction={'back'}
                showAuth={false}
                navigation={navigation}
                backgroundColor={theme.dark ? theme.colors.surface : undefined}
                fixed
            />
            <BackgroundImage>
                <KeyboardAvoidingView
                    style={[
                        {
                            flex: 1,
                            paddingTop: COLLAPSED_HEIGHT + insets.top,
                        },
                    ]}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <ScrollView
                        ref={scroller}
                        contentContainerStyle={[{ padding: theme.spacing.md, paddingBottom: height * 0.5 }]}
                        keyboardShouldPersistTaps={'always'}
                    >
                        <Stack gap={theme.spacing.md}>
                            {regProperties.map((field: RegistrationProperty, index: number) => (
                                <Stack key={`registration_property_${field.property}`}>
                                    {field.type === 'select' ? (
                                        <RNPickerSelect
                                            ref={refs[index]}
                                            disabled={isLoading}
                                            darkTheme={theme.dark}
                                            placeholder={{
                                                label: 'Choose One...',
                                                value: '',
                                                color: 'rgba(0,0,0,0.25)',
                                            }}
                                            items={field.items || []}
                                            onValueChange={
                                                field.onChange
                                                    ? field.onChange
                                                    : (value: string): void => {
                                                          setFields({
                                                              ...fields,
                                                              [field.property]: value
                                                                  .replace(/[^A-Z- .]/gi, '')
                                                                  .substring(0, 32),
                                                          });
                                                      }
                                            }
                                            // @ts-expect-error this is a workaround for a bug in RNPickerSelect with new architecture
                                            style={{ inputIOSContainer: { pointerEvents: 'none' } }}
                                            value={fields[field.property]}
                                            useNativeAndroidPickerStyle={false}
                                        >
                                            <StyledTextInput
                                                editable={false}
                                                label={field.label}
                                                underlineColorAndroid={'transparent'}
                                                value={fields[field.property]}
                                                right={
                                                    <TextInput.Icon
                                                        icon={'keyboard-arrow-down'}
                                                        size={24}
                                                        color={theme.colors.onPrimaryContainer}
                                                    />
                                                }
                                            />
                                        </RNPickerSelect>
                                    ) : (
                                        <View>
                                            <StyledTextInput
                                                ref={refs[index]}
                                                secureTextEntry={field.secure}
                                                autoCorrect={false}
                                                autoCapitalize={'none'}
                                                onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>): void => {
                                                    if (field.onBlur) {
                                                        field.onBlur(e);
                                                    }
                                                }}
                                                editable={!isLoading}
                                                error={
                                                    field.errorMessage !== undefined && field.errorMessage.length > 0
                                                }
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
                                                                  // @ts-expect-error we know refs aren't null inside this block
                                                                  refs[(index + 1) % refs.length].current.focus();
                                                              }
                                                          }
                                                }
                                                right={
                                                    field.property === 'password' ? (
                                                        <TextInput.Icon
                                                            icon={field.secure ? 'visibility' : 'visibility-off'}
                                                            size={theme.size.md}
                                                            color={theme.colors.onPrimaryContainer}
                                                            onPress={(): void => setShowPassword(!showPassword)}
                                                        />
                                                    ) : undefined
                                                }
                                                returnKeyType={'next'}
                                                underlineColorAndroid={'transparent'}
                                                value={fields[field.property]}
                                            />
                                        </View>
                                    )}
                                    <ErrorBox
                                        show={field.errorMessage !== undefined && field.errorMessage.length > 0}
                                        error={field.errorMessage || `Invalid ${field.label}`}
                                        style={{ marginTop: theme.spacing.md }}
                                    />
                                </Stack>
                            ))}
                        </Stack>
                        <SEButton
                            buttonColor={theme.dark ? undefined : theme.colors.secondary}
                            title={!isLoading ? 'SUBMIT' : 'SUBMITTING'}
                            loading={isLoading}
                            onPress={
                                canSubmit() && !isLoading
                                    ? (): void => {
                                          submitRegistration();
                                          if (scroller.current) {
                                              // @ts-expect-error we know scroller isn't null inside this block
                                              scroller.current.scrollTo({ x: 0, y: 0, animated: true });
                                          }
                                      }
                                    : undefined
                            }
                            style={[
                                { marginTop: theme.spacing.md },
                                canSubmit() ? {} : { opacity: 0.6, borderWidth: 0 },
                            ]}
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
            </BackgroundImage>
        </Stack>
    );
};

export const Register: React.FC = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'REGISTER'>>();

    return route.params && route.params.code ? <VerifyForm /> : <RegisterForm />;
};
