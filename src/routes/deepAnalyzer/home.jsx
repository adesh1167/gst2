import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import { useLocation, useNavigate, Link } from "react-router";
import SubscriptionCard from "../../components/subscriptionCard";
import { monthlySubscriptionPrice, weeklySubscriptionPrice } from "../../data/prices";
import NeuralBackground from "../neuralBackground";
import { useSelector } from "react-redux";
import { useApp } from "../../contexts/appContext";
import { getFixtureDate } from "../../functions/formatDate";
import LoadingRing from "../../components/loadingRing";
import { ActiveSubscriberCard } from "../../components/activeSubscriptionCard";

export default function AnalyzerHome() {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const { country, factor, continent } = useSelector(state => state.data);
    const { deepAnalyzerSubscription } = useSelector(state => state.subscriptions);
    const { deepAnalyzerMatches, deepAnalyzerUpcoming, setDeepAnalyzerUpcoming, fetchDeepAnalyzerUpcoming, deepAnalyzerTab, setDeepAnalyzerTab, searchMatches } = useApp();

    const isAfrica = useMemo(() => continent === "AF", [continent]);

    const [loading, setLoading] = useState({
        search: false,
        upcoming: false,
        matches: false
    });
    const [firstLoad, setFirstLoad] = useState(false);
    const [renew, setRenew] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setFirstLoad(true);
        }, 200)
    }, [])

    const tabsRef = useRef(null);
    const searchRef = useRef(null);
    const searchInputRef = useRef(null);

    // Search
    const [query, setQuery] = useState('');
    // const [searching, setSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const upcoming = useMemo(() => ({
        matches: deepAnalyzerUpcoming?.matches || {},
        pages: deepAnalyzerUpcoming?.pages || 0,
        page: deepAnalyzerUpcoming?.page || 1,
        pageSize: deepAnalyzerUpcoming?.pageSize || 4,
        totalPages: deepAnalyzerUpcoming?.totalPages,
        allLoaded: deepAnalyzerUpcoming?.allLoaded,
        loaded: deepAnalyzerUpcoming.loaded,
        // current: deepAnalyzerUpcoming.matches.slice((deepAnalyzerUpcoming.page - 1) * deepAnalyzerUpcoming.pageSize, deepAnalyzerUpcoming.page * deepAnalyzerUpcoming.pageSize)
        current: deepAnalyzerUpcoming.matches?.[deepAnalyzerUpcoming?.page] || [],
    }), [deepAnalyzerUpcoming]);
    // }, [matches, query, highlightsIds]);

    const nextPage = useCallback(() => {
        const newPage = upcoming.page + 1;

        if (upcoming.matches[newPage]) {
            setDeepAnalyzerUpcoming(prev => ({
                ...prev,
                page: newPage
            }))
            return
        }

        if (upcoming.allLoaded && newPage > upcoming.pages) {
            return;
        }

        setDeepAnalyzerUpcoming(prev => ({
            ...prev,
            page: newPage
        }))
        fetchDeepAnalyzerUpcoming(newPage);

    }, [upcoming])

    const prevPage = useCallback(() => {
        const newPage = Math.max(upcoming.page - 1, 1);

        if (upcoming.matches[newPage]) {
            setDeepAnalyzerUpcoming(prev => ({
                ...prev,
                page: newPage
            }))
            return
        }

        setDeepAnalyzerUpcoming(prev => ({
            ...prev,
            page: newPage
        }))
        fetchDeepAnalyzerUpcoming(newPage);

    }, [upcoming])

    useEffect(() => {
        if (deepAnalyzerTab === "upcoming") {
            if (!upcoming.loaded) {
                // console.log("Fetching DeepUpcoming")
                fetchDeepAnalyzerUpcoming();
            }
        }
    }, [deepAnalyzerTab, deepAnalyzerUpcoming])

    useEffect(() => {
        if (tabsRef.current && upcoming.loaded && firstLoad) {
            setTimeout(() => {
                tabsRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, 0)
        }
    }, [upcoming.page, upcoming.loaded])

    useEffect(() => {
        const timeout = setTimeout(() => {
            const string = query.trim();
            if (string.length > 2) {
                setLoading(prev => ({
                    ...prev,
                    search: true
                }));

                searchMatches(string)
                    .then(res => {
                        setSearchResults(res || [])
                    })
                    .catch(() => {

                    }).finally(() => {
                        setLoading(prev => ({
                            ...prev,
                            search: false
                        }));
                    })
            } else {
                setSearchResults([]);
            }
        }, 500)

        return () => {
            clearTimeout(timeout);
        }
    }, [query])

    const searching = useMemo(() => {
        return pathname == '/deep-analyzer/search';
    }, [pathname, firstLoad, window.location])

    useEffect(() => {
        let timeout;

        if (searching) {
            // timeout = setTimeout(() => {
            //     if (searchRef.current) {
            //         searchRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
            //     }
            // }, 200)
        } else {
            if (searchInputRef.current) {
                searchInputRef.current.blur();
            }
        }

        return () => {
            clearTimeout(timeout);
        }
    }, [searching])

    // handlers
    const gotoAnalyze = (id) => navigate(`/deep-analyzer/analyze/${id}`);

    const placeHolder = useMemo(() =>
        Array.from({ length: upcoming.pageSize }).map((_, i) =>
            <PlaceHolder key={i} />
        ), [upcoming.pageSize]
    )

    console.log("Deep Analyzer: ", deepAnalyzerSubscription);

    return (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.45 }} className="max-w-6xl mx-auto p-6 max-md:p-0">

            {/* centered AI-styled search */}
            <header className="text-center mb-12 min-h-[calc(100vh/2)] flex flex-col justify-center relative">
                <NeuralBackground opacity={0.2} animate />
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-red-400 mb-6 relative max-xs:text-3xl">
                    DEEP ANALYZER
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto relative">
                    Step into the future of sports analytics. Harness neural intelligence to uncover tactical insights, live predictions, and performance metrics like never before.
                </p>
            </header>

            {/* Subscription Plans */}
            {deepAnalyzerSubscription.queried ?
                <AnimatePresence mode="wait">
                    {(deepAnalyzerSubscription.plan && (!renew || deepAnalyzerSubscription.isActive)) ?
                        <motion.section
                            key="subscription_active"
                            className="mb-20 font-[raleway]"
                            initial={{
                                scale: 2,
                                opacity: 0
                            }}
                            animate={{
                                scale: 1,
                                opacity: 1
                            }}
                            exit={{
                                scale: 2,
                                opacity: 0
                            }}
                        >
                            {/* <h2 className="text-2xl font-semibold text-purple-500 mb-6">Subscription</h2> */}
                            <ActiveSubscriberCard
                                active={true}
                                planName={deepAnalyzerSubscription.planName}
                                startDateSql={deepAnalyzerSubscription.startDate}
                                endDateSql={deepAnalyzerSubscription.endDate}
                                nowDateSql={deepAnalyzerSubscription.now}
                                onManage={() => console.log('open billing')}
                                renewable={!deepAnalyzerSubscription.isActive}
                                onRenew={() => setRenew(true)}
                            />
                        </motion.section>
                        :
                        <motion.section
                            key="subscribe"
                            className="mb-20 font-[raleway]"
                            initial={{
                                scale: 2,
                                opacity: 0
                            }}
                            animate={{
                                scale: 1,
                                opacity: 1
                            }}
                            exit={{
                                scale: 2,
                                opacity: 0
                            }}
                        >
                            <h2 className="text-2xl font-semibold text-purple-500 mb-6">Subscription Plans</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <SubscriptionCard
                                    price={weeklySubscriptionPrice}
                                    title={"Weekly Plan"}
                                    description={"Access AI-powered analysis and predictions weekly."}
                                    frequency={"week"}
                                    type={"weekly"}
                                />
                                <SubscriptionCard
                                    price={monthlySubscriptionPrice}
                                    title={"Monthly Plan"}
                                    description={"Unlimited access to deep AI insights for the month."}
                                    frequency={"month"}
                                    type={"monthly"}
                                />
                            </div>
                            <div className="block text-center font-bold opacity-50 mt-5 md:mt-10 cursor-pointer">
                                <Link to={"/change-country"} className=''>CHANGE {isAfrica ? "COUNTRY" : "CURRENCY"}</Link>
                            </div>
                        </motion.section>
                    }
                </AnimatePresence>
                :
                <section
                    key="subscription_loading"
                    className="mb-20 font-[raleway] flex justify-center"
                >
                    <LoadingRing size={100} />
                </section>
            }



            <section className="h-[80px] mb-12">
                <motion.div
                    layout
                    transition={{ duration: .2, type: "tween" }}
                    animate={searching ?
                        {
                            // // position: "fixed",
                            top: "50px",
                            // paddingTop: "20px",
                            backgroundColor: "#000",
                            // width: "100%",
                            // right: 0,
                            // zIndex: 10,
                            padding: "20px",
                            // paddingTop: "50px",
                            // overflow: "hidden"
                        }
                        :
                        {
                            // position: "relative",
                            backgroundColor: "#0000",
                            top: 0,
                            // width: "100%"
                            paddingTop: 0,
                            padding: 0,
                        }
                    }
                    ref={searchRef}
                    className={`h-[calc(100dvh-50px)] ${searching ? "fixed w-full right-0 z-10 overflow-hidden" : "relative"}`}
                >
                    <form onSubmit={(e) => e.preventDefault()} className="mx-auto max-w-2xl">
                        <div className="relative">
                            {searching && <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 fill-white"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 640 640" width={24} height={24}
                                onClick={() => navigate(-1)}
                            >

                                {/*!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.*/}
                                <path d="M73.4 297.4C60.9 309.9 60.9 330.2 73.4 342.7L233.4 502.7C245.9 515.2 266.2 515.2 278.7 502.7C291.2 490.2 291.2 469.9 278.7 457.4L173.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L173.3 288L278.7 182.6C291.2 170.1 291.2 149.8 278.7 137.3C266.2 124.8 245.9 124.8 233.4 137.3L73.4 297.3z" />
                            </svg>}
                            <input
                                ref={searchInputRef}
                                value={searching ? query : ""}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search teams or matches"
                                className={`${searching ? "pl-11" : "pl-4"} w-full rounded-3xl bg-[#05060a] border border-gray-800 px-4 py-3 pr-20 text-gray-100 placeholder:text-gray-500 shadow-inner`}
                                aria-label="Search matches"
                                // onFocus={() => setSearching(true)}
                                onFocus={() => {
                                    if (!searching) {
                                        navigate("/deep-analyzer/search")
                                    }
                                }}
                            // onBlur={() => setSearching(false)}
                            />
                            <button type="submit" aria-label="Search" className={`absolute right-1.5 top-1/2 -translate-y-1/2 ${loading.search ? "" : "bg-gradient-to-r from-purple-600 to-red-400"} p-2 rounded-3xl text-black shadow-md px-5`}>
                                {loading.search ?
                                    <LoadingRing size={22} />
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="11" cy="11" r="6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                }
                            </button>
                        </div>
                        <div className="text-center mt-3 text-sm text-gray-400">Search across all matches</div>
                    </form>

                    {/* search results - centered */}
                    <div className="mt-6 mx-auto max-w-2xl h-full pb-[100px]">
                        {/* {searching && <div className="text-center text-sm text-gray-400">Searching…</div>} */}
                        {searching && query.trim().length > 0 && (
                            loading.search || <div className="bg-[rgba(255,255,255,0.01)] border border-gray-800 rounded-2xl p-4 z-10 max-h-full overflow-scroll">
                                {searchResults.length === 0 ? (
                                    <div className="text-center text-sm text-gray-500">{query.trim().length > 2 ? "No matches found" : "Enter minimum of 3 characters"}</div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3">
                                        {searchResults.map(m => (
                                            <div key={m.id} className="flex items-center justify-between p-3 rounded-lg gap-2 bg-[rgba(255,255,255,0.06)]">
                                                <div>
                                                    <div className="text-xs text-gray-400">{m.league?.name}</div>
                                                    <div className="font-medium">{m.teams.home.name} v {m.teams.away.name}</div>
                                                    <div className="text-xs mt-0.5 text-gray-500">{getFixtureDate(m.fixture.date)}</div>
                                                </div>
                                                <div className="flex items-center flex-col gap-2">
                                                    <div className="text-sm text-gray-300">{m.accuracy ?? '—'}%</div>
                                                    <button onClick={() => gotoAnalyze(m.fixture.id)} className="px-3 py-1 rounded-md bg-purple-600 text-white text-sm">Analyze</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </section>

            {/* Tabs: Highlights / Upcoming */}
            <section className="mb-8 relative">
                <div ref={tabsRef} className="flex items-center justify-center gap-3 mb-6 overflow-y-hidden">
                    <button onClick={() => { setDeepAnalyzerTab('highlights'); }} className={`px-4 py-2 rounded-full 'bg-[rgba(255,255,255,0.01)] text-gray-300 border border-gray-800 relative`}>
                        <AnimatePresence>
                            {deepAnalyzerTab === 'highlights' && <motion.div
                                layoutId="highligts"
                                className="bg-gradient-to-r from-purple-600 to-red-400 absolute top-0 left-0 h-full w-full rounded-2xl"
                            />}
                        </AnimatePresence>
                        <span className={`relative ${deepAnalyzerTab === 'highlights' ? 'font-bold' : ''}`}>Highlights</span>
                    </button>
                    <button onClick={() => { setDeepAnalyzerTab('upcoming'); }} className={`px-4 py-2 rounded-full 'bg-[rgba(255,255,255,0.01)] text-gray-300 border border-gray-800 relative overflow-hidden1`}>
                        <AnimatePresence>
                            {deepAnalyzerTab === 'upcoming' && <motion.div
                                layoutId="highligts"
                                className="bg-gradient-to-r from-purple-600 to-red-400 absolute top-0 left-0 h-full w-full rounded-2xl"
                            />}
                        </AnimatePresence>
                        <span className={`relative ${deepAnalyzerTab === 'upcoming' ? 'font-bold' : ''}`}>Upcoming</span>
                    </button>
                </div>

                {deepAnalyzerTab === 'highlights' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {deepAnalyzerMatches.length === 0 && <div className="text-center text-sm text-gray-400">No highlights</div>}
                        {deepAnalyzerMatches.matches.map(m => {

                            const fixtureTime = getFixtureDate(m.fixture?.date, country, true);

                            return <motion.button
                                key={m.id}
                                // layoutId={m.id}
                                onClick={() => gotoAnalyze(m.fixture.id)}
                                className="relative w-full text-left p-4 rounded-2xl border bg-[rgba(255,255,255,0.02)] border-gray-800 hover:border-gray-700"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.995 }}
                            >
                                <div className="flex items-center justify-between gap-5">
                                    <div>
                                        <div className="text-xs text-gray-400">{m.league?.name}</div>
                                        <div className="text-lg font-medium mt-1">{m.teams.home.name} v {m.teams.away.name}</div>
                                    </div>
                                    <div className="flex flex-col justify-around items-end self-stretch gap-2 text-right">
                                        <div className="text-md font-semibold">{m.accuracy ?? '—'}%</div>
                                        <div>
                                            <div className="text-xs font-semibold text-gray-400">{fixtureTime.date}</div>
                                            <div className="text-xs font-semibold text-gray-400">{fixtureTime.time}</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.button>
                        })}
                    </div>
                )}

                {deepAnalyzerTab === 'upcoming' && (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {
                                (upcoming.current.length === 0) ?
                                    placeHolder
                                    :
                                    // placeHolder
                                    upcoming.current.map(m => (
                                        <motion.div
                                            key={m.id}
                                            // layoutId={m.id}
                                            className="p-4 rounded-2xl border bg-[rgba(255,255,255,0.01)] border-gray-800 flex items-center justify-between gap-4 overflow-hidden hover:border-gray-700"
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.995 }}
                                        >
                                            <div className="shrink overflow-hidden">
                                                <div className="text-xs text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis">{m.league?.name}</div>
                                                <div className="text-lg font-medium">{m.teams?.home.name} v {m.teams?.away.name}</div>
                                                <div className="text-xs text-gray-500 mt-1">{getFixtureDate(m.fixture.date)}</div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2 shrink-0"><div className="text-lg font-semibold">{m.accuracy ?? '—'}%</div><button onClick={() => gotoAnalyze(m.fixture.id)} className="px-3 py-1 rounded-md bg-purple-600 text-white text-sm">Analyze</button></div>
                                        </motion.div>
                                    ))
                            }
                        </div>

                        <div className="mt-8 flex items-center justify-center">
                            {/* <div className="text-sm text-gray-400">Total upcoming: {upcoming.length}</div> */}
                            <div className="flex items-center justify-between gap-2 grow max-w-[400px]">
                                <button onClick={() => prevPage()} disabled={upcoming.page === 1} className="px-3 py-2 rounded-md border border-gray-800 text-sm disabled:opacity-40">Prev</button>
                                <div className="text-sm text-gray-300">Page <span className="text-white font-medium">{upcoming.page}</span></div>
                                <button onClick={() => nextPage()} disabled={upcoming.page === upcoming.pages && upcoming.allLoaded} className="px-3 py-2 rounded-md border border-gray-800 text-sm disabled:opacity-40">Next</button>
                            </div>
                        </div>
                    </div>
                )}
            </section>

        </motion.div >
    );
}

function PlaceHolder() {
    return (
        <>
            <div className="p-4 rounded-2xl border bg-[rgba(255,255,255,0.01)] border-gray-800 flex items-center justify-between animate-glow gap-5">
                <div className="w-full">
                    <div className="h-4 w-28 bg-gray-700 rounded-full"></div>
                    <div className="h-8 w-full bg-gray-600 rounded-full mt-2"></div>
                    <div className="h-5 w-20 bg-gray-700 rounded-full mt-1"></div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="h-6 w-16 bg-gray-600 rounded-full"></div>
                    <div className="h-8 w-24 bg-gray-800 rounded-lg"></div>
                </div>
            </div>

            <style>{`
                @keyframes animate-glow {
                    0% {
                        opacity: 0.2;
                    }
                    50% {
                        opacity: 0.4;
                    }
                    100% {
                        opacity: 0.2;
                    }
                }
                .animate-glow {
                    animation: animate-glow 2s infinite;
                }    
            `}</style>
        </>
    )
}
