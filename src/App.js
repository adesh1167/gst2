import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router';
import './App.css';
import UserRoutes from './routes/userRoutes';
import { useEffect } from 'react';
import axios from 'axios';
import { baseApiUrl } from './data/url';
import { setCountry, setFactor, setFirstLoad } from './slices/dataReducer';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './slices/userReducer';

axios.defaults.withCredentials = true;

function App() {

  const dispatch = useDispatch();
  const cart = useSelector((state)=>state.cart);

  useEffect(()=>{
    console.log(cart)
    if(cart){
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart])
  
  useEffect(()=>{
    axios({
      method: "POST",
      url: `${baseApiUrl}/get-profile.php`,
      
    }).then((res)=>{
      console.log(res.data)
      if(res.data.country){
        dispatch(setCountry(res.data.country));
        dispatch(setFactor(res.data.factor));
      }
      if(res.data.status === "loggedin"){
        dispatch(login(res.data.data));
      }
    }).catch((err)=>{
      console.log(err)
    }).finally(()=>{
      dispatch(setFirstLoad(true));
    })
  }, [])

  
  
  return (
    <Router>
      <Routes>
        <Route path="*" element={<UserRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
