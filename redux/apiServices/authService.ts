import { ASYNC_PREFIX, AUTH, BASE_API_URL } from '@/_config';
import { LOG } from '@/logger';
import { getErrorMessage } from '@/redux/apiServices/utils/parseError';
import { prepareHeaders } from '@/redux/apiServices/utils/prepareHeaders';
import { storeToken } from '@/redux/apiServices/utils/storeToken';
import { clearToken, incrementLoginFailures, UserRole } from '@/redux/slices/authSlice';
import { clearProtectedDetails, initializeData } from '@/redux/thunks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as SecureStore from 'expo-secure-store';

export type Credentials = {
    username: string;
    password: string;
    remember?: boolean;
    useBiometry?: boolean;
};

export const authApi = createApi({
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
                        await SecureStore.setItemAsync('auth.username', arg.username);
                        await SecureStore.setItemAsync('auth.password', arg.password);
                    } else if (arg.remember) {
                        await SecureStore.setItemAsync('auth.username', arg.username);
                        await SecureStore.deleteItemAsync('auth.password');
                    } else {
                        await SecureStore.deleteItemAsync('auth.username');
                        await SecureStore.deleteItemAsync('auth.password');
                    }
                    dispatch(initializeData());
                } catch (error) {
                    LOG.error(`Login failed: ${getErrorMessage(error)}`, {
                        zone: 'AUTH',
                    });

                    await SecureStore.deleteItemAsync('auth.username');
                    await SecureStore.deleteItemAsync('auth.password');
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
                    LOG.error(`Logout failed: ${getErrorMessage(error)}`, {
                        zone: 'AUTH',
                    });
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
                    LOG.error(`Refreshing token failed: ${getErrorMessage(error)}`, {
                        zone: 'AUTH',
                    });
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
