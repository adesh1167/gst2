import React from 'react';
import Cart from '../routes/cart';
import { motion } from 'framer-motion';

const AsideCart = () => {
    return (
        <motion.aside
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="hidden lg:flex flex-col
                       sticky w-[30%] max-w-[400px] top-[80px] self-start
                       h-[calc(100dvh-80px)]
                       border-r border-black/10 dark:border-white/10
                       overflow-hidden shrink-0 z-[0]"
        >
            <Cart aside={true} />
        </motion.aside>
    );
};

export default AsideCart;