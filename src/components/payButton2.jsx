import React, { useCallback, useEffect, useState } from 'react'
import LoadingButton from './loadingButton';
import { useApp } from '../contexts/appContext';
import { closePaymentModal, useFlutterwave } from 'flutterwave-react-v3';
import { useNavigate } from 'react-router';
import formatNumber from '../functions/formatNumber';
import axios from 'axios';
import { showToast } from '../slices/toastsReducer';
import { useDispatch, useSelector } from 'react-redux';

const FlutterwaveButton = ({
    initiateLink,
    confirmLink,
    successCallback,
    errorCallBack,
    finalCallBack,
    initiatePayload,
    payload,
    coupon,
    title = "PAY",
    showPrice = true,
    background = "",
    color = "",
    style = {},
    price,
    description,
    country,
    manual
}) => {

    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState(null);
    const { isAdmin, dashboard, user } = useSelector((state) => state.user);
    const isAdminShown = isAdmin && dashboard === "admin" ? true : false;
    const dispatch = useDispatch();
    const navigate = useNavigate();


    function initiatePayment() {
        setLoading(true)
        axios({
            url: `${initiateLink}`,
            method: "POST",
            data: initiatePayload,
        }).then(data => {
            // console.log("data: ", data);
            if (data.data?.status === "success") {
                dispatch(showToast({
                    type: "info",
                    message: "Redirecting to payment page...",
                    duration: 5000
                }))

                if (manual) {
                    navigate(manual);
                    setLoading(false);
                    return;
                }

                const newConfig = {
                    public_key: isAdminShown ? "FLWPUBK_TEST-7217bfc9bf24794b1d11bba35c1bab18-X" : "FLWPUBK-e0e52c06b42b3123b8656c9a879c2215-X", //Ameer
                    // public_key: "FLWPUBK_TEST-188405db052e39c446317fc265c0cc97-X", //Ameer
                    // public_key: "FLWPUBK_TEST-7217bfc9bf24794b1d11bba35c1bab18-X", //Bam
                    // public_key: "FLWPUBK_TEST-7e5e437d158c856bbe2fc2f94ab040c6-X", //HighB
                    // public_key: "FLWPUBK-f2801afdf127dbb02f2adced0d298880-X", //Bam
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
                        title: "Global Sports Trade",
                        description: description,
                        logo: "https://globalsportstrade.vercel.app/logo.png",
                    },
                };

                // console.log("Config: ", newConfig);

                setConfig(newConfig)

                // Step 3: Initialize Flutterwave payment

            } else {
                try {
                    if (errorCallBack) {
                        errorCallBack(data);
                    }
                } catch (error) {
                    dispatch(showToast({
                        type: "error",
                        message: "An error occured, try again or contact support",
                        duration: 4000
                    }))
                }
                setLoading(false);
            }
        }).catch(error => {
            dispatch(showToast({
                type: "error",
                message: "An error occured, Check network and try again",
                duration: 4000
            }))
            console.error(error);
            setLoading(false);
        })
    }


    // console.log("Config: ", config);

    return (
        <>
            {config && <StartPayment
                config={config}
                setConfig={setConfig}
                setLoading={setLoading}
                finalCallBack={finalCallBack}
                confirmLink={confirmLink}
            />}
            <div className="cart-container42 cursor-pointer" id="paymentButton" onClick={loading ? null : initiatePayment} style={{
                backgroundColor: background,
                color: color,
                ...style
            }}>
                <span>
                    <span id="paymentPriceCont">
                        <LoadingButton loading={loading} height={26} width={26} color='#fff'>
                            {title} {showPrice && `${country}${formatNumber(price)}`}
                        </LoadingButton>
                    </span>
                </span>
            </div>
        </>
    )
}

const StartPayment = ({ config, setConfig, setLoading, finalCallBack, confirmLink }) => {

    const handleFlutterPayment = useFlutterwave(config);

    const dispatch = useDispatch();

    useEffect(() => {
        async function startPayment() {
            if (config) {
                try {
                    handleFlutterPayment({
                        callback: (response) => {
                            // console.log("Payment response:", response);
                            closePaymentModal(); // close modal programmatically
                            if (response.status == 'successful' || response.status == 'completed') {
                                confirmPayment(response.tx_ref, config.customer.email);
                            } else if (response.status == "success-pending-validation" || response.status == "pending") {
                                dispatch(showToast({
                                    type: "warning",
                                    message: "Payment pending. Update via email",
                                    duration: 6000
                                }))
                                setLoading(false);
                            } else {
                                dispatch(showToast({
                                    type: "error",
                                    message: "Payment failed",
                                    duration: 4000
                                }))
                                setLoading(false);
                            }
                            setConfig(null);
                        },
                        onClose: () => {
                            dispatch(showToast({
                                type: "warning",
                                message: "Payment cancelled",
                                duration: 4000
                            }))
                            setLoading(false);
                            // setTimeout(() => {
                                // setConfig(null);
                            // }, 10000)
                            // console.log("Payment cancelled");
                        },
                    });
                } catch (error) {
                    dispatch(showToast({
                        type: "error",
                        message: "An error occured, Check network and try again",
                        duration: 4000
                    }))
                    setConfig(false);
                    setLoading(false);
                }
            }
        }

        startPayment();
    }, [config])

    function confirmPayment(tx_ref, email) {
        axios({
            url: `${confirmLink}`,
            method: "POST",
            data: {
                tx_ref
            }
        }).then(res => {
            // console.log("res inside: ", res, res.data);
            finalCallBack(res)
            // if (res.status === "success") {
            //     // saveAccessCode(res.accessCode);
            // } else if (res.data.status === "update") {

            // } else if (res.data.status === "login") {

            // } else {
            //     showToast({
            //         type: "warning",
            //         message: res.message,
            //         duration: 4000
            //     })
            // }
        }).catch(err => {
            console.error(err);
            dispatch(showToast({
                type: "error",
                message: "Network error while confirming payment. Contact Support",
                duration: 4000
            }))
        }).finally(() => {
            setLoading(false);
        })
    }
}

export default FlutterwaveButton
