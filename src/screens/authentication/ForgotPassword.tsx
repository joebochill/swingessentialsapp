import React, { useState, useCallback } from 'react';

// Components
import { View, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Icon, Input } from 'react-native-elements';
import { Body, H7, SEHeader, SEButton } from '../../components';

// Styles
import { spaces, sizes } from '../../styles/sizes';
import { transparent } from '../../styles/colors';
import { sharedStyles } from '../../styles';
import { height } from '../../utilities/dimensions';
import { useTheme } from '../../styles/theme';

// Redux
import { requestPasswordReset } from '../../redux/actions';
import { useDispatch } from 'react-redux';

// Constants
import { EMAIL_REGEX, HEADER_COLLAPSED_HEIGHT } from '../../constants';


export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [complete, setComplete] = useState(false);
    const dispatch = useDispatch();
    const theme = useTheme();

    const _sendPasswordReset = useCallback(() => {
        if (email.match(EMAIL_REGEX)) {
            dispatch(requestPasswordReset({ email }));
            setComplete(true);
        }
    }, [email, dispatch, setComplete]);

    return (
        <View style={sharedStyles.pageContainer}>
            <SEHeader 
                title={'Forgot Password'} 
                subtitle={'request a reset'} 
                mainAction={'back'}
                showAuth={false} 
            />
            <KeyboardAvoidingView
                style={[
                    sharedStyles.pageContainer,
                    {
                        paddingTop: HEADER_COLLAPSED_HEIGHT,
                    },
                ]}
                behavior={'padding'}
            >
                {!complete && (
                    <ScrollView
                        contentContainerStyle={[
                            sharedStyles.paddingMedium,
                            {
                                paddingBottom: height * 0.5,
                            },
                        ]}
                        keyboardShouldPersistTaps={'always'}>
                        <Body>
                            {
                                'Enter your email address below and we will send you instructions for resetting your password.'
                            }
                        </Body>
                        <Input
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            containerStyle={{ marginTop: spaces.medium, paddingHorizontal: 0 }}
                            inputContainerStyle={sharedStyles.inputContainer}
                            inputStyle={sharedStyles.input}
                            keyboardType={'email-address'}
                            label={'Email Address'}
                            labelStyle={[sharedStyles.formLabel]}
                            onChangeText={(value: string) => setEmail(value.substr(0, 128))}
                            onSubmitEditing={(): void => _sendPasswordReset()}
                            returnKeyType={'send'}
                            underlineColorAndroid={transparent}
                            value={email}
                        />
                        {email.match(EMAIL_REGEX) && (
                            <SEButton
                                containerStyle={{ marginTop: spaces.medium }}
                                buttonStyle={{ backgroundColor: theme.colors.primary[400] }}
                                title={<H7 style={{color: theme.colors.onPrimary[500]}}>REQUEST RESET</H7>}
                                onPress={(): void => _sendPasswordReset()}
                            />
                        )}
                    </ScrollView>
                )}
                {complete && (
                    <View style={[sharedStyles.paddingMedium, sharedStyles.centered, { flex: 1 }]}>
                        <Icon name={'check-circle'} size={sizes.jumbo} color={theme.colors.primary[400]} />
                        <H7 font={'regular'} style={{ textAlign: 'center' }}>
                            {'Your password reset request was received. Check your email for further instructions.'}
                        </H7>
                    </View>
                )}
            </KeyboardAvoidingView>
        </View>
    );
};
