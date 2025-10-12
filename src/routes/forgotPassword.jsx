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

const ForgotPassword = () => {

    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [success, setSuccess] = useState(false);
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
                url: `${baseApiUrl}/reset-password.php`,
                method: 'POST',
                data: new FormData(formRef.current),
            });

            // console.log(res.data);
            if (res.data.status === "success") {
                // dispatch(login(res.data.data));
                // navigate('/', { replace: true });
                dispatch(showToast({
                    message: res.data.message,
                    type: "success",
                    duration: 4000
                }))
                setSuccess(true);
            } else {
                dispatch(showToast({
                    message: res.data.message || "Unknown error occurred",
                    type: "error",
                    duration: 5000
                }))
            }
        } catch (err) {
            console.log(err);
            dispatch(showToast({
                message: "Unable to login, check network and try again",
                type: "error",
                duration: 5000
            }))
        } finally {
            // console.log('finally');
            setLoading(false);
        }
    }


    return (
        <div className='register-container'>
            {/* <Header /> */}
            <div className="register-container04 fixed">
                <form ref={formRef} className="register-form" id="loginForm" noValidate="novalidate" onSubmit={handleSubmit(doLogin)}>
                    <div className="register-container05">
                        <div className="register-title">FORGOT PASSWORD</div>
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
                        {success ?
                            <p className="register-success-text">Check your email for the reset link</p>
                            :

                            <button
                                type="submit"
                                className="register-button button"
                                id="submitButton"
                            >
                                <LoadingButton loading={loading} color='#fff'>Reset Password</LoadingButton>
                            </button>}
                        <div className="register-container13">
                            <span>
                                Don't have an account yet?{" "}
                                <Link to="/register" className="register-link link">
                                    Register
                                </Link>
                            </span>
                        </div>
                        <div className="register-container13">
                            <span>
                                Remember Password?{" "}
                                <Link to="/login" className="register-link link">
                                    Login
                                </Link>
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword;
