import React, { useEffect, useState } from 'react';
import LoadingButton from './loadingButton';
import { closePaymentModal, useFlutterwave } from 'flutterwave-react-v3';
import { useNavigate } from 'react-router';
import formatNumber from '../functions/formatNumber';
import axios from 'axios';
import { showToast } from '../slices/toastsReducer';
import { useDispatch, useSelector } from 'react-redux';

const FlutterwaveButton = ({
    initiateLink,
    confirmLink,
    errorCallBack,
    finalCallBack,
    initiatePayload,
    title = "PAY",
    showPrice = true,
    background = "",
    color = "",
    style = {},
    price,
    description,
    country,
    manual,
    className = "",
}) => {
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState(null);
    const { isAdmin, dashboard, user } = useSelector((state) => state.user);
    const isAdminShown = isAdmin && dashboard === "admin";
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function initiatePayment() {
        setLoading(true);
        axios({
            url: `${initiateLink}`,
            method: "POST",
            data: initiatePayload,
        }).then(data => {
            if (data.data?.status === "success") {
                dispatch(showToast({
                    type: "info",
                    message: "Redirecting to payment...",
                    duration: 5000
                }));

                if (manual && !isAdminShown) {
                    navigate(manual, {
                        state: {
                            amount: data.data.data.price,
                        }
                    });
                    setLoading(false);
                    return;
                }

                const newConfig = {
                    public_key: isAdminShown ? "FLWPUBK_TEST-7217bfc9bf24794b1d11bba35c1bab18-X" : "FLWPUBK-e0e52c06b42b3123b8656c9a879c2215-X",
                    tx_ref: data.data?.data?.tx_ref,
                    amount: data.data?.data?.price,
                    currency: data.data?.data?.currency,
                    payment_options: "mobilemoneyghana, mobilemoneyzambia, mobilemoneyuganda, mobilemoneymalawi, mpesa, 1voucher, bank, banktransfer",
                    customer: {
                        email: user.email,
                        phone_number: null,
                        name: `${user.first_name} ${user.last_name}`,
                    },
                    meta: {
                        email: data.data.user.email,
                        fullName: `${data.data.user.first_name} ${data.data.user.last_name}`,
                    },
                    customizations: {
                        title: "GST",
                        description: description,
                        logo: "https://globalsportstrade.vercel.app/logo.png",
                    },
                };

                setConfig(newConfig);
            } else {
                try {
                    if (errorCallBack) {
                        errorCallBack(data);
                    }
                } catch (error) {
                    dispatch(showToast({
                        type: "error",
                        message: "An error occurred, try again or contact support",
                        duration: 4000
                    }));
                }
                setLoading(false);
            }
        }).catch(error => {
            dispatch(showToast({
                type: "error",
                message: "An error occurred. Check your network and try again",
                duration: 4000
            }));
            console.error(error);
            setLoading(false);
        });
    }

    const defaultBg = background || "linear-gradient(135deg, #ea580c 0%, #f97316 100%)";

    return (
        <>
            {config && (
                <StartPayment
                    config={config}
                    setConfig={setConfig}
                    setLoading={setLoading}
                    finalCallBack={finalCallBack}
                    confirmLink={confirmLink}
                />
            )}
            <button
                type="button"
                id="paymentButton"
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
                <LoadingButton loading={loading} height={24} width={24} color="#fff">
                    {title} {showPrice && price ? `${country} ${formatNumber(price)}` : ''}
                </LoadingButton>
            </button>
        </>
    );
};

const StartPayment = ({ config, setConfig, setLoading, finalCallBack, confirmLink }) => {
    const handleFlutterPayment = useFlutterwave(config);
    const dispatch = useDispatch();

    useEffect(() => {
        async function startPayment() {
            if (config) {
                try {
                    handleFlutterPayment({
                        callback: (response) => {
                            closePaymentModal();
                            if (response.status === 'successful' || response.status === 'completed') {
                                confirmPayment(response.tx_ref, config.customer.email);
                            } else if (response.status === "success-pending-validation" || response.status === "pending") {
                                dispatch(showToast({
                                    type: "warning",
                                    message: "Payment pending verification",
                                    duration: 6000
                                }));
                                setLoading(false);
                            } else {
                                dispatch(showToast({
                                    type: "error",
                                    message: "Payment failed",
                                    duration: 4000
                                }));
                                setLoading(false);
                            }
                            setConfig(null);
                        },
                        onClose: () => {
                            dispatch(showToast({
                                type: "warning",
                                message: "Payment cancelled",
                                duration: 4000
                            }));
                            setLoading(false);
                        },
                    });
                } catch (error) {
                    dispatch(showToast({
                        type: "error",
                        message: "An error occurred, check network and try again",
                        duration: 4000
                    }));
                    setConfig(null);
                    setLoading(false);
                }
            }
        }

        startPayment();
    }, [config]); // eslint-disable-line react-hooks/exhaustive-deps

    function confirmPayment(tx_ref) {
        axios({
            url: `${confirmLink}`,
            method: "POST",
            data: { tx_ref }
        }).then(res => {
            finalCallBack(res);
        }).catch(err => {
            console.error(err);
            dispatch(showToast({
                type: "error",
                message: "Network error while confirming payment. Contact Support",
                duration: 4000
            }));
        }).finally(() => {
            setLoading(false);
        });
    }

    return null;
};

export default FlutterwaveButton;
