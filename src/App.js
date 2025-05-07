import { Routes, Route, useNavigate, useLocation } from 'react-router';
import './App.css';
import UserRoutes from './routes/userRoutes';
import { useEffect } from 'react';
import axios from 'axios';
import { baseApiUrl } from './data/url';
import { setCountry, setFactor, setFirstLoad } from './slices/dataReducer';
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

axios.defaults.withCredentials = true;

function App() {

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { user, isAdmin, dashboard } = useSelector((state) => state.user);
  const { tAndCAccepted } = useSelector((state) => state.data);
  const { pathname } = useLocation()

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
    axios({
      method: "POST",
      url: `${baseApiUrl}/get-profile.php`,

    }).then((res) => {
      // console.log(res.data)
      dispatch(setFirstLoad(true));
      if (res.data.country) {
        dispatch(setCountry(res.data.country));
        dispatch(setFactor(res.data.factor));
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
  }, [])



  return (
    <>
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
        <Route path="/about" element={<About />} />
      </Routes>
      {(!tAndCAccepted && pathname != "/about") && <Welcome />}
      <Toasts />
    </>
  );
}

export default App;
