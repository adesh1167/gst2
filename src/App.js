import { Routes, Route, useNavigate, useLocation, Navigate, Outlet } from 'react-router';
import './App.css';
import UserRoutes from './routes/userRoutes';
import { useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import { baseApiUrl } from './data/url';
import { setContinent, setCountry, setCurrency, setFactor, setFirstLoad, setNewPaths, setVersion } from './slices/dataReducer';
import { useDispatch, useSelector } from 'react-redux';
import { login, setUserQueried } from './slices/userReducer';
import Toasts from './components/toasts';
import { showToast } from './slices/toastsReducer';
import AdminRoutes from './routes/adminRoutes';
import { setFixtures, setFixturesLoaded } from './slices/fixturesReducer';
import MyMatches from './routes/myMatches';
import Login from './routes/login';
import Register from './routes/register';
import About from './routes/about';
import { setMatchesLoaded, setMyMatches } from './slices/myMatchesReducer';
import Welcome from './components/welcome';
import Header from './components/header';
import ForgotPassword from './routes/forgotPassword';
import ResetPassword from './routes/resetPassword';
import DesktopMenu from './components/desktopMenu';
import MobileMenu from './components/mobileMenu';
import { useApp } from './contexts/appContext';
import DeepAnalyzer from './routes/deepAnalyzer';
import useWindowSize from './functions/useWindowSize';
import AsideCart from './components/asideCart';
import { AnimatePresence } from 'framer-motion';

axios.defaults.withCredentials = true;

function App() {
    const dispatch = useDispatch();
    const cart = useSelector(s => s.cart);
    const { user, isAdmin, dashboard } = useSelector(s => s.user);
    const { firstLoad, country, currency, continent, tAndCAccepted } = useSelector(s => s.data);
    const { pathname } = useLocation();
    const { width } = useWindowSize();
    const { menuExpanded } = useApp();
    const navigate = useNavigate();

    const isAfrica = continent === 'AF';
    const isCountrySelected = (isAfrica && country) || (!isAfrica && currency);

    // Persist cart to localStorage
    useEffect(() => {
        if (cart) localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Reset fixtures on dashboard switch
    useEffect(() => {
        dispatch(setFixturesLoaded(false));
    }, [dashboard]); // eslint-disable-line react-hooks/exhaustive-deps

    // Reset matches on auth change
    useEffect(() => {
        dispatch(setFixtures([]));
        dispatch(setFixturesLoaded(false));
        dispatch(setMyMatches([]));
        dispatch(setMatchesLoaded(false));
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    // Boot: fetch session data
    useLayoutEffect(() => {
        async function init() {
            if (pathname === '/persisted') {
                try {
                    const res = await axios({ method: 'POST', url: `${baseApiUrl}/profile.php` });
                    if (!res.data.cookies?.PHPSESSID) {
                        sessionStorage.setItem('incognito', true);
                        navigate('/', { replace: true });
                    }
                } catch {
                    dispatch(showToast({ message: 'Network error occurred, reload', type: 'error', duration: 3000 }));
                }
            }

            axios({ method: 'POST', url: `${baseApiUrl}/profile.php` })
                .then(res => {
                    dispatch(setFirstLoad(true));
                    if (res.data.continent)  dispatch(setContinent(res.data.continent));
                    if (res.data.factor)     dispatch(setFactor(res.data.factor));
                    if (res.data.country)    dispatch(setCountry(res.data.country));
                    if (res.data.currency) {
                        dispatch(setCurrency(res.data.currency));
                        dispatch(setCountry(res.data.currency));
                    }
                    if (res.data.status === 'loggedin') dispatch(login(res.data.data));
                    if (res.data.version)    dispatch(setVersion(res.data.version));
                    if (res.data.new_paths)  dispatch(setNewPaths(res.data.new_paths));
                    dispatch(setUserQueried(true));
                })
                .catch(() => dispatch(showToast({ message: 'An error occurred, reload page', type: 'error', duration: 3000 })));
        }
        init();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Scroll lock
    useEffect(() => {
        const lock =
            pathname === '/cart' ||
            pathname === '/country' ||
            pathname === '/change-country' ||
            pathname === '/deep-analyzer/search' ||
            (menuExpanded && width < 1024) ||   // lg breakpoint = 1024px
            (!tAndCAccepted && pathname !== '/about');

        document.body.classList.toggle('scroll-lock', lock);
    }, [pathname, tAndCAccepted, menuExpanded, width]);

    // Deep Analyzer ai class
    useEffect(() => {
        if (pathname.includes('/deep-analyzer')) {
            document.getElementById('root').classList.add('ai');
        } else{
            document.getElementById('root').classList.remove('ai');
        }
    }, [pathname]);

    // Country redirect
    useEffect(() => {
        if (firstLoad && !isCountrySelected && pathname !== '/country' && pathname !== '/about') {
            navigate('/country', { state: { redirect: pathname } });
        }
        if (firstLoad && isCountrySelected && pathname === '/country') {
            navigate('/');
        }
    }, [isCountrySelected, firstLoad, pathname]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {/* Fixed top bar */}
            <Header />

            {/* Mobile slide-over (hidden on lg+) */}
            <MobileMenu />

            {/*
              ── Page shell ──────────────────────────────────────────────
              Starts below the 50px header.
              On lg+: horizontal flex → [DesktopMenu sidebar | main content]
              On mobile: just the main content (menu is the overlay above)
            */}
            <div className="flex pt-[60px] lg:pt-[80px] min-h-[100dvh] bg-light-bg dark:bg-dark-bg">

                {/* Static sidebar — rendered in flow, lg+ only */}
                <DesktopMenu />

                {/* Main content — grows to fill remaining width */}
                <main className="flex-1 w-[60%] h-[calc(100dvh-60px)] lg:h-[calc(100dvh-80px)] flex-shrink-0 relative overflow-hidden z-[2]">
                    <Routes>
                        <Route
                            path="*"
                            element={
                                isAdmin && dashboard === 'admin'
                                    ? <AdminRoutes />
                                    : <UserRoutes />
                            }
                        />
                        <Route element={
                            <div className='h-full overflow-y-scroll'>
                                <Outlet/>
                            </div>
                        }>
                            <Route path="/deep-analyzer/*" element={<DeepAnalyzer />} />
                            <Route path="/my-matches"       element={<MyMatches />} />
                            <Route path="/login"            element={<Login />} />
                            <Route path="/register"         element={<Register />} />
                            <Route path="/forgot-password"  element={<ForgotPassword />} />
                            <Route path="/reset-password/:id" element={<ResetPassword />} />
                            <Route path="/about"            element={<About />} />
                        </Route>
                    </Routes>

                    <AnimatePresence mode="sync">
                        {(!tAndCAccepted && pathname !== '/about') && <Welcome key="welcome-modal" />}
                    </AnimatePresence>
                </main>

                <AnimatePresence mode='sync'>
                    {pathname !== "/cart" && !pathname.includes('/deep-analyzer') && (
                        <AsideCart key="aside-cart" />
                    )}
                </AnimatePresence>
            </div>

            <Toasts/>
        </>
    );
}

export default App;
