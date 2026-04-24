import React, { useEffect, useState } from 'react';
import './styles/home.css';
import Header from '../components/header';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../slices/userReducer';
import Fixtures from '../components/fixtures';
import { Link, Outlet } from 'react-router';
import { selectNetTotal } from '../slices/netTotal';
import Loading from '../components/loading';
import formatNumber from '../functions/formatNumber';

const Home = () => {
    const { isAuthenticated, user, userQueried } = useSelector(state => state.user);
    const { country, factor } = useSelector(state => state.data);
    const cart = useSelector(state => state.cart);
    const netTotal = useSelector(selectNetTotal);
    const dispatch = useDispatch();

    const [cartData, setCartData] = useState();

    // console.log("User: ", user, isAuthenticated, cart, factor);

    return (
        <>
            <div className="dag-container w-full flex min-h-screen overflow-x-hidden items-center flex-col">
                <div className="dag-container04 top-[49px] flex-[0_0_auto] w-full flex fixed overflow-x-hidden items-center pt-2.5 bg-cover justify-end bg-black" style={{ backgroundImage: 'url(assets/background.jpg)' }}>                    <img alt="image" src="/assets/ronaldo.png" className="dag-image1 w-auto h-[300px] object-cover" />
                    <div className="dag-container05 top-0 flex-[0_0_auto] left-0 text-black w-full h-full flex absolute items-center justify-between">
                        <div className="dag-container06 flex-[0_0_auto] w-[70%] h-full flex p-5 items-start flex-col">
                            <span className="dag-digital text-white p-2.5 text-2xl font-black leading-[2] rounded-none rounded-tr-[15px] rounded-br-[15px]">
                                <span>GLOBAL</span>
                                <br />
                                <span>SPORTS</span>
                                <br />
                                <span>TRADE</span>
                                <br />
                            </span>
                            <span className="dag-text09 p-2.5 text-lg font-medium bg-white/70 backdrop-blur-[3px] rounded-[5px]">Accuracy with AI</span>
                        </div>
                    </div>
                </div>
                {userQueried ?
                    <Fixtures />
                    :
                    <div className='dag-container07 w-full h-auto relative mt-[300px] min-h-full overflow-x-hidden text-center mx-2.5 pt-0 px-0 mb-0 pb-0'>
                        <div className='dag-container08 flex-[0_0_auto] w-full h-10 flex mb-[-1px] bg-gradient-to-b from-transparent to-[#fdfdee]' />
                        <div className='dag-container09 flex-[0_0_auto] w-full h-auto min-h-[calc(100vh-50px)] flex items-start pt-5 flex-col pb-[140px] bg-[#fdfdee]'>
                            <div className='dag-container10 w-full h-auto flex flex-col pb-5 bg-[#fdfdee]'>
                                <div className="main-loading w-full h-[200px] flex items-center justify-center">
                                    <Loading />
                                </div>

                            </div>
                        </div>
                    </div>
                }
                <Link className="dag-container18 fill-white flex-[0_0_auto] text-white right-[25px] bottom-[15px] h-[50px] flex fixed shadow-[0_0_5px_0_rgba(0,0,0,0.5)] items-center border-white border-2 pl-[15px] rounded-[20px] pr-[15px] bg-green-600" to="/cart">
                    <div className="dag-container19 flex-[0_0_auto] w-auto h-auto flex items-center flex-row border-r border-r-white pr-2.5">
                        <span className="dag-text26 text-sm" id="checkoutCurrencyCont" />
                        <span className="dag-text27 text-lg font-semibold" id="checkoutPriceCont">
                            PAY {country} {formatNumber(netTotal * factor)}
                        </span>
                    </div>
                    <div className="dag-container20 ml-2.5 flex-[0_0_auto] w-auto h-auto flex items-start mr-2.5">
                        <svg viewBox="0 0 1024 1024" className="dag-icon6 w-6 h-6">
                            <path d="M726 768q34 0 59 26t25 60-25 59-59 25-60-25-26-59 26-60 60-26zM42 86h140l40 84h632q18 0 30 13t12 31q0 2-6 20l-152 276q-24 44-74 44h-318l-38 70-2 6q0 10 10 10h494v86h-512q-34 0-59-26t-25-60q0-20 10-40l58-106-154-324h-86v-84zM298 768q34 0 60 26t26 60-26 59-60 25-59-25-25-59 25-60 59-26z" />
                        </svg>
                    </div>
                    <div className="items-count font-bold" id="itemsCountCont">
                        <span> {cart.quantity}</span>
                    </div>
                </Link>
            </div>
            {<Outlet />}
        </>

    )
}

export default Home;