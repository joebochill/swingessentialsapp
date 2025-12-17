import { LOG } from '@/logger';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

type StoredCredentials = {
    username: string | null;
    password: string | null;
};

type BiometricTypes = {
    fingerprint: boolean;
    faceID: boolean;
    iris: boolean;
};

const canUseBiometrics = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return compatible && enrolled;
};

const getBiometricTypes = async (): Promise<BiometricTypes> => {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

    return {
        fingerprint: types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT),
        faceID: types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION),
        iris: types.includes(LocalAuthentication.AuthenticationType.IRIS),
    };
};

const getBiometricLabel = (types: BiometricTypes): string => {
    let label = 'biometrics';
    if (Platform.OS === 'ios') {
        if (types.faceID) {
            label = 'FaceID';
        } else if (types.fingerprint) {
            label = 'TouchID';
        }
    } else if (Platform.OS === 'android') {
        if (types.fingerprint && !types.faceID && !types.iris) {
            label = 'Fingerprint';
        } else if (!types.fingerprint && types.faceID && !types.iris) {
            label = 'Face ID';
        } else if (!types.fingerprint && !types.faceID && types.iris) {
            label = 'Iris';
        }
    }
    return label;
};

export const useBiometricLogin = () => {
    const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
    const [storedCredentials, setStoredCredentials] = useState<StoredCredentials>({ username: null, password: null });
    const [biometricTypes, setBiometricTypes] = useState<BiometricTypes>({
        fingerprint: false,
        faceID: false,
        iris: false,
    });

    // Fetch the stored credentials and store them if they exist
    useEffect(() => {
        const fetchStoredCredentials = async () => {
            try {
                const username = await SecureStore.getItemAsync('auth.username');
                const password = await SecureStore.getItemAsync('auth.password');
                setStoredCredentials({ username, password });
            } catch (error) {
                LOG.error(`Failed to retrieve stored credentials: ${error}`, {
                    zone: 'AUTH',
                });
            }
        };
        fetchStoredCredentials();
    }, []);

    // Check for biometric availability and types
    useEffect(() => {
        const fetchBiometricAvailability = async () => {
            try {
                const canUse = await canUseBiometrics();
                setIsBiometricAvailable(canUse);
                if (canUse) {
                    const types = await getBiometricTypes();
                    setBiometricTypes(types);
                }
            } catch (error) {
                LOG.error(`Failed to check biometric capabilities: ${error}`, {
                    zone: 'AUTH',
                });
            }
        };
        fetchBiometricAvailability();
    }, []);

    const showBiometricPrompt = async (): Promise<boolean> => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Secure Sign In',
                fallbackLabel: 'Use Password',
            });
            return result.success;
        } catch (error) {
            LOG.error(`Biometric authentication failed: ${error}`, {
                zone: 'AUTH',
            });
            return false;
        }
    };

    return {
        isBiometricAvailable,
        types: biometricTypes,
        showBiometricPrompt,
        biometricLabel: getBiometricLabel(biometricTypes),
    };
};
