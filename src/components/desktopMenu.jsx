/**
 * DesktopMenu – static sidebar, visible only on lg+.
 * Sits in the normal document flow (relative/static).
 * The App.js layout gives it a fixed width; main content takes the rest.
 */
import React from 'react';
import MenuContent from './menuContent';

const DesktopMenu = () => (
    /* hidden on mobile, shown as a sticky sidebar on lg+ */
    <aside
        className="hidden md:flex flex-col
                   w-64 xl:w-72 shrink-0
                   sticky top-[80px] self-start
                   h-[calc(100dvh-50px)] lg:h-[calc(100dvh-80px)]
                   border-r border-black/10 dark:border-white/10
                   overflow-hidden"
    >
        <MenuContent variant="desktop" />
    </aside>
);

export default DesktopMenu;
