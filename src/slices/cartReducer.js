import { createSlice } from "@reduxjs/toolkit";

const localCart = localStorage.getItem('cart');

const initialState = localCart ? JSON.parse(localCart) : {
    quantity: 0,
    total: 0,
    items: [],
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            if (state.items.find(item => item.id === action.payload.id)) {
                state.items.map(item => {
                    if (item.id === action.payload.id) {
                        if (item.quantity) {
                            // item.quantity += 1;
                        } else {
                            // item.quantity = 2;
                        }
                    }
                    return item;
                });
            } else {
                state.items.push(action.payload);
            }
            state.quantity = state.items.length;
            state.total = state.items.reduce((acc, item) => {
                return acc + (item.price * (item.quantity || 1));
            }, 0);
        },
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            state.quantity = state.items.length;
            state.total = state.items.reduce((acc, item) => {
                return acc + (item.price * (item.quantity || 1));
            }, 0);
        },
        clearCart: (state) => {
            return {
                quantity: 0,
                total: 0,       
                items: [],
            }
        }
    }
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;