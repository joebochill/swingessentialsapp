import { ASYNC_PREFIX, AUTH } from '../../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const prepareHeaders = async (headers: Headers) => {
    try {
        const token = await AsyncStorage.getItem(`${ASYNC_PREFIX}token`);
        if (token) {
            headers.set(AUTH, `Bearer ${token}`);
        }
    } catch (error) {
        console.error('Error retrieving token from AsyncStorage:', error);
    }
    return headers;
};
