import { createAsyncThunk } from "@reduxjs/toolkit"
import * as ACTIONS from './types';
import { HttpRequest } from "../../api/http";
import axios from 'axios';

export const loadLessons = createAsyncThunk(
    'lessons/load',
    async (_arg, { rejectWithValue }) => {
        console.log('fetching lessons');
        const lessons = await axios.get(
            'https://www.swingessentials.com/apis/swingessentials.php/lessons',
            {
                headers: { 'Content-Type': 'application/json', Message: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzd2luZ2Vzc2VudGlhbHMiLCJpYXQiOjE3MDYzODU0NzIsImV4cCI6MTcwNjM4NzI3MiwiYXVkIjoid3d3LnN3aW5nZXNzZW50aWFscy5jb20iLCJzdWIiOiJqb2Vib2NoaWxsIiwicm9sZSI6ImFkbWluaXN0cmF0b3IifQ==.ZGZiOTZlMjQ4ZWI4MTU5M2Q2YzUzYzJkYjQzNGI5OWQ4ZmE5M2QzMWU0YTllZDE0MWQ1NmQyMGZmNjM0ODcxMw==` },
            }
        );
        return lessons.data;
    }
)

// const loadLessons = createAsyncThunk(
//     'lessons/load',
//     async (_arg, { rejectWithValue }) => {
//         void HttpRequest.get(ACTIONS.GET_LESSONS.API)
//         .onSuccess((body: any) => {
//             // dispatch(success(ACTIONS.GET_LESSONS.SUCCESS, body));
//             return body;
//         })
//         .onFailure((response: Response) => {
//             rejectWithValue(response.data)
//             // dispatch(failure(ACTIONS.GET_LESSONS.FAILURE, response, 'LoadLessons'));
//         })
//         .request();
//     //     try {
//     //     const response = await userAPI.updateById(id, fields)
//     //     return response.data.user
//     //   } catch (err) {
//     //     // Use `err.response.data` as `action.payload` for a `rejected` action,
//     //     // by explicitly returning it using the `rejectWithValue()` utility
//     //     return rejectWithValue(err.response.data)
//     //   }
//     }
//   )