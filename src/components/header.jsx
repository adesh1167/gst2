import { Link, NavLink, useLocation, useNavigate } from "react-router";
import "./styles/header.css";

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { baseApiUrl } from "../data/url";
import Loading from "./loading";
import { logout, switchDashboard } from "../slices/userReducer";
import { showToast } from "../slices/toastsReducer";
import Switch from "./switch";
import Menu from "./menu";

const Header = () => {

    const [menuExpanded, setMenuExpanded] = useState(false);
    const [menuClosed, setMenuClosed] = useState(false);
    const { isAdmin, dashboard } = useSelector(state => state.user);
    const { pathname } = useLocation();

    const isAdminShown = isAdmin && dashboard === "admin" ? true : false;

    const skip = useRef(false);

    useEffect(() => {
        if (menuExpanded) {
            setMenuClosed(false)
        } else {
            setTimeout(() => setMenuClosed(true), 250)
        }
    }, [menuExpanded])

    useEffect(() => {
        if (menuExpanded) {
            if (skip.current) {
                skip.current = false
                return;
            }
            setMenuExpanded(false);
        }
    }, [pathname])

    const toggleMenuExpanded = () => {
        setMenuExpanded(!menuExpanded);
    }

    const setSkip = useCallback((val) => {
        skip.current = val;
    }, [])

    console.log("IsAdminShown: ", isAdminShown);

    return (
        <div className="dag-container01 header">
            <div className="dag-container02">
                <img alt="image" src="/assets/logo.jpg" className="dag-image" />
                <span className="dag-text">
                    <span>GST</span>
                    <br />
                </span>
            </div>
            <div className={`menu-container ${menuExpanded ? "expanded" : ""}`}>
                <div className="menu-icon" htmlFor="menu-btn" onClick={toggleMenuExpanded}>
                    {(menuClosed && isAdminShown) && <span className="admin-dashboard-indicator">ADMIN</span>}
                    <span className="navicon" />
                </div>
                <div className="menu-blank-space" onClick={toggleMenuExpanded} />
                <Menu
                    isAdminShown={isAdminShown}
                    setMenuExpanded={setMenuExpanded}
                    setSkip={setSkip}
                />

            </div>
        </div>
    )
}

export default Header
