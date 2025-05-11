import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL } from '../../_config';
import { prepareHeaders } from './utils/prepareHeaders';
import { storeToken } from './utils/storeToken';
import { LOG } from '../../logger';
import { getErrorMessage } from './utils/parseError';

export type UserRegistrationDetails = {
    username: string;
    email: string;
    password: string;
    acquisition: string;
};

const registrationApi = createApi({
    reducerPath: 'registrationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API_URL,
        prepareHeaders,
    }),
    endpoints: (builder) => ({
        checkUsernameAvailability: builder.mutation<boolean, string>({
            query: (username) => ({
                url: 'user/exists',
                method: 'POST',
                body: { username },
            }),
            transformResponse: (response: { usernameAvailable: boolean }): boolean => {
                return response.usernameAvailable;
            },
        }),
        checkEmailAvailability: builder.mutation<boolean, string>({
            query: (email) => ({
                url: '/user/exists',
                method: 'POST',
                body: { email },
            }),
            transformResponse: (response: { emailAvailable: boolean }): boolean => {
                return response.emailAvailable;
            },
        }),
        createNewUserAccount: builder.mutation<void, UserRegistrationDetails>({
            query: (details) => ({
                url: 'user/register',
                method: 'POST',
                body: details,
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { meta } = await queryFulfilled;
                    storeToken(meta, dispatch);
                } catch (error) {
                    LOG.error(`Registration failed: ${getErrorMessage(error)}`, { zone: 'REGI' });
                }
            },
        }),
        verifyUserEmail: builder.mutation<void, string>({
            query: (registrationKey) => ({
                url: 'user/register/verify-email',
                method: 'POST',
                body: {
                    registrationKey,
                },
            }),
            transformErrorResponse: (response: { status: number; data: { code: number; error: string } }): string => {
                const { code } = response.data;
                let message = '';
                switch (code) {
                    case 400302:
                        message =
                            'Oops! Your verification link is invalid. Please check your registration email and try again. If you continue to have problems, please contact us.';
                        break;
                    case 400303:
                        message = 'Your verification link has expired. You will need to re-register.';
                        break;
                    case 400304:
                    case -1:
                        message = 'Your your email address has already been verified. Sign in to view your account.';
                        break;
                    default:
                        message = `Unknown Error: ${code || ''}`;
                }
                return message;
            },
        }),
    }),
});

export const {
    useCheckUsernameAvailabilityMutation,
    useCheckEmailAvailabilityMutation,
    useCreateNewUserAccountMutation,
    useVerifyUserEmailMutation,
} = registrationApi;
export default registrationApi;
