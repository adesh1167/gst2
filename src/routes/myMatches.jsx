import { useDispatch, useSelector } from "react-redux";
import Header from "../components/header";
import "./styles/myMatches.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseApiUrl } from "../data/url";
import Loading from "../components/loading";
import { setMatchesLoaded, setMyMatches } from "../slices/myMatchesReducer";
import MyMatchDay from "../components/myMatchDay";
import { Link, useNavigationType } from "react-router";
import { showToast } from "../slices/toastsReducer";

const MyMatches = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { matches, matchesLoaded } = useSelector(state => state.myMatches);
    const { isAuthenticated } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navType = useNavigationType();
    const [firstLoad, setFirstLoad] = useState(matchesLoaded && navType !== "PUSH");


    function fetchMyMatches() {
        setLoading(true);
        axios({
            url: `${baseApiUrl}/get-my-matches.php`,
            method: "POST",
        }).then((res) => {
            console.log(res.data);
            if (res.data.status === "success") {
                dispatch(setMyMatches(res.data.data))
            } else if (res.data.errorCode === "notLoggedIn") {
                setError(
                    <>
                        <div className="no-matches-text"> Please login to see your matches</div>
                        <Link className="no-matches-button" to="/login"> Login</Link>
                    </>
                )
            }
        }).catch((err) => {
            dispatch(showToast({
                message: "An error occurred, check your network and reload",
                type: "error",
                duration: 3000
            }))
            console.log(err);
        }).finally(() => {
            setFirstLoad(true);
            if (!matchesLoaded) dispatch(setMatchesLoaded(true));
            setLoading(false);
        })
    }

    useEffect(() => {
        // setFirstLoad(false);
        if (firstLoad) return;
        if (!isAuthenticated) return;
        fetchMyMatches();
    }, [isAuthenticated])

    console.log("Here: ", matches);

    return (
        <div className="my-matches-container">
            <Header />
            <div className="my-matches-container04">
                <div className="my-matches-container06">
                    <div className="my-matches-description">
                        All matches you've paid for will appear here
                    </div>

                    {!isAuthenticated ?

                        <div className="no-matches">
                            <div className="no-matches-text"> Please login to see your matches</div>
                            <Link className="no-matches-button" to="/login"> Login</Link>
                        </div>
                        :

                        firstLoad && (
                            (matches.length > 0) ?
                                <div className="slips" id="slips">
                                    {matches.map((match, index) =>
                                        <MyMatchDay day={match} />
                                    )}
                                </div>
                                :
                                <div className="no-matches">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM159.3 388.7c-2.6 8.4-11.6 13.2-20 10.5s-13.2-11.6-10.5-20C145.2 326.1 196.3 288 256 288s110.8 38.1 127.3 91.3c2.6 8.4-2.1 17.4-10.5 20s-17.4-2.1-20-10.5C340.5 349.4 302.1 320 256 320s-84.5 29.4-96.7 68.7zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                                    </svg>
                                    <span className="no-matches-text">Ooops! You have not bought any matches recently.</span>
                                </div>
                        )
                    }


                    {loading && <div className="my-matches-loading">
                        <Loading />
                    </div>}
                </div>
            </div>
        </div>

    )
}

export default MyMatches
