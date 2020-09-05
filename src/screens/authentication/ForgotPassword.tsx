import React, { useState, useCallback } from 'react';

// Components
import { View, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Body, H7, SEHeader, SEButton, BackgroundImage } from '../../components';

// Styles
import { transparent } from '../../styles/colors';
import { useSharedStyles, useFormStyles } from '../../styles';
import { height } from '../../utilities/dimensions';
import { useTheme, TextInput } from 'react-native-paper';
import MatIcon from 'react-native-vector-icons/MaterialIcons';


// Redux
import { requestPasswordReset } from '../../redux/actions';
import { useDispatch } from 'react-redux';

// Constants
import { EMAIL_REGEX, HEADER_COLLAPSED_HEIGHT } from '../../constants';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [activeField, setActiveField] = useState<'email' | null>(null);
    const [complete, setComplete] = useState(false);
    const dispatch = useDispatch();
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);
    const formStyles = useFormStyles(theme);
    
    const _sendPasswordReset = useCallback(() => {
        if (email.match(EMAIL_REGEX)) {
            dispatch(requestPasswordReset({ email }));
            setComplete(true);
        }
    }, [email, dispatch, setComplete]);

    return (
        <View style={sharedStyles.pageContainer}>
            <SEHeader title={'Forgot Password'} subtitle={'Request a reset'} mainAction={'back'} showAuth={false} />
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
                            sharedStyles.paddingMedium,
                            {
                                paddingBottom: height * 0.5,
                            },
                        ]}
                        keyboardShouldPersistTaps={'always'}>
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
                            style={[formStyles.formField, activeField === 'email' || email.length > 0 ? formStyles.active : formStyles.inactive]}
                            onFocus={() => setActiveField('email')}
                            onBlur={() => setActiveField(null)}
                            onChangeText={(value: string) => setEmail(value.substr(0, 128))}
                            onSubmitEditing={(): void => _sendPasswordReset()}
                            returnKeyType={'send'}
                            underlineColorAndroid={transparent}
                            value={email}
                        />
                        <SEButton
                            title={'REQUEST RESET'}
                            onPress={email.match(EMAIL_REGEX) ? (): void => _sendPasswordReset() : undefined}
                            style={[formStyles.formField, email.match(EMAIL_REGEX) ? {} : { opacity: 0.6 }]}
                            contentStyle={{ backgroundColor: theme.colors.accent }}
                        />
                    </ScrollView>
                )}
                {complete && (
                    <View style={[sharedStyles.paddingMedium, sharedStyles.centered, { flex: 1 }]}>
                        <MatIcon name={'check-circle'} size={theme.sizes.jumbo} color={theme.colors.onPrimary} style={{alignSelf: 'center'}} />
                        <H7 font={'regular'} color={'onPrimary'} style={[{ textAlign: 'center' }]}>
                            {'Your password reset request was received. Check your email for further instructions.'}
                        </H7>
                    </View>
                )}
            </KeyboardAvoidingView>
        </View>
    );
};
