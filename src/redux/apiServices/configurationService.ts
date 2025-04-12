import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL } from '../../constants';
import { prepareHeaders } from './utils/prepareHeaders';

export type WelcomeVideo = {
    video: string;
    description: string;
};

export const configurationApi = createApi({
    reducerPath: 'configurationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API_URL,
        prepareHeaders,
    }),
    endpoints: (builder) => ({
        getWelcomeVideo: builder.query<WelcomeVideo, void>({
            query: () => `configuration/welcome-video`,
        }),
    }),
});

export const { useGetWelcomeVideoQuery } = configurationApi;
