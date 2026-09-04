import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectNetTotal } from '../slices/netTotal';
import formatNumber from '../functions/formatNumber';
import { CartSvg } from '../components/svgs';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '../hooks/useModal';

const CheckoutButton = memo(() => {
    const { country, factor } = useSelector(state => state.data);
    const cartQuantity = useSelector(state => state.cart.quantity);
    const coupon = useSelector(state => state.data.coupon);
    const netTotal = useSelector(selectNetTotal);
    const { openModal } = useModal();

    const couponActive = coupon && cartQuantity > 0 &&
        (!coupon.min_matches || coupon.min_matches <= cartQuantity);

    return (
        <AnimatePresence>
            {cartQuantity > 0 && (
                <motion.div
                    className="fixed right-5 bottom-5 flex justify-end z-[15] pointer-events-none"
                    initial={{ y: 80, opacity: 0, height: 0 }}
                    animate={{ y: 0, opacity: 1, height: "auto" }}
                    exit={{ y: 80, opacity: 0, height: 0 }}
                >
                    <div className="block lg:hidden pointer-events-auto">
                        <button
                            type="button"
                            onClick={() => openModal('cart')}
                            className="relative flex items-center gap-3 pl-4 pr-5 py-3
                                      bg-orange-500 hover:bg-orange-400
                                      text-white font-bold rounded-2xl
                                      shadow-[0_0px_18px_rgba(234,88,12,0.55)]
                                      hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                            aria-label="Open cart"
                        >
                            {/* Coupon badge */}
                            <AnimatePresence>
                                {couponActive && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`absolute -top-[2px] -right-[2px] flex items-center gap-1
                                                 bg-green-500 text-white text-[10px] font-bold
                                                 pl-2 pr-3 py-0.5 rounded-bl-[14px] rounded-tr-[14px] ${couponActive ? "border-b-[2px] border-l-[2px]" : ""} border-[#edc] dark:border-black/80
                                                 shadow-sm whitespace-nowrap`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="8" height="8" fill="white">
                                            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                                        </svg>
                                        {parseInt(coupon.percent_off * 100)}% OFF
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {/* Cart icon + count bubble */}
                            <div className="relative">
                                <CartSvg size={26} />
                                <AnimatePresence mode='wait'>
                                    <motion.span
                                        key={cartQuantity}
                                        initial={{ rotateX: -90, }}
                                        animate={{ rotateX: 0, }}
                                        exit={{ rotateX: 90, }}
                                        transition={{ duration: 0.15 }}
                                        className="sans font-extrabold absolute -top-1.5 -right-2 w-4 h-4 bg-white text-orange-500
                                                    text-[10px] font-black rounded-full flex items-center justify-center">
                                        {cartQuantity}
                                    </motion.span>
                                </AnimatePresence>
                            </div>

                            {/* Price */}
                            <div className="flex flex-col leading-tight text-left">
                                <span className="text-orange-100 text-[10px] font-bold">Pay</span>
                                <span className="text-white text-sm font-extrabold tracking-tight">
                                    {country} <span className="sans">{formatNumber(netTotal * factor)}</span>
                                </span>
                            </div>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});

export default CheckoutButton;
