import { useLayoutEffect, useState } from "react";
import { replace, useLocation, useNavigate } from "react-router";
import { baseApiUrl } from "../../data/url";
import LoadingButton from "../../components/loadingButton";
import axios from "axios";

import "./styles/editCoupon.css";
import Loading from "../../components/loading";
import { useDispatch } from "react-redux";
import { showToast } from "../../slices/toastsReducer";
import { DateTime } from "luxon";

const EditCoupon = ({edit = true}) => {

    const navigate = useNavigate();
    const location = useLocation();
    const coupon = location.state?.coupon;
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState({
        update: false,
        add: false
    });

    useLayoutEffect(()=>{
        if(edit){
            if(coupon){
                setFormData({
                    id: coupon.id,
                    coupon: coupon.coupon,
                    description: coupon.message,
                    discount: coupon.percent_off,
                    minimum: coupon.min_matches,
                    minMessage: coupon.min_matches_message,
                    expiration: coupon.expires
                });
            } else{
                navigate("/admin/coupons", {replace: true});
            }
        }

    }, [])

    function setValue(field, value){
        setFormData({...formData, [field]: value});
    }

    function updateCoupon(){

        const currentData = {
            id: coupon.id,
            coupon: formData.coupon,
            message: formData.description,
            percent_off: formData.discount,
            min_matches: formData.minimum,
            min_matches_message: formData.minMessage,
            expires: DateTime.fromISO(formData.expiration).toFormat('yyyy-MM-dd HH:mm:ss')
        }

        setLoading({...loading, update: true});
        axios({
            url: `${baseApiUrl}/update-coupon.php`,
            method: "POST",
            data: formData
        })
        .then(res=>{
            // console.log(res.data);
            
            if(res.data.status === 'success'){
                dispatch(showToast({
                    type: "success",
                    message: "Coupon Updated Successfully",
                    duration: 3000
                }))

                navigate("/admin/coupons", {state: {
                    updated: true,
                    id: coupon.id,
                    newData: currentData
                }, replace: true});
            } else{
                dispatch(showToast({
                    type: "error",
                    message: res.data.message,
                    duration: 3000
                }))
            }
        })
        .catch(err=>{
            console.log(err);
            dispatch(showToast({
                type: "error",
                message: "An error occured",
                duration: 3000
            }))
        })
        .finally(()=>setLoading({...loading, update: false}));
    }

    function addCoupon(){

        const currentData = {
            coupon: formData.coupon,
            message: formData.description,
            percent_off: formData.discount,
            min_matches: formData.minimum,
            min_matches_message: formData.minMessage,
            expires: DateTime.fromISO(formData.expiration).toFormat('yyyy-MM-dd HH:mm:ss')
        }

        setLoading({...loading, add: true});
        axios({
            url: `${baseApiUrl}/add-coupon.php`,
            method: "POST",
            data: formData
        })
        .then(res=>{
            // console.log(res.data);
            
            if(res.data.status === 'success'){
                dispatch(showToast({
                    type: "success",
                    message: "Coupon Added Successfully",
                    duration: 3000
                }))

                navigate("/admin/coupons", {state: {
                    added: true,
                    newData: {...currentData, id: res.data.id}
                }, replace: true});
            } else{
                let localMessage;
                if(res.data.error_type === "duplicate_entry"){
                    localMessage = `Coupon ${currentData.coupon} already exists`;
                } else{
                    localMessage = "An error occured";
                }

                dispatch(showToast({
                    type: "error",
                    message: res.data.message || localMessage,
                    duration: 3000
                }))
            }
        })
        .catch(err=>{
            console.log(err);
            dispatch(showToast({
                type: "error",
                message: "An error occured",
                duration: 3000
            }))
        })
        .finally(()=>setLoading({...loading, add: false}));
    }

    // console.log(formData.expiration, DateTime.fromISO(formData.expiration).toFormat('yyyy-MM-dd HH:mm:ss'))


    return (
        <div className='edit-coupon'>
            <div className='back-drop' onClick={()=>navigate(-1)}/>
            <form onSubmit={e=>e.preventDefault()}>
                <h2>{edit ? "Edit" : "Add"} Coupon</h2>
                <div className='form-group'>
                    <label htmlFor='coupon-code'>Coupon</label>
                    <input type='text' id='coupon-code' value={formData.coupon} onChange={(e)=>setValue("coupon", e.target.value)}/>
                </div>
                <div className='form-group'>
                    <label htmlFor='coupon-description'>Description</label>
                    <input type='text' id='coupon-description' value={formData.description} onChange={(e)=>setValue("description", e.target.value)}/>
                </div>
                <div className='form-group'>
                    <label htmlFor='coupon-discount'>Discount</label>
                    <input type='text' id='coupon-discount' value={formData.discount} onChange={(e)=>setValue("discount", e.target.value)}/>
                </div>
                <div className='form-group'>
                    <label htmlFor='coupon-minimum'>Min. Matches</label>
                    <input type='text' id='coupon-minimum' value={formData.minimum} onChange={(e)=>setValue("minimum", e.target.value)}/>
                </div>
                <div className='form-group'>
                    <label htmlFor='coupon-min-message'>Min. Error</label>
                    <input type='text' id='coupon-min-message' value={formData.minMessage} onChange={(e)=>setValue("minMessage", e.target.value)}/>
                </div>
                <div className='form-group'>
                    <label htmlFor='coupon-expiration'>Expiration</label>
                    <input type="datetime-local" id='coupon-expiration' value={formData.expiration} onChange={(e)=>setValue("expiration", e.target.value)}/>
                </div>
                {edit ?
                    <div className='buttons'>
                        <button className="button" onClick={loading.add ? null : addCoupon}>
                            <LoadingButton loading={loading.add} color="#fff">Add As New</LoadingButton>
                        </button>
                        <button className="button" onClick={loading.update ? null : updateCoupon}>
                            <LoadingButton loading={loading.update} color="#fff" height={20} width={20}>Update</LoadingButton>
                        </button>
                        
                    </div>
                    :
                    <div className='buttons'>
                        <button className="button" onClick={loading.add ? null : addCoupon}>
                            <LoadingButton loading={loading.add} color="#fff">ADD</LoadingButton>
                        </button>
                    </div>
                }
            </form>
        </div>
    )
}

export default EditCoupon;