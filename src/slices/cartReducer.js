import { createSlice } from "@reduxjs/toolkit";

const localCart = localStorage.getItem('cart');
const parsed = localCart ? JSON.parse(localCart) : null;

const initialState = {
    quantity: parsed?.quantity || 0,
    total: parsed?.total || 0,
    items: parsed?.items || [],
    emptyCartFlag: parsed?.emptyCartFlag !== undefined ? parsed.emptyCartFlag : false,
};

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
        removeItems: (state, action) => {
            state.items = state.items.filter(item => !action.payload.includes(item.id));
            state.quantity = state.items.length;
            state.total = state.items.reduce((acc, item) => {
                return acc + (item.price * (item.quantity || 1));
            }, 0);
        },
        clearCart: (state) => {
            state.quantity = 0;
            state.total = 0;
            state.items = [];
        },
        setEmptyCartFlag: (state, action) => {
            state.emptyCartFlag = action.payload;
        },
        toggleEmptyCartFlag: (state) => {
            state.emptyCartFlag = !state.emptyCartFlag;
        }
    }
});

export const { addItem, removeItem, removeItems, clearCart, setEmptyCartFlag, toggleEmptyCartFlag } = cartSlice.actions;
export default cartSlice.reducer;