import { creditsApi } from '@/redux/apiServices/creditsService';
import { lessonsApi } from '@/redux/apiServices/lessonsService';
import { Middleware } from '@reduxjs/toolkit';

// Listen for fulfilled addLessonRequest mutation and invalidate creditsApi tags
export const lessonsCreditsMiddleware: Middleware = (store) => (next) => (action) => {
    if (lessonsApi.endpoints.addLessonRequest.matchFulfilled(action)) {
        store.dispatch(creditsApi.util.invalidateTags(['credits']));
    }
    return next(action);
};
