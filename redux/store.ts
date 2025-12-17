import { authApi } from '@/redux/apiServices/authService';
import { blogsApi } from '@/redux/apiServices/blogsService';
import { configurationApi } from '@/redux/apiServices/configurationService';
import { connectivityApi } from '@/redux/apiServices/connectivityService';
import { creditsApi } from '@/redux/apiServices/creditsService';
import { faqApi } from '@/redux/apiServices/faqService';
import { lessonsApi } from '@/redux/apiServices/lessonsService';
import { logsApi } from '@/redux/apiServices/logsService';
import { packagesApi } from '@/redux/apiServices/packagesService';
import { prosApi } from '@/redux/apiServices/prosService';
import { registrationApi } from '@/redux/apiServices/registrationService';
import { testimonialsApi } from '@/redux/apiServices/testimonialsService';
import { tipsApi } from '@/redux/apiServices/tipsService';
import { userDetailsApi } from '@/redux/apiServices/userDetailsService';
import { lessonsCreditsMiddleware } from '@/redux/middleware/lessonsCreditsMiddleware';
import authReducer from '@/redux/slices/authSlice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        [blogsApi.reducerPath]: blogsApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [userDetailsApi.reducerPath]: userDetailsApi.reducer,
        [testimonialsApi.reducerPath]: testimonialsApi.reducer,
        [prosApi.reducerPath]: prosApi.reducer,
        [registrationApi.reducerPath]: registrationApi.reducer,
        [tipsApi.reducerPath]: tipsApi.reducer,
        [lessonsApi.reducerPath]: lessonsApi.reducer,
        [packagesApi.reducerPath]: packagesApi.reducer,
        [creditsApi.reducerPath]: creditsApi.reducer,
        [configurationApi.reducerPath]: configurationApi.reducer,
        [connectivityApi.reducerPath]: connectivityApi.reducer,
        [logsApi.reducerPath]: logsApi.reducer,
        [faqApi.reducerPath]: faqApi.reducer,

        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['logsApi/executeMutation/fulfilled'],
            },
        }).concat(
            blogsApi.middleware,
            authApi.middleware,
            userDetailsApi.middleware,
            testimonialsApi.middleware,
            prosApi.middleware,
            registrationApi.middleware,
            tipsApi.middleware,
            lessonsApi.middleware,
            packagesApi.middleware,
            creditsApi.middleware,
            configurationApi.middleware,
            connectivityApi.middleware,
            logsApi.middleware,
            faqApi.middleware,
            lessonsCreditsMiddleware
        ),
});

// setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
