import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL } from '../../constants';
import { prepareHeaders } from './utils/prepareHeaders';

export const creditsApi = createApi({
    reducerPath: 'creditsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API_URL,
        prepareHeaders,
    }),
    tagTypes: ['credits'],
    endpoints: (builder) => ({
        getCredits: builder.query<{ count: number }, void>({
            query: () => `credits`,
            providesTags: ['credits'],
        }),
    }),
});

export const { useGetCreditsQuery } = creditsApi;
