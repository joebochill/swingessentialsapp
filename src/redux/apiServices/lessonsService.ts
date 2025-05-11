import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_PREFIX, AUTH, BASE_API_URL } from '../../_config';
import { prepareHeaders } from './utils/prepareHeaders';
import { store } from '../store';
import { creditsApi } from './creditsService';

export type LessonBasicDetails = {
    request_date: string;
    request_url: string;
    type: 'single' | 'in-person';
    username?: string;
    viewed: 0 | 1;
};
export type LessonsResponse = {
    totalResults: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    data: LessonBasicDetails[];
};
export type FullLessonDetails = LessonBasicDetails & {
    dtl_swing: string;
    fo_swing: string;
    request_id: number;
    response_status?: 'good' | 'rejected';
    request_notes: string;
    response_notes: string;
    response_video: string;
};
export type FullLessonDetailsResponse = {
    details: FullLessonDetails;
    page: number;
};

export const lessonsApi = createApi({
    reducerPath: 'lessonsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API_URL,
        prepareHeaders,
    }),
    tagTypes: ['lessons', 'pendingLessons', 'lessonDetails'],
    endpoints: (builder) => ({
        getCompletedLessons: builder.query<LessonsResponse, { page: number; users: string }>({
            query: ({ page, users }) => `lessons?page=${page}&pageSize=20${users ? `&users=${users}` : ''}`,
            providesTags: ['lessons'],
        }),
        getPendingLessons: builder.query<LessonsResponse, string | undefined>({
            query: (users) => `lessons/pending${users ? `?users=${users}` : ''}`,
            providesTags: ['lessons'],
        }),
        getLessonById: builder.query<FullLessonDetailsResponse, { id: string | number; users: string }>({
            query: ({ id, users }) => `lessons/${id}?pageSize=8${users ? `&users=${users}` : ''}`,
            providesTags: ['lessonDetails'],
        }),
        markLessonViewed: builder.mutation<void, string | number>({
            query: (id) => ({
                url: `lessons/${id}/viewed`,
                method: 'PATCH',
            }),
            invalidatesTags: ['lessons', 'lessonDetails'],
        }),
        addLessonRequest: builder.mutation<void, { data: FormData; progressCallback: (e: ProgressEvent) => void }>({
            queryFn: async (args) => {
                try {
                    const { data, progressCallback } = args;

                    const result = await new Promise<{ data: any }>((resolve, reject) => {
                        const xhr = new XMLHttpRequest();
                        xhr.open('POST', `${BASE_API_URL}/lessons/redeem`);

                        // Retrieve the token from AsyncStorage
                        AsyncStorage.getItem(`${ASYNC_PREFIX}token`).then((token) => {
                            if (token) {
                                xhr.setRequestHeader(AUTH, `Bearer ${token}`);
                            }

                            xhr.upload.onprogress = progressCallback;

                            xhr.onload = () => {
                                if (xhr.status >= 200 && xhr.status < 300) {
                                    resolve({ data: JSON.parse(xhr.responseText) });
                                } else {
                                    reject({
                                        status: xhr.status,
                                        statusText: xhr.statusText,
                                        response: JSON.parse(xhr.responseText),
                                    });
                                }
                            };

                            xhr.onerror = () => reject({ error: xhr.statusText });
                            xhr.send(data);
                        });
                    });

                    store.dispatch(creditsApi.util.invalidateTags(['credits']));

                    return { data: result.data };
                } catch (error: unknown) {
                    const err = error as { status: number; statusText: string; response: { message: string } };
                    return {
                        error: {
                            status: err.status,
                            data: { message: err.response.message || 'An unknown error occurred' },
                        },
                    };
                }
            },
            invalidatesTags: ['lessons'],
        }),
    }),
});

export const {
    useGetCompletedLessonsQuery,
    useGetPendingLessonsQuery,
    useGetLessonByIdQuery,
    useMarkLessonViewedMutation,
    useAddLessonRequestMutation,
} = lessonsApi;
