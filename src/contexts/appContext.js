import { createContext, useContext, useEffect, useMemo, useState } from "react";

import React from 'react'

const AuthContext = createContext();

const AppContext = ({children}) => {

    const [menuExpanded, setMenuExpanded] = useState(false);

    const value = useMemo(() => ({
        menuExpanded, setMenuExpanded
    }), [menuExpanded])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AppContext;

export const useApp = () => useContext(AuthContext);