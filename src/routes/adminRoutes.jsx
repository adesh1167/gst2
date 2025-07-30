import React from 'react'
import { Navigate, Routes, Route, useLocation } from 'react-router'
import Home from './home'
import UploadMatches from './admin/uploadMatches'
import SelectCountry from './selectCountry'
import Cart from './cart'
import Coupon from './coupon'
import { useSelector } from 'react-redux'
import SelectCurrency from './selectCurrency'
import Coupons from './admin/coupons'
import EditCoupon from './admin/editCoupon'
import ManualPayment from '../components/manualPayment'

const AdminRoutes = () => {

    const { firstLoad, country, currency, continent, factor } = useSelector((state) => state.data);
    const { isAuthenticated, user } = useSelector(state => state.user);

    const { pathname } = useLocation();

    const isAfrica = continent === "AF" ? true : false;

    const isCountrySelected = (isAfrica && country) || (!isAfrica && currency);

    // console.log(pathname, firstLoad, continent, country, currency, factor);

    return (
        <>
            <Routes>
                <Route path='/' element={<Home />}>
                    <Route index element={<Navigate to="/admin" />} />
                    <Route path="country" element={isAfrica ? <SelectCountry exitable={false} /> : <SelectCurrency exitable={false} />} />
                    <Route path="change-country" element={isAfrica ? <SelectCountry /> : <SelectCurrency />} />
                    <Route path="cart" element={<Cart />}>
                        <Route path="manual-payment" element={<ManualPayment />} />
                    </Route>
                    <Route path="coupon/:id" element={<Coupon />} />
                    <Route path="*" element={<Navigate to="/admin" />} />
                </Route>
                <Route path='/admin' element={<Home />}>
                </Route>
                <Route path='/admin/coupons' element={<Coupons/>}>
                    <Route path="new" element={<EditCoupon edit={false}/>} />
                    <Route path="edit/:id" element={<EditCoupon/>} />
                </Route>
                <Route path="/admin/upload-matches" element={<UploadMatches />} />
                <Route path='*' element={<h1>404</h1>} />
            </Routes>

            
            {(firstLoad && !isCountrySelected) && <Navigate to="/country" replace />}
            {(firstLoad && isCountrySelected && pathname === "/country") && <Navigate to="/" replace />}
        </>
    )
}

export default AdminRoutes
