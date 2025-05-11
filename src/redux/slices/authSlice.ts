import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'administrator' | 'anonymous' | 'customer' | 'pending';

type AuthState = {
    initialized: boolean;
    token: string | null;
    admin: boolean;
    role: UserRole;
    loginFailures: number;
};

const initialState: AuthState = {
    initialized: false,
    token: null,
    admin: false,
    role: 'anonymous',
    loginFailures: 0,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string | null>) => {
            state.token = action.payload;
            let role: UserRole = 'anonymous';
            if (action.payload) {
                role = JSON.parse(atob(action.payload.split('.')[1])).role;
            }
            state.role = role;
            state.admin = role === 'administrator';
            state.loginFailures = 0;
        },
        clearToken: (state) => {
            state.token = null;
            state.admin = false;
            state.role = 'anonymous';
            state.loginFailures = 0;
        },
        incrementLoginFailures: (state) => {
            state.loginFailures += 1;
        },
        resetLoginFailures: (state) => {
            state.loginFailures = 0;
        },
        initialize: (state) => {
            state.initialized = true;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setToken, clearToken, incrementLoginFailures, resetLoginFailures, initialize } = authSlice.actions;

export default authSlice.reducer;
