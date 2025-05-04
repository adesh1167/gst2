import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router";
import Home from "./home";
import SelectCountry from "./selectCountry";
import { useSelector } from "react-redux";
import Cart from "./cart";
import Coupon from "./coupon";
import Login from "./login";
import Register from "./register";
import MyMatches from "./myMatches";
import About from "./about";

const UserRoutes = ({ }) => {

    const { firstLoad, country } = useSelector((state) => state.data);
    const { isAuthenticated, user } = useSelector(state => state.user);

    const { pathname } = useLocation();

    console.log(pathname, firstLoad, country, firstLoad && country && pathname === "/country");

    return (
        <>
            <Routes>
                <Route path="/" element={<Home />}>
                    <Route path="country" element={<SelectCountry exitable={false} />} />
                    <Route path="change-country" element={<SelectCountry />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="coupon/:id" element={<Coupon />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="/my-matches" element={<MyMatches />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
            </Routes>

            {(firstLoad && !country) && <Navigate to="/country" replace />}
            {(firstLoad && country && pathname === "/country") && <Navigate to="/" replace />}
        </>
    )
}

export default UserRoutes;