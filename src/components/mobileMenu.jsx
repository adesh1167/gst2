/**
 * MobileMenu – fixed overlay, slides in from the right on mobile.
 * Hidden entirely on lg+ (desktop uses DesktopMenu instead).
 * Rendered once at the top of App.js.
 */
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router';
import { useApp } from '../contexts/appContext';
import MenuContent from './menuContent';

const backdrop = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1 },
    exit:    { opacity: 0 },
};

const panel = {
    hidden:  { x: '100%' },
    visible: { x: 0,      transition: { type: 'spring', stiffness: 300, damping: 35 } },
    exit:    { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 35 } },
};

const MobileMenu = () => {
    const { menuExpanded, closeMenu, menuSkip } = useApp();
    const { pathname } = useLocation();

    // Close on route change (unless skip flag is set)
    useEffect(() => {
        if (!menuExpanded) return;
        if (menuSkip.current) {
            menuSkip.current = false;
            return;
        }
        closeMenu();
    }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        /* lg: hide entirely — desktop has its own sidebar */
        <div className="md:hidden">
            <AnimatePresence>
                {menuExpanded && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="mobile-backdrop"
                            variants={backdrop}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.22 }}
                            className="fixed inset-0 z-[18] bg-black/50 backdrop-blur-[2px]"
                            onClick={closeMenu}
                            aria-hidden
                        />

                        {/* Sliding panel */}
                        <motion.div
                            key="mobile-panel"
                            variants={panel}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="fixed top-0 pt-[60px] right-0 z-[19] h-[100dvh] w-[78%] max-w-[300px]
                                       shadow-2xl overflow-hidden"
                        >
                            <MenuContent onClose={closeMenu} variant="mobile" />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MobileMenu;
