import { createContext, useContext, useEffect, useState } from "react";

import React from 'react'

const AuthContext = createContext();

const AppContext = () => {

    const [cart, setCart] = useState([]);
    const [currency, setCurrency] = useState("GHS");

    return (
        <AuthContext.Provider value={{
            cart, setCart
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AppContext;

export const useApp = () => useContext(AuthContext);