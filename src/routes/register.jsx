import React, { useRef, useState } from 'react'
import Header from '../components/header'
import Loading from '../components/loading';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import { baseApiUrl } from '../data/url';
import { useForm } from 'react-hook-form';
import { showToast } from '../slices/toastsReducer';
import LoadingButton from '../components/loadingButton';
import PasswordEye from '../components/passwordEye';

const Register = () => {

    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const formRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { register, handleSubmit, watch, formState: {
        errors,
        isSubmitting,
    } } = useForm();


    async function doRegister(e) {
        // e.preventDefault();
        setLoading(true);

        try {
            const res = await axios({
                url: `${baseApiUrl}/register.php`,
                method: 'POST',
                data: new FormData(formRef.current),
            });

            // console.log(res.data);

            if (res.data.status === "success") {
                dispatch(showToast({
                    message: "Registration succesful",
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
                message: "Unable to logout, check network and try again",
                type: "error",
                duration: 3000
            }))
        } finally {
            // console.log('finally');
            setLoading(false);
        }
    }

    const password = watch("password");


    return (
        <div className="register-container">
            {/* <Header /> */}
            <div className="register-container04">
                <form ref={formRef} className="register-form" id="registerForm" onSubmit={handleSubmit(doRegister)} noValidate>
                    <div className="register-container05">
                        <div className="register-title">REGISTER</div>
                        <div className="register-container06">
                            <div className="register-container07">
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    placeholder="First Name"
                                    className="register-textinput input"
                                    {...register("firstName", {
                                        required: "First name is required",
                                        minLength: {
                                            value: 2,
                                            message: "Too short"
                                        }
                                    })}
                                />
                                {errors.firstName &&
                                    <span className="validation-message">{errors.firstName.message}</span>
                                }
                            </div>
                            <div className="register-container08">
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    placeholder="Last Name"
                                    className="register-textinput input"
                                    {...register("lastName", {
                                        required: "Last name is required",
                                        minLength: {
                                            value: 2,
                                            message: "Too short"
                                        }
                                    })}
                                />
                                {errors.lastName &&
                                    <span className="validation-message">{errors.lastName.message}</span>
                                }
                            </div>
                        </div>
                        <div className="register-container09">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email"
                                className="register-textinput input"
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
                        <div className="plus18">
                            <input
                                name="plus18"
                                id='pus18'
                                type="checkbox"
                                {...register("plus18", {
                                    required: "Agree that you are 18+",
                                })}
                                style={{ marginRight: 10 }}
                            />
                            <label htmlFor='pus18'>I am 18+</label>
                            {errors.plus18 &&
                                <div className="validation-message" style={{ width: "100%", textAlign: 'right', flex: "1 1" }}>{errors.plus18.message}</div>
                            }
                        </div>
                        <button
                            type="submit"
                            className="register-button button"
                            id="submitButton"
                        >
                            <LoadingButton loading={loading} color='#fff'>Register</LoadingButton>
                        </button>
                        <div className="register-container13 after-button">
                            <span>
                                Have an account already?{" "}
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

export default Register
