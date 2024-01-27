import { createSlice } from '@reduxjs/toolkit'
import type { AsyncThunk, PayloadAction, UnknownAction } from '@reduxjs/toolkit'
import { Lesson, LessonsState } from '../../__types__';
import { LOGOUT, TOKEN_TIMEOUT } from '../actions/types';
import { loadLessons } from '../actions/lessons';

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

// type PendingAction = ReturnType<GenericAsyncThunk['pending']>
// type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

function isResetAction(action: UnknownAction): action is FulfilledAction {
    return typeof action.type === 'string' && [LOGOUT.SUCCESS, LOGOUT.FAILURE, TOKEN_TIMEOUT].includes(action.type);
}

const initialState: LessonsState = {
    loading: false,
    pending: [],
    closed: [],
    redeemPending: false,
    redeemSuccess: false,
    redeemError: null,
};

export const lessonsSlice = createSlice({
    name: 'lessons',
    initialState,
    reducers: {
        submitLessonRequest: (state) => {
            state.redeemPending = true;
            state.redeemSuccess = false;
            state.redeemError = null;
        },
        submitLessonSuccess: (state) => {
            state.redeemPending = false;
            state.redeemSuccess = true;
            state.redeemError = null;
        },
        submitLessonFailure: (state, action: PayloadAction<{ error: string }>) => {
            state.redeemPending = false;
            state.redeemSuccess = false;
            state.redeemError = parseInt(action.payload.error, 10);
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(loadLessons.pending, (state) => {
            console.log('fetch lessons pending');
            state.loading = true;
        })
        .addCase(loadLessons.fulfilled, (state, action: PayloadAction<{ pending: Lesson[], closed: Lesson[] }>) => {
            console.log('fetch lessons success');
            state.loading = false;
            state.pending = action.payload.pending;
            state.closed = action.payload.closed;
        })
        .addCase(loadLessons.rejected, (state, action) => {
            console.log('fetch lessons failed');
            console.log(action.error)
            state.loading = false;
        })
        .addMatcher(isResetAction, (state) => {
            console.log('resetting lessons');
            state.loading = false;
            state.pending = [];
            state.closed = [];
        })
        
    }

})
// export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default lessonsSlice.reducer;