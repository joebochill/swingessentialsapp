import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL } from '../../constants';
import { prepareHeaders } from './utils/prepareHeaders';
import { Platform } from 'react-native';

export const logsApi = createApi({
    reducerPath: 'logsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API_URL,
        prepareHeaders,
    }),
    endpoints: (builder) => ({
        sendMobileLogs: builder.mutation<void, { data: string }>({
            query: (args) => ({
                url: `logs/send-mobile`,
                method: 'POST',
                body: {
                    data: args.data,
                    platform: Platform.OS,
                },
            }),
        }),
    }),
});

export const { useSendMobileLogsMutation } = logsApi;
