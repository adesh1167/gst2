
import { createSlice } from "@reduxjs/toolkit";

const localTAndCAccepted = localStorage.getItem("tAndCAccepted");

const initialState = {
    factor: 0,
    continent: null,
    country: null,
    currency: null,
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
        setContinent: (state, action) => {
            state.continent = action.payload;
        },
        setCountry: (state, action) => {
            state.country = action.payload;
        },
        setCurrency: (state, action) => {
            state.currency = action.payload;
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

export const { setFactor, setCountry, setCurrency, setContinent, setCoupon, setFirstLoad, setTAndCAccepted } = dataReducer.actions;
export default dataReducer.reducer;