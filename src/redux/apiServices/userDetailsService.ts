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
export type Level2UserDetailsApiResponse = Level1UserDetailsApiResponse & {
    notify_new_lesson: 0 | 1;
    notify_marketing: 0 | 1;
    notify_newsletter: 0 | 1;
    notify_reminders: 0 | 1;
};
export type Level3UserDetailsApiResponse = Level2UserDetailsApiResponse & {
    handed: 'left' | 'right';
    camera_delay: number;
    camera_duration: number;
    camera_overlay: 0 | 1;
};

export const BLANK_USER: Level2UserDetailsApiResponse = {
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
        getUserDetails: builder.query<Level2UserDetailsApiResponse, void>({
            providesTags: ['userDetails'],
            query: () => ({
                url: `user`,
                method: 'GET',
                params: { detailLevel: 2 },
            }),
        }),
        getUserDetailsById: builder.query<Level1UserDetailsApiResponse, string>({
            providesTags: ['userDetails'],
            query: (id) => `user/${id}?detailLevel=1`,
        }),
        updateUserDetails: builder.mutation<boolean, Partial<Level2UserDetailsApiResponse>>({
            query: (body) => ({
                url: `user`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['userDetails'],
        }),
        searchUsers: builder.mutation<Omit<BasicUserDetailsApiResponse, 'avatar'>[], string>({
            query: (search) => `user/search?q=${search}`,
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetUserDetailsQuery,
    useUpdateUserDetailsMutation,
    useGetUserDetailsByIdQuery,
    useSearchUsersMutation,
} = userDetailsApi;
