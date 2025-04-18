import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL } from '../../_config';
import { prepareHeaders } from './utils/prepareHeaders';

export type BlogDetails = {
    id: number;
    date: string;
    title: string;
    body: string;
};
export type BlogDetailsWithYear = BlogDetails & {
    year: number;
};

export const blogsApi = createApi({
    reducerPath: 'blogsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API_URL,
        prepareHeaders,
    }),
    tagTypes: ['blogs', 'blog'],
    endpoints: (builder) => ({
        getBlogs: builder.query<BlogDetailsWithYear[], void>({
            query: () => 'blogs',
            providesTags: ['blogs'],
            transformResponse: (response: BlogDetails[]) => {
                return response.map((blog) => {
                    return {
                        ...blog,
                        year: new Date(blog.date).getFullYear(),
                    };
                });
            },
        }),
        getBlogById: builder.query<BlogDetails, string | number>({
            query: (id) => `blogs/${id}`,
            providesTags: ['blog'],
        }),
        addBlog: builder.mutation<void, Omit<BlogDetails, 'id'>>({
            query: (newBlog) => ({
                url: 'blogs',
                method: 'POST',
                body: newBlog,
            }),
            invalidatesTags: ['blogs'],
        }),
        updateBlog: builder.mutation<void, BlogDetails>({
            query: (updatedBlog) => ({
                url: `blogs/${updatedBlog.id}`,
                method: 'PATCH',
                body: updatedBlog,
            }),
            invalidatesTags: ['blogs', 'blog'],
        }),
        removeBlog: builder.mutation<void, { id: string | number }>({
            query: (deletedBlog) => ({
                url: `blogs/${deletedBlog.id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['blogs', 'blog'],
        }),
    }),
});

export const {
    useGetBlogsQuery,
    useGetBlogByIdQuery,
    useAddBlogMutation,
    useUpdateBlogMutation,
    useRemoveBlogMutation,
} = blogsApi;
