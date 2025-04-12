import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL } from '../../constants';
import { prepareHeaders } from './utils/prepareHeaders';
import { creditsApi } from './creditsService';

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
export type Discount = {
    type: 'amount' | 'percent';
    value: string;
    code: string;
};
export type FullDiscount = {
    id: number;
    code: string;
    description: string;
    type: 'percent' | 'amount';
    value: string;
    expires: number;
    quantity: number;
};
export const packagesApi = createApi({
    reducerPath: 'packagesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API_URL,
        prepareHeaders,
    }),
    tagTypes: ['packages', 'discounts'],
    endpoints: (builder) => ({
        getPackages: builder.query<Level0PackageDetails[], void>({
            query: () => `packages`,
            providesTags: ['packages'],
        }),
        getDiscounts: builder.query<FullDiscount[], void>({
            query: () => `packages/discounts`,
            providesTags: ['discounts'],
        }),
        getDiscount: builder.mutation<Discount, string>({
            query: (code) => `packages/discounts/${code}`,
        }),
        addDiscount: builder.mutation<void, Omit<FullDiscount, 'id'>>({
            query: (newDiscount) => ({
                url: `packages/discounts`,
                method: 'POST',
                body: newDiscount,
            }),
            invalidatesTags: ['discounts'],
        }),
        updateDiscount: builder.mutation<void, FullDiscount>({
            query: (updatedDiscount) => ({
                url: `packages/discounts/${updatedDiscount.id}`,
                method: 'PATCH',
                body: updatedDiscount,
            }),
            invalidatesTags: ['discounts'],
        }),
        removeDiscount: builder.mutation<void, { id: string | number }>({
            query: (deletedDiscount) => ({
                url: `packages/discounts/${deletedDiscount.id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['discounts'],
        }),
        addPackage: builder.mutation<void, Omit<Level1PackageDetails, 'id'>>({
            query: (newPackage) => ({
                url: `packages`,
                method: 'POST',
                body: newPackage,
            }),
            invalidatesTags: ['packages'],
        }),
        updatePackage: builder.mutation<void, Level1PackageDetails>({
            query: (updatedPackage) => ({
                url: `packages/${updatedPackage.id}`,
                method: 'PATCH',
                body: updatedPackage,
            }),
            invalidatesTags: ['packages'],
        }),
        removePackage: builder.mutation<void, { id: string | number }>({
            query: (deletedPackage) => ({
                url: `packages/${deletedPackage.id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['packages'],
        }),
        createPayPalOrder: builder.mutation<{ id: string }, { packageId: number; coupon: string; total: number }>({
            query: (body) => ({
                url: `packages/order`,
                method: 'POST',
                body: body,
            }),
        }),
        capturePayPalOrder: builder.mutation<
            void,
            { orderId: string; packageId: number; coupon?: string; total: number }
        >({
            query: (body) => ({
                url: `packages/order/${body.orderId}/capture`,
                method: 'POST',
                body,
            }),
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    dispatch(creditsApi.util.invalidateTags(['credits']));
                } catch (error) {
                    console.error('Error capturing PayPal order:', error);
                }
            },
        }),
        captureFreeOrder: builder.mutation<void, { packageId: number; coupon?: string; total: number }>({
            query: (body) => ({
                url: `packages/order/capture-free`,
                method: 'POST',
                body,
            }),
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    dispatch(creditsApi.util.invalidateTags(['credits']));
                } catch (error) {
                    console.error('Error capturing free order:', error);
                }
            },
        }),
    }),
});

export const {
    useGetPackagesQuery,
    useAddPackageMutation,
    useUpdatePackageMutation,
    useRemovePackageMutation,
    useGetDiscountMutation,
    useGetDiscountsQuery,
    useCreatePayPalOrderMutation,
    useCapturePayPalOrderMutation,
    useCaptureFreeOrderMutation,
    useAddDiscountMutation,
    useUpdateDiscountMutation,
    useRemoveDiscountMutation,
} = packagesApi;
