import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { selectNetTotal } from '../slices/netTotal';
import formatNumber from '../functions/formatNumber';
import { useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import { showToast } from '../slices/toastsReducer';
import { removeItems } from '../slices/cartReducer';
import LoadingButton from './loadingButton';

const PayButtonCrypto = ({
    payload,
    style = {},
    color = "",
    showPrice = true,
    defaultCurrency,
    title = "PAY",
    background = "#000",
    ready = false,
    className = "",
    initiateLink
}) => {
    const netTotal = useSelector(selectNetTotal);
    const { country, factor } = useSelector((state) => state.data);

    return (
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
    );
};

const PayButtonCryptoStart = ({
    title = "PAY",
    showPrice = true,
    background = "#000",
    color = "",
    style = {},
    payload,
    ready,
    amountText,
    initiateLink,
    className = ""
}) => {
    const { isAuthenticated } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { pathname } = useLocation();

    function initiatePayment() {
        if (isAuthenticated) {
            if (ready) {
                const data = payload;
                setLoading(true);
                axios({
                    url: initiateLink,
                    method: "POST",
                    data: data,
                }).then((res) => {
                    if (res.data.status === "success") {
                        if (window.confirm(`Are you sure you want to pay ${res.data.data.currency} ${res.data.data.price}`)) {
                            window.location.href = res.data.payment_link;
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

    const defaultBg = background || "#12131f";

    return (
        <button
            type="button"
            id="paymentButton"
            onClick={loading ? null : initiatePayment}
            disabled={loading}
            style={{
                backgroundColor: defaultBg,
                color: color || '#fff',
                ...style
            }}
            className={`min-w-[140px] px-6 py-3 rounded-xl font-bold text-sm text-white
                       border border-white/10 hover:border-white/20
                       shadow-sm hover:shadow
                       hover:brightness-110 active:scale-[0.98] transition-all
                       flex items-center justify-center cursor-pointer select-none
                       disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        >
            <LoadingButton className={"sans"} loading={loading} height={24} width={24} color="#fff">
                {title} {showPrice && amountText}
            </LoadingButton>
        </button>
    );
};

export default PayButtonCrypto;
