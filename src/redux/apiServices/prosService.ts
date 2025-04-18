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
type ProBiosAPIResponse = ProBio[];

export const prosApi = createApi({
    reducerPath: 'prosApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API_URL,
        prepareHeaders,
    }),
    tagTypes: ['pros'],
    endpoints: (builder) => ({
        getPros: builder.query<ProBiosAPIResponse, void>({
            query: () => 'pros',
            providesTags: ['pros'],
        }),
        addPro: builder.mutation<void, Omit<ProBio, 'id'>>({
            query: (newProBio) => ({
                url: 'pros',
                method: 'POST',
                body: newProBio,
            }),
            invalidatesTags: ['pros'],
        }),
        updatePro: builder.mutation<void, ProBio>({
            query: (updatedProBio) => ({
                url: `pros/${updatedProBio.id}`,
                method: 'PATCH',
                body: updatedProBio,
            }),
            invalidatesTags: ['pros'],
        }),
        removePro: builder.mutation<void, { id: string }>({
            query: (deletedBio) => ({
                url: `pros/${deletedBio.id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['pros'],
        }),
    }),
});

export const { useGetProsQuery, useAddProMutation, useUpdateProMutation, useRemoveProMutation } = prosApi;
