import React, { useEffect, useState } from 'react';
import './styles/home.css';
import Header from '../components/header';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../slices/userReducer';
import Fixtures from '../components/fixtures';
import { Link, Outlet } from 'react-router';
import { selectNetTotal } from '../slices/netTotal';

const Home = () => {
    const { isAuthenticated, user } = useSelector(state => state.user);
    const {country, factor} = useSelector(state => state.data);
    const cart = useSelector(state => state.cart);
    const netTotal = useSelector(selectNetTotal);
    const dispatch = useDispatch();

    const [cartData, setCartData] = useState();

    console.log("User: ", user, isAuthenticated, cart, factor);

    return (
        <>
            <main>
                <div className="dag-container">
                    <Header />
                    <div className="dag-container04">
                        <img alt="image" src="/assets/ronaldo.png" className="dag-image1" />
                        <div className="dag-container05">
                            <div className="dag-container06">
                                <span className="dag-digital" onClick={() => {
                                    console.log("Pressed")
                                    dispatch(
                                        login({
                                            user: { name: "Adesile", email: "adesh1167@gmail.com" },
                                            isAuthenticated: true
                                        })
                                    )
                                }}>
                                    <span>GLOBAL</span>
                                    <br />
                                    <span>SPORTS</span>
                                    <br />
                                    <span>TRADE</span>
                                    <br />
                                </span>
                                <span className="dag-text09">Accuracy with AI</span>
                            </div>
                        </div>
                    </div>
                    <Fixtures />
                    <Link className="dag-container18" onclick="showCart()" to="/cart">
                        <div className="items-count" id="itemsCountCont">
                            <span> {cart.quantity}</span>
                        </div>
                        <div className="dag-container19">
                            <span className="dag-text26" id="checkoutCurrencyCont" />
                            <span className="dag-text27" id="checkoutPriceCont">
                                {country}{netTotal * factor}
                            </span>
                        </div>
                        <div className="dag-container20">
                            <svg viewBox="0 0 1024 1024" className="dag-icon6">
                                <path d="M726 768q34 0 59 26t25 60-25 59-59 25-60-25-26-59 26-60 60-26zM42 86h140l40 84h632q18 0 30 13t12 31q0 2-6 20l-152 276q-24 44-74 44h-318l-38 70-2 6q0 10 10 10h494v86h-512q-34 0-59-26t-25-60q0-20 10-40l58-106-154-324h-86v-84zM298 768q34 0 60 26t26 60-26 59-60 25-59-25-25-59 25-60 59-26z" />
                            </svg>
                        </div>
                    </Link>
                </div>
            </main>
            <Outlet />
        </>

    )
}

export default Home;