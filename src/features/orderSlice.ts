import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { MenuItem, Order } from '../entities/entities';
import { addOrder, getOrders, updateOrder, deleteOrder, removeAllOrders } from '../services/MenuData';
import logger from "../utilities/Logger";

export interface OrderState {
    orders: Order[];
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
        const orderId = await addOrder(item);
        return { id: orderId, items: [item] } as Order;
    }
);

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async () => {
        return await getOrders();
    }
);

export const updateOrderThunk = createAsyncThunk(
    'orders/updateOrder',
    async ({orderId, order}: {orderId: string, order: Order}) => {
        await updateOrder(orderId, order);
        return { orderId, order };
    }
);

export const deleteOrderThunk = createAsyncThunk(
    'orders/deleteOrder',
    async (orderId: string) => {
        await deleteOrder(orderId);
        return orderId;
    }
);

export const deleteAllOrders = createAsyncThunk(
    'orders/deleteAllOrders',
    async () => {
        await removeAllOrders();
        return true;
    }
);


const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Create Order
            .addCase(createOrder.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.status = 'idle';
                state.orders.push(action.payload);
                logger.info("createOrder fulfilled");
            })
            .addCase(createOrder.rejected, (state) => {
                state.status = 'failed';
                state.error = 'Error al crear el pedido';
            })
            // Fetch Orders
            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading';
                console.log("fetching")
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = 'idle';
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state) => {
                state.status = 'failed';
                state.error = 'Error al obtener los pedidos';
            })
            // Update Order
            .addCase(updateOrderThunk.fulfilled, (state, action) => {
                const index = state.orders.findIndex(order => order.id === action.payload.orderId);
                if (index !== -1) {
                    state.orders[index] = action.payload.order;
                }
            })
            // Delete Order
            .addCase(deleteOrderThunk.fulfilled, (state, action) => {
                state.orders = state.orders.filter(order => order.id !== action.payload);
            })
            .addCase(deleteAllOrders.fulfilled, (state) => {
                state.orders = [];
            });
    }
});

export default orderSlice.reducer;