// import { AppReducer } from '../redux/reducers';
// import { saveAuthToken } from '../api/tokenMiddleware';
// import { createStore, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk';
// export const store = createStore(AppReducer, applyMiddleware(thunk, saveAuthToken));

import { configureStore } from '@reduxjs/toolkit'
import lessonsReducer from './slices/lessonsSlice'
import { lessonsAPI } from '../api/services/lessonsService'
import { setupListeners } from '@reduxjs/toolkit/query'

export const store = configureStore({
    reducer: {
        lessons: lessonsReducer,
        // Add the generated reducer as a specific top-level slice
        [lessonsAPI.reducerPath]: lessonsAPI.reducer,
    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(lessonsAPI.middleware),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch