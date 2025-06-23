import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './styles/coupons.css';
import axios from 'axios';
import { baseApiUrl } from '../../data/url';
import { getMyMatchTime } from '../../functions/formatDate';
import Loading from '../../components/loading';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { showToast } from '../../slices/toastsReducer';

const Coupons = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const locationState = location.state;

    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    function getCoupons() {
        axios({
            url: `${baseApiUrl}/get-coupons.php`,
            method: "POST",
        }).then((res) => {
            // console.log(res.data);
            setCoupons(res.data.coupons)
            setLoading(false);
        }).catch((err) => {
            console.log(err);
            setLoading(false);
            setError('Unable to load coupons');
        })
    }

    useLayoutEffect(() => {
        getCoupons();
    }, [])

    function addCoupon() {
        navigate(`/admin/coupons/new`);
    }

    useEffect(() => {
        if (locationState?.updated) {
            // console.log(locationState);
            if (!loading && !error) {
                setCoupons(prev => {
                    const newCoupons = prev.map(coupon => {
                        if (coupon.id === locationState.id) {
                            return locationState.newData;
                        } else {
                            return coupon;
                        }
                    })
                    return newCoupons;
                })
            }
        }

        if (locationState?.added) {
            if (!loading && !error) {
                if (!coupons.find(coupon => coupon.id === locationState.newData.id)) {
                    setCoupons(prev => {
                        const newCoupons = [locationState.newData, ...prev];
                        return newCoupons;

                    })
                }
            }
        }
    }, [locationState]);

    return (
        <div className='coupons-page'>
            <h2>Manage Coupons</h2>

            {error ?
                <div className='error'>
                    <span>{error}</span>
                </div>
                :
                loading ?
                    <div className='loading'>
                        <div className='coupon-loading'>
                            <Loading />
                        </div>
                    </div>
                    :
                    <div className='coupons-list'>
                        {coupons.map((coupon, index) =>
                            <CouponItem couponData={coupon} key={coupon.id} setCoupons={setCoupons} />
                        )}
                    </div>

            }

            <div className='coupons-list-actions'>
                <button className='coupon-add-button' onClick={addCoupon}>ADD</button>
            </div>

            <Outlet />
        </div>
    )
}

const deleteCountdownFrom = 10;

const CouponItem = ({ couponData, setCoupons }) => {

    const { coupon, id, message, min_matches, min_matches_message, percent_off, expires } = couponData;

    const [toDelete, setToDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteCountDown, setDeleteCountDown] = useState(deleteCountdownFrom);

    const deleteCountDownInterval = useRef(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    function editCoupon() {
        navigate(`/admin/coupons/edit/${id}`, { state: { coupon: couponData } })
    }

    function initiateDelete() {
        setToDelete(true);
        setDeleteCountDown(deleteCountdownFrom - 1);
        deleteCountDownInterval.current = setInterval(() => {
            setDeleteCountDown(prev => {
                if (prev === 0) {
                    clearInterval(deleteCountDownInterval.current);
                    return prev;
                } else {
                    return prev - 1;
                }
            })
        }, 400)
    }

    useEffect(() => {
        if (deleteCountDown === 0 && toDelete) {
            doDelete();
        }
    }, [deleteCountDown])

    function stopDelete() {
        setToDelete(false);
        clearInterval(deleteCountDownInterval.current);
        setDeleteCountDown(deleteCountdownFrom);
    }

    function doDelete() {
        axios({
            url: `${baseApiUrl}/delete-coupon.php`,
            method: "POST",
            data: {
                id
            }
        })
            .then(res => {
                // console.log(res.data);
                if (res.data.status === 'success') {
                    dispatch(showToast({
                        type: "success",
                        message: "Coupon Deleted Successfully",
                        duration: 3000
                    }))

                    setCoupons(prev => {
                        const newCoupons = prev.filter(coupon => coupon.id !== id);
                        return newCoupons;
                    })
                } else {
                    dispatch(showToast({
                        type: "error",
                        message: res.data.message,
                        duration: 3000
                    }))
                    stopDelete();
                }
            })
            .catch(err => {
                console.log(err)
                dispatch(showToast({
                    type: "error",
                    message: "An error occured",
                    duration: 3000
                }))
                stopDelete();
            })
            .finally(() => {
            })
        // setDeleting(false);
    }

    return (
        <div className='coupons-list-item'>
            <div className='coupons-list-item-info'>
                <h3>{coupon}</h3>
                <div className='coupon-details'>
                    {/* <div className='coupon-details-row'>
                        <span>{message}</span>
                    </div> */}
                    <div className='coupon-details-row'>
                        <span>{(percent_off * 100).toFixed(0)}% Off</span>
                        <span>Min: {min_matches || 0} Matches</span>
                    </div>
                    <div className='coupon-details-row'>
                        <span>Expires {getMyMatchTime(expires)}</span>
                    </div>


                </div>
            </div>
            <div className='coupon-deleting-overlay' style={{
                width: `${(deleteCountdownFrom - deleteCountDown) / deleteCountdownFrom * 100}%`,
                opacity: `${(deleteCountdownFrom - deleteCountDown) / deleteCountdownFrom}`
            }}></div>
            {toDelete ?
                <div className='coupons-list-item-actions'>
                    <button className='danger' onClick={stopDelete}>Cancel</button>
                </div>
                :
                <div className='coupons-list-item-actions'>
                    <button onClick={() => editCoupon(coupon)}>Edit</button>
                    <button className='danger' onClick={initiateDelete}>Delete</button>
                </div>
            }

        </div>
    )
}


export default Coupons
