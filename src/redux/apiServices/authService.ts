import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_PREFIX, AUTH, BASE_API_URL } from '../../constants';
import { clearToken, incrementLoginFailures, UserRole } from '../slices/authSlice';
import { storeToken } from './utils/storeToken';
import { clearProtectedDetails, initializeData } from '../thunks';
import { prepareHeaders } from './utils/prepareHeaders';

export type Credentials = {
    username: string;
    password: string;
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
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { meta } = await queryFulfilled;
                    storeToken(meta, dispatch);
                    dispatch(initializeData());
                } catch (error) {
                    console.error('Login failed:', error);
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
                    console.error('Logout failed:', error);
                } finally {
                    dispatch(clearToken());
                    await AsyncStorage.removeItem(`${ASYNC_PREFIX}token`);
                    dispatch(clearProtectedDetails());
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
                    console.error('Refresh token failed:', error);
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
        verifyResetPasswordCode: builder.mutation<{ username: string; auth: string }, string>({
            query: (resetPasswordKey) => ({
                url: 'auth/password/reset/verify',
                method: 'POST',
                body: {
                    resetPasswordKey,
                },
                headers: new Headers(),
            }),
            transformErrorResponse: (response: { status: number; data: { code: number; error: string } }) => {
                const { code } = response.data;
                let message = '';

                switch (code) {
                    case 400300:
                        message =
                            'Oops! Your reset password link is invalid or may have already been used. Please check the link in your email and try again. If you continue to have problems, please contact us.';
                        break;
                    case 400301:
                        message = 'Your reset password link has expired. You will need to re-request a password reset.';
                        break;
                    case -1:
                    default:
                        message = `Unknown Error: ${code || ''}`;
                }
                return message;
            },
        }),

        resetPassword: builder.mutation<boolean, { password: string; token: string }>({
            query: ({ password, token }) => ({
                url: 'auth/password/reset',
                method: 'PATCH',
                headers: {
                    [AUTH]: `Bearer ${token}`,
                },
                body: {
                    password,
                },
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { meta } = await queryFulfilled;
                    storeToken(meta, dispatch);
                } catch (error) {
                    console.error('Reset Password failed:', error);
                }
            },
            transformErrorResponse: () => {
                return `Failed to change your password. Please try again later. If the problem persists, please contact us.`;
            },
        }),

        changePassword: builder.mutation<void, { oldPassword: string; newPassword: string }>({
            query: (credentials) => ({
                url: 'auth/password',
                method: 'PATCH',
                body: credentials,
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { meta } = await queryFulfilled;
                    storeToken(meta, dispatch);
                } catch (error) {
                    console.error('Change Password failed:', error);
                }
            },
        }),
    }),
});

export const {
    useLoginMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
    useGetRoleMutation,
    useSendResetPasswordEmailMutation,
    useVerifyResetPasswordCodeMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
} = authApi;
export default authApi;
