import { useParams, useNavigate } from 'react-router'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { setCoupon } from '../slices/dataReducer';
import axios from 'axios';
import { baseApiUrl } from '../data/url';
import { showToast } from '../slices/toastsReducer';

const Coupon = () => {

const {id} = useParams();
const dispatch = useDispatch();
const navigate = useNavigate();

function applyCoupon() {
    axios({
        url: `${baseApiUrl}/check-coupon.php`,
        data: { coupon: id },
        method: "POST"
    }).then(res => {
        console.log(res)
        if (res.data.status == "success") {
            dispatch(setCoupon(res.data.data));
        } else {
            dispatch(setCoupon(null))
            dispatch(showToast({
                message: res.data.message,
                type: "error",
                duration: 3000
            }))
        }
    }).catch(err => {
        console.log(err);
    }).finally(()=>{
        navigate('/', {replace: true});
    })
}

useEffect(()=>{
    applyCoupon();
}, [])

}

export default Coupon
