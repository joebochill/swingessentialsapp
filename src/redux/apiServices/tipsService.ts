import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL } from '../../_config';
import { prepareHeaders } from './utils/prepareHeaders';

export type TipDetails = {
    id: number;
    date: string;
    title: string;
    video: string;
    comments: string;
};
export type TipDetailsWithYear = TipDetails & {
    year: number;
};

export const tipsApi = createApi({
    reducerPath: 'tipsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API_URL,
        prepareHeaders,
    }),
    tagTypes: ['tips', 'tip'],
    endpoints: (builder) => ({
        getTips: builder.query<TipDetailsWithYear[], void>({
            query: () => 'tips?detailLevel=1',
            providesTags: ['tips'],
            transformResponse: (response: TipDetails[]) => {
                return response.map((tip) => {
                    return {
                        ...tip,
                        year: new Date(tip.date).getFullYear(),
                    };
                });
            },
        }),
        getTipById: builder.query<TipDetails, string | number>({
            query: (id) => `tips/${id}`,
            providesTags: ['tip'],
        }),
    }),
});

export const { useGetTipsQuery, useGetTipByIdQuery } = tipsApi;
