import { useRef, useState } from 'react';
import axios from 'axios';
import './styles/login.css';
import { baseApiUrl } from '../data/url';
import { useDispatch } from 'react-redux';
import { login } from '../slices/userReducer';
import { Link, useLocation, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { showToast } from '../slices/toastsReducer';
import PasswordEye from '../components/passwordEye';
import LoadingButton from '../components/loadingButton';
import Tick from '../components/tick';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const formRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    async function doLogin(e) {
        setLoading(true);
        try {
            const res = await axios({
                url: `${baseApiUrl}/login.php`,
                method: 'POST',
                data: new FormData(formRef.current),
            });
            if (res.data.status === "success") {
                dispatch(login(res.data.data));
                navigate(state?.redirect || '/', { replace: true });
            } else {
                dispatch(showToast({ message: res.data.message, type: "error", duration: 3000 }));
            }
        } catch {
            dispatch(showToast({ message: "Unable to login, check network and try again", type: "error", duration: 3000 }));
        } finally {
            setLoading(false);
        }
    }

    const rememberMe = watch('remember-me', false);

    return (
        <div className="register-container04 fixed inset-0 flex items-center justify-center overflow-scroll pt-[50px] z-[1]">
            <form
                ref={formRef}
                onSubmit={handleSubmit(doLogin)}
                noValidate
                className="w-[90%] max-w-md m-3 p-6 pb-10 rounded-2xl
                           bg-black/55 backdrop-blur-sm border border-white/15
                           shadow-xl flex flex-col gap-4"
            >
                <h1 className="text-white font-bold text-xl text-center mb-2">LOGIN</h1>

                {/* Email */}
                <div className="flex flex-col gap-1">
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40
                                   rounded-xl px-4 py-3 text-base focus:outline-none focus:border-orange-500/70
                                   transition-colors"
                        {...register("email", {
                            required: "Email is required",
                            pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Invalid email" }
                        })}
                    />
                    {errors.email && <span className="text-orange-300 text-sm">{errors.email.message}</span>}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1">
                    <div className="relative flex items-center">
                        <input
                            name="password"
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Password"
                            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40
                                       rounded-xl px-4 py-3 pr-10 text-base focus:outline-none focus:border-orange-500/70
                                       transition-colors"
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "At least 6 characters" }
                            })}
                        />
                        <div className="absolute right-3"><PasswordEye toggleVisible={setPasswordVisible} visible={passwordVisible} /></div>
                    </div>
                    {errors.password && <span className="text-orange-300 text-sm">{errors.password.message}</span>}
                </div>

                {/* Keep me logged in */}
                <div className="flex items-center gap-2 text-white text-sm">
                    <input name="remember-me" type="checkbox" id="remember-me" defaultChecked
                           className="absolute opacity-0"
                           {...register("remember-me")} />
                    <label htmlFor="remember-me" className="flex items-center gap-2 cursor-pointer">
                        <Tick checked={rememberMe} color="#fff" />
                        <span>Keep me logged in</span>
                    </label>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold
                               text-base transition-colors shadow-lg"
                >
                    <LoadingButton loading={loading} size={24} color="#fff">Login</LoadingButton>
                </button>

                {/* Links */}
                <div className="text-center text-white text-sm mt-1">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-bold text-white underline hover:text-orange-300 transition-colors">Register</Link>
                </div>
                <div className="text-center text-white text-sm">
                    Forgot Password?{" "}
                    <Link to="/forgot-password" className="font-bold text-white underline hover:text-orange-300 transition-colors">Reset</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
