import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router'
import CartItem from '../components/cartItem';
import { clearCart } from '../slices/cartReducer';
import { selectNetTotal } from '../slices/netTotal';
import formatNumber from '../functions/formatNumber';
import axios from 'axios';
import { baseApiUrl } from '../data/url';
import { setCoupon } from '../slices/dataReducer';
import PayButton from '../components/payButton';
import LoadingButton from '../components/loadingButton';
import { showToast } from '../slices/toastsReducer';
import Tick from '../components/tick';

const Cart = () => {

    const cartObj = useSelector(state => state.cart);
    const { factor, country } = useSelector(state => state.data)
    const cart = cartObj.items;
    const netTotal = useSelector(selectNetTotal) * factor;
    const { quantity, total } = cartObj;
    const coupon = useSelector(state => state.data.coupon);
    const [couponText, setCouponText] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);
    const [emptyCartFlag, setEmptyCartFlag] = useState(false);

    // console.log("netTotal: ", netTotal);
    const dispatch = useDispatch();

    const navigate = useNavigate();


    function emptyCart() {
        dispatch(clearCart());
    }

    function applyCoupon(e) {
        e.preventDefault();
        if (couponText === "") {
            dispatch(showToast({
                message: "Enter A Coupon",
                type: "warning",
                duration: 3000
            }))
            return;
        }
        setCouponLoading(true);
        axios({
            url: `${baseApiUrl}/check-coupon.php`,
            data: { coupon: couponText },
            method: "POST"
        }).then(res => {
            // console.log(res)
            if (res.data.status == "success") {
                dispatch(showToast({
                    message: `${res.data.data.coupon} applied`,
                    type: "success",
                    duration: 3000
                }))
                dispatch(setCoupon(res.data.data));
                setCouponText("");
            } else {
                dispatch(setCoupon(null))
                dispatch(showToast({
                    message: res.data.message,
                    type: "error",
                    duration: 3000
                }))
            }
        }).catch(err => {
            dispatch(showToast({
                message: "An error occurred, check your network and try again",
                type: "error",
                duration: 3000
            }))
            console.log(err);
        }).finally(() => {
            setCouponLoading(false);
        })
    }

    // console.log("Coupon: ", couponText, cartObj.quantity, coupon?.min_matches && coupon.min_matches > cartObj.quantity)

    return (
        <div className="cart" id="cartContainer" style={{ display: "block" }}>
            <div className="close-cart" onClick={() => navigate(-1)}>
                <svg viewBox="0 0 1024 1024" fill="white" width="16px" height="16px">
                    <path d="M1014.662 822.66c-0.004-0.004-0.008-0.008-0.012-0.010l-310.644-310.65 310.644-310.65c0.004-0.004 0.008-0.006 0.012-0.010 3.344-3.346 5.762-7.254 7.312-11.416 4.246-11.376 1.824-24.682-7.324-33.83l-146.746-146.746c-9.148-9.146-22.45-11.566-33.828-7.32-4.16 1.55-8.070 3.968-11.418 7.31 0 0.004-0.004 0.006-0.008 0.010l-310.648 310.652-310.648-310.65c-0.004-0.004-0.006-0.006-0.010-0.010-3.346-3.342-7.254-5.76-11.414-7.31-11.38-4.248-24.682-1.826-33.83 7.32l-146.748 146.748c-9.148 9.148-11.568 22.452-7.322 33.828 1.552 4.16 3.97 8.072 7.312 11.416 0.004 0.002 0.006 0.006 0.010 0.010l310.65 310.648-310.65 310.652c-0.002 0.004-0.006 0.006-0.008 0.010-3.342 3.346-5.76 7.254-7.314 11.414-4.248 11.376-1.826 24.682 7.322 33.83l146.748 146.746c9.15 9.148 22.452 11.568 33.83 7.322 4.16-1.552 8.070-3.97 11.416-7.312 0.002-0.004 0.006-0.006 0.010-0.010l310.648-310.65 310.648 310.65c0.004 0.002 0.008 0.006 0.012 0.008 3.348 3.344 7.254 5.762 11.414 7.314 11.378 4.246 24.684 1.826 33.828-7.322l146.746-146.748c9.148-9.148 11.57-22.454 7.324-33.83-1.552-4.16-3.97-8.068-7.314-11.414z" />
                </svg>
                <span>Close Cart</span>
            </div>
            <div className="cart-wrapper">
                <div className="cart-container01">
                    <div className="cart-container02">
                        <div className="cart-container03">
                            <span className="cart-text">SELECTED MATCHES</span>
                            <span className="cart-description">
                                Selections of matches you pay for will be seen under{" "}
                                <Link className="cart-link" to="/my-matches">
                                    MY MATCHES
                                </Link>{" "}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="cart-container">
                    <div className="cart-container05" id="cartItems">
                        {cart.length > 0 ?
                            cart.map(item =>
                                <CartItem key={item.id} item={item} />
                            )
                            :
                            <span class="empty-cart-message">
                                <img src='/assets/empty-cart.png' />
                                Cart is empty
                            </span>
                        }
                    </div>
                    {cart.length > 0 && <div className="remove-all" id="removeAllItemsCont">
                        <div className="cart-container04" id="removeAllItemsButton" onClick={emptyCart}>
                            <span>Remove All</span>
                            <svg viewBox="0 0 1024 1024" className="cart-icon">
                                <path d="M512 128c-211.755 0-384 172.288-384 384s172.245 384 384 384 384-172.288 384-384-172.245-384-384-384zM512 810.667c-164.651 0-298.667-133.973-298.667-298.667s134.016-298.667 298.667-298.667 298.667 133.973 298.667 298.667-134.016 298.667-298.667 298.667z" />
                                <path d="M542.165 512l112.896-112.896c8.277-8.277 8.277-21.845 0-30.165-8.32-8.277-21.888-8.277-30.165 0l-112.896 112.896-112.896-112.939c-8.32-8.277-21.888-8.277-30.165 0-8.32 8.32-8.32 21.888 0 30.165l112.896 112.939-112.896 112.896c-8.32 8.32-8.32 21.888 0 30.165 4.139 4.181 9.6 6.272 15.061 6.272s10.923-2.091 15.104-6.229l112.896-112.939 112.896 112.896c4.181 4.181 9.643 6.272 15.104 6.272s10.923-2.091 15.104-6.229c8.277-8.277 8.277-21.845 0-30.165l-112.939-112.939z" />
                            </svg>
                        </div>
                    </div>}
                    <div className="empty-cart-flag" id="emptyCartFlagCont">
                        <label htmlFor='emptyCartFlagInput'>Empty cart after payment <Tick checked={emptyCartFlag} /></label>
                        <input className="empty-cart-input" id='emptyCartFlagInput' type="checkbox" value={emptyCartFlag} onChange={e => setEmptyCartFlag(e.target.checked)} />
                    </div>
                    <div className="cart-container34">
                        <div className="cart-container35">
                            <div className="cart-container36">
                                <span className="cart-text46">SUMMARY</span>
                            </div>
                            <form className="cart-container37" onSubmit={couponLoading ? e => e.preventDefault() : applyCoupon}>
                                <input
                                    type="text"
                                    placeholder="Promo Code"
                                    className="cart-textinput input"
                                    id="couponInput"
                                    value={couponText}
                                    onChange={(e) => setCouponText(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="cart-button button"
                                    id="couponButton"
                                >
                                    <LoadingButton loading={couponLoading}>Apply</LoadingButton>
                                </button>
                            </form>
                            <div className="cart-container38">
                                <span>TOTAL</span>
                                <span>
                                    {" "}
                                    <span id="cartCheckoutPriceCont">{country} {formatNumber(total * factor)}</span>
                                </span>
                            </div>
                            {coupon &&
                                (coupon?.min_matches && coupon.min_matches > cartObj.quantity ?
                                    <div>Coupon <span style={{ fontWeight: 'bold' }}>{coupon.coupon}</span> only applies on {coupon.min_matches} or more matches</div>
                                    :
                                    <div
                                        className="coupon-details"
                                        id="couponDetailsCont"
                                    >
                                        <div className="cart-container39">
                                            <div className="cart-container40">
                                                <span id="couponMessageCont">{coupon?.coupon} applied &nbsp;</span>
                                                <svg width={20} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                                                </svg>

                                            </div>
                                            <span id="couponMessageCustomCont">{coupon?.message}</span>
                                        </div>
                                        <div className="cart-container41">
                                            <span>NEW TOTAL</span>
                                            <span>
                                                {" "}
                                                <span id="newCartCheckoutPriceCont">{country} {formatNumber(netTotal)}</span>
                                            </span>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    {cart.length > 0 ?
                        <PayButton emptyCartFlag={emptyCartFlag} emptyCart={emptyCart} />
                        :
                        <div className='cart-add-item-message'>
                            Add at least one match to cart to checkout
                        </div>
                    }
                    <Link className="change-country" id="changeCountry" to="/change-country">
                        Change Country
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Cart;
