import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    toasts: []
}

const toastsSlice = createSlice({
    name: 'toasts',
    initialState,
    reducers: {
        showToast: (state, action) => {
            state.toasts.push({...action.payload, id: Date.now()+Math.random() })
        },
        removeToast: (state, action) => {
            state.toasts = state.toasts.filter(toast => toast.id !== action.payload)
        }
    }

})

export const  {showToast, removeToast} = toastsSlice.actions;
export default toastsSlice.reducer;