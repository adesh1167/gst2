import axios from "axios";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import React from 'react'
import { baseApiUrl } from "../data/url";
import { useDispatch, useSelector } from "react-redux";
import { setDeepAnalyzerSubscription } from "../slices/subscriptionsReducer";
import { useLocation } from "react-router";
import { setNewPaths } from "../slices/dataReducer";

const AuthContext = createContext();

const AppContext = ({ children }) => {

    const [menuExpanded, setMenuExpanded] = useState(false);
    const [deepAnalyzerMatches, setDeepAnalyzerMatches] = useState({
        loaded: false,
        matches: [],
    });
    const {pathname} = useLocation();
    const {firstLoad, version, newPaths} = useSelector(state => state.data)

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
            const localVersion = localStorage.getItem('version');
            if(localVersion){
                const parsedLocalVersion = JSON.parse(localVersion);
                if(parsedLocalVersion != version){
                    localStorage.setItem('version', JSON.stringify(version));
                    window.location.reload();
                }
            } else {
                localStorage.setItem('version', JSON.stringify(version));
            }
        }
    }, [firstLoad, version])

    // console.log("New Paths: ", newPaths);

    const fetchDeepAnalyzerMatches = useCallback(() => {
        axios({
            method: "GET",
            url: `${baseApiUrl}/get-matches.php`,
        }).then((res) => {
            // console.log(res.data);
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

        // console.log(pageSize, page, deepAnalyzerUpcoming.page);
        if(deepAnalyzerUpcoming.matches[page]) return;
        axios({
            method: "GET",
            url: `${baseApiUrl}/get-matches-by-page.php?page=${page}&pageSize=${pageSize}`,
        }).then((res) => {
            // console.log(res.data);
            // if (res.data.success) {
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
            // } else {

            // }
        })
    }, [deepAnalyzerUpcoming]);

    const fetchDeepAnalyzerSubscription = useCallback(() => {
        axios({
            method: "GET",
            url: `${baseApiUrl}/get-deep-analyzer-subscription.php`,
        }).then((res) => {
            // console.log(res.data);
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
            // console.log(err);
            return [];
        }   )
    }, []);

    const value = useMemo(() => ({
        menuExpanded, setMenuExpanded,
        deepAnalyzerMatches, setDeepAnalyzerMatches,
        deepAnalyzerUpcoming, setDeepAnalyzerUpcoming,
        deepAnalyzerTab, setDeepAnalyzerTab,
        fetchDeepAnalyzerMatches,
        fetchDeepAnalyzerUpcoming,
        fetchDeepAnalyzerSubscription,
        searchMatches,
    }), [menuExpanded, deepAnalyzerMatches, deepAnalyzerUpcoming, deepAnalyzerTab])

    // console.log("DeepAnalyzerUpcoming: ", deepAnalyzerUpcoming)

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AppContext;

export const useApp = () => useContext(AuthContext);