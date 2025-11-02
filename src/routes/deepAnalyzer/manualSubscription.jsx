import { useNavigate, useLocation } from 'react-router'
import React, { useEffect, useLayoutEffect } from 'react'
import ManualPayment from '../../components/manualPayment'
import { useParams } from 'react-router'

const ManualSubscription = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { amount } = location.state || {}

    useEffect(() => {
        if (!amount) {
            navigate("/deep-analyzer", { replace: true });
        }
    }, [])

    return (
        <ManualPayment
            type="subscription"
            duration={id}
            amount={amount}
        />
    )
}

export default ManualSubscription
