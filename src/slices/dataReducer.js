
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    factor: 0,
    country: null,
    firstLoad: false,
    coupon: null,
}

const dataReducer = createSlice({
    name: "data",
    initialState,
    reducers: {
        setFactor: (state, action) => {
            state.factor = action.payload;
        },
        setCountry: (state, action) => {
            state.country = action.payload;
        },
        setCoupon: (state, action) =>{
            state.coupon = action.payload;
        },
        setFirstLoad: (state, action) =>{
            state.firstLoad = action.payload;
        },
    }
})

export const { setFactor, setCountry, setCoupon, setFirstLoad } = dataReducer.actions;
export default dataReducer.reducer;