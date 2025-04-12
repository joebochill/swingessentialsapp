import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL } from '../../constants';
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
            query: () => `tips`,
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
        addTip: builder.mutation<void, Omit<TipDetails, 'id'>>({
            query: (newTip) => ({
                url: `tips`,
                method: 'POST',
                body: newTip,
            }),
            invalidatesTags: ['tips'],
        }),
        updateTip: builder.mutation<void, TipDetails>({
            query: (updatedTip) => ({
                url: `tips/${updatedTip.id}`,
                method: 'PATCH',
                body: updatedTip,
            }),
            invalidatesTags: ['tips', 'tip'],
        }),
        removeTip: builder.mutation<void, { id: string | number }>({
            query: (deletedTip) => ({
                url: `tips/${deletedTip.id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['tips', 'tip'],
        }),
    }),
});

export const { useGetTipsQuery, useGetTipByIdQuery, useAddTipMutation, useUpdateTipMutation, useRemoveTipMutation } =
    tipsApi;
