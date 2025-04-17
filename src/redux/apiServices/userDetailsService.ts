import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL } from '../../constants';
import { prepareHeaders } from './utils/prepareHeaders';

export type ScoreRange = '60' | '70' | '80' | '90' | '100' | '150';

export type BasicUserDetailsApiResponse = {
    username: string;
    first: string;
    last: string;
    email: string;
    avatar: string;
};
export type Level1UserDetailsApiResponse = BasicUserDetailsApiResponse & {
    location: string;
    phone: string;
    goals: string;
    birthday: string;
    average: ScoreRange;
    joined: number;
};
export type UserNotificationSettings = {
    notify_new_lesson: 0 | 1;
    notify_marketing: 0 | 1;
    notify_newsletter: 0 | 1;
    notify_reminders: 0 | 1;
};
export type Level2UserDetailsApiResponse = Level1UserDetailsApiResponse & UserNotificationSettings;
export type UserAppSettings = {
    handed: 'left' | 'right';
    camera_delay: number;
    camera_duration: number;
    camera_overlay: 0 | 1;
};
export type Level3UserDetailsApiResponse = Level2UserDetailsApiResponse & UserAppSettings;

export const BLANK_USER: Level3UserDetailsApiResponse = {
    username: '',
    first: '',
    last: '',
    email: '',
    avatar: '',
    location: '',
    phone: '',
    goals: '',
    birthday: '',
    average: '150',
    joined: 0,
    notify_new_lesson: 0,
    notify_marketing: 0,
    notify_newsletter: 0,
    notify_reminders: 0,
    handed: 'right',
    camera_delay: 8,
    camera_duration: 10,
    camera_overlay: 1,
};

// Define a service using a base URL and expected endpoints
export const userDetailsApi = createApi({
    reducerPath: 'userDetailsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API_URL,
        prepareHeaders,
    }),
    tagTypes: ['userDetails'],
    endpoints: (builder) => ({
        getUserDetails: builder.query<Level3UserDetailsApiResponse, void>({
            providesTags: ['userDetails'],
            query: () => ({
                url: `user`,
                method: 'GET',
                params: { detailLevel: 3 },
            }),
        }),
        updateUserDetails: builder.mutation<boolean, Partial<Level3UserDetailsApiResponse>>({
            query: (body) => ({
                url: `user`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['userDetails'],
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetUserDetailsQuery, useUpdateUserDetailsMutation } = userDetailsApi;
