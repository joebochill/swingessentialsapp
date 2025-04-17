import { configureStore } from '@reduxjs/toolkit';
import { blogsApi } from './apiServices/blogsService';
import authApi from './apiServices/authService';
import authReducer from './slices/authSlice';
import { userDetailsApi } from './apiServices/userDetailsService';
import { testimonialsApi } from './apiServices/testimonialsService';
import { prosApi } from './apiServices/prosService';
import registrationApi from './apiServices/registrationService';
import { tipsApi } from './apiServices/tipsService';
import { lessonsApi } from './apiServices/lessonsService';
import { packagesApi } from './apiServices/packagesService';
import { creditsApi } from './apiServices/creditsService';
import { configurationApi } from './apiServices/configurationService';
import { logsApi } from './apiServices/logsService';
import { faqApi } from './apiServices/faqService';

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
        [logsApi.reducerPath]: logsApi.reducer,
        [faqApi.reducerPath]: faqApi.reducer,

        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [`logsApi/executeMutation/fulfilled`],
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
            logsApi.middleware,
            faqApi.middleware
        ),
});

// setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
