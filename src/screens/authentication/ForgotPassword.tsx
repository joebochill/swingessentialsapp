import React, { useState, useCallback } from 'react';

// Components
import { Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Typography, SEButton, BackgroundImage, Stack } from '../../components';

// Styles
import { height } from '../../utilities/dimensions';
import { TextInput } from 'react-native-paper';
import MatIcon from 'react-native-vector-icons/MaterialIcons';

// Redux
import { requestPasswordReset } from '../../redux/actions';
import { useDispatch } from 'react-redux';

// Constants
import { EMAIL_REGEX } from '../../constants';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useAppTheme } from '../../theme';
import { Header } from '../../components/CollapsibleHeader/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLLAPSED_HEIGHT } from '../../components/CollapsibleHeader';

export const ForgotPassword: React.FC<StackScreenProps<RootStackParamList, 'ResetPassword'>> = (props) => {
    const { navigation } = props;
    const [email, setEmail] = useState('');
    const [complete, setComplete] = useState(false);
    const dispatch = useDispatch();
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();

    const sendPasswordReset = useCallback(() => {
        if (EMAIL_REGEX.test(email)) {
            // @ts-ignore
            dispatch(requestPasswordReset({ email }));
            setComplete(true);
        }
    }, [email, dispatch, setComplete]);

    return (
        <Stack style={{ flex: 1, backgroundColor: theme.colors.primary }}>
            <Header
                title={'Forgot Password'}
                subtitle={'Request a reset'}
                mainAction={'back'}
                showAuth={false}
                navigation={navigation}
                fixed
            />
            <BackgroundImage style={{ paddingTop: 0, backgroundColor: theme.colors.primary }}>
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
                            <Stack space={theme.spacing.md}>
                                <Typography variant={'bodyLarge'} color={'onPrimary'}>
                                    {
                                        'Enter the email address you used to register for your account below and we will send you instructions for resetting your password.'
                                    }
                                </Typography>
                                <TextInput
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
                                    dark
                                    buttonColor={theme.colors.secondary}
                                    title={'REQUEST RESET'}
                                    onPress={EMAIL_REGEX.test(email) ? (): void => sendPasswordReset() : undefined}
                                    style={[EMAIL_REGEX.test(email) ? {} : { opacity: 0.6 }]}
                                />
                            </Stack>
                        </ScrollView>
                    )}
                    {complete && (
                        <Stack align={'center'} justify={'center'} style={[{ flex: 1, padding: theme.spacing.md }]}>
                            <MatIcon name={'check-circle'} size={theme.size.xxl} color={theme.colors.onPrimary} />
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
