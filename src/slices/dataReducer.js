
import { createSlice } from "@reduxjs/toolkit";

const localTAndCAccepted = localStorage.getItem("tAndCAccepted");

const initialState = {
    factor: 0,
    country: null,
    firstLoad: false,
    coupon: null,
    tAndCAccepted:  localTAndCAccepted ? true : false
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
        setTAndCAccepted: (state, action) =>{
            state.tAndCAccepted = action.payload;
            localStorage.setItem("tAndCAccepted", true);
        }
    }
})

export const { setFactor, setCountry, setCoupon, setFirstLoad, setTAndCAccepted } = dataReducer.actions;
export default dataReducer.reducer;