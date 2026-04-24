import { useDispatch } from 'react-redux';
import { useState } from 'react'
import { useSelector } from 'react-redux';
import { selectNetTotal } from '../slices/netTotal';
import formatNumber from '../functions/formatNumber';
import { useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import { baseApiUrl } from '../data/url';
import { showToast } from '../slices/toastsReducer';
import { removeItems } from '../slices/cartReducer';
import LoadingButton from './loadingButton';
import { title } from 'framer-motion/client';

const PayButtonCrypto = ({ payload, style = {}, color = "", showPrice = true, defaultCurrency, title = "PAY", background = "#000", ready = false, amountText, className, initiateLink }) => {
    const netTotal = useSelector(selectNetTotal);
    const { isAdmin, dashboard } = useSelector((state) => state.user);
    const isAdminShown = isAdmin && dashboard === "admin" ? true : false;
    const { country, factor } = useSelector((state) => state.data);

    // {
    //                 items: cart?.items?.map(item => item.id),
    //                 coupon: coupon?.coupon
    //             }

    return(
        <PayButtonCryptoStart
            payload={payload}
            style={style}
            color={color}
            showPrice={showPrice}
            defaultCurrency={defaultCurrency}
            title={title}
            background={background}
            ready={ready}
            amountText={defaultCurrency ? `$${formatNumber(netTotal * 0.1)}` : `${country} ${formatNumber(netTotal * factor)}`}
            initiateLink={initiateLink}
            className={className}
        />
    )
}

const PayButtonCryptoStart = ({ defaultCurrency, title = "PAY", showPrice = true, background = "#000", color = "", style = {}, payload, ready, amountText, initiateLink, className }) => {

    const { isAuthenticated} = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { pathname } = useLocation();

    function initiatePayment() {
        if (isAuthenticated) {
            if (ready) {
                const data = payload
                // console.log(data);
                setLoading(true);
                axios({
                    url: initiateLink,
                    method: "POST",
                    data: data,
                }).then((res) => {
                    // console.log(res.data);
                    if (res.data.status === "success") {
                        if (window.confirm(`Are you sure you want to pay ${res.data.data.currency} ${res.data.data.price}`)) {
                            window.location.href = res.data.payment_link;
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
                            message: res.data.message,
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
            navigate("/login", { state: { redirect: pathname } });
        }
    }

    return (
        <div className={`cart-container42 cursor-pointer hover:scale-105 transition-all ${className || "" }`} id="paymentButton" onClick={loading ? null : initiatePayment} style={{
            backgroundColor: background,
            color: color,
            ...style
        }}>
            <span>
                <span id="paymentPriceCont">
                    <LoadingButton loading={loading} height={26} width={26} color='#fff'>
                        {title} {showPrice && amountText}
                    </LoadingButton>
                </span>
            </span>
        </div>
    )
}

export default PayButtonCrypto;
