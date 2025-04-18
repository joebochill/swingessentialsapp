import React, { useState, useCallback } from 'react';
import { Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { height } from '../../../utilities/dimensions';
import { EMAIL_REGEX } from '../../../_config';
import { StackScreenProps } from '@react-navigation/stack';
import { useAppTheme } from '../../../theme';
import { Header } from '../../layout/CollapsibleHeader/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLLAPSED_HEIGHT } from '../../layout/CollapsibleHeader';
import { useNavigation } from '@react-navigation/core';
import { RootStackParamList } from '../../../navigation/MainNavigation';
import { Stack } from '../../layout/Stack';
import { BackgroundImage } from '../../common/BackgroundImage';
import { Typography } from '../../typography';
import { SEButton } from '../../common/SEButton';
import { StyledTextInput } from '../../inputs/StyledTextInput';
import { useSendResetPasswordEmailMutation } from '../../../redux/apiServices/authService';
import { Icon } from '../../common/Icon';

export const ForgotPassword: React.FC = () => {
    const navigation = useNavigation<StackScreenProps<RootStackParamList>>();
    const [email, setEmail] = useState('');
    const [complete, setComplete] = useState(false);
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();
    const [sendResetPasswordEmail] = useSendResetPasswordEmailMutation();

    const sendPasswordReset = useCallback(() => {
        if (EMAIL_REGEX.test(email)) {
            sendResetPasswordEmail(email);
            setComplete(true);
        }
    }, [email, setComplete, sendResetPasswordEmail]);

    return (
        <Stack style={{ flex: 1 }}>
            <Header
                title={'Forgot Password'}
                subtitle={'Request a reset'}
                mainAction={'back'}
                showAuth={false}
                navigation={navigation}
                backgroundColor={theme.dark ? theme.colors.surface : undefined}
                fixed
            />
            <BackgroundImage style={{ paddingTop: 0 }}>
                <KeyboardAvoidingView
                    style={[
                        {
                            flex: 1,
                            paddingTop: COLLAPSED_HEIGHT + insets.top,
                        },
                    ]}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    {!complete && (
                        <ScrollView
                            contentContainerStyle={[
                                {
                                    padding: theme.spacing.md,
                                    paddingBottom: height * 0.5,
                                },
                            ]}
                            keyboardShouldPersistTaps={'always'}
                        >
                            <Stack gap={theme.spacing.md}>
                                <Typography variant={'bodyLarge'} color={'onPrimary'}>
                                    {
                                        'Enter the email address you used to register for your account below and we will send you instructions for resetting your password.'
                                    }
                                </Typography>
                                <StyledTextInput
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    keyboardType={'email-address'}
                                    label={'Email Address'}
                                    onChangeText={(value: string): void => setEmail(value.substr(0, 128))}
                                    onSubmitEditing={(): void => sendPasswordReset()}
                                    returnKeyType={'send'}
                                    underlineColorAndroid={'transparent'}
                                    value={email}
                                />
                                <SEButton
                                    buttonColor={theme.dark ? undefined : theme.colors.secondary}
                                    title={'REQUEST RESET'}
                                    onPress={EMAIL_REGEX.test(email) ? (): void => sendPasswordReset() : undefined}
                                    style={[EMAIL_REGEX.test(email) ? {} : { opacity: 0.6, borderWidth: 0 }]}
                                />
                            </Stack>
                        </ScrollView>
                    )}
                    {complete && (
                        <Stack align={'center'} justify={'center'} style={[{ flex: 1, padding: theme.spacing.md }]}>
                            <Icon name={'check-circle'} size={theme.size.xxl} color={theme.colors.onPrimary} />
                            <Typography variant={'bodyLarge'} color={'onPrimary'} align={'center'}>
                                {'Your password reset request was received. Check your email for further instructions.'}
                            </Typography>
                        </Stack>
                    )}
                </KeyboardAvoidingView>
            </BackgroundImage>
        </Stack>
    );
};
