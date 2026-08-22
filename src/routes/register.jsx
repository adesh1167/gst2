import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import { baseApiUrl } from '../data/url';
import { useForm } from 'react-hook-form';
import { showToast } from '../slices/toastsReducer';
import LoadingButton from '../components/loadingButton';
import PasswordEye from '../components/passwordEye';
import Tick from '../components/tick';
import './styles/login.css';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const formRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    async function doRegister() {
        setLoading(true);
        try {
            const res = await axios({
                url: `${baseApiUrl}/register.php`,
                method: 'POST',
                data: new FormData(formRef.current),
            });
            if (res.data.status === "success") {
                dispatch(showToast({ message: "Registration successful", type: "success", duration: 2000 }));
                navigate('/login', { replace: true });
            } else {
                dispatch(showToast({ message: res.data.message, type: "error", duration: 3000 }));
            }
        } catch {
            dispatch(showToast({ message: "Unable to register, check network and try again", type: "error", duration: 3000 }));
        } finally {
            setLoading(false);
        }
    }

    const password = watch("password");
    const plus18 = watch('plus18', false);

    return (
        <div className="register-container04 fixed inset-0 flex items-center justify-center overflow-scroll pt-[50px] z-[1]">
            <form
                ref={formRef}
                onSubmit={handleSubmit(doRegister)}
                noValidate
                className="w-[90%] max-w-md m-3 p-6 pb-10 rounded-2xl
                           bg-black/55 backdrop-blur-sm border border-white/15
                           shadow-xl flex flex-col gap-4"
            >
                <h1 className="text-white font-bold text-xl text-center mb-2">REGISTER</h1>

                {/* Name row */}
                <div className="flex gap-3">
                    <div className="flex-1 flex flex-col gap-1">
                        <input
                            name="firstName"
                            type="text"
                            placeholder="First Name"
                            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40
                                       rounded-xl px-4 py-3 text-base focus:outline-none focus:border-orange-500/70 transition-colors"
                            {...register("firstName", { required: "Required", minLength: { value: 2, message: "Too short" } })}
                        />
                        {errors.firstName && <span className="text-orange-300 text-sm">{errors.firstName.message}</span>}
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                        <input
                            name="lastName"
                            type="text"
                            placeholder="Last Name"
                            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40
                                       rounded-xl px-4 py-3 text-base focus:outline-none focus:border-orange-500/70 transition-colors"
                            {...register("lastName", { required: "Required", minLength: { value: 2, message: "Too short" } })}
                        />
                        {errors.lastName && <span className="text-orange-300 text-sm">{errors.lastName.message}</span>}
                    </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40
                                   rounded-xl px-4 py-3 text-base focus:outline-none focus:border-orange-500/70 transition-colors"
                        {...register("email", {
                            required: "Email is required",
                            pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Invalid email" }
                        })}
                    />
                    {errors.email && <span className="text-orange-300 text-sm">{errors.email.message}</span>}
                </div>

                {/* Password row */}
                <div className="flex gap-3">
                    <div className="flex-1 flex flex-col gap-1">
                        <div className="relative flex items-center">
                            <input
                                name="password"
                                type={passwordVisible ? "text" : "password"}
                                placeholder="Password"
                                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40
                                           rounded-xl px-4 py-3 pr-10 text-base focus:outline-none focus:border-orange-500/70 transition-colors"
                                {...register("password", {
                                    required: "Required",
                                    minLength: { value: 6, message: "At least 6 chars" }
                                })}
                            />
                            <div className="absolute right-3"><PasswordEye toggleVisible={setPasswordVisible} visible={passwordVisible} /></div>
                        </div>
                        {errors.password && <span className="text-orange-300 text-sm">{errors.password.message}</span>}
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                        <input
                            name="confirm-password"
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Confirm Password"
                            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40
                                       rounded-xl px-4 py-3 text-base focus:outline-none focus:border-orange-500/70 transition-colors"
                            {...register("confirm-password", {
                                required: "Required",
                                validate: v => v === password || "Passwords don't match"
                            })}
                        />
                        {errors["confirm-password"] && <span className="text-orange-300 text-sm">{errors["confirm-password"].message}</span>}
                    </div>
                </div>

                {/* 18+ checkbox */}
                <div className="flex items-center gap-2 text-white text-sm">
                    <input name="plus18" id="plus18" type="checkbox"
                           className="absolute opacity-0"
                           {...register("plus18", { required: "Agree that you are 18+" })} />
                    <label htmlFor="plus18" className="flex items-center gap-2 cursor-pointer">
                        <Tick checked={plus18} color="#fff" />
                        <span>I am 18+</span>
                    </label>
                    {errors.plus18 && <span className="text-orange-300 text-sm">{errors.plus18.message}</span>}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold
                               text-base transition-colors shadow-lg"
                >
                    <LoadingButton loading={loading} color="#fff">Register</LoadingButton>
                </button>

                <div className="text-center text-white text-sm mt-1">
                    Have an account?{" "}
                    <Link to="/login" className="font-bold text-white underline hover:text-orange-300 transition-colors">Login</Link>
                </div>
                <div className="text-center text-white text-sm">
                    Forgot Password?{" "}
                    <Link to="/forgot-password" className="font-bold text-white underline hover:text-orange-300 transition-colors">Reset</Link>
                </div>
            </form>
        </div>
    );
};

export default Register;
