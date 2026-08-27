import { useRef, useState } from 'react';
import axios from 'axios';
import { baseApiUrl } from '../data/url';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { showToast } from '../slices/toastsReducer';
import LoadingButton from '../components/loadingButton';
import SEO from '../components/seo';
import './styles/login.css';

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const formRef = useRef(null);
    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm();

    async function doReset() {
        setLoading(true);
        try {
            const res = await axios({
                url: `${baseApiUrl}/reset-password.php`,
                method: 'POST',
                data: new FormData(formRef.current),
            });
            if (res.data.status === "success") {
                dispatch(showToast({ message: res.data.message, type: "success", duration: 4000 }));
                setSuccess(true);
            } else {
                dispatch(showToast({ message: res.data.message || "Unknown error", type: "error", duration: 5000 }));
            }
        } catch {
            dispatch(showToast({ message: "Unable to send reset link, check network and try again", type: "error", duration: 5000 }));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="register-container04 fixed inset-0 flex items-center justify-center overflow-scroll pt-[60px] z-[1]">
            <SEO
                title="Reset Password | Global Sports Trade"
                description="Recover your Global Sports Trade account password securely."
            />
            <form
                ref={formRef}
                onSubmit={handleSubmit(doReset)}
                noValidate
                className="w-[90%] max-w-md m-3 p-6 pb-10 rounded-2xl
                           bg-black/55 backdrop-blur-sm border border-white/15
                           shadow-xl flex flex-col gap-4"
            >
                <h1 className="text-white font-bold text-xl text-center mb-2">FORGOT PASSWORD</h1>

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

                {success ? (
                    <p className="text-green-400 font-semibold text-center">Check your email for the reset link</p>
                ) : (
                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-base transition-colors shadow-lg"
                    >
                        <LoadingButton loading={loading} color="#fff">Reset Password</LoadingButton>
                    </button>
                )}

                <div className="text-center text-white text-sm">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-bold underline hover:text-orange-300 transition-colors">Register</Link>
                </div>
                <div className="text-center text-white text-sm">
                    Remember password?{" "}
                    <Link to="/login" className="font-bold underline hover:text-orange-300 transition-colors">Login</Link>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
