import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import userReducer from "./slices/userReducer";
import fixturesReducer from "./slices/fixturesReducer";
import cartReducer from "./slices/cartReducer";
import dataReducer from "./slices/dataReducer";
import myMatchesReducer from "./slices/myMatchesReducer";
import toastsReducer from "./slices/toastsReducer";
import subscriptionsReducer from "./slices/subscriptionsReducer";

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  predicate: (action, currentState, previousState) => {
    return currentState.cart !== previousState.cart;
  },
  effect: (action, listenerApi) => {
    const cart = listenerApi.getState().cart;
    localStorage.setItem('cart', JSON.stringify(cart));
  },
});


const store = configureStore({
    reducer: {
        user: userReducer,
        fixtures: fixturesReducer,
        cart: cartReducer,
        data: dataReducer,
        myMatches: myMatchesReducer,
        toasts: toastsReducer,
        subscriptions: subscriptionsReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware)
})

export default store;