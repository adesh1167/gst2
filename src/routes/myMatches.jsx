import { useDispatch, useSelector } from "react-redux";
import "./styles/myMatches.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseApiUrl } from "../data/url";
import Loading from "../components/loading";
import { setMatchesLoaded, setMyMatches } from "../slices/myMatchesReducer";
import MyMatchDay from "../components/myMatchDay";
import { Link, useLocation, useNavigationType } from "react-router";
import { showToast } from "../slices/toastsReducer";

const MyMatches = () => {
    const { userQueried } = useSelector(state => state.user);

    return (
        <div className="w-full min-h-full bg-white dark:bg-dark-bg">
            {userQueried && true ? (
                <MyMatchesContent />
            ) : (
                <div className="w-full pt-[50px]">
                    <div className="w-full min-h-full flex items-center justify-center">
                        <Loading color="#ea580c" />
                    </div>
                </div>
            )}
        </div>
    );
};

const MyMatchesContent = () => {
    const [loading, setLoading] = useState(true);
    const [firstLoad, setFirstLoad] = useState(false);
    const [error, setError] = useState(null);
    const { matches, matchesLoaded } = useSelector(state => state.myMatches);
    const { isAuthenticated } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navType = useNavigationType();
    const { pathname } = useLocation();

    function fetchMyMatches() {
        setLoading(true);
        axios({ url: `${baseApiUrl}/get-my-matches.php`, method: "POST" })
            .then(res => {
                if (res.data.status === "success") {
                    dispatch(setMyMatches(res.data.data));
                } else if (res.data.errorCode === "notLoggedIn") {
                    setError(
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-white/60">Please login to see your matches</p>
                            <Link
                                to="/login"
                                state={{ redirect: pathname }}
                                className="px-6 py-2 rounded-full border-2 border-orange-500/60 text-orange-400
                                           hover:bg-orange-500/10 font-bold transition-colors"
                            >
                                Login
                            </Link>
                        </div>
                    );
                }
            })
            .catch(() => dispatch(showToast({ message: "An error occurred, check your network and reload", type: "error", duration: 3000 })))
            .finally(() => {
                if (!matchesLoaded) dispatch(setMatchesLoaded(true));
                setLoading(false);
            });
    }

    useEffect(() => {
        if (firstLoad) {
            if (matchesLoaded) {
                if (navType !== "PUSH") setLoading(false);
                else fetchMyMatches();  // intentionally kept same as original
            } else {
                fetchMyMatches();
            }
        } else {
            if (matchesLoaded) {
                if (navType !== "PUSH") setLoading(false);
                else fetchMyMatches();
            } else {
                fetchMyMatches();
            }
        }
        if (!firstLoad) setFirstLoad(true);
    }, [matchesLoaded]);

    return (
        <div className="w-full min-h-full bg-white dark:bg-dark-bg">
            <div className="my-matches-container04 w-full
                            bg-white dark:bg-dark-bg px-0">
                <div className="flex flex-col items-center min-h-[calc(100dvh-50px)] lg:min-h-[calc(100dvh-80px)] w-full px-3 py-3 gap-3">

                    {/* Description banner */}
                    <div className="w-full my-4 px-4 py-3 rounded-xl font-semibold text-center text-sm
                                    bg-green-500/8 border border-green-500/30 text-green-400
                                    my-matches-description tracking-wide">
                        All recent matches you bought will appear here
                    </div>

                    {!isAuthenticated ? (
                        <div className="flex flex-col items-center gap-4 py-16 text-white/60">
                            <p>Please login to see your matches</p>
                            <Link
                                to="/login"
                                className="px-6 py-2 rounded-full border-2 border-orange-500/60 text-orange-400
                                           hover:bg-orange-500/10 font-bold transition-colors"
                            >
                                Login
                            </Link>
                        </div>
                    ) : loading ? (
                        <div className="flex-1 flex items-center justify-center py-16">
                            <Loading color="#ea580c" />
                        </div>
                    ) : error ? (
                        <div className="flex-1 flex items-center justify-center py-16">{error}</div>
                    ) : matches.length > 0 ? (
                        <div className="w-full flex flex-col gap-4" id="slips">
                            {matches.map((match, i) => (
                                <MyMatchDay key={match.time + i} day={match} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 py-16 text-white/50 text-center px-5">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-24 h-24 fill-white/15">
                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM159.3 388.7c-2.6 8.4-11.6 13.2-20 10.5s-13.2-11.6-10.5-20C145.2 326.1 196.3 288 256 288s110.8 38.1 127.3 91.3c2.6 8.4-2.1 17.4-10.5 20s-17.4-2.1-20-10.5C340.5 349.4 302.1 320 256 320s-84.5 29.4-96.7 68.7zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                            </svg>
                            <p className="font-bold text-lg text-white/50">No matches bought recently.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyMatches;
