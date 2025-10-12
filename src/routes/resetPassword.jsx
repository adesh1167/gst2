import React, { useEffect, useRef, useState } from 'react'
import Header from '../components/header'
import Loading from '../components/loading';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { baseApiUrl } from '../data/url';
import { useForm } from 'react-hook-form';
import { showToast } from '../slices/toastsReducer';
import LoadingButton from '../components/loadingButton';
import PasswordEye from '../components/passwordEye';

const ResetPassword = () => {

    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [firstLoading, setFirstLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const formRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { register, handleSubmit, watch, formState: {
        errors,
        isSubmitting,
    } } = useForm();


    async function doUpdate(e) {
        // e.preventDefault();
        setLoading(true);

        try {
            const res = await axios({
                url: `${baseApiUrl}/update-password.php`,
                method: 'POST',
                data: new FormData(formRef.current),
            });

            console.log(res.data);

            if (res.data.status === "success") {
                dispatch(showToast({
                    message: "Password Updated",
                    type: "success",
                    duration: 2000
                }))
                navigate('/login', { replace: true });
            } else {
                dispatch(showToast({
                    message: res.data.message,
                    type: "error",
                    duration: 3000
                }))
            }

        } catch (err) {
            console.error(err);
            dispatch(showToast({
                message: "Unable to register, check network and try again",
                type: "error",
                duration: 3000
            }))
        } finally {
            // console.log('finally');
            setLoading(false);
        }
    }

    function checkToken() {
        axios({
            url: `${baseApiUrl}/check-reset-token.php`,
            method: 'POST',
            data: {
                token: id
            }
        })
            .then(res => {
                // console.log(res.data);
                if (res.data.status === 'success') {
                    setFirstLoading(false);
                    setData(res.data.data);
                } else {
                    setError(res.data.message || "An unknown error occured, reload");
                }
            })
            .catch(err => {
                console.error(err);
                setError("Check your network and reload")
            })
            .finally(() => {
                setFirstLoading(false);
            })
    }

    useEffect(() => {
        checkToken();
    }, [])

    const password = watch("password");

    console.log(error);

    return (
        <div className="register-container">
            {/* <Header /> */}
            <div className="register-container04 fixed">
                {data.first_name && <div className='reset-user'>{data.first_name} {data.last_name}</div>}
                {firstLoading ?
                    <div className='register-center-container'>
                        <Loading width={100} height={100} color='#fff' />
                    </div>
                    :
                    <form ref={formRef} className="register-form" id="registerForm" onSubmit={handleSubmit(doUpdate)} noValidate>
                        {error ?
                            <div className="register-error-text">
                                <span className="register-text2">{error}</span>
                                <div className="register-container13 after-button">
                                    <span>
                                        <Link to="/login" className="register-link link">
                                            Login
                                        </Link>
                                        {" or "}
                                        <Link to="/register" className="register-link link">
                                            Register
                                        </Link>
                                    </span>
                                </div>
                                <div className="register-container13 after-button">
                                    <span>
                                        <Link to="/forgot-password" className="register-link link">
                                            Reset Password
                                        </Link>
                                    </span>
                                </div>
                            </div>
                            :
                            <div className="register-container05">
                                <div className="register-title">RESET PASSWORD</div>
                                <div className="register-container06">
                                    <div className="register-container11">
                                        <div className='password-input-wrapper'>
                                            <input
                                                id="password"
                                                name="password"
                                                type={passwordVisible ? "text" : "password"}
                                                placeholder="Password"
                                                className="register-textinput input password-eye-input"
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
                                </div>
                                <input type="hidden" name="token" value={id} />
                                <div className="register-container06">
                                    <div className="register-container12">
                                        <input
                                            id="confirmPassword"
                                            name="confirm-password"
                                            type={passwordVisible ? "text" : "password"}
                                            placeholder="Confirm Password"
                                            className="register-textinput input"
                                            {...register("confirm-password", {
                                                required: "Confirm Password is required",
                                                validate: (value) => value === password || "Passwords do not match"
                                            })}
                                        />
                                        {errors["confirm-password"] &&
                                            <span className="validation-message">{errors["confirm-password"].message}</span>
                                        }
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="register-button button"
                                    id="submitButton"
                                >
                                    <LoadingButton loading={loading} color='#fff'>Update Password</LoadingButton>
                                </button>
                                <div className="register-container13 after-button">
                                    <span>
                                        <Link to="/login" className="register-link link">
                                            Login
                                        </Link>
                                        {" or "}
                                        <Link to="/register" className="register-link link">
                                            Register
                                        </Link>
                                    </span>
                                </div>
                                <div className="register-container13">
                                    <span>
                                        {/* Forgot Password?{" "} */}
                                    </span>
                                </div>
                            </div>
                        }
                    </form>
                }
            </div>
        </div>

    )
}

export default ResetPassword
