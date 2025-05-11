import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL } from '../../_config';
import { prepareHeaders } from './utils/prepareHeaders';

export const connectivityApi = createApi({
    reducerPath: 'connectivityApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API_URL,
        prepareHeaders,
    }),
    endpoints: (builder) => ({
        ping: builder.query<void, void>({
            query: () => 'connectivity/ping',
        }),
    }),
});

export const { usePingQuery } = connectivityApi;
