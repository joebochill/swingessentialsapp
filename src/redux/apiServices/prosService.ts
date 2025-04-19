import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL } from '../../_config';
import { prepareHeaders } from './utils/prepareHeaders';

export type ProBio = {
    id: string;
    name: string;
    title: string;
    bio: string;
    image: string;
    imagePosition?: string;
    imageSize?: string;
};

export const prosApi = createApi({
    reducerPath: 'prosApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API_URL,
        prepareHeaders,
    }),
    tagTypes: ['pros'],
    endpoints: (builder) => ({
        getPros: builder.query<ProBio[], void>({
            query: () => 'pros',
            providesTags: ['pros'],
        }),
    }),
});

export const { useGetProsQuery } = prosApi;
