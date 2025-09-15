import { Routes, Route, useNavigate, useLocation, redirect } from 'react-router';
import './App.css';
import UserRoutes from './routes/userRoutes';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { baseApiUrl } from './data/url';
import { setContinent, setCountry, setCurrency, setFactor, setFirstLoad } from './slices/dataReducer';
import { useDispatch, useSelector } from 'react-redux';
import { login, setUserQueried } from './slices/userReducer';
import Toasts from './components/toasts';
import { showToast } from './slices/toastsReducer';
import AdminRoutes from './routes/adminRoutes';
import { setFixtures, setFixturesLoaded } from './slices/fixturesReducer';
import MyMatches from './routes/myMatches';
import Login from './routes/login';
import Register from './routes/register';
import About from './routes/about';
import { setMatchesLoaded, setMyMatches } from './slices/myMatchesReducer';
import Welcome from './components/welcome';
import Header from './components/header';
import ForgotPassword from './routes/forgotPassword';
import ResetPassword from './routes/resetPassword';
import ManualPayment from './components/manualPayment';
import Menu from './components/menu';
import useWindowSize from './functions/useWindowSize';
import AppContext, { useApp } from './contexts/appContext';

axios.defaults.withCredentials = true;

function App() {

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { user, isAdmin, dashboard } = useSelector((state) => state.user);
  const { tAndCAccepted } = useSelector((state) => state.data);
  const { pathname } = useLocation()

  const { width, height } = useWindowSize();
  const {menuExpanded} = useApp();

  const navigate = useNavigate();

  useEffect(() => {
    // console.log(cart)
    if (cart) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart])

  useEffect(() => {
    dispatch(setFixturesLoaded(false));
  }, [dashboard])

  useEffect(() => {
    dispatch(setFixtures([]));
    dispatch(setFixturesLoaded(false));
    dispatch(setMyMatches([]));
    dispatch(setMatchesLoaded(false));
  }, [user])

  useEffect(() => {

    async function init() {

      if (pathname === "/persisted") {
        try {
          const res = await axios({
            method: "POST",
            url: `${baseApiUrl}/profile.php`,
          })

          console.log(res.data);
          if (!res.data.persisted) {
            sessionStorage.setItem("incognito", true);
            navigate("/", { replace: true });
          }

        } catch (error) {
          console.log(error);
          dispatch(showToast({
            message: "Network error occured, reload",
            type: "error",
            duration: 3000
          }))
        }
      }

      axios({
        method: "POST",
        url: `${baseApiUrl}/profile.php`,

      }).then((res) => {
        console.log(res.data)
        if (!res.data.persisted) {
          const isIncognito = sessionStorage.getItem("incognito", true);
          if (!isIncognito) {
            setTimeout(() => {
              console.log("redirecting");
              window.location.href = `${baseApiUrl}/ping.php?redirect=${window.location.origin}/persisted`;
            }, 1)
            return;
          }
        }
        dispatch(setFirstLoad(true));

        if (res.data.continent) {
          dispatch(setContinent(res.data.continent))
          dispatch(setFactor(res.data.factor));
        }
        if (res.data.country) {
          dispatch(setCountry(res.data.country));
        }
        if (res.data.currency) {
          dispatch(setCurrency(res.data.currency));
          dispatch(setCountry(res.data.currency));
        }
        if (res.data.status === "loggedin") {
          dispatch(login(res.data.data));
        }
        dispatch(setUserQueried(true));
      }).catch((err) => {
        dispatch(showToast({
          message: "An error occurred, reload page",
          type: "error",
          duration: 3000
        }))
        console.log(err)
      }).finally(() => {
      })
    }

    init();
  }, [])

  useEffect(() => {
    if (pathname === "/cart" || pathname === "/country" || pathname === "/change-country" || (menuExpanded && width <= 960) || (!tAndCAccepted && pathname !== "/about")) {
      document.body.classList.add("scroll-lock");
    } else {
      document.body.classList.remove("scroll-lock");
    }
  }, [pathname, tAndCAccepted, menuExpanded, width, height])



  return (
    <>

      <Header />
      <div className='static'>
        <Menu />
      </div>
      <main>
        <Routes>

          <Route path="*" element={
            isAdmin && dashboard === "admin" ?
              <AdminRoutes />
              :
              <UserRoutes />
          } />
          <Route path="/my-matches" element={<MyMatches />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:id" element={<ResetPassword />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      {(!tAndCAccepted && pathname != "/about") && <Welcome />}
      <Toasts />
    </>
  );
}

export default App;
