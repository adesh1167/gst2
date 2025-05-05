import { Link, NavLink, useLocation } from "react-router";
import "./styles/header.css";

import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { baseApiUrl } from "../data/url";
import Loading from "./loading";
import { logout } from "../slices/userReducer";
import { showToast } from "../slices/toastsReducer";

const Header = () => {

    const [menuExpanded, setMenuExpanded] = useState(false);
    const { user, isAuthenticated } = useSelector(state => state.user);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { pathname } = useLocation();

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
                dispatch(logout());
            } else {
                dispatch(showToast({
                    message: "res.data.message",
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
            console.log("logout");
            setLoading(false);
        })
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
                    <span className="navicon" />
                </div>
                <div className="menu-blank-space" onClick={toggleMenuExpanded} />
                <div className="menu">
                    <ul className="menu-content">
                        {isAuthenticated ?
                            <li className="profile-details">
                                <span>{user.first_name} {user.last_name}</span>
                            </li>
                            :
                            <li>
                                <div className="login-register">
                                    {pathname === "/login" || <Link to="/login">Login</Link>}
                                    {pathname === "/register" || <Link to="/register">Register</Link>}
                                </div>
                            </li>
                        }
                        <li>
                            <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/">
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
                            <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/about">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                                    </svg>
                                    About Us</span>
                            </NavLink>
                        </li>
                        <li>
                            <a href="mailto:contact.globalsportstrade@gmail.com">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                                    </svg>
                                    Contact Us</span>
                            </a>
                        </li>
                        {isAuthenticated && <li>
                            <a href="#" className="logout" onClick={loading ? null : doLogout}>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                                    </svg>
                                    Logout
                                    {loading && <Loading width={16} height={18} color="red" style={{ marginLeft: 10 }} />}
                                </span>
                            </a>
                        </li>}

                    </ul>
                </div>

            </div>
        </div>
    )
}

export default Header
