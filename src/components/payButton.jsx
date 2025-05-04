import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectNetTotal } from '../slices/netTotal';
import formatNumber from '../functions/formatNumber';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { baseApiUrl } from '../data/url';
import { closePaymentModal, useFlutterwave } from 'flutterwave-react-v3';

const PayButton = ({ }) => {

    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState(null);

    const netTotal = useSelector(selectNetTotal);
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const { country, factor } = useSelector((state) => state.data);
    const cart = useSelector((state) => state.cart);
    const coupon = useSelector((state) => state.data.coupon);
    const navigate = useNavigate();
    const handlePayment = useFlutterwave(config);

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
                                public_key: 'FLWPUBK_TEST-7217bfc9bf24794b1d11bba35c1bab18-X',
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

                    } else if (res.data.status === "login") {

                    } else {
                        alert(res.data.message);
                    }
                }).catch((err) => {
                    console.log(err);
                    alert("An error occured, please try again later");
                }).finally(() => {
                    setLoading(false);
                });
            }
        } else {
            alert("Please login to continue");
            navigate("/login");
        }
    }


    function checkOut() {
        setConfig(null);
        setLoading(true);
        handlePayment({
            callback: (response) => {
                console.log(response);
                if (response.status == 'successful' || response.status == 'completed') {
                    confirmPayment(response.tx_ref);
                } else {
                    alert("Payment failed, please try again later");
                    setLoading(false);
                }
                setTimeout(closePaymentModal(), 2000);
            },
            onClose: () => {
                alert("Payment failed, please try again later");
                setLoading(false);
            }
        })
    }

    function confirmPayment(tx_ref) {
        axios({
            url: `${baseApiUrl}/confirm-payment-test.php`,
            method: "POST",
            data: {
                tx_ref
            }
        }).then((res) => {
            console.log(res.data);
            if (res.data.status === "success") {
                alert("Payment successful");
                setTimeout(navigate("/my-matches"));
            } else if (res.data.status === "update") {

            } else if (res.data.status === "login") {

            } else {
                alert(res.data.message);
            }
        }).catch((err) => {
            console.log(err);
            alert("An error occured, please try again later");
        }).finally(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
        if (config) {
            checkOut();
        }
    }, [config])

    return (
        <div className="cart-container42" id="paymentButton" onClick={loading ? null : initiatePayment}>
            <span>PAY &nbsp;</span>
            <span>
                {" "}
                <span id="paymentPriceCont">{country} {formatNumber(netTotal * factor)}</span>
            </span>
        </div>
    )
}

export default PayButton;
