
import { createSlice } from "@reduxjs/toolkit";

const localTAndCAccepted = localStorage.getItem("tAndCAccepted");

const initialState = {
    factor: 0,
    continent: null,
    country: null,
    currency: null,
    firstLoad: false,
    coupon: null,
    tAndCAccepted: localTAndCAccepted ? true : false,
    newPaths: [],
    version: null,
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
        setCoupon: (state, action) => {
            state.coupon = action.payload;
        },
        setFirstLoad: (state, action) => {
            state.firstLoad = action.payload;
        },
        setTAndCAccepted: (state, action) => {
            state.tAndCAccepted = action.payload;
            localStorage.setItem("tAndCAccepted", true);
        },
        setNewPaths: (state, action) => {
            const serverNewPaths = action.payload ?? state.newPaths;
            const localNewPaths = localStorage.getItem("newPaths");
            let parsedNewPaths = null;
            if (localNewPaths && serverNewPaths.length > 0) {
                parsedNewPaths = JSON.parse(localNewPaths);
                const setB = new Set(parsedNewPaths);
                const difference = serverNewPaths.filter(item => !setB.has(item));
                state.newPaths = difference;
            } else if(!localNewPaths && serverNewPaths?.length > 0 ){
                state.newPaths = serverNewPaths;
            }else if(!serverNewPaths?.length > 0){
                state.newPaths = [];
            } else{
                state.newPaths = [];
            }
        },
        setVersion: (state, action) => {
            state.version = action.payload;
        }
    }
})

export const { setFactor, setCountry, setCurrency, setContinent, setCoupon, setFirstLoad, setTAndCAccepted, setNewPaths, setVersion } = dataReducer.actions;
export default dataReducer.reducer;