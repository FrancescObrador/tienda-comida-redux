import { configureStore } from "@reduxjs/toolkit";
import orderReducer from './features/orderSlice'
import loggerMiddleware from "./middlewares/loggerMiddleware";

const store = configureStore({
    reducer: {
        order: orderReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;