import { Link, useNavigate, useParams } from 'react-router';
import React, { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from '../../contexts/appContext';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { set } from 'react-hook-form';
import { baseApiUrl } from '../../data/url';
import { getFixtureDate } from '../../functions/formatDate';
import localFixtureStats from '../../test';

const categories = [
    "Fixture Overview",
    "Team Stats",
    "Player Stats",
    "Form",
    "Head-to-Head",
    "Predictions Matchup",
    "Final Outcome"
];

const sequence = {
    "Fixture Overview": [
        (data) => {
            const base = data.fixture[0].fixture;
            const referee = base.referee;
            const venue = base.venue;
            const league = base.league;
        }
    ],
    "Team Stats": ["Player Stats", "Head-to-Head", "Predictions Matchup", "Final Outcome"],
    "Player Stats": ["Head-to-Head", "Predictions Matchup", "Final Outcome"],
    "Head-to-Head": ["Predictions Matchup", "Final Outcome"],
    "Predictions Matchup": ["Final Outcome"],
    "Final Outcome": []
};

const errorCodes = {
    "NOT_LOGGED_IN": <div className='text-center'>
        <div>Login To Start Using Deep Analyzer</div>
        <div className='p-8'>
            <Link to={"/login"} className='login-register-button' style={{marginRight: 0}}>LOGIN</Link>
        </div>
    </div>,
    "SUB_EXPIRED": <div className='text-center'>
        <div className='font-bold mb-4'>Your subscription has expired </div>
        <div>Renew your subscription to continue using DEEP ANALYZER</div>
        <div className='p-8'>
            <Link to={"/deep-analyzer"} className='login-register-button' style={{marginRight: 0}}>SUBSCRIBE</Link>
        </div>
    </div>,
    "NO SUB": <div className='text-center'>
        <div className='font-bold mb-4'>You do not have a subscription</div>
        <div> Subscribe to start using DEEP ANALYZER</div>
        <div className='p-8'>
            <Link to={"/deep-analyzer"} className='login-register-button' style={{marginRight: 0}}>SUBSCRIBE</Link>
        </div>
    </div>,
}

const DeepAnalyzerTool = () => {

    const { country } = useSelector(state => state.data);

    const { deepAnalyzerMatches, fetchDeepAnalyzerMatches } = useApp();
    const [subscriptionNoticeShown, setsubscriptionNoticeShown] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [fixtureStats, setFixtureStats] = useState(localFixtureStats);
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            if (!deepAnalyzerMatches.loaded) {
                fetchDeepAnalyzerMatches();
            } else {
                const details = deepAnalyzerMatches.matches.find(match => match.id == id);
                if (details) {
                    setData(details);
                } else {
                    setError("Match not Available");
                }
            }
        }, 500 + Math.random() * 700)
        console.log("Stats: ", fixtureStats);
    }, [deepAnalyzerMatches]);

    useEffect(() => {
        if (!analyzing) return;

        const interval = setInterval(() => {
            switch (categories[currentCategoryIndex]) {
                case "Form": {
                    const maxLen = Math.max(
                        fixtureStats?.form?.length || 0,
                    );
                    if (subIndex < maxLen - 1) {
                        setSubIndex((prev) => prev + 1);
                    } else {
                        setCurrentCategoryIndex((prev) => prev + 1);
                        setSubIndex(0);
                    }
                    console.log("Form: ", fixtureStats?.form.length, maxLen, subIndex);
                    break;
                }
                case "Head-to-Head": {
                    const maxLen = Math.max(
                        fixtureStats?.head_to_head?.length || 0,
                    );
                    if (subIndex < maxLen - 1) {
                        setSubIndex((prev) => prev + 1);
                    } else {
                        setCurrentCategoryIndex((prev) => prev + 1);
                        setSubIndex(0);
                    }
                    break;
                }
                case "Player Stats": {
                    const maxLen = fixtureStats.players[0]?.players?.length || 0;
                    if (subIndex < maxLen - 1) {
                        setSubIndex((prev) => prev + 1);
                    } else {
                        setCurrentCategoryIndex((prev) => prev + 1);
                        setSubIndex(0);
                    }
                    break;
                }
                default: {
                    if (currentCategoryIndex < categories.length - 1) {
                        setCurrentCategoryIndex((prev) => prev + 1);
                        setSubIndex(0);
                    } else {
                        clearInterval(interval);
                    }
                }
            }
        }, categories[currentCategoryIndex] === "Head-to-Head" ? 500 : 2000);

        return () => clearInterval(interval);
    }, [currentCategoryIndex, subIndex, analyzing]);

    const handleStart = useCallback(() => {
        if (data) {
            fetchFixtureStats()
                .then((res) => {
                    console.log("Res: ", res);
                    if(res) setAnalyzing(true);
                })
                .catch(() => {

                });
        }
    }, [data])

    async function fetchFixtureStats() {
        return axios({
            method: 'POST',
            url: `${baseApiUrl}/get-fixture-stats.php`,
            data: {
                fixture_id: data.fixture.id,
                team1_id: data?.teams?.home?.id,
                team2_id: data?.teams?.away?.id
            }
        })
            .then(res => {
                console.log(res.data);
                if (res.data.status === 'success') {
                    setFixtureStats({
                        ...res.data.data,
                        form: [...(res.data.data?.home_form || []), ...(res.data.data?.away_form || [])],
                    });
                    return true;
                } else {
                    setError(errorCodes[res.data.error_code] || res.data.message || "An unknown error occured, reload");
                    return false;
                    // throw new Error(res.data.message || "An unknown error occured, reload");
                }
            })
            .catch(err => {
                console.error(err);
                setError("Check your network and reload");
                return false;
            })
    }

    const renderCategoryContent = () => {
        if (!analyzing) return null;

        switch (categories[currentCategoryIndex]) {
            case "Fixture Overview":
                return (
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-purple-400 mb-2">Fixture Details</h3>
                        <p>{fixtureStats.fixture[0]?.teams?.home?.name} vs {fixtureStats.fixture[0]?.teams?.away?.name}</p>
                        <p>{fixtureStats.fixture[0]?.venue?.name}</p>
                        <p>{fixtureStats.fixture[0]?.date}</p>
                    </div>
                );
            case "Team Stats":
                return (
                    <div className="grid grid-cols-2 gap-4 text-center">
                        {fixtureStats.stats?.map((s, idx) => (
                            <div key={idx} className="bg-gray-800 p-3 rounded-lg">
                                <p className="text-sm text-gray-400">{s.type}</p>
                                <p className="text-xl font-bold text-purple-400">{s.value}</p>
                            </div>
                        ))}
                    </div>
                );
            case "Player Stats": {
                const player = fixtureStats.players[0]?.players?.[subIndex];
                return player ? (
                    <div className="flex flex-col items-center">
                        <img src={player.player.photo} alt={player.player.name} className="w-16 h-16 rounded-full mb-2" />
                        <p className="text-sm font-semibold">{player.player.id} - {player.player.name}</p>
                        <p className="text-xs text-gray-400">{player.player.position}</p>
                    </div>
                ) : null;
            }
            case "Head-to-Head": {
                const base = fixtureStats.head_to_head[subIndex];
                // const base = fixtureStats.form[subIndex];
                const homeMatch = base?.teams?.home;
                const awayMatch = base?.teams?.away;
                return (
                    <div className='flex flex-col gap-4'>
                        <div className=''>{getFixtureDate(base?.fixture?.date, country)}</div>
                        <div className="flex items-center gap-2">
                            <div className='flex flex-col justify-center items-center gap-1 w-full'>
                                <h4 className="text-purple-400 font-semibold mb-2">{homeMatch?.name}</h4>
                                <img src={homeMatch.logo} alt={homeMatch?.name} className="w-8 h-8 rounded-full mb-2" />
                            </div>
                            <div className=''>v</div>
                            <div className='flex flex-col justify-center items-center gap-1 w-full'>
                                <h4 className="text-purple-400 font-semibold mb-2">{awayMatch?.name}</h4>
                                <img src={awayMatch.logo} alt={homeMatch?.name} className="w-8 h-8 rounded-full mb-2" />
                            </div>
                        </div>
                    </div>
                );
            }
            case "Form": {
                // const base = fixtureStats.head_to_head[subIndex];
                const base = fixtureStats.form[subIndex];
                const homeMatch = base?.teams?.home;
                const awayMatch = base?.teams?.away;
                return (
                    <div className='flex flex-col gap-4'>
                        <div className=''>{getFixtureDate(base?.fixture?.date, country)}</div>
                        <div className="flex items-center gap-2">
                            <div className='flex flex-col justify-center items-center gap-1 w-full'>
                                <h4 className="text-purple-400 font-semibold mb-2">{homeMatch?.name}</h4>
                                <img src={homeMatch?.logo} alt={homeMatch?.name} className="w-8 h-8 rounded-full mb-2" />
                            </div>
                            <div className=''>v</div>
                            <div className='flex flex-col justify-center items-center gap-1 w-full'>
                                <h4 className="text-purple-400 font-semibold mb-2">{awayMatch?.name}</h4>
                                <img src={awayMatch?.logo} alt={homeMatch?.name} className="w-8 h-8 rounded-full mb-2" />
                            </div>
                        </div>
                    </div>
                );
            }
            case "Predictions":
                return (
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-purple-400 mb-2">Predicted Winner</h3>
                        <p>{fixtureStats.predictions?.winner?.name}</p>
                        <p className="text-sm text-gray-400">Win %: {fixtureStats.predictions?.winner?.percent}</p>
                    </div>
                );
            case "Final Outcome":
                return (
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-purple-400 mb-2">Result</h3>
                        <p>{fixtureStats.fixture[0]?.score?.fulltime?.home} - {fixtureStats.fixture[0]?.score?.fulltime?.away}</p>
                    </div>
                );
            default:
                return null;
        }
    };

    const test = () => {
        const base = fixtureStats.head_to_head[subIndex];
        const homeMatch = base?.teams?.home;
        const awayMatch = base?.teams?.away;
        return (
            <div className='flex flex-col gap-4'>
                <div className=''>{getFixtureDate(base?.fixture?.date, country)}</div>
                <div className="flex items-center gap-2">
                    <div className='flex flex-col justify-center items-center gap-1 w-full'>
                        <h4 className="text-purple-400 font-semibold mb-2">{homeMatch?.name}</h4>
                        <img src={homeMatch.logo} alt={homeMatch?.name} className="w-8 h-8 rounded-full mb-2" />
                    </div>
                    <div className=''>v</div>
                    <div className='flex flex-col justify-center items-center gap-1 w-full'>
                        <h4 className="text-purple-400 font-semibold mb-2">{awayMatch?.name}</h4>
                        <img src={awayMatch.logo} alt={homeMatch?.name} className="w-8 h-8 rounded-full mb-2" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            key="analysis"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 1 }}
        >
            {/* Analysis Section */}
            <section className='min-h-[calc(100vh-10rem)]'>
                <button
                    className="mb-6 text-sm text-purple-400 hover:underline"
                    onClick={() => navigate('/deep-analyzer')}
                >
                    ← Back to matches
                </button>
                {error ?
                    <div className="flex items-center justify-center min-h-[calc(100vh-15rem)] p-8">
                        <div className="text-gray-400">{error}</div>
                    </div>
                    :
                    data ?
                        <div className="rounded-3xl p-6 bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-transparent border border-gray-800 min-h-[500px] flex flex-col gap-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <div className="text-sm text-gray-400">Selected Match</div>
                                    <div className="text-xl font-semibold">{data?.teams?.home?.name} v {data?.teams?.away?.name} — Tactical Summary</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-xs text-gray-400">Confidence</div>
                                    <div className="px-2 py-1 bg-[rgba(255,255,255,0.03)] rounded-lg border border-gray-800 text-sm">{data?.accuracy}%</div>
                                </div>
                            </div>

                            <div className="flex flex-col lg-custom:flex-row gap-6 flex-1">
                                <div className="flex-1 rounded-2xl p-4 bg-[rgba(255,255,255,0.015)] border border-gray-800 relative overflow-hidden flex items-center justify-center">
                                    <div className="relative w-full max-w-md aspect-video rounded-xl bg-[#05060a] border border-gray-800 shadow-inner flex items-center justify-center p-5">
                                        <div className="absolute -inset-5 flex items-center justify-center pointer-events-none">
                                            {
                                                analyzing &&
                                                <>
                                                    <div className="ring-anim ring-1" />
                                                    <div className="ring-anim ring-2" />
                                                    <div className="ring-anim ring-3" />
                                                </>
                                            }
                                        </div>
                                        {analyzing ?
                                            <div className="relative z-2 text-center text-gray-300 select-none w-full">
                                                {renderCategoryContent()}
                                                {/* {test()} */}

                                            </div>
                                            :
                                            <div className="relative z-2 text-center text-gray-300 select-none">
                                                <div className="text-sm text-gray-400">Real Time Analysis Report will be displayed here</div>
                                                <div className="mt-2 text-xs">READY</div>
                                            </div>
                                        }
                                    </div>
                                </div>

                                {
                                    analyzing ?
                                        <div className="w-full lg-custom:w-80 rounded-2xl p-4 bg-[rgba(255,255,255,0.015)] border border-gray-800 flex flex-col gap-3">
                                            <div className="text-sm text-gray-400">Top Insights</div>
                                            <ul className="space-y-2 mt-2">
                                                {categories.map((c, idx) => (
                                                    <li key={c} className={`text-sm ${idx === currentCategoryIndex ? "text-purple-400 font-semibold" : "text-gray-500"}`}>
                                                        {idx <= currentCategoryIndex ? `✔ ${c}` : `• ${c}`}
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="mt-10 lg-custom:mt-auto">
                                                <div className='rounded-lg relative pt-4' style={{
                                                    padding: 1,
                                                    width: "100%",
                                                    height: "100%",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    overflow: "hidden"
                                                }}>
                                                    <div className='animate-spin-slow' style={{
                                                        position: "absolute",
                                                        background: "conic-gradient(transparent, transparent, rgb(192 132 252), transparent, transparent, #00f8, transparent, transparent)",
                                                        width: "105%",
                                                        aspectRatio: "1/1",
                                                        animationDuration: "3s",
                                                        animationTimingFunction: "cubic-bezier(0.5, 0, 0.5, 1)"
                                                    }} />
                                                    <div className='animate-spin-slow' style={{
                                                        position: "absolute",
                                                        background: "conic-gradient(transparent, transparent, #ff09, transparent, transparent, transparent, transparent, transparent)",
                                                        width: "105%",
                                                        aspectRatio: "1/1",
                                                        // height: "400px",
                                                        animationDuration: "3.2s",
                                                    }} />
                                                    <button className="w-full py-2 rounded-lg text-sm relative overflow-hidden" style={{
                                                        background: "black"
                                                    }}>
                                                        <div className='' style={{
                                                            position: "absolute",
                                                            background: "linear-gradient(to right, #211, #121)",
                                                            width: "20%",
                                                            height: "100%",
                                                            top: 0,
                                                            left: 0,
                                                        }} />
                                                        22% DONE
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div onClick={() => handleStart()} className="w-full lg-custom:w-80 rounded-2xl p-4 bg-[rgba(255,255,255,0.015)] border border-gray-800 flex flex-col gap-3">
                                            <div className="text-sm text-gray-400">Available Analysis</div>
                                            <ul className="space-y-2 mt-2">
                                                <li className="text-sm">• Full Time Winner with {data?.accuracy}% accuracy.</li>
                                                <li className="text-sm">• League Backtracking And Extended Analysis ({data.league?.name})</li>
                                                {/* <li className="text-sm">• Defensive line drifted wider at minute 62, creating 12% more space on left.</li> */}
                                            </ul>
                                            <div className="mt-auto">
                                                <button className="w-full py-2 rounded-lg border border-gray-700 text-sm" style={{
                                                    background: "linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.00) 100%)"
                                                }}>START ANALYZING</button>
                                            </div>
                                        </div>
                                }
                            </div>
                        </div>
                        :
                        <div className="flex items-center justify-center h-[400px]">
                            <div className="text-gray-400">Loading...</div>
                        </div>

                }
            </section>
            <AnimatePresence>
                {subscriptionNoticeShown && (
                    <motion.div
                        className="fixed bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-red-500 text-center"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                        >
                            <h3 className="text-lg font-semibold text-red-400 mb-2">Subscription Required</h3>
                            <p className="text-gray-400 mb-4">Please subscribe to access AI match analysis.</p>
                            <button
                                onClick={() => setsubscriptionNoticeShown(false)}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default DeepAnalyzerTool
