import React from 'react'
import { Navigate, Routes, Route } from 'react-router'
import Home from './home'
import UploadMatches from './admin/uploadMatches'
import SelectCountry from './selectCountry'
import Cart from './cart'
import Coupon from './coupon'

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />}>            
                <Route path="country" element={<SelectCountry exitable={false} />} />
                <Route path="change-country" element={<SelectCountry />} />
                <Route path="cart" element={<Cart />} />
                <Route path="coupon/:id" element={<Coupon />} />
                <Route path="*" element={<Navigate to="/admin" />} />
            </Route>
            <Route path='/admin' element={<Home />}>
            </Route>
            <Route path="/admin/upload-matches" element={<UploadMatches />} />
            <Route path='*' element={<h1>404</h1>} />
        </Routes>
    )
}

export default AdminRoutes
