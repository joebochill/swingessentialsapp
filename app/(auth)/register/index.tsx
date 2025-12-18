import { EMAIL_REGEX } from '@/_config';
import { BackgroundImage } from '@/components/common/BackgroundImage';
import { SEButton } from '@/components/common/SEButton';
import { ErrorBox } from '@/components/feedback/ErrorBox';
import { StyledTextInput } from '@/components/inputs/StyledTextInput';
import { Header } from '@/components/layout/CollapsibleHeader/Header';
import { COLLAPSED_HEIGHT } from '@/components/layout/CollapsibleHeader/useCollapsibleHeader';
import { Stack } from '@/components/layout/Stack';
import {
    useCheckEmailAvailabilityMutation,
    useCheckUsernameAvailabilityMutation,
    useCreateNewUserAccountMutation,
    UserRegistrationDetails,
} from '@/redux/apiServices/registrationService';
import { useAppTheme } from '@/theme';
import { height } from '@/utilities/dimensions';
import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    BlurEvent,
    Keyboard,
    KeyboardAvoidingView,
    KeyboardType,
    Platform,
    ScrollView,
    TextInputSubmitEditingEvent,
    View,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';

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
    onBlur?: (e: BlurEvent) => void;
    onChange?: (value: string) => void;
    onSubmit?: (e: TextInputSubmitEditingEvent) => void | (() => void);
    hasError?: boolean;
    errorMessage?: string;
    items?: Item[];
};

export default function RegisterScreen() {
    const router = useRouter();
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();
    const scroller = useRef(null);

    const [checkUsernameAvailability, { data: usernameAvailable, reset: resetUsernameCheck }] =
        useCheckUsernameAvailabilityMutation();
    const [checkEmailAvailability, { data: emailAvailable, reset: resetEmailCheck }] =
        useCheckEmailAvailabilityMutation();
    const [
        createNewUserAccount,
        { isSuccess: registeredSuccessfully, isLoading, isError, error, reset: resetRegistration },
    ] = useCreateNewUserAccountMutation();

    const [fields, setFields] = useState(defaultKeys);
    const [showPassword, setShowPassword] = useState(false);
    const emailRef = useRef(null);
    const userRef = useRef(null);
    const passRef = useRef(null);

    const usernameTaken = fields.username !== '' && usernameAvailable === false;
    const emailTaken = fields.email !== '' && emailAvailable === false;

    const refs = [userRef, emailRef, passRef];

    const resetForm = useCallback(() => {
        setFields(defaultKeys);
        setShowPassword(false);
    }, []);

    // Select the first field on load
    useEffect(() => {
        if (userRef && userRef.current) {
            // @ts-expect-error we know userRef isn't null inside this block
            userRef.current.focus();
        }
    }, []);

    // Error
    useEffect(() => {
        if (isError) {
            const errorMessage = (error as { data: { message: string } })?.data.message ?? '';
            Alert.alert(
                'Oops',
                `An error occurred during your registration: ${errorMessage}. Please try again later or contact us if the problem persists.`,
                [{ text: 'OK', onPress: () => resetRegistration() }]
            );
        }
    }, [isError, error, resetRegistration]);

    // Success
    useEffect(() => {
        if (registeredSuccessfully) {
            router.replace('/(drawer)/(screens)/home');
            resetForm();
            resetEmailCheck();
            resetUsernameCheck();
            resetRegistration();
        }
    }, [registeredSuccessfully, router, resetEmailCheck, resetForm, resetUsernameCheck, resetRegistration]);

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
    }, [canSubmit, fields, createNewUserAccount]);

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
                if (fields.username) {
                    checkUsernameAvailability(fields.username);
                }
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
                if (fields.email) {
                    checkEmailAvailability(fields.email);
                }
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
                                                color: theme.dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.25)',
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
                                                onBlur={(e: BlurEvent): void => {
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
                                              scroller.current.scrollTo({
                                                  x: 0,
                                                  y: 0,
                                                  animated: true,
                                              });
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
}
