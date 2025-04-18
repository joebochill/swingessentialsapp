import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type OrdersState = {
    activeOrderID: string | null;
};

const initialState: OrdersState = {
    activeOrderID: null,
};

export const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setActiveOrderID: (state, action: PayloadAction<string | null>) => {
            state.activeOrderID = action.payload;
        },
        clearActiveOrderID: (state) => {
            state.activeOrderID = null;
        },
    },
});

export const { setActiveOrderID, clearActiveOrderID } = ordersSlice.actions;

export default ordersSlice.reducer;
