import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userDetailsApi } from '../apiServices/userDetailsService';
import { ASYNC_PREFIX } from '../../constants';
import { initialize, setToken } from '../slices/authSlice';
import { tipsApi } from '../apiServices/tipsService';
import { lessonsApi } from '../apiServices/lessonsService';
import { blogsApi } from '../apiServices/blogsService';
import { creditsApi } from '../apiServices/creditsService';
import { packagesApi } from '../apiServices/packagesService';

export const loadUserData = createAsyncThunk('auth/loadUserData', async (_, { dispatch }) => {
    try {
        dispatch(userDetailsApi.util.invalidateTags(['userDetails']));
        dispatch(lessonsApi.endpoints.getCompletedLessons.initiate({ page: 1, users: '' }));
        dispatch(creditsApi.endpoints.getCredits.initiate());
    } catch (error) {
        console.error('Error loading data after login:', error);
    }
});

export const initializeData = createAsyncThunk('app/initializeData', async (_, { dispatch }) => {
    try {
        const token = await AsyncStorage.getItem(`${ASYNC_PREFIX}token`);

        // If the user is still logged in when the application loads
        if (token) {
            dispatch(setToken(token));
            dispatch(loadUserData());
        }
        dispatch(initialize());
        dispatch(tipsApi.util.invalidateTags(['tips', 'tip']));
        dispatch(tipsApi.endpoints.getTips.initiate());
        dispatch(blogsApi.util.invalidateTags(['blogs', 'blog']));
        dispatch(blogsApi.endpoints.getBlogs.initiate());
    } catch (error) {
        console.error('Error loading user data:', error);
    }
});

export const clearProtectedDetails = createAsyncThunk('app/clearProtectedDetails', async (_, { dispatch }) => {
    try {
        dispatch(userDetailsApi.util.resetApiState());
        dispatch(lessonsApi.util.resetApiState());
        dispatch(tipsApi.util.resetApiState());
        dispatch(blogsApi.util.resetApiState());
        dispatch(creditsApi.util.resetApiState());
        dispatch(packagesApi.util.resetApiState());
    } catch (error) {
        console.error('Error clearing protected details:', error);
    }
});
