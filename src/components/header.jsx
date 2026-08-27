/**
 * Header – fixed top bar.
 * - Shows hamburger on mobile (md: hidden).
 * - Hamburger is hidden on md+ because DesktopMenu is visible.
 * - On md+, brand logo and full title are centered with color styling.
 * - Dark mode toggle visible on all breakpoints.
 */
import { Link } from 'react-router';
import './styles/header.css';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useApp } from '../contexts/appContext';
import { Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Header = () => {
    const { isAdmin, dashboard } = useSelector(s => s.user);
    const { newPaths } = useSelector(s => s.data);
    const { menuExpanded, setMenuExpanded, darkMode, toggleDarkMode } = useApp();

    const isAdminShown = isAdmin && dashboard === 'admin';

    // Track whether the panel has fully closed so we can show ADMIN label
    const [panelClosed, setPanelClosed] = useState(true);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        if (menuExpanded) setPanelClosed(false);
        else setTimeout(() => setPanelClosed(true), 320);
    }, [menuExpanded]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setHydrated(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const toggle = () => setMenuExpanded(v => !v);

    return (
        <header
            className="fixed top-0 left-0 right-0 h-[60px] lg:h-[80px] z-[20]
                       flex items-center justify-between px-3.5 lg:px-4
                       bg-white/95 dark:bg-[#0a0a0f]/95
                       backdrop-blur-md
                       border-b border-black/10 dark:border-white/10
                       shadow-sm dark:shadow-none transition-colors"
        >
            {/* Brand Link (Left on mobile, dead-center on md+) */}
            <Link
                to="/"
                className="flex items-center gap-2.5 group
                           active:scale-[0.98] transition-transform"
            >
                <div className="relative w-8 h-8 lg:w-9 lg:h-9 rounded-xl overflow-hidden transition-shadow shrink-0">
                    <img
                        src="/assets/logo.png"
                        alt="Global Sports Trade"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Mobile Title */}
                <div className="md:hidden flex items-center leading-none">
                    <span className="font-black text-lg text-gray-900 dark:text-white tracking-wider">
                        G<span className="text-orange-500">S</span>T
                    </span>
                </div>

                {/* Desktop / Tablet Full Title (md+) */}
                <div className="hidden md:flex items-center gap-1.5 text-base lg:text-lg font-black tracking-wider leading-none select-none">
                    <span className="text-gray-900 dark:text-white">GLOBAL</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600">
                        SPORTS
                    </span>
                    <span className="text-gray-900 dark:text-white">TRADE</span>
                </div>
            </Link>

            {/* Right controls */}
            <div className="flex items-center gap-2 z-10">
                {/* Dark / light toggle — always visible */}
                <AnimatePresence>
                    {((!menuExpanded && !isAdmin) || isAdmin) && (
                        <motion.button
                            initial={hydrated ? { rotate: 360, opacity: 0.3, right: -30, top: 100, marginLeft: "-0.5rem" } : {}}
                            animate={{ rotate: 0, opacity: 1, right: 0, top: 0, marginLeft: "0" }}
                            exit={{ rotate: 360, opacity: 0.3, right: -30, top: 100, marginLeft: "-0.5rem" }}
                            transition={{ duration: 0.4 }}
                            onClick={toggleDarkMode}
                            aria-label="Toggle dark mode"
                            className="relative w-9 h-9 flex items-center justify-center rounded-full
                               hover:bg-black/5 dark:hover:bg-white/10
                               text-gray-700 dark:text-gray-200 transition-colors bg-transparent"
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Admin badge — mobile only, when panel is closed */}
                <AnimatePresence>
                    {!menuExpanded && isAdminShown && (
                        <motion.span
                            className="text-xs font-extrabold text-orange-500 dark:text-orange-400 tracking-widest uppercase px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20"
                            initial={{ opacity: 0, width: 0, marginLeft: "-0.5rem" }}
                            animate={{ opacity: 1, width: 'auto', marginLeft: "0" }}
                            exit={{ opacity: 0, width: 0, marginLeft: "-0.5rem" }}
                        >
                            ADMIN
                        </motion.span>
                    )}
                </AnimatePresence>

                {/* Hamburger — mobile only */}
                <div
                    className={`md:hidden menu-container relative flex items-center justify-center
                               w-9 h-9 cursor-pointer rounded-full
                               transition-colors
                               ${menuExpanded ? 'expanded' : ''}`}
                    onClick={toggle}
                    aria-label="Open navigation"
                >
                    {/* Green dot for new paths */}
                    {newPaths.length > 0 && panelClosed && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
                    )}
                    <span className="navicon text-gray-800 dark:text-white" />
                </div>
            </div>
        </header>
    );
};

export default Header;
