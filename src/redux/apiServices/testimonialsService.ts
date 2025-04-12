import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL } from '../../constants';
import { prepareHeaders } from './utils/prepareHeaders';
import { Testimonial } from '../../__types__';

type TestimonialsApiResponse = Testimonial[];

export const testimonialsApi = createApi({
    reducerPath: 'testimonials',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API_URL,
        prepareHeaders,
    }),
    endpoints: (builder) => ({
        getTestimonials: builder.query<TestimonialsApiResponse, void>({
            query: () => `testimonials?limit=5`,
        }),
    }),
});

export const { useGetTestimonialsQuery } = testimonialsApi;
