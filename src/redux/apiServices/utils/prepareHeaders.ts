import { ASYNC_PREFIX, AUTH } from '../../../_config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOG } from '../../../logger';

export const prepareHeaders = async (headers: Headers) => {
    try {
        const token = await AsyncStorage.getItem(`${ASYNC_PREFIX}token`);
        if (token) {
            headers.set(AUTH, `Bearer ${token}`);
        }
    } catch (error) {
        LOG.error(`Error retrieving token from AsyncStorage: ${error}`, { zone: 'AUTH' });
    }
    return headers;
};
