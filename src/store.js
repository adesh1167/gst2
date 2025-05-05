import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userReducer";
import fixturesReducer from "./slices/fixturesReducer";
import cartReducer from "./slices/cartReducer";
import dataReducer from "./slices/dataReducer";
import myMatchesReducer from "./slices/myMatchesReducer";
import toastsReducer from "./slices/toastsReducer";


const store = configureStore({
    reducer: {
        user: userReducer,
        fixtures: fixturesReducer,
        cart: cartReducer,
        data: dataReducer,
        myMatches: myMatchesReducer,
        toasts: toastsReducer
    }
})

export default store;