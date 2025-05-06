import { createSelector } from "@reduxjs/toolkit";

const selectCart = state => state.cart;
const selectCoupon = state => state.data.coupon;

export const selectNetTotal = createSelector(
    [selectCart, selectCoupon],
    (cart, coupon) => {
        let total = cart.total;
        if(coupon && (!coupon.min_matches || coupon.min_matches <= cart.quantity)){
            total = total - (total * coupon.percent_off || 1);
        }
        // console.log('Coupon: ', coupon?.percent_off, total);
        return Math.max(total, 0);
    }
)