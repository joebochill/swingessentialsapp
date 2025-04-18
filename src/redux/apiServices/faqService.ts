import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL } from '../../_config';
import { prepareHeaders } from './utils/prepareHeaders';

type FAQ = {
    id: number;
    question: string;
    platform_specific: 0 | 1;
    answer: string;
    answer_android: string;
    answer_ios: string;
    video?: string;
};
type FAQApiResponse = FAQ[];

export const faqApi = createApi({
    reducerPath: 'faqs',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API_URL,
        prepareHeaders,
    }),
    endpoints: (builder) => ({
        getFAQs: builder.query<FAQApiResponse, void>({
            query: () => 'faqs',
        }),
    }),
});

export const { useGetFAQsQuery } = faqApi;
