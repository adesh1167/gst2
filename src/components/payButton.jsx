import { useDispatch } from 'react-redux';
import React, { useEffect, useRef, useState } from 'react'
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

const PayButton = ({ emptyCart, emptyCartFlag }) => {

    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState(null);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const navCounter = useRef(0);

    const netTotal = useSelector(selectNetTotal);
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const { country, factor } = useSelector((state) => state.data);
    const cart = useSelector((state) => state.cart);
    const coupon = useSelector((state) => state.data.coupon);
    const navigate = useNavigate();
    const handlePayment = useFlutterwave(config);

    const dispatch = useDispatch();
    const location = useLocation();

    function initiatePayment() {
        if (isAuthenticated) {
            if (cart.quantity > 0) {
                const data = {
                    items: cart?.items?.map(item => item.id),
                    coupon: coupon?.coupon
                }
                console.log(data);
                setLoading(true);
                axios({
                    url: `${baseApiUrl}/initiate-payment.php`,
                    method: "POST",
                    data: data,
                }).then((res) => {
                    console.log(res.data);
                    if (res.data.status === "success") {
                        if (window.confirm(`Are you sure you want to pay ${res.data.data.currency} ${res.data.data.price}`)) {
                            const conf = {
                                public_key: 'FLWPUBK-f2801afdf127dbb02f2adced0d298880-X',
                                // public_key: 'FLWPUBK_TEST-7217bfc9bf24794b1d11bba35c1bab18-X',
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
                            }
                            console.log("Config: ", conf);
                            setConfig(conf);
                        }
                    } else if (res.data.status === "update") {
                        dispatch(showToast({
                            message: "Some matches are no longer available. Cart has been updated",
                            type: "warning",
                            duration: 5000
                        }))
                        setTimeout(() => {
                            dispatch(showToast({
                                message: "Verify new cart items and checkout again",
                                type: "info",
                                duration: 5000
                            }))
                        }, 3000)
                        dispatch(removeItems(res.data.removed_items));
                    } else if (res.data.status === "login") {

                    } else {
                        dispatch(showToast({
                            message: "res.data.message",
                            type: "error",
                            duration: 3000
                        }))
                    }
                }).catch((err) => {
                    console.log(err);
                    dispatch(showToast({
                        message: "An error occured, please try again later",
                        type: "error",
                        duration: 3000
                    }))
                }).finally(() => {
                    setLoading(false);
                });
            }
        } else {
            dispatch(showToast({
                message: "Please login to continue",
                type: "error",
                duration: 3000
            }))
            navigate("/login");
        }
    }


    function checkOut() {
        setConfig(null);
        setLoading(true);
        // navCounter.current = 0;
        setIsPaymentOpen(true);
        handlePayment({
            callback: (response) => {
                console.log(response);
                if (response.status == 'successful' || response.status == 'completed') {
                    confirmPayment(response.tx_ref);
                } else {
                    dispatch(showToast({
                        message: "Payment failed, please try again",
                        type: "error",
                        duration: 3000
                    }))
                    setLoading(false);
                }
                setTimeout(closePaymentModal(), 2000);
                setIsPaymentOpen(false);
                // navigate(-navCounter.current);
            },
            onClose: () => {
                dispatch(showToast({
                    message: "Payment abandoned, check My Matches to confirm if payment was successful",
                    type: "warn",
                    duration: 5000
                }))
                setLoading(false);
                setIsPaymentOpen(false)
                // navigate(-navCounter.current);
            }
        })
    }

    function confirmPayment(tx_ref) {
        axios({
            url: `${baseApiUrl}/confirm-payment.php`,
            method: "POST",
            data: {
                tx_ref
            }
        }).then((res) => {
            console.log(res.data);
            if (res.data.status === "success") {
                dispatch(showToast({
                    message: "Payment successful",
                    type: "success",
                    duration: 5000
                }))
                setTimeout(() => {
                    dispatch(showToast({
                        message: "Redirecting to My Matches",
                        type: "info",
                        duration: 4000
                    }))
                }, 1000);
                if (emptyCartFlag) emptyCart();
                setTimeout(()=>navigate("/my-matches"), 3000);
            } else if (res.data.status === "update") {

            } else if (res.data.status === "login") {

            } else {
                dispatch(showToast({
                    message: res.data.message,
                    type: "warning",
                    duration: 3000
                }))
            }
        }).catch((err) => {
            console.log(err);
            dispatch(showToast({
                message: "An error occured, check your network and try again",
                type: "error",
                duration: 3000
            }))
        }).finally(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
        if (config) {
            checkOut();
        }
    }, [config])

    useEffect(() => {

        const removeFlutterwaveIframes = () => {
            const iframes = document.querySelectorAll('iframe[src*="flutterwave"]');
            iframes.forEach(iframe => iframe.remove());
        };

        if (!isPaymentOpen) {
            // Wait a moment for modal to fully close
            setTimeout(removeFlutterwaveIframes, 1000);
        }
    }, [isPaymentOpen])

    console.log("Is Payment Open: ", isPaymentOpen, navCounter);

    return (
        <div className="cart-container42" id="paymentButton" onClick={loading ? null : initiatePayment}>
            <span>
                <span id="paymentPriceCont">
                    <LoadingButton loading={loading} height={26} width={26} color='#fff'>
                        PAY {country} {formatNumber(netTotal * factor)}
                    </LoadingButton>
                </span>
            </span>
        </div>
    )
}

export default PayButton;
