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
import { useApp } from '../contexts/appContext';

import { useIsAdmin } from '../hooks/useIsAdmin';

const PayForSubscriptionWrapper = ({ title = "SUBSCRIBE", type = "weekly", showPrice = true, background = "", color = "", className, style = {} }) => {


    const { fetchDeepAnalyzerSubscription } = useApp();

    const [manualLink, setManualLink] = useState(null);

    const netTotal = useSelector(selectNetTotal);
    const isAdminShown = useIsAdmin();
    const { country, factor } = useSelector((state) => state.data);
    const navigate = useNavigate();
    const {pathname} = useLocation();

    const dispatch = useDispatch();

    useEffect(() => {
        if (country && unavailablePayments.includes(country)) {
            setManualLink({ type: 'subscription', duration: type });
        } else {
            setManualLink(null);
        }
    }, [country, type])

    // console.log("Is Payment Open: ", isPaymentOpen, navCounter);

    const initiatePayload = useMemo(() => {
        return {
            type: type,
        }
    }, [type])

    const finalCallBack = useCallback((res) => {
        // console.log("Res outside: ", res);
        if (res.data.status === "success") {
            dispatch(showToast({
                message: "Payment successful",
                type: "success",
                duration: 5000
            }))
            fetchDeepAnalyzerSubscription();
        } else if (res.data.status === "update") {

        } else if (res.data.status === "login") {

        } else {
            dispatch(showToast({
                message: res.data.message,
                type: "warning",
                duration: 3000
            }))
        }
    }, [dispatch, fetchDeepAnalyzerSubscription])

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
    }, [dispatch, navigate, pathname])

    return (

        <FlutterwaveButton
            initiateLink={`${baseApiUrl}/initiate-subscription.php`}
            confirmLink={`${baseApiUrl}/${isAdminShown ? "confirm-subscription-test" : "confirm-subscription"}.php`}
            errorCallBack={errorCallBack}
            finalCallBack={finalCallBack}
            initiatePayload={initiatePayload}
            coupon={null}
            title='SUBSCRIBE'
            price={netTotal * factor}
            showPrice={showPrice}
            country={country}
            description={`${title}`}
            manual={manualLink}
            style={style}
            background={background}
            className={className}
        />
    )
}

export default PayForSubscriptionWrapper;
