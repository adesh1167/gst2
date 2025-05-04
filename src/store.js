import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userReducer";
import fixturesReducer from "./slices/fixturesReducer";
import cartReducer from "./slices/cartReducer";
import dataReducer from "./slices/dataReducer";
import myMatchesReducer from "./slices/myMatchesReducer";


const store = configureStore({
    reducer: {
        user: userReducer,
        fixtures: fixturesReducer,
        cart: cartReducer,
        data: dataReducer,
        myMatches: myMatchesReducer
    }
})

export default store;