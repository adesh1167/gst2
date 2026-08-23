import React, { useEffect, useRef, useState } from 'react'
import Loading from '../components/loading';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { baseApiUrl } from '../data/url';
import { useForm } from 'react-hook-form';
import { showToast } from '../slices/toastsReducer';
import LoadingButton from '../components/loadingButton';
import PasswordEye from '../components/passwordEye';
import './styles/login.css';

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

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    async function doUpdate() {
        setLoading(true);
        try {
            const res = await axios({
                url: `${baseApiUrl}/update-password.php`,
                method: 'POST',
                data: new FormData(formRef.current),
            });
            if (res.data.status === "success") {
                dispatch(showToast({ message: "Password Updated", type: "success", duration: 2000 }));
                navigate('/login', { replace: true });
            } else {
                dispatch(showToast({ message: res.data.message, type: "error", duration: 3000 }));
            }
        } catch {
            dispatch(showToast({ message: "Unable to update password, check network and try again", type: "error", duration: 3000 }));
        } finally {
            setLoading(false);
        }
    }

    function checkToken() {
        axios({ url: `${baseApiUrl}/check-reset-token.php`, method: 'POST', data: { token: id } })
            .then(res => {
                if (res.data.status === 'success') {
                    setFirstLoading(false);
                    setData(res.data.data);
                } else {
                    setError(res.data.message || "An unknown error occurred, reload");
                }
            })
            .catch(() => setError("Check your network and reload"))
            .finally(() => setFirstLoading(false));
    }

    useEffect(() => { checkToken(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const password = watch("password");

    return (
        <div className="register-container04 fixed inset-0 flex items-center justify-center overflow-scroll pt-[60px] z-[1]">
            {data.first_name && (
                <div className="fixed right-5 top-[62px] text-white font-bold uppercase text-sm">
                    {data.first_name} {data.last_name}
                </div>
            )}

            {firstLoading ? (
                <div className="flex items-center justify-center">
                    <Loading width={100} height={100} color="#fff" />
                </div>
            ) : (
                <form
                    ref={formRef}
                    onSubmit={handleSubmit(doUpdate)}
                    noValidate
                    className="w-[90%] max-w-md m-3 p-6 pb-10 rounded-2xl
                               bg-black/55 backdrop-blur-sm border border-white/15
                               shadow-xl flex flex-col gap-4"
                >
                    {error ? (
                        <div className="flex flex-col gap-4 items-center">
                            <p className="text-red-400 font-semibold text-center">{error}</p>
                            <div className="flex gap-3 text-sm text-white">
                                <Link to="/login" className="font-bold underline hover:text-orange-300">Login</Link>
                                <span className="opacity-40">or</span>
                                <Link to="/register" className="font-bold underline hover:text-orange-300">Register</Link>
                            </div>
                            <Link to="/forgot-password" className="text-sm font-bold text-white underline hover:text-orange-300">
                                Reset Password
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-white font-bold text-xl text-center mb-2">RESET PASSWORD</h1>

                            <div className="flex flex-col gap-1">
                                <div className="relative flex items-center">
                                    <input
                                        name="password"
                                        type={passwordVisible ? "text" : "password"}
                                        placeholder="New Password"
                                        className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40
                                                   rounded-xl px-4 py-3 pr-10 text-base focus:outline-none focus:border-orange-500/70 transition-colors"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: { value: 6, message: "At least 6 characters" }
                                        })}
                                    />
                                    <div className="absolute right-3">
                                        <PasswordEye toggleVisible={setPasswordVisible} visible={passwordVisible} />
                                    </div>
                                </div>
                                {errors.password && <span className="text-orange-300 text-sm">{errors.password.message}</span>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <input
                                    name="confirm-password"
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40
                                               rounded-xl px-4 py-3 text-base focus:outline-none focus:border-orange-500/70 transition-colors"
                                    {...register("confirm-password", {
                                        required: "Confirm Password is required",
                                        validate: v => v === password || "Passwords do not match"
                                    })}
                                />
                                {errors["confirm-password"] && <span className="text-orange-300 text-sm">{errors["confirm-password"].message}</span>}
                            </div>

                            <input type="hidden" name="token" value={id} />

                            <button
                                type="submit"
                                className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-base transition-colors shadow-lg"
                            >
                                <LoadingButton loading={loading} size={24} color="#fff">Update Password</LoadingButton>
                            </button>

                            <div className="text-center text-sm text-white flex items-center justify-center gap-3">
                                <Link to="/login" className="font-bold underline hover:text-orange-300">Login</Link>
                                <span className="opacity-40">or</span>
                                <Link to="/register" className="font-bold underline hover:text-orange-300">Register</Link>
                            </div>
                        </>
                    )}
                </form>
            )}
        </div>
    );
};

export default ResetPassword;
