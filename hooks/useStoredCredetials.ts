import { LOG } from '@/logger';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';

type StoredCredentials = {
    username: string | null;
    password: string | null;
};

export const useStoredCredentials = () => {
    const [storedCredentials, setStoredCredentials] = useState<StoredCredentials>({ username: null, password: null });

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

    const updatePassword = async (newPassword: string) => {
        try {
            await SecureStore.setItemAsync('auth.password', newPassword);
            setStoredCredentials((prev) => ({
                ...prev,
                password: newPassword,
            }));
        } catch (error) {
            LOG.error(`Failed to update stored password: ${error}`, {
                zone: 'AUTH',
            });
        }
    };
    const updateUsername = async (newUsername: string) => {
        try {
            await SecureStore.setItemAsync('auth.username', newUsername);
            setStoredCredentials((prev) => ({
                ...prev,
                username: newUsername,
            }));
        } catch (error) {
            LOG.error(`Failed to update stored username: ${error}`, {
                zone: 'AUTH',
            });
        }
    };

    const clearPassword = async () => {
        try {
            await SecureStore.deleteItemAsync('auth.password');
            setStoredCredentials((prev) => ({
                ...prev,
                password: null,
            }));
        } catch (error) {
            LOG.error(`Failed to clear stored password: ${error}`, {
                zone: 'AUTH',
            });
        }
    };

    const clearUsername = async () => {
        try {
            await SecureStore.deleteItemAsync('auth.username');
            setStoredCredentials((prev) => ({
                ...prev,
                username: null,
            }));
        } catch (error) {
            LOG.error(`Failed to clear stored username: ${error}`, {
                zone: 'AUTH',
            });
        }
    };

    return {
        credentials: storedCredentials,
        updatePassword,
        updateUsername,
        clearPassword,
        clearUsername,
    };
};
