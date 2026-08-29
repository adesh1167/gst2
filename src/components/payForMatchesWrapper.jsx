import { useDispatch } from 'react-redux';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectNetTotal } from '../slices/netTotal';
import { baseApiUrl } from '../data/url';
import { showToast } from '../slices/toastsReducer';
import { removeItems } from '../slices/cartReducer';
import { unavailablePayments } from '../data/unavaiablePayments';
import FlutterwaveButton from './payButton2';
import { useLocation, useNavigate } from 'react-router';

import { useIsAdmin } from '../hooks/useIsAdmin';

const PayForMatchesWrapper = ({ emptyCart, emptyCartFlag, title = "PAY", showPrice = true, background = "", color = "", style = {}, className }) => {

    const [manualLink, setManualLink] = useState(null);

    const netTotal = useSelector(selectNetTotal);
    const isAdminShown = useIsAdmin();
    const { country, factor } = useSelector((state) => state.data);
    const cartItems = useSelector((state) => state.cart.items);
    const coupon = useSelector((state) => state.data.coupon);
    const navigate = useNavigate();
    const {pathname} = useLocation();

    const dispatch = useDispatch();

    useEffect(() => {
        if (country && unavailablePayments.includes(country)) {
            setManualLink({ type: 'matches' });
        } else {
            setManualLink(null);
        }
    }, [country])

    const initiatePayload = useMemo(() => {
        return {
            items: cartItems?.map(item => item.id),
            coupon: coupon?.coupon
        }
    }, [cartItems, coupon?.coupon])

    const finalCallBack = useCallback((res) => {
        // console.log("Res outside: ", res);
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
            if (emptyCartFlag && emptyCart) emptyCart();
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
    }, [dispatch, emptyCartFlag, emptyCart, navigate])

    const errorCallBack = useCallback((res) => {
        // console.log(res)
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
            dispatch(showToast({
                message: "Please login to continue",
                type: "error",
                duration: 3000
            }))
            navigate("/login", { state: { redirect: pathname}});
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
            className={className}
        />
    )
}

export default PayForMatchesWrapper;
