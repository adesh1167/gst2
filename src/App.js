import { Routes, Route, useNavigate, useLocation, Navigate, Outlet, useNavigationType } from 'react-router';
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
import { useIsAdmin } from './hooks/useIsAdmin';
import { useModal } from './hooks/useModal';
import GlobalModals from './components/globalModals';
import { incrementDepth, decrementDepth } from './services/navigationDepth';

axios.defaults.withCredentials = true;

function App() {
    const dispatch = useDispatch();
    const { user, dashboard } = useSelector(s => s.user);
    const isAdminShown = useIsAdmin();
    const { firstLoad, country, currency, continent, tAndCAccepted } = useSelector(s => s.data);
    const { modal, sub, openModal, closeModal } = useModal();
    const { pathname } = useLocation();
    const { width } = useWindowSize();
    const { menuExpanded, windowSize } = useApp();
    const location = useLocation();
    const navigate = useNavigate();
    const navType = useNavigationType();

    // Track internal SPA navigation depth for history-aware back navigation
    useEffect(() => {
        if (navType === 'PUSH') {
            incrementDepth();
        } else if (navType === 'POP') {
            decrementDepth();
        }
    }, [location.key, navType]);

    const isAfrica = continent === 'AF';
    const isCountrySelected = Boolean((isAfrica && country) || (!isAfrica && currency));

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
                    if (res.data.continent) dispatch(setContinent(res.data.continent));
                    if (res.data.factor) dispatch(setFactor(res.data.factor));
                    if (res.data.country) dispatch(setCountry(res.data.country));
                    if (res.data.currency) {
                        dispatch(setCurrency(res.data.currency));
                        dispatch(setCountry(res.data.currency));
                    }
                    if (res.data.status === 'loggedin') dispatch(login(res.data.data));
                    if (res.data.version) dispatch(setVersion(res.data.version));
                    if (res.data.new_paths) dispatch(setNewPaths(res.data.new_paths));
                    dispatch(setUserQueried(true));
                })
                .catch(() => dispatch(showToast({ message: 'An error occurred, reload page', type: 'error', duration: 3000 })));
        }
        init();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Scroll lock
    useEffect(() => {
        const lock =
            Boolean(modal) ||
            Boolean(sub) ||
            (firstLoad && !isCountrySelected && pathname !== '/about') ||
            pathname === '/deep-analyzer/search' ||
            (menuExpanded && !windowSize.isMd) || // lg breakpoint = 1024px
            (!tAndCAccepted && pathname !== '/about');

        document.body.classList.toggle('scroll-lock', lock);
    }, [pathname, tAndCAccepted, menuExpanded, width, modal, sub, firstLoad, isCountrySelected]);

    // Deep Analyzer ai class
    useEffect(() => {
        if (pathname.includes('/deep-analyzer')) {
            document.getElementById('root').classList.add('ai');
        } else {
            document.getElementById('root').classList.remove('ai');
        }
    }, [pathname]);


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
                                isAdminShown
                                    ? <AdminRoutes />
                                    : <UserRoutes />
                            }
                        />
                        <Route element={
                            <div className='h-full overflow-y-scroll'>
                                <Outlet />
                            </div>
                        }>
                            <Route path="/deep-analyzer/*" element={<DeepAnalyzer />} />
                            <Route path="/my-matches" element={<MyMatches />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password/:id" element={<ResetPassword />} />
                            <Route path="/about" element={<About />} />
                        </Route>
                    </Routes>
                </main>

                {/* Desktop Aside Cart */}
                <AnimatePresence mode='sync'>
                    {!pathname.includes('/deep-analyzer') && (
                        <AsideCart key="aside-cart" />
                    )}
                </AnimatePresence>
            </div>

            {/* Centralized Global Modals (Query Parameter driven) */}
            <GlobalModals />

            {/* Toast Notifications */}
            <Toasts />
        </>
    );
}

export default App;
