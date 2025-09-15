import { Link, NavLink, useLocation, useNavigate } from "react-router";
import "./styles/header.css";

import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { baseApiUrl } from "../data/url";
import Loading from "./loading";
import { logout, switchDashboard } from "../slices/userReducer";
import { showToast } from "../slices/toastsReducer";
import Switch from "./switch";

const Header = () => {

    const [menuExpanded, setMenuExpanded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [switching, setSwitching] = useState(false);
    const [menuClosed, setMenuClosed] = useState(false);
    const { user, isAuthenticated, isAdmin, dashboard } = useSelector(state => state.user);
    const dispatch = useDispatch();
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
            if(skip.current){
                skip.current = false
                return;
            }
            setMenuExpanded(false);
        }
    }, [pathname])

    const toggleMenuExpanded = () => {
        setMenuExpanded(!menuExpanded);
    }

    function doLogout() {
        setLoading(true);
        axios({
            url: `${baseApiUrl}/logout.php`,
            method: "POST",
        }).then((res) => {
            if (res.data.status == "success") {
                setTimeout(() => {
                    setMenuExpanded(false);
                    dispatch(showToast({
                        message: "Logged Out",
                        type: "info",
                        duration: 3000
                    }))
                }, 500);
                setTimeout(() => {
                    dispatch(logout());
                }, 1000);
            } else {
                dispatch(showToast({
                    message: res.data.message,
                    type: "error",
                    duration: 3000
                }))
            }
        }).catch((err) => {
            console.log(err);
            dispatch(showToast({
                message: "Unable to logout, check network and try again",
                type: "error",
                duration: 3000
            }))
        }).finally(() => {
            // console.log("logout");
            setLoading(false);
        })
    }

    function doSwitchDashoard() {
        // console.log('here');
        setSwitching(true);
        skip.current = true;
        // setTimeout(() => setMenuExpanded(false), 400);
        setTimeout(() => {
            dispatch(switchDashboard(dashboard === "user" ? "admin" : "user"));
            setSwitching(false);
        }, 600);
    }

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
                <div className="menu">
                    <ul className="menu-content">
                        {isAuthenticated ?
                            <>
                                <li className="profile-details">
                                    <span className="profile-details-wrapper">
                                        <span className="user-name">{user.first_name} {user.last_name}</span>
                                        <span className="user-email">{user.email}</span>
                                        {isAdmin && <div className="menu-admin-indicator">ADMIN</div>}
                                    </span>
                                </li>
                                {isAdmin &&
                                    <li className={`switch-dashboard`}>
                                        <span className="">Admin Dashboard</span>
                                        <Switch
                                            on={isAdminShown}
                                            switching={switching}
                                            toggle={doSwitchDashoard}
                                        />
                                    </li>
                                }
                            </>
                            :
                            <li>
                                <div className="login-register">
                                    {pathname === "/login" || <Link to="/login">Login</Link>}
                                    {pathname === "/register" || <Link to="/register">Register</Link>}
                                </div>
                            </li>
                        }
                        <li>
                            <NavLink className={({ isActive }) => isActive ? "active" : ""} to={isAdminShown ? "/admin" : "/"} end>
                                <span >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                        <path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
                                    </svg>
                                    Home</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/my-matches">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M417.3 360.1l-71.6-4.8c-5.2-.3-10.3 1.1-14.5 4.2s-7.2 7.4-8.4 12.5l-17.6 69.6C289.5 445.8 273 448 256 448s-33.5-2.2-49.2-6.4L189.2 372c-1.3-5-4.3-9.4-8.4-12.5s-9.3-4.5-14.5-4.2l-71.6 4.8c-17.6-27.2-28.5-59.2-30.4-93.6L125 228.3c4.4-2.8 7.6-7 9.2-11.9s1.4-10.2-.5-15l-26.7-66.6C128 109.2 155.3 89 186.7 76.9l55.2 46c4 3.3 9 5.1 14.1 5.1s10.2-1.8 14.1-5.1l55.2-46c31.3 12.1 58.7 32.3 79.6 57.9l-26.7 66.6c-1.9 4.8-2.1 10.1-.5 15s4.9 9.1 9.2 11.9l60.7 38.2c-1.9 34.4-12.8 66.4-30.4 93.6zM256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm14.1-325.7c-8.4-6.1-19.8-6.1-28.2 0L194 221c-8.4 6.1-11.9 16.9-8.7 26.8l18.3 56.3c3.2 9.9 12.4 16.6 22.8 16.6l59.2 0c10.4 0 19.6-6.7 22.8-16.6l18.3-56.3c3.2-9.9-.3-20.7-8.7-26.8l-47.9-34.8z" />
                                    </svg>
                                    My Matches
                                </span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/cart" >
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                        <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                                    </svg>

                                    Cart
                                </span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/about" >
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                                    </svg>
                                    About Us
                                </span>
                            </NavLink>
                        </li>
                        <li>
                            <a href="mailto:contact.globalsportstrade@gmail.com">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                                    </svg>
                                    Contact Us
                                </span>
                            </a>
                        </li>
                        {isAdminShown &&
                            <>
                                <li>
                                    <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/admin/upload-matches">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path d="M288 109.3L288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-242.7-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352l128 0c0 35.3 28.7 64 64 64s64-28.7 64-64l128 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
                                            </svg>

                                            Upload Matches
                                        </span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/admin/coupons">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                <path d="M64 64C28.7 64 0 92.7 0 128l0 64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320l0 64c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-64c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6l0-64c0-35.3-28.7-64-64-64L64 64zm64 112l0 160c0 8.8 7.2 16 16 16l288 0c8.8 0 16-7.2 16-16l0-160c0-8.8-7.2-16-16-16l-288 0c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32l320 0c17.7 0 32 14.3 32 32l0 192c0 17.7-14.3 32-32 32l-320 0c-17.7 0-32-14.3-32-32l0-192z" />
                                            </svg>

                                            Coupons
                                        </span>
                                    </NavLink>
                                </li>
                            </>
                        }
                        {isAuthenticated &&
                            <li>
                                <a href="#" className="logout" onClick={loading ? null : doLogout}>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                                        </svg>
                                        Logout
                                        {loading && <Loading width={16} height={18} color="red" style={{ marginLeft: 10 }} />}
                                    </span>
                                </a>
                            </li>
                        }

                    </ul>
                </div>

            </div>
        </div>
    )
}

export default Header
