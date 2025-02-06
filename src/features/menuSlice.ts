import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { MenuItem } from '../entities/entities';
import { addMenuItem, getMenu, addOrder } from '../services/MenuData';

export interface MenuState {
    menu: MenuItem[];
    status: 'idle' | 'loading' | 'failed';
    error: string | null;
}

const initialState: MenuState = {
    menu: [
        {
            id: 1,
            name: "Hamburguesa de Pollo",
            quantity: 40,
            desc: "Hamburguesa de pollo frito - ... y mayonesa",
            price: 24,
            image: "pollo.jpeg"
        },
        {
            id: 2,
            name: "Hamburguesa de vaca", 
            quantity: 20,
            desc: "Hamburguesa de vaca - ... y ketsup",
            price: 24,
            image: "pollo.jpeg"
        }
    ],
    status: 'idle',
    error: null
}

// Thunks
export const fetchMenu = createAsyncThunk(
    'menu/fetchMenu',
    async () => {
        const response = await getMenu();
        console.log(response as MenuItem[])
        return response;
    }
);

export const addNewMenuItem = createAsyncThunk(
    'menu/addMenuItem',
    async (item: MenuItem) => {
        await addMenuItem(item);
        return item;
    }
);


export const addNewOrder = createAsyncThunk(
    'menu/addOrder', 
    async (item: MenuItem) => {
        await addOrder(item);
        return item;
    }
);

const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        updateMenuItem: (state, action) => {
            const index = state.menu.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.menu[index] = action.payload;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMenu.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMenu.fulfilled, (state, action) => {
                state.status = 'idle';
                console.log(action.payload)
                //state.menu = action.payload;
            })
            .addCase(fetchMenu.rejected, (state) => {
                state.status = 'failed';
                state.error = 'Error al cargar el menú';
            })
            .addCase(addNewMenuItem.fulfilled, (state, action) => {
                state.menu.push(action.payload);
            })
            .addCase(addNewOrder.fulfilled, (state, action) => {
                const index = state.menu.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.menu[index].quantity -= 1; 
                }
            });
    }
});

export const { updateMenuItem } = menuSlice.actions;
export default menuSlice.reducer;