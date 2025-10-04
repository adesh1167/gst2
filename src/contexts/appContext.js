import axios from "axios";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import React from 'react'
import { baseApiUrl } from "../data/url";
import { useDispatch } from "react-redux";
import { setDeepAnalyzerSubscription } from "../slices/subscriptionsReducer";

const AuthContext = createContext();

const AppContext = ({ children }) => {

    const [menuExpanded, setMenuExpanded] = useState(false);
    const [deepAnalyzerMatches, setDeepAnalyzerMatches] = useState({
        loaded: false,
        matches: [],
    });

    const dispatch = useDispatch();

    const fetchDeepAnalyzerMatches = useCallback(() => {
        axios({
            method: "GET",
            url: `${baseApiUrl}/get-matches.php`,
        }).then((res) => {
            console.log(res.data);
            setDeepAnalyzerMatches(prev => ({
                ...prev,
                loaded: true,
                matches: res.data.matches.map(match => ({
                    ...match,
                    ...JSON.parse(match.match_data),
                    match_data: null
                }))
            }));
        })
    }, []);

    const fetchDeepAnalyzerSubscription = useCallback(() => {
        axios({
            method: "GET",
            url: `${baseApiUrl}/get-deep-analyzer-subscription.php`,
        }).then((res) => {
            console.log(res.data);
            if(res.data.success) {
                dispatch(setDeepAnalyzerSubscription(res.data.data));
            } else{
                dispatch(setDeepAnalyzerSubscription({error: res.data.message}));
            }
        })
    }, []);

    const value = useMemo(() => ({
        menuExpanded, setMenuExpanded,
        deepAnalyzerMatches, setDeepAnalyzerMatches,
        fetchDeepAnalyzerMatches,
        fetchDeepAnalyzerSubscription
    }), [menuExpanded, deepAnalyzerMatches])

    console.log("DeepAnalyzerMatches: ", deepAnalyzerMatches)

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AppContext;

export const useApp = () => useContext(AuthContext);