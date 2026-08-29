import React from 'react';
import { Navigate, Routes, Route } from 'react-router';
import Home from './home';
import UploadMatches from './admin/uploadMatches';
import Coupon from './coupon';
import Coupons from './admin/coupons';
import EditCoupon from './admin/editCoupon';
import SEO from '../components/seo';

const AdminRoutes = () => {
    return (
        <>
            <SEO
                title="Admin Management Portal | Global Sports Trade"
                noindex={true}
            />
            <Routes>
                <Route path='/' element={<Home />}>
                    <Route index element={<Navigate to="/admin" />} />
                    <Route path="coupon/:id" element={<Coupon />} />
                    <Route path="*" element={<Navigate to="/admin" />} />
                </Route>
                <Route path='/admin' element={<Home />} />
                <Route path='/admin/coupons' element={<Coupons />}>
                    <Route path="new" element={<EditCoupon edit={false} />} />
                    <Route path="edit/:id" element={<EditCoupon />} />
                </Route>
                <Route path="/admin/upload-matches" element={<UploadMatches />} />
                <Route path='*' element={<h1>404</h1>} />
            </Routes>
        </>
    );
};

export default AdminRoutes;
