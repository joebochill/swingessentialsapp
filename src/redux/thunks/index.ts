import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userDetailsApi } from '../apiServices/userDetailsService';
import { ASYNC_PREFIX } from '../../_config';
import { initialize, setToken } from '../slices/authSlice';
import { tipsApi } from '../apiServices/tipsService';
import { lessonsApi } from '../apiServices/lessonsService';
import { blogsApi } from '../apiServices/blogsService';
import { creditsApi } from '../apiServices/creditsService';
import { packagesApi } from '../apiServices/packagesService';
import { LOG } from '../../logger';

export const loadUserData = createAsyncThunk('auth/loadUserData', async (_, { dispatch }) => {
    try {
        dispatch(userDetailsApi.util.invalidateTags(['userDetails']));
        dispatch(lessonsApi.util.invalidateTags(['lessons']));
        dispatch(lessonsApi.endpoints.getCompletedLessons.initiate({ page: 1, users: '' }));
        dispatch(creditsApi.util.invalidateTags(['credits']));
        dispatch(creditsApi.endpoints.getCredits.initiate());
    } catch (error) {
        LOG.error(`Error loading user details: ${error}`, { zone: 'AUTH' });
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
        dispatch(packagesApi.util.invalidateTags(['packages']));
        dispatch(packagesApi.endpoints.getPackages.initiate());
    } catch (error) {
        LOG.error(`Error initializing data: ${error}`, { zone: 'AUTH' });
    }
});

export const clearProtectedDetails = createAsyncThunk('app/clearProtectedDetails', async (_, { dispatch }) => {
    try {
        dispatch(userDetailsApi.util.resetApiState());
        dispatch(lessonsApi.util.resetApiState());
        dispatch(tipsApi.util.resetApiState());
        dispatch(blogsApi.util.resetApiState());
        dispatch(creditsApi.util.resetApiState());
    } catch (error) {
        LOG.error(`Error clearing protected details: ${error}`, { zone: 'AUTH' });
    }
});
