import { BASE_API_URL } from '@/_config';
import { prepareHeaders } from '@/redux/apiServices/utils/prepareHeaders';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const creditsApi = createApi({
    reducerPath: 'creditsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API_URL,
        prepareHeaders,
    }),
    tagTypes: ['credits'],
    endpoints: (builder) => ({
        getCredits: builder.query<{ count: number }, void>({
            query: () => 'credits',
            providesTags: ['credits'],
        }),
    }),
});

export const { useGetCreditsQuery } = creditsApi;
