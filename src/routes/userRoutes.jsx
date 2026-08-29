import React from "react";
import { Routes, Route, Navigate } from "react-router";
import Home from "./home";
import Coupon from "./coupon";
import { useSelector } from "react-redux";

const UserRoutes = () => {
    const { firstLoad } = useSelector((state) => state.data);

    return (
        <Routes>
            <Route path="/" element={<Home />}>
                <Route path="coupon/:id" element={<Coupon />} />
            </Route>
            <Route path="*" element={firstLoad ? <Navigate to="/" replace /> : null} />
        </Routes>
    );
};

export default UserRoutes;