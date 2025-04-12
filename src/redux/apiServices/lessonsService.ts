import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_PREFIX, AUTH, BASE_API_URL } from '../../constants';
import { prepareHeaders } from './utils/prepareHeaders';

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

export type LessonResponse = {
    lesson_id: number;
    response_video: string;
    response_notes: string;
    response_status: 'good' | 'rejected' | '';
};

export type InPersonLesson = {
    request_date: string;
    response_video: string;
    response_notes: string;
    response_status: 'good' | 'rejected' | '';
    username: string;
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
            query: ({ page, users }) => `lessons?page=${page}&pageSize=8${users ? `&users=${users}` : ''}`,
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
        addLessonResponse: builder.mutation<void, LessonResponse>({
            query: (newLesson) => ({
                url: `lessons/${newLesson.lesson_id}/respond`,
                method: 'POST',
                body: newLesson,
            }),
            invalidatesTags: ['lessons', 'lessonDetails'],
        }),
        addInPersonLesson: builder.mutation<void, InPersonLesson>({
            query: (newLesson) => ({
                url: `lessons/in-person`,
                method: 'POST',
                body: newLesson,
            }),
            invalidatesTags: ['lessons'],
        }),
        updateLessonResponse: builder.mutation<void, LessonResponse>({
            query: (updatedLesson) => ({
                url: `lessons/${updatedLesson.lesson_id}`,
                method: 'PUT',
                body: updatedLesson,
            }),
            invalidatesTags: ['lessons', 'lessonDetails'],
        }),
        addLessonRequest: builder.mutation<void, { data: FormData; progressCallback: (e: ProgressEvent) => void }>({
            queryFn: async (args) => {
                const { data, progressCallback } = args;

                return new Promise(async (resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', `${BASE_API_URL}/lessons/redeem`);

                    // Retrieve the token from AsyncStorage
                    const token = await AsyncStorage.getItem(`${ASYNC_PREFIX}token`);
                    if (token) {
                        xhr.setRequestHeader(AUTH, `Bearer ${token}`);
                    }

                    xhr.upload.onprogress = progressCallback;

                    xhr.onload = () => {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            resolve({ data: JSON.parse(xhr.responseText) });
                        } else {
                            reject({ error: xhr.statusText });
                        }
                    };

                    xhr.onerror = () => reject({ error: xhr.statusText });
                    xhr.send(data);
                });
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
    useAddInPersonLessonMutation,
    useAddLessonResponseMutation,
    useUpdateLessonResponseMutation,
    useAddLessonRequestMutation,
} = lessonsApi;
