import React, { useState, useRef, RefObject, useCallback, useEffect } from 'react';
import { Alert, View, KeyboardAvoidingView, ScrollView, StyleSheet, NativeSyntheticEvent, TextInputFocusEventData, TextInputSubmitEditingEventData, Keyboard, KeyboardType, Platform, ActivityIndicator } from 'react-native';
import { Input } from 'react-native-elements';
import { H7 } from '@pxblue/react-native-components';
import { SEHeader, ErrorBox, SEButton } from '../../../components';
import { sharedStyles, transparent, unit, sizes, spaces, fonts, white, purple, blackOpacity } from '../../../styles';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from '../../../__types__';
import { checkUsernameAvailability, checkEmailAvailability, createAccount } from '../../../redux/actions';
import { usePrevious, height } from '../../../utilities';
import { ROUTES } from '../../../constants/routes';

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

type RegistrationKeys = {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    confirm: string;
    heard: string;
}
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
    keyboard?: KeyboardType,
    secure?: boolean;
    onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    onChange?: (value: string) => void;
    onSubmit?: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
    hasError?: boolean;
    errorMessage?: string;
    items?: Item[];
}

export const Register = (props) => {
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


    useEffect(() => { // Registration finished
        if (previousPendingState && !registration.pending) {
            if (registration.success) { // Successful
                props.navigation.goBack(ROUTES.AUTH_GROUP);
            }
            else {
                // TODO: Log error
                Alert.alert(
                    'Oops:',
                    'Your account registration has failed. Please try again later and contact us if the problem continues.',
                    [{ text: 'OK' }]
                );
            }
        }
    }, [previousPendingState, registration])

    const _canSubmit = useCallback((): boolean => {
        const keys: RegistrationKey[] = Object.keys(fields) as RegistrationKey[];
        for (let i = 0; i < keys.length; i++) {
            if (fields[keys[i]].length <= 0) return false
        }
        if (fields.password !== fields.confirm) return false;
        if (!fields.email.match(EMAIL_REGEX)) return false;
        if (!registration.emailAvailable) return false;
        return true;

    }, [fields, registration])

    const _submitRegistration = useCallback((): void => {
        console.log('button clicked');
        if (!_canSubmit()) return;
        dispatch(createAccount({
            ...fields,
            phone: '',
            platform: Platform.OS
        }));
    }, [dispatch, _canSubmit])

    const regProperties: RegistrationProperty[] = [
        { property: 'firstName', label: 'First Name' },
        { property: 'lastName', label: 'Last Name' },
        {
            property: 'email',
            label: 'Email Address',
            keyboard: 'email-address',
            errorMessage:
                (fields.email.length > 0 && !fields.email.match(EMAIL_REGEX)) ? 'Invalid Email Address' :
                    !registration.emailAvailable ? 'Email Address is already registered' : '',
            onChange: (value) => {
                setFields({
                    ...fields,
                    email: value.substr(0, 128)
                })
            },
            onBlur: () => dispatch(checkEmailAvailability(fields.email))
        },
        {
            property: 'username',
            label: 'Username',
            errorMessage: !registration.userAvailable ? 'Username is already registered' : '',
            onChange: (value: string) => {
                setFields({
                    ...fields,
                    username: value.replace(/[^A-Z0-9-_.$#@!+]/gi, "").substr(0, 32)
                });
            },
            onBlur: () => dispatch(checkUsernameAvailability(fields.username))
        },
        { property: 'password', label: 'Password', secure: true },
        {
            property: 'confirm',
            label: 'Confirm Password',
            secure: true,
            errorMessage: (fields.password !== fields.confirm) ? 'Passwords do not match' : '',
            onSubmit: () => Keyboard.dismiss()
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
                { label: 'Other', value: 'Other' }
            ],
        },
    ];

    return (
        <View style={sharedStyles.pageContainer}>
            <SEHeader
                title={'Submit Your Swing'}
                subtitle={'create a new lesson'}
                mainAction={'back'}
                showAuth={false}
            />
            <KeyboardAvoidingView style={[sharedStyles.pageContainer, { backgroundColor: transparent }]} behavior={'padding'}>
                <ScrollView
                    ref={scroller}
                    contentContainerStyle={[sharedStyles.paddingMedium, { paddingBottom: height * .5 }]}
                    keyboardShouldPersistTaps={'always'}
                >
                    {registration.pending && <ActivityIndicator size={'large'} />}
                    {regProperties.map((field: RegistrationProperty, index: number) => (
                        <React.Fragment key={`registration_property_${field.property}`}>
                            {field.type === 'select' ?
                                <RNPickerSelect
                                    ref={refs[index]}
                                    placeholder={{ label: 'Choose One...', value: '', color: blackOpacity(0.25) }}
                                    items={field.items || []}
                                    onValueChange={field.onChange ? field.onChange :
                                        (value: string) => {
                                            setFields(
                                                {
                                                    ...fields,
                                                    [field.property]: value.replace(/[^A-Z- .]/gi, "").substr(0, 32)
                                                }
                                            )
                                        }
                                    }
                                    value={fields[field.property]}
                                    useNativeAndroidPickerStyle={false}
                                >
                                    <Input
                                        editable={false}
                                        containerStyle={{ paddingHorizontal: 0, marginTop: index > 0 ? spaces.medium : 0 }}
                                        inputContainerStyle={styles.inputContainer}
                                        inputStyle={styles.input}
                                        label={field.label}
                                        labelStyle={[styles.formLabel]}
                                        underlineColorAndroid={transparent}
                                        value={fields[field.property]}
                                    />
                                </RNPickerSelect>
                                :
                                <Input
                                    ref={refs[index]}
                                    secureTextEntry={field.secure}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    containerStyle={{ paddingHorizontal: 0, marginTop: index > 0 ? spaces.medium : 0 }}
                                    editable={!registration.pending}
                                    inputContainerStyle={styles.inputContainer}
                                    inputStyle={styles.input}
                                    keyboardType={field.keyboard}
                                    label={field.label}
                                    labelStyle={[styles.formLabel]}
                                    onChangeText={field.onChange ? field.onChange :
                                        (value: string) => {
                                            setFields(
                                                {
                                                    ...fields,
                                                    [field.property]: value.replace(/[^A-Z- .]/gi, "").substr(0, 32)
                                                }
                                            )
                                        }
                                    }
                                    onBlur={field.onBlur}
                                    onSubmitEditing={field.onSubmit ? field.onSubmit :
                                        () => {
                                            if (refs[(index + 1) % refs.length].current) {
                                                refs[(index + 1) % refs.length].current.focus();
                                            }
                                        }
                                    }
                                    returnKeyType={'next'}
                                    underlineColorAndroid={transparent}
                                    value={fields[field.property]}
                                />
                            }
                            <ErrorBox
                                style={{ marginTop: spaces.small }}
                                show={field.errorMessage !== undefined && field.errorMessage.length > 0}
                                error={field.errorMessage || `Invalid ${field.label}`}
                            />
                        </React.Fragment>
                    ))}
                    {_canSubmit() && !registration.pending &&
                        <SEButton
                            // disabled={!_canSubmit()}
                            containerStyle={{ marginTop: spaces.large }}
                            buttonStyle={{ backgroundColor: purple[400] }}
                            title={<H7 color={'onPrimary'}>SUBMIT</H7>}
                            onPress={() => {
                                _submitRegistration();
                                if (scroller.current) scroller.current.scrollTo({ x: 0, y: 0, animated: true });
                            }}
                        />
                    }
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
};

const styles = StyleSheet.create({
    formLabel: {
        fontFamily: 'SFCompactDisplay-Regular',
        color: purple[500],
        marginLeft: 0,
        marginTop: 0,
        fontSize: fonts[14],
        fontWeight: '500',
    },
    input: {
        color: purple[500],
        fontSize: fonts[14],
        textAlignVertical: 'center',
        paddingHorizontal: spaces.small,
    },
    inputContainer: {
        height: sizes.large,
        backgroundColor: white[50],
        marginTop: spaces.small,
        padding: spaces.small,
        borderColor: purple[800],
        borderWidth: unit(1),
        borderBottomWidth: unit(1),
        borderRadius: unit(5),
    },
})