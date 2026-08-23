import axios from "axios";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import React from 'react'
import { baseApiUrl } from "../data/url";
import { useDispatch, useSelector } from "react-redux";
import { setDeepAnalyzerSubscription } from "../slices/subscriptionsReducer";
import { useLocation } from "react-router";
import { setNewPaths } from "../slices/dataReducer";

const VERSION = "3.0.0";

const AuthContext = createContext();

const AppContext = ({ children }) => {

    const [menuExpanded, setMenuExpanded] = useState(false);

    // skip ref: when a nav action inside the menu triggers a route change that
    // would normally close the mobile menu, skip=true tells the close effect to
    // stand down for one tick (e.g. admin dashboard switch)
    const menuSkip = useRef(false);

    const closeMenu = useCallback(() => {
        setMenuExpanded(false);
    }, []);

    const skipNextClose = useCallback(() => {
        menuSkip.current = true;
    }, []);
    const [deepAnalyzerMatches, setDeepAnalyzerMatches] = useState({
        loaded: false,
        matches: [],
    });
    const {pathname} = useLocation();
    const {firstLoad, version, newPaths} = useSelector(state => state.data)

    // ── Dark Mode ──────────────────────────────────────────────────────────────
    const getInitialDarkMode = () => {
        try {
            const stored = localStorage.getItem('darkMode');
            if (stored !== null) return JSON.parse(stored);
        } catch (_) {}
        return false; // default: dark
    };

    const [darkMode, setDarkModeState] = useState(getInitialDarkMode);

    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        try {
            localStorage.setItem('darkMode', JSON.stringify(darkMode));
        } catch (_) {}
    }, [darkMode]);

    const toggleDarkMode = useCallback(({status}) => { //status = light/dark
        if(status){
            setDarkModeState(status === "light" ? false : true)
        } else{
            setDarkModeState(prev => !prev);
        }
    }, []);
    // ──────────────────────────────────────────────────────────────────────────

    const [deepAnalyzerUpcoming, setDeepAnalyzerUpcoming] = useState({
        pageSize: 20,
        pages: 0,
        page: 1,
        loaded: false,
        matches: {},
        allLoaded: false
    });

    const [deepAnalyzerTab, setDeepAnalyzerTab] = useState('highlights');

    const dispatch = useDispatch();

    useEffect(()=>{
        if(firstLoad){
            let shouldUpdate = false;
            newPaths.forEach(path => {
                if(pathname.startsWith(path)){
                    const localNewPaths = localStorage.getItem("newPaths");
                    let filteredLocalNewPaths;
                    if(localNewPaths){
                        const parsedLocalNewPaths = JSON.parse(localNewPaths);
                        filteredLocalNewPaths = parsedLocalNewPaths.filter(p => p !== path);
                    } else {
                        filteredLocalNewPaths = [];
                    }

                    filteredLocalNewPaths.push(path);
                    localStorage.setItem("newPaths", JSON.stringify(filteredLocalNewPaths));

                    shouldUpdate = true;
                }
            })

            if(shouldUpdate){
                dispatch(setNewPaths());
            }
        }
    }, [pathname, firstLoad])

    useEffect(()=>{
        if(firstLoad){
            if(VERSION < version){
                window.location.reload();
            }
        }
    }, [firstLoad, version])

    const fetchDeepAnalyzerMatches = useCallback(() => {
        axios({
            method: "GET",
            url: `${baseApiUrl}/get-matches.php`,
        }).then((res) => {
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

    const fetchDeepAnalyzerUpcoming = useCallback((newPage) => {
        if(deepAnalyzerUpcoming.allLoaded) return;
        const pageSize = deepAnalyzerUpcoming.pageSize || 4;
        const page = newPage ?? (deepAnalyzerUpcoming.page || 1);

        if(deepAnalyzerUpcoming.matches[page]) return;
        axios({
            method: "GET",
            url: `${baseApiUrl}/get-matches-by-page.php?page=${page}&pageSize=${pageSize}`,
        }).then((res) => {
            const allLoaded = res.data.matches.length < pageSize;
            if(res.data.matches.length === 0) {
                setDeepAnalyzerUpcoming(prev => ({
                    ...prev,
                    page: page - 1,
                    loaded: true,
                    allLoaded: true
                }))
                return;
            }

            setDeepAnalyzerUpcoming(prev => ({
                ...prev,
                loaded: true,
                pages: Math.max(page, deepAnalyzerUpcoming.pages),
                matches: {
                    ...prev.matches,
                    [page]: res.data.matches.map(match => ({
                        ...match,
                        ...JSON.parse(match.match_data),
                        match_data: null
                    }))
                },
                allLoaded
            }));
        })
    }, [deepAnalyzerUpcoming]);

    const fetchDeepAnalyzerSubscription = useCallback(() => {
        axios({
            method: "GET",
            url: `${baseApiUrl}/get-deep-analyzer-subscription.php`,
        }).then((res) => {
            if (res.data.status === "success") {
                dispatch(setDeepAnalyzerSubscription(res.data.data));
            } else {
                dispatch(setDeepAnalyzerSubscription({ error: res.data.message }));
            }
        })
    }, []);

    const searchMatches = useCallback(async (query) => {
        return axios({
            method: "GET",
            url: `${baseApiUrl}/search-matches.php?query=${query}`,
        }).then((res) => {
            if(res.data.status === "success"){
                return res.data.matches.map(match => ({
                    ...match,
                    ...JSON.parse(match.match_data),
                    match_data: null
                }))
            } else {
                return [];
            }
        }).catch(err => {
            return [];
        })
    }, []);

    const value = useMemo(() => ({
        menuExpanded, setMenuExpanded,
        closeMenu, skipNextClose, menuSkip,
        darkMode, toggleDarkMode,
        deepAnalyzerMatches, setDeepAnalyzerMatches,
        deepAnalyzerUpcoming, setDeepAnalyzerUpcoming,
        deepAnalyzerTab, setDeepAnalyzerTab,
        fetchDeepAnalyzerMatches,
        fetchDeepAnalyzerUpcoming,
        fetchDeepAnalyzerSubscription,
        searchMatches,
    }), [menuExpanded, darkMode, closeMenu, skipNextClose, deepAnalyzerMatches, deepAnalyzerUpcoming, deepAnalyzerTab])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AppContext;

export const useApp = () => useContext(AuthContext);
