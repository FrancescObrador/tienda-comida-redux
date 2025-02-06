import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { MenuItem } from '../entities/entities';
import { addOrder } from '../services/MenuData';
import logger from "../utilities/Logger";

export interface OrderState {
    orders: MenuItem[];
    status: 'idle' | 'loading' | 'failed';
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    status: 'idle',
    error: null
};

export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (item: MenuItem) => {
        let payload = {...item, id: Math.random()};
        await addOrder(payload);
        return item;
    }
);

const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.status = 'idle';
                logger.info("createOrder fulfilled")
                state.orders.push(action.payload);
            })
            .addCase(createOrder.rejected, (state) => {
                state.status = 'failed';
                state.error = 'Error al crear el pedido';
            });
    }
});

export default orderSlice.reducer;