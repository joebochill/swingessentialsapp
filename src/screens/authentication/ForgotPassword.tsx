import React, { useState, useCallback } from 'react';

// Components
import { View, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Body, H7, SEHeader, SEButton, BackgroundImage } from '../../components';

// Styles
import { transparent } from '../../styles/colors';
import { useSharedStyles, useFormStyles, useFlexStyles } from '../../styles';
import { height } from '../../utilities/dimensions';
import { useTheme, TextInput } from 'react-native-paper';
import MatIcon from 'react-native-vector-icons/MaterialIcons';

// Redux
import { requestPasswordReset } from '../../redux/actions';
import { useDispatch } from 'react-redux';

// Constants
import { EMAIL_REGEX, HEADER_COLLAPSED_HEIGHT } from '../../constants';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';

export const ForgotPassword: React.FC<StackScreenProps<RootStackParamList, 'ResetPassword'>> = (props) => {
    const { navigation } = props;
    const [email, setEmail] = useState('');
    const [activeField, setActiveField] = useState<'email' | null>(null);
    const [complete, setComplete] = useState(false);
    const dispatch = useDispatch();
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);
    const formStyles = useFormStyles(theme);
    const flexStyles = useFlexStyles(theme);

    const sendPasswordReset = useCallback(() => {
        if (EMAIL_REGEX.test(email)) {
            dispatch(requestPasswordReset({ email }));
            setComplete(true);
        }
    }, [email, dispatch, setComplete]);

    return (
        <View style={sharedStyles.pageContainer}>
            <SEHeader
                title={'Forgot Password'}
                subtitle={'Request a reset'}
                mainAction={'back'}
                showAuth={false}
                navigation={navigation}
            />
            <KeyboardAvoidingView
                style={[
                    sharedStyles.pageContainer,
                    {
                        paddingTop: HEADER_COLLAPSED_HEIGHT,
                        backgroundColor: theme.colors.primary,
                    },
                ]}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <BackgroundImage style={{ top: HEADER_COLLAPSED_HEIGHT }} />
                {!complete && (
                    <ScrollView
                        contentContainerStyle={[
                            flexStyles.paddingMedium,
                            {
                                paddingBottom: height * 0.5,
                            },
                        ]}
                        keyboardShouldPersistTaps={'always'}
                    >
                        <Body color={'onPrimary'}>
                            {
                                'Enter the email address you used to register for your account below and we will send you instructions for resetting your password.'
                            }
                        </Body>
                        <TextInput
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            keyboardType={'email-address'}
                            label={'Email Address'}
                            style={[
                                formStyles.formField,
                                activeField === 'email' || email.length > 0 ? formStyles.active : formStyles.inactive,
                            ]}
                            onFocus={(): void => setActiveField('email')}
                            onBlur={(): void => setActiveField(null)}
                            onChangeText={(value: string): void => setEmail(value.substr(0, 128))}
                            onSubmitEditing={(): void => sendPasswordReset()}
                            returnKeyType={'send'}
                            underlineColorAndroid={transparent}
                            value={email}
                        />
                        <SEButton
                            dark
                            title={'REQUEST RESET'}
                            onPress={EMAIL_REGEX.test(email) ? (): void => sendPasswordReset() : undefined}
                            style={[formStyles.formField, EMAIL_REGEX.test(email) ? {} : { opacity: 0.6 }]}
                        />
                    </ScrollView>
                )}
                {complete && (
                    <View style={[flexStyles.paddingMedium, sharedStyles.centered, { flex: 1 }]}>
                        <MatIcon
                            name={'check-circle'}
                            size={theme.sizes.jumbo}
                            color={theme.colors.onPrimary}
                            style={{ alignSelf: 'center' }}
                        />
                        <H7 font={'regular'} color={'onPrimary'} style={[{ textAlign: 'center' }]}>
                            {'Your password reset request was received. Check your email for further instructions.'}
                        </H7>
                    </View>
                )}
            </KeyboardAvoidingView>
        </View>
    );
};
