import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_PREFIX, AUTH, BASE_API_URL } from '../../_config';
import { clearToken, incrementLoginFailures, UserRole } from '../slices/authSlice';
import { storeToken } from './utils/storeToken';
import { clearProtectedDetails, initializeData } from '../thunks';
import { prepareHeaders } from './utils/prepareHeaders';
import * as Keychain from 'react-native-keychain';
import { LOG } from '../../logger';
import { getErrorMessage } from './utils/parseError';

export type Credentials = {
    username: string;
    password: string;
    remember?: boolean;
    useBiometry?: boolean;
};

const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API_URL,
        prepareHeaders,
    }),
    endpoints: (builder) => ({
        login: builder.mutation<void, Credentials>({
            query: (credentials) => ({
                url: 'auth/login',
                method: 'POST',
                headers: {
                    [AUTH]: `Basic ${btoa(credentials.username)}.${btoa(credentials.password)}`,
                },
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { meta } = await queryFulfilled;
                    storeToken(meta, dispatch);
                    if (arg.useBiometry) {
                        Keychain.setGenericPassword(arg.username, arg.password);
                    } else {
                        Keychain.resetGenericPassword();
                    }
                    if (arg.remember) {
                        AsyncStorage.setItem(`${ASYNC_PREFIX}lastUser`, arg.username || '');
                    }
                    dispatch(initializeData());
                } catch (error) {
                    LOG.error(`Login failed: ${getErrorMessage(error)}`, { zone: 'AUTH' });

                    Keychain.resetGenericPassword();
                    dispatch(incrementLoginFailures());
                }
            },
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: 'auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (error) {
                    LOG.error(`Logout failed: ${getErrorMessage(error)}`, { zone: 'AUTH' });
                } finally {
                    dispatch(clearProtectedDetails());
                    await AsyncStorage.removeItem(`${ASYNC_PREFIX}token`);
                    dispatch(clearToken());
                }
            },
        }),
        getRole: builder.mutation<UserRole, void>({
            query: () => ({
                url: 'auth/role',
                method: 'GET',
            }),
            transformResponse: (response: { role: UserRole }) => {
                return response.role;
            },
        }),
        refreshToken: builder.mutation<void, void>({
            query: () => ({
                url: 'auth/refresh-token',
                method: 'POST',
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { meta } = await queryFulfilled;
                    storeToken(meta, dispatch, false);
                } catch (error) {
                    LOG.error(`Refreshing token failed: ${getErrorMessage(error)}`, { zone: 'AUTH' });
                }
            },
        }),
        sendResetPasswordEmail: builder.mutation<void, string>({
            query: (email) => ({
                url: 'auth/password/reset',
                method: 'POST',
                body: { email },
                headers: new Headers(),
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
    useGetRoleMutation,
    useSendResetPasswordEmailMutation,
} = authApi;
export default authApi;
