import { useDispatch } from 'react-redux';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectNetTotal } from '../slices/netTotal';
import { baseApiUrl } from '../data/url';
import { showToast } from '../slices/toastsReducer';
import { removeItems } from '../slices/cartReducer';
import { unavailablePayments } from '../data/unavaiablePayments';
import FlutterwaveButton from './payButton2';
import { useNavigate } from 'react-router';

const PayForMatchesWrapper = ({ emptyCart, emptyCartFlag, title = "PAY", showPrice = true, background = "", color = "", style = {} }) => {

    const [loading, setLoading] = useState(false);
    const [manualLink, setManualLink] = useState(null);
    const [config, setConfig] = useState(null);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const navCounter = useRef(0);

    const netTotal = useSelector(selectNetTotal);
    const { isAdmin, dashboard } = useSelector((state) => state.user);
    const isAdminShown = isAdmin && dashboard === "admin" ? true : false;
    const { country, factor } = useSelector((state) => state.data);
    const cart = useSelector((state) => state.cart);
    const coupon = useSelector((state) => state.data.coupon);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    useEffect(() => {
        if (country && unavailablePayments.includes(country)) {
            setManualLink("/cart/manual-payment");
        }
    }, [country])

    // console.log("Is Payment Open: ", isPaymentOpen, navCounter);

    const initiatePayload = useMemo(() => {
        return {
            items: cart?.items?.map(item => item.id),
            coupon: coupon?.coupon
        }
    }, [cart, coupon])

    const finalCallBack = useCallback((res) => {
        console.log("Res outside: ", res);
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
            setTimeout(() => navigate("/my-matches"), 3000);
        } else if (res.data.status === "update") {

        } else if (res.data.status === "login") {

        } else {
            dispatch(showToast({
                message: res.data.message,
                type: "warning",
                duration: 3000
            }))
        }
    }, [])

    const errorCallBack = useCallback((res) => {
        if (res.data.status === "update") {
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
    }, [])

    return (

        <FlutterwaveButton
            initiateLink={`${baseApiUrl}/initiate-payment.php`}
            confirmLink={`${baseApiUrl}/${isAdminShown ? "confirm-payment-test" : "confirm-payment"}.php`}
            errorCallBack={errorCallBack}
            finalCallBack={finalCallBack}
            initiatePayload={initiatePayload}
            coupon={coupon}
            title='PAY'
            price={netTotal * factor}
            showPrice={true}
            country={country}
            description={`Pay For Matches`}
            manual={manualLink}
        />
    )
}

export default PayForMatchesWrapper;
