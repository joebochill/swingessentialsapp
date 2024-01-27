// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Lesson } from '../../__types__'

// Define a service using a base URL and expected endpoints
export const lessonsAPI = createApi({
    reducerPath: 'lessonsAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://www.swingessentials.com/apis/swingessentials.php/',
        prepareHeaders: (headers) => {
            headers.set('Message', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzd2luZ2Vzc2VudGlhbHMiLCJpYXQiOjE3MDYzOTIxMTIsImV4cCI6MTcwNzYwMTcxMiwiYXVkIjoid3d3LnN3aW5nZXNzZW50aWFscy5jb20iLCJzdWIiOiJKQm9pIiwicm9sZSI6ImN1c3RvbWVyIn0=.YTYwMWZkNzM1YmM2NGY5ZTc1ZDA2M2ZmYjUyNTc1ZWM5ZGVlOTAzNGU4YTAzMTQ1NzI0ODIxNmIzYjVkMmVmZA==`)
            return headers
        },
    }),
    endpoints: (builder) => ({
        getLessons: builder.query<{ pending: Lesson[], closed: Lesson[] }, void>({
            query: () => `lessons/`,

        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetLessonsQuery } = lessonsAPI;