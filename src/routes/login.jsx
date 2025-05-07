import { useRef } from 'react';
import { useState } from 'react';
import axios from 'axios';
import Header from '../components/header';
import './styles/login.css';
import { baseApiUrl } from '../data/url';
import { useDispatch } from 'react-redux';
import { login } from '../slices/userReducer';
import { Link, useNavigate } from 'react-router';
import Loading from '../components/loading';
import { useForm } from 'react-hook-form';
import { showToast } from '../slices/toastsReducer';
import PasswordEye from '../components/passwordEye';
import LoadingButton from '../components/loadingButton';

const Login = () => {

    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const formRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { register, handleSubmit, watch, formState: {
        errors,
        isSubmitting,
    } } = useForm();


    async function doLogin(e) {
        setLoading(true);

        try {
            const res = await axios({
                url: `${baseApiUrl}/login.php`,
                method: 'POST',
                data: new FormData(formRef.current),
            });

            // console.log(res.data);
            if (res.data.status === "success") {
                dispatch(login(res.data.data));
                navigate('/', { replace: true });
            } else {
                dispatch(showToast({
                    message: res.data.message,
                    type: "error",
                    duration: 3000
                }))
            }
        } catch (err) {
            console.log(err);
            dispatch(showToast({
                message: "Unable to login, check network and try again",
                type: "error",
                duration: 3000
            }))
        } finally {
            // console.log('finally');
            setLoading(false);
        }
    }


    return (
        <div className='register-container'>
            {/* <Header /> */}
            <div className="register-container04">
                <form ref={formRef} className="register-form" id="loginForm" noValidate="novalidate" onSubmit={handleSubmit(doLogin)}>
                    <div className="register-container05">
                        <div className="register-title">LOGIN</div>
                        <div className="register-container09">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email"
                                className="register-textinput input valid"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                            {errors.email &&
                                <span className="validation-message">{errors.email.message}</span>
                            }
                        </div>
                        <div className="register-container09">
                            <div className='password-input-wrapper'>

                                <input
                                    id="password"
                                    name="password"
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="Password"
                                    className="register-textinput input valid"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "At least 6 characters"
                                        }
                                    })}
                                />
                                <PasswordEye toggleVisible={setPasswordVisible} visible={passwordVisible} />
                            </div>
                            {errors.password &&
                                <span className="validation-message">{errors.password.message}</span>
                            }
                        </div>
                        <div className="plus18">
                            <input
                                name="remember-me"
                                type="checkbox"
                                id='remember-me'
                                style={{ marginRight: 10 }}
                                defaultChecked=""
                            />
                            <label htmlFor='remember-me'>Keep Me Logged In</label>
                        </div>
                        <button
                            type="submit"
                            className="register-button button"
                            id="submitButton"
                        >
                            <LoadingButton loading={loading} color='#fff'>Login</LoadingButton>
                        </button>
                        <div className="register-container13">
                            <span>
                                Don't have an account yet?{" "}
                                <Link to="/register" className="register-link link">
                                    Register
                                </Link>
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
