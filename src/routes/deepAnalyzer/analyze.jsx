// src/pages/DeepAnalyzerTool.jsx
import { Link, redirect, useLocation, useNavigate, useParams } from 'react-router';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from '../../contexts/appContext';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { baseApiUrl } from '../../data/url';
import { getFixtureDate } from '../../functions/formatDate';
import localFixtureStats from '../../test';
import LoadingRing from '../../components/loadingRing';
import formatNumber from '../../functions/formatNumber';
import analysisConfig from '../../data/analysisConfig';
import NeuralBackground from '../neuralBackground';
import SummaryPanel from '../../components/deepAnalyzer/summary';
import errorCodes from '../../data/errorCodes';
import buildReport from '../../functions/buildReport';

const DeepAnalyzerTool = () => {

    const { country } = useSelector(state => state.data);

    const { deepAnalyzerMatches, fetchDeepAnalyzerMatches } = useApp();
    const [subscriptionNoticeShown, setsubscriptionNoticeShown] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [analyzed, setAnalyzed] = useState(false);
    const [result, setResult] = useState(null);
    const [summaryOpen, setSummaryOpen] = useState(false);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState({
        data: false,
        stats: false,
        result: false,
    });
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const { id } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [fixtureStats, setFixtureStats] = useState(null);
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const duration = useRef({
        startTime: null,
        endTime: null
    })
    const showSummaryTimeout = useRef();

    useLayoutEffect(() => {
        if (data) {
            const sessionSummary = sessionStorage.getItem(`summary_${data.fixture.id}`);
            if (sessionSummary) {
                setSummary(JSON.parse(sessionSummary));
            }
        }
    }, [data])

    // useEffect(() => {
    //     setTimeout(() => {
    //         if (!deepAnalyzerMatches.loaded) {
    //             fetchDeepAnalyzerMatches();
    //         } else {
    //             const details = deepAnalyzerMatches.matches.find(match => match.id == id);
    //             console.log("Details: ", details);
    //             if (details) {
    //                 setData(details);
    //             } else {
    //                 setError("Match not Available");
    //             }
    //         }
    //     }, 500 + Math.random() * 700)
    //     console.log("Stats: ", fixtureStats);
    // }, [deepAnalyzerMatches]);

    useLayoutEffect(() => {
        fetchMatch();
    }, [])

    // config-driven stepping useEffect
    useEffect(() => {
        if (!analyzing) return;

        const dt = fixtureStats || {};
        let mounted = true;

        const getCfg = (index) => analysisConfig[index] ?? analysisConfig[0];

        const tick = () => {
            if (!mounted) return;
            const cfg = getCfg(currentCategoryIndex);
            const maxLen = (typeof cfg.getMaxLen === "function") ? cfg.getMaxLen(dt) : 1;

            // if no data for this category, skip forward
            if (!maxLen || maxLen === 0) {
                if (currentCategoryIndex < analysisConfig.length - 1) {
                    setCurrentCategoryIndex((c) => c + 1);
                    setSubIndex(0);
                } else {
                    // setAnalyzing(false);
                    setAnalyzed(true);
                }
                return;
            }

            // advance subIndex pages for current category
            if (subIndex < maxLen - 1) {
                setSubIndex((s) => s + 1);
            } else {
                if (currentCategoryIndex < analysisConfig.length - 1) {
                    setCurrentCategoryIndex((c) => c + 1);
                    setSubIndex(0);
                } else {
                    setAnalyzed(true);
                    // setAnalyzing(false);
                }
            }
        };

        const cfgNow = getCfg(currentCategoryIndex);
        const intervalMs = cfgNow.interval ?? 2400;
        const interval = setInterval(tick, intervalMs);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [currentCategoryIndex, subIndex, analyzing, fixtureStats]);


    useEffect(() => {
        if (analyzing) {
            if (showSummaryTimeout.current) {
                clearTimeout(showSummaryTimeout.current);
            }
            duration.current.startTime = Date.now();
        } else {
            setCurrentCategoryIndex(0);
            setSubIndex(0);
        }
    }, [analyzing])

    useEffect(() => {

        let timeout;
        if (analyzed) {

            if (analyzing) {
                duration.current.endTime = Date.now();
                setAnalyzing(false);
            }
            if (!fixtureStats || !data) return;
            // if (!summary) {
            timeout = setTimeout(() => {
                // console.log("Building Report...");
                setSummary(buildReport(fixtureStats, {
                    accuracy: data.accuracy,
                    ...duration.current
                }))
            }, 1000);
            // }
        }

        return () => {
            clearTimeout(timeout);
        }
    }, [analyzed])

    // useEffect(() => {
    //     if (fixtureStats) {
    //         console.log("Building Report...");
    //         setSummary(buildReport(fixtureStats, {
    //             accuracy: data.accuracy,
    //             ...duration.current
    //         }))
    //     }
    // }, [fixtureStats])

    useEffect(() => {
        if (summary) {
            sessionStorage.setItem(`summary_${data.fixture.id}`, JSON.stringify(summary));
            showSummaryTimeout.current = setTimeout(() => {
                setSummaryOpen(true);
            }, 1000);
        }

        return () => {
            clearTimeout(showSummaryTimeout.current)
        }
    }, [summary])


    const handleStart = useCallback(() => {
        if (data) {
            setLoading(prev => ({
                ...prev,
                stats: true
            }));

            fetchFixtureStats()
                .then((res) => {
                    // console.log("Res: ", res);
                    if (res) {
                        setAnalyzed(false);
                        setAnalyzing(true);
                    }
                })
                .catch(() => {

                }).finally(() => {
                    setLoading(prev => ({
                        ...prev,
                        stats: false
                    }));
                });
        }
    }, [data])

    function fetchMatch() {
        axios({
            method: 'GET',
            url: `${baseApiUrl}/get-match.php?fixture_id=${id}`
        })
            .then(res => {
                // console.log(res.data);
                if (res.data.status === 'success') {
                    const newdata = res.data.data;
                    setData({
                        ...newdata,
                        ...JSON.parse(newdata.match_data),
                        match_data: null
                    });
                } else {
                    setError("Match not Available");
                }
            })
            .catch(err => {
                console.error(err);
                setError("Check your network and reload");
            })
    }

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
                // console.log(res.data);
                if (res.data.status === 'success') {
                    setFixtureStats({
                        ...res.data.data,
                        form: [...(res.data.data?.home_form || []), ...(res.data.data?.away_form || [])],
                        players: [...(res.data.data?.home_team || []), ...(res.data.data?.away_team || [])]
                    });
                    return true;
                } else {
                    setError(errorCodes[res.data.error_code] ? errorCodes[res.data.error_code]({ redirect: pathname }) : (res.data.message || "An unknown error occured, reload"));
                    return false;
                }
            })
            .catch(err => {
                console.error(err);
                setError("Check your network and reload");
                return false;
            })
    }

    // config-driven renderCategoryContent (keeps your same motion wrapping / JSX)
    const cardVariants = {
        initial: { opacity: 0, y: 8 },
        enter: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 }
    };

    const renderCategoryContent = () => {
        if (!analyzing || !fixtureStats) return null;

        const dt = fixtureStats || {};
        const fixtureObj = dt.fixture?.[0] || dt.fixture || {};
        const fixtureMeta = fixtureObj.fixture || fixtureObj; // some shapes nest under .fixture
        const fixtureLeague = fixtureObj.league;
        const teamsFromFixture = fixtureObj.teams || fixtureMeta.teams || fixtureStats.teams || {};
        const predictionRoot = dt.predictions?.[0] || dt.predictions || {};

        const cfg = analysisConfig[currentCategoryIndex];
        if (!cfg) return null;

        const key = `${cfg.id}-${subIndex}`;

        const node = cfg.render?.({
            dt,
            subIndex,
            teamsFromFixture,
            predictionRoot,
            fixtureMeta,
            fixtureLeague,
            country
        });

        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key={key}
                    variants={cardVariants}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    transition={{ duration: 0.45 }}
                    className="w-full"
                >
                    {node}
                </motion.div>
            </AnimatePresence>
        );
    };

    const getProgress = useCallback(() => {
        const totalCategories = analysisConfig.length;
        const dt = fixtureStats || {};

        const cfg = analysisConfig[currentCategoryIndex] ?? analysisConfig[0];

        const getTotalSubForCurrent = () => {
            const maybe = cfg.getMaxLen ? cfg.getMaxLen(dt) : 1;
            return maybe || 1;
        };

        const totalSub = getTotalSubForCurrent();

        // progress as percentage: category index + fraction
        const base = (currentCategoryIndex + (subIndex / totalSub)) / totalCategories;
        return base * 100;
    }, [currentCategoryIndex, subIndex, fixtureStats]);

    const progress = useMemo(() => getProgress(), [getProgress]);

    const categoryContent = useMemo(() => {
        return renderCategoryContent();
    }, [currentCategoryIndex, subIndex, fixtureStats])

    const roundData = useMemo(() => {
        const currentCategory = analysisConfig[currentCategoryIndex];
        const interval = currentCategory?.interval ?? 2400;
        const categoryKey = currentCategory.id;
        const subKey = categoryKey + "-" + subIndex;

        return ({
            currentCategory,
            interval,
            categoryKey,
            subKey
        })
    }, [currentCategoryIndex, subIndex, fixtureStats])

    // console.log("Summary: ", analyzed, analyzing, summary);

    return (
        <motion.div
            key="analysis"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 1 }}
        >
            {/* Analysis Section */}
            <section className='min-h-[calc(100vh-10rem)] font-[raleway]'>
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
                                    <div className="text-xl max-sm:text-lg font-semibold orbitron-regular">{data?.teams?.home?.name} v {data?.teams?.away?.name} — Tactical Analysis</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-xs text-gray-400">Confidence</div>
                                    <div className="px-2 py-1 bg-[rgba(255,255,255,0.03)] rounded-lg border border-gray-800 text-sm orbitron-regular">High</div>
                                </div>
                            </div>
                            <div className="relative flex flex-col lg-custom:flex-row gap-6 flex-1">
                                <div className="flex-1 rounded-2xl p-4 bg-[rgba(255,255,255,0.015)] border border-gray-800 relative overflow-hidden flex items-center justify-center">
                                    <NeuralBackground opacity={0.2} animate={analyzing} />
                                    <div className="relative w-full min-h-[35vh] max-w-md rounded-xl bg-[#05060a] border border-gray-800 shadow-inner flex items-center justify-center p-5 overflow-hidden">
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

                                        {(analyzing) &&
                                            <>
                                                <div
                                                    className='absolute top-0 h-[1px] transition-[width] duration-500 ease-in-out left-0 overflow-hidden'
                                                    style={{
                                                        // width: `${50}%`,
                                                        width: `${progress}%`,
                                                        background: "linear-gradient(90deg, rgba(255, 0, 255, 1) 0%, rgba(0, 0, 255, 1) 100%)",
                                                        boxShadow: "0 0 10px 1px rgba(255, 255, 255, 0.03)",
                                                        opacity: 0.3 + (progress / 200 * 0.7),
                                                    }}
                                                >
                                                    <div
                                                        className='h-full shimmer absolute'
                                                        style={{
                                                            background: "linear-gradient(90deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3))",
                                                            width: 200
                                                        }}
                                                    >
                                                        <style>
                                                            {`

                                                                .shimmer{
                                                                    animation: shimmer 3s ease-in infinite forwards
                                                                }

                                                                @keyframes shimmer{
                                                                    0%{
                                                                        left: -200px;
                                                                    }
                                                                    40%{
                                                                        left: calc(100% + 200px);
                                                                    }
                                                                    100%{
                                                                        left: calc(100% + 200px);
                                                                    }
                                                                }
                                                                `}
                                                        </style>
                                                    </div>
                                                </div>
                                                <motion.div
                                                    className="h-[1.5px] bg-purple-900 absolute bottom-0"
                                                    key={roundData.subKey}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "100%" }}
                                                    exit={{ width: 0 }}
                                                    transition={{ duration: roundData.interval / 1000, ease: "easeInOut" }}
                                                />
                                            </>
                                        }
                                        {analyzing ?
                                            <div className="relative z-2 text-center text-gray-300 select-none w-full">
                                                {categoryContent}

                                            </div>
                                            :
                                            <div className="relative z-2 text-center text-gray-300 select-none">
                                                <div className="text-sm text-gray-400">Real Time Analysis Report will be displayed here</div>
                                                <div className="mt-2 text-xs orbitron-regular">READY</div>
                                            </div>
                                        }
                                    </div>
                                </div>

                                <AnimatePresence mode="sync">

                                    {analyzing ?
                                        <motion.div
                                            key="analysis"
                                            layout
                                            initial={{ opacity: 0, x: 50, height: 200 }}
                                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                                            exit={{ opacity: 0, x: -50, position: "absolute", right: 0 }}
                                            transition={{ duration: 0.8 }}
                                            className="w-full lg-custom:w-80 rounded-2xl p-4 bg-[rgba(255,255,255,0.015)] border border-gray-800 flex flex-col gap-3 overflow-hidden"
                                        >
                                            <div className="text-sm text-gray-400">
                                                <span>Progress: </span>
                                                <span className='text-purple-500 text-shadow-xs text-shadow-purple-500 scale-105 font-extrabold'>
                                                    {analysisConfig[currentCategoryIndex]?.title} <LoadingRing size={20} />
                                                </span>
                                            </div>
                                            <ul className="space-y-2 mt-2">
                                                <AnimatePresence>
                                                    {analysisConfig.map((c, idx) => (
                                                        <li key={c.id} className={`text-sm transition duration-500 ease-in-out origin-left ${currentCategoryIndex >= idx ? "text-purple-400 font-bold" : "text-gray-500 font-normal"} ${currentCategoryIndex === idx ? "text-shadow-xs text-shadow-purple-500 scale-110 translate-x-[-12px] font-extrabold" : "font-bold scale-100 translate-x-0"}`}>
                                                            {idx < currentCategoryIndex ? `✔ ` : idx === currentCategoryIndex ?
                                                                <motion.span className='absolute left-0' layoutId='testlayout'>
                                                                    <LoadingRing key={c.id} size={20} className={"block"} style={{ display: "block" }} />
                                                                </motion.span>
                                                                : `• `} {idx === currentCategoryIndex && <span className='invisible'> ..... </span>} {c.title}
                                                        </li>
                                                    ))}
                                                </AnimatePresence>
                                            </ul>
                                            <div className="mt-auto pt-5">
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
                                                        animationDuration: "3.2s",
                                                    }} />
                                                    <button className="flex items-center justify-center h-10 w-full py-2 rounded-lg text-sm relative overflow-hidden" style={{
                                                        background: "black"
                                                    }}>
                                                        <div className='transition-all duration-1000 ease-in-out' style={{
                                                            position: "absolute",
                                                            background: "linear-gradient(to right, #211, #121)",
                                                            width: `${progress > 100 ? 100 : progress}%`,
                                                            height: "100%",
                                                            top: 0,
                                                            left: 0,
                                                            borderRight: "1px #ff03 solid"
                                                        }} />
                                                        <span className='relative orbitron-regular'>{formatNumber(progress)}%</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                        :
                                        <div className='flex flex-col gap-3'>
                                            {summary && <motion.div
                                                key="complete"
                                                layout
                                                initial={{ opacity: 0, x: 50, scale: 0.5 }}
                                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                                exit={{ opacity: 0, x: -50, position: "absolute", right: 0 }}
                                                transition={{ duration: 0.5 }}
                                                onClick={() => setSummaryOpen(true)}
                                                className="glow-shadow right-0 w-full lg-custom:w-80 rounded-2xl p-4 bg-[rgba(255,255,255,0.015)] border border-purple-900 flex flex-col gap-3"
                                            >
                                                <div className="text-xl text-purple-400 text-center pt-2 font-bold">ANALYSIS COMPLETE ✔</div>
                                                <div className="mt-auto orbitron-regular pt-4">
                                                    <button className="flex items-center h-10 justify-center w-full py-2 rounded-lg border border-purple-600 font-bold text-purple-500 text-sm" style={{
                                                        background: "linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.00) 100%)"
                                                    }}>VIEW SUMMARY</button>
                                                    <style>{`

                                                        .glow-shadow{
                                                            animation: glow-shadow 2s ease-in-out infinite;
                                                        }

                                                        @keyframes glow-shadow{
                                                            0%{
                                                                box-shadow: 0 0 30px -10px rgba(168, 5, 247, 0.6);
                                                            }
                                                            25%{
                                                                box-shadow: 0 0 35px -5px rgba(168, 5, 247, 0.6);
                                                            }
                                                            50%{
                                                                box-shadow: 0 0 30px -10px rgba(168, 5, 247, 0.6);
                                                            }
                                                            100%{
                                                                box-shadow: 0 0 30px -10px rgba(168, 5, 247, 0.6);
                                                            }
                                                        }
                                                    `}</style>
                                                </div>
                                            </motion.div>}
                                            <motion.div
                                                key="available"
                                                initial={{ opacity: 0, x: 50, height: 200 }}
                                                animate={{ opacity: 1, x: 0, height: 'auto' }}
                                                exit={{ opacity: 0, x: -50, position: "absolute", right: 0 }}
                                                transition={{ duration: 0.8 }}
                                                className="right-0 w-full lg-custom:w-80 rounded-2xl p-4 bg-[rgba(255,255,255,0.015)] border border-gray-800 flex flex-col gap-3 grow"
                                            >
                                                <div className="text-sm text-gray-400">Available Analysis</div>
                                                <ul className="space-y-2 mt-2">
                                                    <li className="text-sm">• Full Time Winner with {data?.accuracy}% accuracy.</li>
                                                    <li className="text-sm">• League Backtracking And Extended Analysis ({data.league?.name})</li>
                                                </ul>
                                                <div className="mt-auto orbitron-regular pt-10">
                                                    <button onClick={() => handleStart()} className="flex items-center h-10 justify-center w-full py-2 rounded-lg border border-gray-700 text-sm" style={{
                                                        background: "linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.00) 100%)"
                                                    }}>{loading.stats ? <LoadingRing size={24} /> : summary ? "ANALYZE AGAIN" : "START ANALYZING"}</button>
                                                </div>
                                            </motion.div>
                                        </div>
                                    }

                                </AnimatePresence>
                            </div>
                        </div>
                        :
                        <div className="flex items-center justify-center h-[400px]">
                            <div className="text-gray-400 orbitron-regular">Loading...</div>
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
            <AnimatePresence mode='wait'>
                {summaryOpen && (
                    <SummaryPanel open={summaryOpen} onClose={() => setSummaryOpen(false)} report={summary} />
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default DeepAnalyzerTool
