import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL } from '../../constants';
import { prepareHeaders } from './utils/prepareHeaders';

export const logsApi = createApi({
    reducerPath: 'logsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API_URL,
        prepareHeaders,
        responseHandler: (response) => {
            if (response.status === 200) {
                return response.blob();
            } else {
                throw new Error('Failed to fetch logs');
            }
        },
    }),
    endpoints: (builder) => ({
        getLogs: builder.mutation<{ url: string }, void>({
            query: () => `logs`,
            transformResponse: (blob: Blob) => {
                const url = window.URL.createObjectURL(blob); // Convert Blob to object URL
                return { url }; // Return a serializable objecct
            },
        }),
    }),
});

export const { useGetLogsMutation } = logsApi;
