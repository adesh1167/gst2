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
import Loading from "../components/loading";
import Header from "../components/header";
import SelectCurrency from "./selectCurrency";
import ManualPayment from "../components/manualPayment";

const UserRoutes = ({ }) => {

    const { firstLoad, country, currency, continent } = useSelector((state) => state.data);
    const { isAuthenticated, user } = useSelector(state => state.user);

    const { pathname } = useLocation();

    const isAfrica = continent === "AF" ? true : false;

    const isCountrySelected = (isAfrica && country) || (!isAfrica && currency);

    // console.log(pathname, firstLoad, continent, country, currency);

    return (
        <>
            <Routes>
                <Route path="/" element={<Home />}>
                    <Route path="country" element={isAfrica ? <SelectCountry exitable={false} /> : <SelectCurrency exitable={false} />} />
                    <Route path="change-country" element={isAfrica ? <SelectCountry /> : <SelectCurrency />} />
                    <Route path="cart" element={<Cart />}>
                        <Route path="manual-payment" element={<ManualPayment />} />
                    </Route>
                    <Route path="coupon/:id" element={<Coupon />} />
                </Route>
                <Route path="*" element={firstLoad ? <Navigate to={"/"} replace /> : <Header />} />
            </Routes>

            {(firstLoad && !isCountrySelected) && <Navigate to="/country" replace />}
            {(firstLoad && isCountrySelected && pathname === "/country") && <Navigate to="/" replace />}
        </>
    )
}

export default UserRoutes;