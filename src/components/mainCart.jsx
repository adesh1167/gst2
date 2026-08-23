import React from 'react';
import Cart from '../routes/cart';
import { motion } from 'framer-motion';

const MainCart = () => {
    return (
        <motion.div
            initial={{ y: '100%', opacity: .2 }}
            animate={{ y: 0 , opacity: 1 }}
            exit={{ y: '100%', opacity: .2 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="absolute bottom-0 w-full h-[calc(100dvh-60px)] lg:h-[calc(100dvh-80px)] z-[16]"
        >
            <Cart />
        </motion.div>
    );
};

export default MainCart;