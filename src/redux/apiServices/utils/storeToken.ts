import { FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import { ASYNC_PREFIX } from '../../../constants';
import { setToken } from '../../slices/authSlice';
import { loadUserData } from '../../thunks';
import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (
    meta: FetchBaseQueryMeta | undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    shouldLoadUserData: boolean = true
) => {
    const token = meta?.response?.headers.get('Token') ?? '';
    if (token) {
        try {
            await AsyncStorage.setItem(`${ASYNC_PREFIX}token`, token);
            dispatch(setToken(token));
            if (shouldLoadUserData) dispatch(loadUserData());
        } catch (error) {
            console.error('Error storing token in AsyncStorage:', error);
        }
    }
};
