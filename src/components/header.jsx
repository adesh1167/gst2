/**
 * Header – fixed top bar.
 * - Shows hamburger on mobile (lg: hidden).
 * - Hamburger is hidden on lg+ because DesktopMenu is always visible.
 * - Dark mode toggle visible on all breakpoints.
 */
import { useLocation } from 'react-router';
import './styles/header.css';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useApp } from '../contexts/appContext';
import { Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { set } from 'react-hook-form';

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

    useEffect(()=>{
        setTimeout(()=>{
            setHydrated(true);
        }, 2000)
    }, [])

    const toggle = () => setMenuExpanded(v => !v);

    console.log("Panel Closed: ", panelClosed)

    return (
        <header
            className="fixed top-0 left-0 right-0 h-[60px] lg:h-[80px] z-[20]
                       flex items-center justify-between px-3 lg:px-5
                       bg-white/95 dark:bg-[#0a0a0f]/95
                       backdrop-blur-sm
                       border-b border-black/10 dark:border-white/10
                       shadow-sm dark:shadow-none"
        >
            {/* Brand */}
            <div className="flex items-center gap-2">
                <img src="/assets/logo.png" alt="GST" className="w-8 h-8 ml-1 rounded-lg object-cover" />
                <span className="font-extrabold text-lg text-gray-900 dark:text-white tracking-wide">GST</span>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">

                {/* Dark / light toggle — always visible */}
                <AnimatePresence>
                    {((!menuExpanded && !isAdmin) || isAdmin) && (
                        <motion.button
                            initial={hydrated ? {rotate: 360, opacity: 0.3, right: -30, top:100, marginLeft: "-0.5rem" } : {}}
                            animate={{ rotate: 0, opacity: 1, right: 0, top:0, marginLeft: "0", }}
                            exit={{ rotate: 360, opacity: 0.3, right: -30, top: 100, marginLeft: "-0.5rem" }}
                            transition={{duration: 0.4}}
                            onClick={toggleDarkMode}
                            aria-label="Toggle dark mode"
                            className="relative w-9 h-9 flex items-center justify-center rounded-full
                               hover:bg-gray-200 dark:hover:bg-white/20
                               text-gray-700 dark:text-gray-200 transition-colors bg-transparent"
                        >
                            {darkMode ? (
                                /* Sun */
                                <Sun size={20} />
                            ) : (
                                <Moon size={20} />
                            )}
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Admin badge — mobile only, when panel is closed */}
                <AnimatePresence>
                    {!menuExpanded && isAdminShown && (
                        <motion.span
                            className="text-xs font-bold text-orange-500 dark:text-orange-400 tracking-widest uppercase"
                            initial={{ opacity: 0, width: 0, marginLeft: "-0.5rem" }}
                            animate={{ opacity: 1, width: 'auto', marginLeft: "0", }}
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
