import { useDispatch } from 'react-redux';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectNetTotal } from '../slices/netTotal';
import formatNumber from '../functions/formatNumber';
import { useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import { baseApiUrl } from '../data/url';
import { closePaymentModal, useFlutterwave } from 'flutterwave-react-v3';
import { showToast } from '../slices/toastsReducer';
import { removeItems } from '../slices/cartReducer';
import LoadingButton from './loadingButton';
import { unavailablePayments } from '../data/unavaiablePayments';

const PayButton = ({ emptyCart, emptyCartFlag, title = "PAY", showPrice = true, background = "", color = "", style = {}, className = "" }) => {
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState(null);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    const netTotal = useSelector(selectNetTotal);
    const { user, isAuthenticated, isAdmin, dashboard } = useSelector((state) => state.user);
    const isAdminShown = isAdmin && dashboard === "admin";
    const { country, factor } = useSelector((state) => state.data);
    const cart = useSelector((state) => state.cart);
    const coupon = useSelector((state) => state.data.coupon);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const handlePayment = useFlutterwave(config);
    const dispatch = useDispatch();

    function initiatePayment() {
        if (isAuthenticated) {
            if (cart.quantity > 0) {
                const data = {
                    items: cart?.items?.map(item => item.id),
                    coupon: coupon?.coupon
                };
                setLoading(true);
                axios({
                    url: `${baseApiUrl}/initiate-payment.php`,
                    method: "POST",
                    data: data,
                }).then((res) => {
                    if (res.data.status === "success") {
                        if (window.confirm(`Are you sure you want to pay ${res.data.data.currency} ${res.data.data.price}`)) {
                            const conf = {
                                public_key: isAdminShown ? 'FLWPUBK_TEST-7217bfc9bf24794b1d11bba35c1bab18-X' : "FLWPUBK-e0e52c06b42b3123b8656c9a879c2215-X",
                                tx_ref: res.data.data.tx_ref,
                                amount: res.data.data.price,
                                currency: res.data.data.currency,
                                payment_options: 'mobilemoneyghana, mobilemoneyzambia, mobilemoneyuganda, mpesa, banktransfer, card, 1voucher',
                                customer: {
                                    email: user.email,
                                    phone_number: null,
                                    name: `${user.first_name} ${user.last_name}`,
                                },
                                customizations: {
                                    title: 'GST',
                                    description: 'Pay For Matches',
                                    logo: 'https://globalsportstrade.vercel.app/assets/logo.png',
                                },
                            };
                            setConfig(conf);
                        }
                    } else if (res.data.status === "update") {
                        dispatch(showToast({
                            message: "Some matches are no longer available. Cart has been updated",
                            type: "warning",
                            duration: 5000
                        }));
                        setTimeout(() => {
                            dispatch(showToast({
                                message: "Verify new cart items and checkout again",
                                type: "info",
                                duration: 5000
                            }));
                        }, 3000);
                        dispatch(removeItems(res.data.removed_items));
                    } else if (res.data.status === "login") {
                        navigate("/login", { state: { redirect: pathname } });
                    } else {
                        dispatch(showToast({
                            message: res.data.message,
                            type: "error",
                            duration: 3000
                        }));
                    }
                }).catch((err) => {
                    console.error(err);
                    dispatch(showToast({
                        message: "An error occurred, please try again later",
                        type: "error",
                        duration: 3000
                    }));
                }).finally(() => {
                    setLoading(false);
                });
            }
        } else {
            dispatch(showToast({
                message: "Please login to continue",
                type: "error",
                duration: 3000
            }));
            navigate("/login", { state: { redirect: pathname } });
        }
    }

    function checkOut() {
        setLoading(true);
        setIsPaymentOpen(true);
        if (unavailablePayments.includes(country)) {
            setTimeout(() => {
                setLoading(false);
                closePaymentModal();
                setIsPaymentOpen(false);
                navigate("/cart/manual-payment");
            }, 100);
            return;
        }

        handlePayment({
            callback: (response) => {
                if (response.status === 'successful' || response.status === 'completed') {
                    confirmPayment(response.tx_ref);
                } else {
                    dispatch(showToast({
                        message: "Payment failed, please try again",
                        type: "error",
                        duration: 3000
                    }));
                    setLoading(false);
                }
                setTimeout(() => closePaymentModal(), 2000);
                setIsPaymentOpen(false);
            },
            onClose: () => {
                dispatch(showToast({
                    message: "Payment abandoned, check My Matches to confirm if payment was successful",
                    type: "warning",
                    duration: 5000
                }));
                setLoading(false);
                setIsPaymentOpen(false);
            }
        });

        setConfig(null);
    }

    function confirmPayment(tx_ref) {
        axios({
            url: `${baseApiUrl}/${isAdminShown ? "confirm-payment-test" : "confirm-payment"}.php`,
            method: "POST",
            data: { tx_ref }
        }).then((res) => {
            if (res.data.status === "success") {
                dispatch(showToast({
                    message: "Payment successful",
                    type: "success",
                    duration: 5000
                }));
                setTimeout(() => {
                    dispatch(showToast({
                        message: "Redirecting to My Matches",
                        type: "info",
                        duration: 4000
                    }));
                }, 1000);
                if (emptyCartFlag) emptyCart();
                setTimeout(() => navigate("/my-matches"), 3000);
            } else {
                dispatch(showToast({
                    message: res.data.message,
                    type: "warning",
                    duration: 3000
                }));
            }
        }).catch((err) => {
            console.error(err);
            dispatch(showToast({
                message: "An error occurred, check your network and try again",
                type: "error",
                duration: 3000
            }));
        }).finally(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
        if (config) {
            checkOut();
        }
    }, [config]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const removeFlutterwaveIframes = () => {
            const iframes = document.querySelectorAll('iframe[src*="flutterwave"]');
            iframes.forEach(iframe => iframe.remove());
        };

        if (!isPaymentOpen) {
            setTimeout(removeFlutterwaveIframes, 1000);
        }
    }, [isPaymentOpen]);

    const defaultBg = background || "linear-gradient(135deg, #ea580c 0%, #f97316 100%)";

    return (
        <button
            type="button"
            onClick={loading ? null : initiatePayment}
            disabled={loading}
            style={{
                background: defaultBg,
                color: color || '#fff',
                ...style
            }}
            className={`min-w-[140px] px-6 py-3 rounded-xl font-bold text-sm text-white
                       shadow-sm hover:shadow
                       hover:brightness-105 active:scale-[0.98] transition-all
                       flex items-center justify-center cursor-pointer select-none
                       disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        >
            <LoadingButton loading={loading} size={24} color="#fff">
                {title} {showPrice && `${country} ${formatNumber(netTotal * factor)}`}
            </LoadingButton>
        </button>
    );
};

export default PayButton;
