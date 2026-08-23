/**
 * MenuContent – pure nav list, no positioning wrapper.
 * All styling is Tailwind-only (no .menu CSS class dependency).
 * Shared by DesktopMenu and MobileMenu.
 */
import React, { useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { baseApiUrl } from '../data/url';
import Loading from './loading';
import Switch from './switch';
import { logout, switchDashboard } from '../slices/userReducer';
import { showToast } from '../slices/toastsReducer';
import { AiSvg, BallSvg, CartSvg } from './svgs';
import { Globe, Ticket, Upload } from 'lucide-react';

/* ── Shared row styles ─────────────────────────────────────────────────── */
const ROW_BASE =
    'flex items-center gap-3 px-3 py-2.5 w-full rounded-l-2xl ' +
    'text-sm whitespace-nowrap ' +
    'transition-all duration-300 cursor-pointer';

const ROW_INACTIVE =
    'text-gray-700  dark:text-gray-300 ' +
    'font-medium ' +
    'hover:bg-gray-200 dark:hover:bg-white/10';

const ROW_ACTIVE =
    'bg-gray-900 dark:bg-white/90 ' +
    'text-white dark:text-gray-900 ' +
    'font-extrabold ' +
    'hover:bg-gray-800 dark:hover:bg-white/80';

const ICON_BASE = 'w-6 h-6 shrink-0 fill-current';

/* ── NEW badge (after pseudo handled by global CSS) ─────────────────────── */
const NEW_CLS = 'new';

const NavRow = ({ to, end, close, newBadge, children }) => {
    console.log("Here")

    return (
        <NavLink
            to={to}
            end={end}
            onClick={close}
            className={({ isActive }) =>
                `block pl-2 pr-0 py-1 mb-2`
            }
        >
            {({ isActive }) => (
                <span className={`${isActive ? ROW_ACTIVE : ROW_INACTIVE} ${ROW_BASE} ${newBadge ? NEW_CLS : ''}`}>
                    {children}
                </span>
            )}
        </NavLink>
    )
}

const MenuContent = ({ onClose }) => {
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [switching, setSwitching] = useState(false);

    const { user, isAuthenticated, isAdmin, dashboard } = useSelector(s => s.user);
    const { newPaths, continent } = useSelector(s => s.data);
    const dispatch = useDispatch();
    const { pathname } = useLocation();

    const isAdminShown = useMemo(() => isAdmin && dashboard === 'admin', [isAdmin, dashboard]);
    const isAfrica = continent === "AF" ? true : false;

    const close = () => onClose?.();

    /* ── Logout ────────────────────────────────────────── */
    function doLogout() {
        setLogoutLoading(true);
        axios({ url: `${baseApiUrl}/logout.php`, method: 'POST' })
            .then(res => {
                if (res.data.status === 'success') {
                    setTimeout(() => { close(); dispatch(showToast({ message: 'Logged Out', type: 'info', duration: 3000 })); }, 400);
                    setTimeout(() => dispatch(logout()), 900);
                } else {
                    dispatch(showToast({ message: res.data.message, type: 'error', duration: 3000 }));
                }
            })
            .catch(() => dispatch(showToast({ message: 'Unable to logout, check network', type: 'error', duration: 3000 })))
            .finally(() => setLogoutLoading(false));
    }

    /* ── Dashboard switch ──────────────────────────────── */
    function doSwitchDashboard() {
        setSwitching(true);
        setTimeout(() => { dispatch(switchDashboard(dashboard === 'user' ? 'admin' : 'user')); setSwitching(false); }, 500);
    }

    /* ── NEW badges ────────────────────────────────────── */
    const hasNew = useMemo(() => ({
        home: newPaths.find(p => p.startsWith('/home') || p === '/'),
        deepAnalyzer: newPaths.find(p => p.startsWith('/deep-analyzer')),
        myMatches: newPaths.find(p => p.startsWith('/my-matches')),
        cart: newPaths.find(p => p.startsWith('/cart')),
        about: newPaths.find(p => p.startsWith('/about')),
        contact: newPaths.find(p => p.startsWith('/contact')),
        country: newPaths.find(p => p.startsWith('/change-country')) || newPaths.find(p => p.startsWith('/change-currency')),
    }), [newPaths]);

    /* ── NavLink row ───────────────────────────────────── */

    return (
        <div className="flex flex-col h-full overflow-y-auto bg-white dark:bg-[#0d0d14]">

            {/* ── Auth header ──────────────────────────── */}
            {isAuthenticated ? (
                <div className="px-4 py-3 border-b border-black/10 dark:border-white/10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center
                                        text-white font-bold text-sm shrink-0 uppercase select-none">
                            {user.first_name?.[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-bold text-sm truncate capitalize text-gray-900 dark:text-white">
                                {user.first_name} {user.last_name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                        {isAdmin && (
                            <span className="self-start text-[10px] px-2 py-0.5 border border-gray-400 dark:border-gray-600
                                             text-gray-500 dark:text-gray-400 rounded-full shrink-0">
                                ADMIN
                            </span>
                        )}
                    </div>
                    {isAdmin && (
                        <div className="flex items-center justify-between mt-3 px-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Admin Dashboard</span>
                            <Switch on={isAdminShown} switching={switching} toggle={doSwitchDashboard} />
                        </div>
                    )}
                </div>
            ) : (
                <div className="px-4 py-3 border-b border-black/10 dark:border-white/10 shrink-0">
                    <div className="flex gap-2">
                        {pathname !== '/login' && (
                            <Link to="/login" state={{ redirect: pathname }} onClick={close}
                                className="flex-1 text-center py-2 rounded-xl border-2
                                           border-gray-800 dark:border-white
                                           text-gray-800 dark:text-white font-bold text-sm
                                           hover:bg-gray-800 hover:text-white
                                           dark:hover:bg-white dark:hover:text-gray-900
                                           transition-colors">
                                Login
                            </Link>
                        )}
                        {pathname !== '/register' && (
                            <Link to="/register" onClick={close}
                                className="flex-1 text-center py-2 rounded-xl
                                           bg-orange-600 hover:bg-orange-500
                                           text-white font-bold text-sm transition-colors">
                                Register
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* ── Nav items ────────────────────────────── */}
            <nav className="flex flex-col flex-1 py-2 pr-0">

                {/* Home */}
                <NavRow key={"home"} to={isAdminShown ? '/admin' : '/'} end newBadge={hasNew.home}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className={ICON_BASE}>
                        <path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
                    </svg>
                    Fixtures
                </NavRow>

                {/* Deep Analyzer */}
                <NavLink
                    to="/deep-analyzer"
                    onClick={close}
                    className="block pl-2 pr-0 py-0.5"
                >
                    {({ isActive }) => (
                        <span className={`${ROW_BASE} ${isActive ? ROW_ACTIVE : ROW_INACTIVE} ${hasNew.deepAnalyzer ? NEW_CLS : ''}`}>
                            {/* AI circuit icon */}
                            <AiSvg className={`${ICON_BASE} text-purple-900`} />
                            {/* Rainbow gradient text — active state inverts the gradient for legibility */}
                            <span className={isActive ? 'rainbow-text-active' : 'rainbow-text'}>
                                Deep Analyzer
                            </span>
                        </span>
                    )}
                </NavLink>

                {/* My Matches */}
                <NavRow to="/my-matches" close={close} newBadge={hasNew.myMatches}>
                    <BallSvg className={ICON_BASE} />
                    My Matches
                </NavRow>

                {/* Cart */}
                <NavRow to="/cart" close={close} newBadge={hasNew.cart}>
                    <CartSvg className={ICON_BASE} />
                    Cart
                </NavRow>

                {/* Country */}
                <NavRow to="/change-country" close={close} newBadge={hasNew.country}>
                    <Globe className={ICON_BASE} style={{ fill: "transparent" }} />
                    Change {isAfrica ? "Country" : "Currency"}
                </NavRow>

                {/* About */}
                <NavRow to="/about" close={close} newBadge={hasNew.about}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={ICON_BASE}>
                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                    </svg>
                    About Us
                </NavRow>

                {/* Contact */}
                <a href="mailto:contact.globalsportstrade@gmail.com" onClick={close} className="block pl-2 pr-0 py-0.5">
                    <span className={`${ROW_BASE} ${ROW_INACTIVE} ${hasNew.contact ? NEW_CLS : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={ICON_BASE}>
                            <path d="M64 112c-8.8 0-16 7.2-16 16l0 22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1l0-22.1c0-8.8-7.2-16-16-16L64 112zM48 212.2L48 384c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-171.8L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64l384 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128z" />
                        </svg>
                        Contact Us
                    </span>
                </a>

                {/* Admin: Upload Matches */}
                {isAdminShown && (
                    <NavRow close={close} to="/admin/upload-matches">
                        <Upload className={ICON_BASE} style={{fill: "transparent"}}/>
                        Upload Matches
                    </NavRow>
                )}

                {/* Admin: Coupons */}
                {isAdminShown && (
                    <NavRow close={close} to="/admin/coupons">
                        <Ticket className={ICON_BASE} style={{fill: "transparent"}}/>
                        Coupons
                    </NavRow>
                )}

                {/* Logout — pinned to bottom */}
                {isAuthenticated && (
                    <div className="mt-auto pt-2 border-t border-black/10 dark:border-white/10">
                        <button type="button" onClick={doLogout} className="w-full pl-2 pr-0 py-0.5">
                            <span className={`${ROW_BASE} !text-red-500 hover:!bg-red-50 dark:hover:!bg-red-500/10`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 shrink-0 !fill-red-500">
                                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                                </svg>
                                {logoutLoading
                                    ? <Loading width={16} height={16} color="#ef4444" />
                                    : 'Logout'
                                }
                            </span>
                        </button>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default MenuContent;
