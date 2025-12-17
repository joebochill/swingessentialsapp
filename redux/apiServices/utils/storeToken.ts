import { ASYNC_PREFIX } from '@/_config';
import { LOG } from '@/logger';
import { setToken } from '@/redux/slices/authSlice';
import { loadUserData } from '@/redux/thunks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { FetchBaseQueryMeta } from '@reduxjs/toolkit/query';

export const storeToken = async (
    meta: FetchBaseQueryMeta | undefined,

    dispatch: ThunkDispatch<any, any, UnknownAction>,
    shouldLoadUserData: boolean = true
) => {
    const token = meta?.response?.headers.get('Token') ?? '';
    if (token) {
        try {
            await AsyncStorage.setItem(`${ASYNC_PREFIX}token`, token);
            dispatch(setToken(token));
            if (shouldLoadUserData) {
                dispatch(loadUserData());
            }
        } catch (error) {
            LOG.error(`Error storing token in AsyncStorage: ${error}`, { zone: 'AUTH' });
        }
    }
};
