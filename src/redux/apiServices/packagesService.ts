import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL } from '../../_config';
import { prepareHeaders } from './utils/prepareHeaders';
import { creditsApi } from './creditsService';
import { Platform } from 'react-native';
import { LOG } from '../../logger';
import { getErrorMessage } from './utils/parseError';

export type Level0PackageDetails = {
    id: number;
    name: number;
    description: string;
    shortcode: string;
    count: string;
    price: string;
};
export type Level1PackageDetails = Level0PackageDetails & {
    app_sku: string;
};

export const packagesApi = createApi({
    reducerPath: 'packagesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API_URL,
        prepareHeaders,
    }),
    tagTypes: ['packages'],
    endpoints: (builder) => ({
        getPackages: builder.query<Level1PackageDetails[], void>({
            query: () => 'packages?detailLevel=1',
            providesTags: ['packages'],
        }),
        captureMobileOrder: builder.mutation<void, { orderId: string; packageId: number }>({
            query: (body) => ({
                url: `packages/order/${body.orderId}/capture-mobile`,
                method: 'POST',
                body: {
                    ...body,
                    platform: Platform.OS,
                },
            }),
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    dispatch(creditsApi.util.invalidateTags(['credits']));
                } catch (error) {
                    LOG.error(`Error capturing order: ${getErrorMessage(error)}`, { zone: 'ORDR' });
                }
            },
        }),
    }),
});

export const { useGetPackagesQuery, useCaptureMobileOrderMutation } = packagesApi;
export const selectCaptureMobileOrderState = (requestId: string) =>
    packagesApi.endpoints.captureMobileOrder.select(requestId);
