import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useOutlet, useNavigate } from 'react-router';
import CartItem from '../components/cartItem';
import { clearCart } from '../slices/cartReducer';
import { selectNetTotal } from '../slices/netTotal';
import formatNumber from '../functions/formatNumber';
import axios from 'axios';
import { baseApiUrl } from '../data/url';
import { setCoupon } from '../slices/dataReducer';
import LoadingButton from '../components/loadingButton';
import { showToast } from '../slices/toastsReducer';
import Tick from '../components/tick';
import PayButtonCrypto from '../components/payButtonCrypto';
import PayForMatchesWrapper from '../components/payForMatchesWrapper';
import { AnimatePresence } from 'framer-motion';
import '../routes/styles/home.css';

const Cart = ({ aside = false }) => {
    const cartObj = useSelector(state => state.cart);
    const { factor, country, continent } = useSelector(state => state.data);
    const cart = cartObj.items;
    const netTotal = useSelector(selectNetTotal) * factor;
    const { total } = cartObj;
    const coupon = useSelector(state => state.data.coupon);
    const [couponText, setCouponText] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);
    const [emptyCartFlag, setEmptyCartFlag] = useState(false);
    const isAfrica = continent === "AF";
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const outlet = useOutlet();

    function emptyCart() { dispatch(clearCart()); }

    function applyCoupon(e) {
        e.preventDefault();
        if (!couponText) {
            dispatch(showToast({ message: "Enter A Coupon", type: "warning", duration: 3000 }));
            return;
        }
        setCouponLoading(true);
        axios({ url: `${baseApiUrl}/check-coupon.php`, data: { coupon: couponText }, method: "POST" })
            .then(res => {
                if (res.data.status === "success") {
                    dispatch(showToast({ message: `${res.data.data.coupon} applied`, type: "success", duration: 3000 }));
                    dispatch(setCoupon(res.data.data));
                    setCouponText("");
                } else {
                    dispatch(setCoupon(null));
                    dispatch(showToast({ message: res.data.message, type: "error", duration: 3000 }));
                }
            })
            .catch(() => dispatch(showToast({ message: "An error occurred, check your network and try again", type: "error", duration: 3000 })))
            .finally(() => setCouponLoading(false));
    }

    const couponActive = coupon && cartObj.quantity &&
        (!coupon?.min_matches || coupon.min_matches <= cartObj.quantity);

    return (
        <>
            <div className="cart absolute flex flex-col w-full top-0 h-full bg-[#f5f5f5] dark:bg-black" id="cartContainer" style={{ display: "flex" }}>

                {/* Close strip */}
                {aside || (
                    <button
                        onClick={() => navigate(-1)}
                        className="top-0 left-0 w-full shrink-0 h-[70px] flex items-center justify-center gap-3
                               dark:text-white/90 text-black font-bold text-base cursor-pointer z-10"
                    >
                        <svg viewBox="0 0 1024 1024" fill="currentColor" width="16px" height="16px">
                            <path d="M1014.662 822.66c-0.004-0.004-0.008-0.008-0.012-0.010l-310.644-310.65 310.644-310.65c0.004-0.004 0.008-0.006 0.012-0.010 3.344-3.346 5.762-7.254 7.312-11.416 4.246-11.376 1.824-24.682-7.324-33.83l-146.746-146.746c-9.148-9.146-22.45-11.566-33.828-7.32-4.16 1.55-8.070 3.968-11.418 7.31 0 0.004-0.004 0.006-0.008 0.010l-310.648 310.652-310.648-310.65c-0.004-0.004-0.006-0.006-0.010-0.010-3.346-3.342-7.254-5.76-11.414-7.31-11.38-4.248-24.682-1.826-33.83 7.32l-146.748 146.748c-9.148 9.148-11.568 22.452-7.322 33.828 1.552 4.16 3.97 8.072 7.312 11.416 0.004 0.002 0.006 0.006 0.010 0.010l310.65 310.648-310.65 310.652c-0.002 0.004-0.006 0.006-0.008 0.010-3.342 3.346-5.76 7.254-7.314 11.414-4.248 11.376-1.826 24.682 7.322 33.83l146.748 146.746c9.15 9.148 22.452 11.568 33.83 7.322 4.16-1.552 8.070-3.97 11.416-7.312 0.002-0.004 0.006-0.006 0.010-0.010l310.648-310.65 310.648 310.65c0.004 0.002 0.008 0.006 0.012 0.008 3.348 3.344 7.254 5.762 11.414 7.314 11.378 4.246 24.684 1.826 33.828-7.322l146.746-146.748c9.148-9.148 11.57-22.454 7.324-33.83-1.552-4.16-3.97-8.068-7.314-11.414z" />
                        </svg>
                        <span>Close Cart</span>
                    </button>
                )}

                {/* Main panel */}
                <div className={`h-full relative text-gray-900 dark:text-white overflow-scroll ${aside ? "" : "rounded-t-[1.4rem]"}`}>
                    <div className="absolute top-0 z-[2] w-full px-4 py-4
                                    bg-gradient-to-b from-[#fff] to-[#fff]/40 dark:from-[#1a1a2e] dark:to-[#0f1419]/40
                                    backdrop-blur-md border-b border-white/10
                                    shadow-md
                                    ">
                        <h2 className="text-lg font-semibold">
                            SELECTED MATCHES {cart.length > 0 && <span className="text-orange-400">({cart.length})</span>}
                        </h2>
                        <p className="text-sm text-black/60 dark:text-white/60 mt-0.5">
                            Paid selections appear under{" "}
                            <Link to="/my-matches" className="font-bold text-orange-400 hover:text-orange-300 whitespace-nowrap">
                                MY MATCHES
                            </Link>
                        </p>
                    </div>

                    <div className="cart-wrapper relative h-full flex-1 bg-gradient-to-b from-[#fff] to-[#fff]
                                dark:from-[#1a1a2e]/80 dark:to-[#1a1a2e]/80
                                shadow-[0_-4px_30px_rgba(0,0,0,0.5)]">

                        {/* Scrollable content */}
                        <div className="cart-container">
                            <div className="flex flex-col flex-1 gap-2.5 w-full min-h-[60px] pt-[120px] px-5 pb-2 text-sm">
                                {cart.length > 0 ? (
                                    cart.map(item => <CartItem key={item.id} item={item} />)
                                ) : (
                                    <div className="flex flex-col flex-1 items-center justify-center py-4 gap-3 text-black/60 dark:text-white/60">
                                        <img src="/assets/empty-cart.png" alt="empty" className="w-12 opacity-30 dark:invert" />
                                        <span className="text-lg">Cart is empty</span>
                                    </div>
                                )}
                            </div>

                            {/* Remove all */}
                            {cart.length > 0 && (
                                <div className="w-full flex justify-end px-5 pt-2">
                                    <button
                                        onClick={emptyCart}
                                        className="flex items-center gap-2 text-sm text-red-400 border border-red-500/30
                                               bg-red-500/10 hover:bg-red-500/20 rounded-lg px-4 py-2 transition-colors"
                                    >
                                        <span>Remove All</span>
                                        <svg viewBox="0 0 1024 1024" className="w-5 h-5 fill-red-400">
                                            <path d="M512 128c-211.755 0-384 172.288-384 384s172.245 384 384 384 384-172.288 384-384-172.245-384-384-384zM512 810.667c-164.651 0-298.667-133.973-298.667-298.667s134.016-298.667 298.667-298.667 298.667 133.973 298.667 298.667-134.016 298.667-298.667 298.667z" />
                                            <path d="M542.165 512l112.896-112.896c8.277-8.277 8.277-21.845 0-30.165-8.32-8.277-21.888-8.277-30.165 0l-112.896 112.896-112.896-112.939c-8.32-8.277-21.888-8.277-30.165 0-8.32 8.32-8.32 21.888 0 30.165l112.896 112.939-112.896 112.896c-8.32 8.32-8.32 21.888 0 30.165 4.139 4.181 9.6 6.272 15.061 6.272s10.923-2.091 15.104-6.229l112.896-112.939 112.896 112.896c4.181 4.181 9.643 6.272 15.104 6.272s10.923-2.091 15.104-6.229c8.277-8.277 8.277-21.845 0-30.165l-112.939-112.939z" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {/* Empty cart after payment */}
                            <div className="flex items-center self-start gap-2 px-5 pt-2 pb-6 text-black/60 dark:text-white/60 text-sm">
                                <label htmlFor="emptyCartFlagInput" className="flex items-center gap-2 cursor-pointer select-none">
                                    Empty cart after payment
                                    <Tick checked={emptyCartFlag} color="#fff" />
                                </label>
                                <input
                                    id="emptyCartFlagInput"
                                    type="checkbox"
                                    value={emptyCartFlag}
                                    onChange={e => setEmptyCartFlag(e.target.checked)}
                                    className="absolute opacity-0 -z-10"
                                />
                            </div>

                            {/* Summary + coupon */}
                            <div className="w-full mb-4 border-y border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] px-5 py-5 flex flex-col gap-3">
                                <h3 className="text-lg font-bold">SUMMARY</h3>

                                {/* Coupon input */}
                                <form className="flex items-center justify-end gap-2" onSubmit={couponLoading ? e => e.preventDefault() : applyCoupon}>
                                    <input
                                        type="text"
                                        placeholder="Promo Code"
                                        value={couponText}
                                        onChange={e => setCouponText(e.target.value)}
                                        className="sans w-36 bg-white/70 dark:bg-gray-700/20 border border-[2px] border-gray-500 dark:border-white/70 text-gray-700 dark:text-gray-300 placeholder-black/30 dark:placeholder:text-white/30
                                               rounded-lg px-3 py-2 text-base focus:outline-none focus:border-orange-500/60 dark:focus:border-orange-500/60
                                               transition-colors"
                                    />
                                    <button
                                        type="submit"
                                        className="self-stretch font-bold text-orange-600 dark:text-orange-400 border-2 border-orange-500/60 bg-orange-500/15
                                               hover:bg-orange-500/25 rounded-lg px-4 py-2 text-sm transition-colors"
                                    >
                                        <LoadingButton size={20} loading={couponLoading}>APPLY</LoadingButton>
                                    </button>
                                </form>

                                {/* Total row */}
                                <div className="flex justify-between font-bold">
                                    <span>TOTAL</span>
                                    <span
                                        className="sans"
                                        style={{
                                            textDecoration: couponActive ? 'line-through' : 'none',
                                            opacity: couponActive ? 0.45 : 1,
                                        }}
                                    >
                                        {country} {formatNumber(total * factor)}
                                    </span>
                                </div>

                                {/* Coupon details */}
                                {coupon && cartObj.quantity > 0 && (
                                    coupon?.min_matches && coupon.min_matches > cartObj.quantity ? (
                                        <p className="text-sm text-white/60">
                                            Coupon <strong className="text-white">{coupon.coupon}</strong> only applies on {coupon.min_matches}+ matches
                                        </p>
                                    ) : (
                                        <div className="rounded-xl bg-green-300/10 border border-green-500/50 px-4 py-3 flex flex-col gap-2">
                                            <div className="flex items-center justify-between text-green-600 dark:text-green-300 text-sm font-semibold">
                                                <span>{coupon.coupon} applied</span>
                                                <svg width={16} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
                                                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-xs text-green-600/80 dark:text-green-200/80">{coupon.message}</p>
                                            <div className="flex justify-between font-extrabold text-green-600 dark:text-green-300 text-md">
                                                <span>NEW TOTAL</span>
                                                <span className="sans font-[900]">{country} {formatNumber(netTotal)}</span>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>

                            {/* Pay buttons */}
                            {cart.length > 0 ? (
                                <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-4">
                                    {isAfrica && (
                                        <PayForMatchesWrapper
                                            emptyCartFlag={emptyCartFlag}
                                            emptyCart={emptyCart}
                                            className="payment-button-orange"
                                        />
                                    )}
                                    <PayButtonCrypto
                                        emptyCartFlag={emptyCartFlag}
                                        emptyCart={emptyCart}
                                        defaultCurrency={isAfrica ? "$" : null}
                                        title="PAY"
                                        showPrice={true}
                                        payload={{ items: cart?.map(i => i.id), coupon: coupon?.coupon }}
                                        ready={cart.length > 0}
                                        initiateLink={`${baseApiUrl}/initiate-payment-crypto.php`}
                                        className='border border-[#333] bg-gray-800 text-white dark:bg-white/80 dark:text-gray-700'
                                    />
                                </div>
                            ) : (
                                <p className="font-semibold text-black/60 dark:text-white/60 px-5 py-3 text-sm">
                                    Add at least one match to checkout
                                </p>
                            )}

                            {/* Change country */}
                            <Link
                                to="/change-country"
                                className="px-5 py-3 text-sm text-orange-400 hover:text-orange-300 font-bold transition-colors"
                            >
                                Change {isAfrica ? "Country" : "Currency"}
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
            <AnimatePresence mode="sync">
                {outlet && React.cloneElement(outlet, { key: location.pathname })}
            </AnimatePresence>
        </>
    );
};

export default Cart;
