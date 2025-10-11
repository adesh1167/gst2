import { Link, useNavigate, useParams } from 'react-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from '../../contexts/appContext';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { set } from 'react-hook-form';
import { baseApiUrl } from '../../data/url';
import { getFixtureDate } from '../../functions/formatDate';
import localFixtureStats from '../../test';
import LoadingRing from '../../components/loadingRing';
import formatNumber from '../../functions/formatNumber';

const categories = [
    "Fixture Overview",
    "Venue & League",
    "Team Snapshot (Home)",
    "Team Snapshot (Away)",
    "Head-to-Head",
    "Form (Home)",
    "Form (Away)",
    "Team Comparison",
    "Player Stats",
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
            <Link to={"/login"} className='login-register-button' style={{ marginRight: 0 }}>LOGIN</Link>
        </div>
    </div>,
    "SUB_EXPIRED": <div className='text-center'>
        <div className='font-bold mb-4'>Your subscription has expired </div>
        <div>Renew your subscription to continue using DEEP ANALYZER</div>
        <div className='p-8'>
            <Link to={"/deep-analyzer"} className='login-register-button' style={{ marginRight: 0 }}>SUBSCRIBE</Link>
        </div>
    </div>,
    "NO SUB": <div className='text-center'>
        <div className='font-bold mb-4'>You do not have a subscription</div>
        <div> Subscribe to start using DEEP ANALYZER</div>
        <div className='p-8'>
            <Link to={"/deep-analyzer"} className='login-register-button' style={{ marginRight: 0 }}>SUBSCRIBE</Link>
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

        const dt = fixtureStats || {};

        const getMaxLenForCategory = (category) => {
            switch (category) {
                case "Form (Home)":
                    // per your request: length comes from dt?.home_form
                    return dt?.home_form?.length ?? 0;
                case "Form (Away)":
                    // per your request: length comes from dt?.away_form
                    return dt?.away_form?.length ?? 0;
                case "Head-to-Head":
                    return dt?.predictions[0]?.h2h?.length ?? dt?.predictions.h2h?.length ?? dt?.head_to_head?.length ?? 0;
                case "Player Stats":
                    // players may be nested or flat
                    return dt?.players?.[0]?.players?.length ?? dt?.players?.length ?? 0;
                default:
                    return 1; // single-screen categories
            }
        };

        const getIntervalForCategory = (category) => {
            if (category === "Head-to-Head") return 1200; // fast flip through many past matches
            if (category === "Player Stats") return 1200;
            if (category === "Team Comparison") return 12000;
            if (category.startsWith("Form")) return 1200;
            return 2400;
        };

        const interval = setInterval(() => {
            const category = categories[currentCategoryIndex] || categories[0];
            const maxLen = getMaxLenForCategory(category);

            // if no data for this category, skip forward (avoid hanging)
            if (maxLen === 0) {
                if (currentCategoryIndex < categories.length - 1) {
                    setCurrentCategoryIndex((c) => c + 1);
                    setSubIndex(0);
                } else {
                    // finished
                    clearInterval(interval);
                    setAnalyzing(false);
                }
                return;
            }

            // advance through subIndex pages for this category, then move next category
            if (subIndex < maxLen - 1) {
                setSubIndex((s) => s + 1);
            } else {
                if (currentCategoryIndex < categories.length - 1) {
                    setCurrentCategoryIndex((c) => c + 1);
                    setSubIndex(0);
                } else {
                    // finished all categories
                    clearInterval(interval);
                    setAnalyzing(false);
                }
            }
        }, getIntervalForCategory(categories[currentCategoryIndex]));

        return () => clearInterval(interval);
    }, [currentCategoryIndex, subIndex, analyzing, fixtureStats]);


    useEffect(() => {
        if (!analyzing) {
            setCurrentCategoryIndex(0);
            setSubIndex(0);
        }
    }, [analyzing])


    const handleStart = useCallback(() => {
        if (data) {
            fetchFixtureStats()
                .then((res) => {
                    console.log("Res: ", res);
                    if (res) setAnalyzing(true);
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
                        players: [...(res.data.data?.home_team || []), ...(res.data.data?.away_team || [])]
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
        if (!analyzing || !fixtureStats) return null;

        const dt = fixtureStats || {};
        const fixtureObj = dt.fixture?.[0] || dt.fixture || {};
        const fixtureMeta = fixtureObj.fixture || fixtureObj; // some shapes nest under .fixture
        const teamsFromFixture = fixtureObj.teams || fixtureMeta.teams || fixtureStats.teams || {};
        const predictionRoot = dt.predictions?.[0] || dt.predictions || {};
        // sometimes predictions are nested under .predictions (array) or predictions[0].predictions
        const predictionBlock = predictionRoot.predictions ?? predictionRoot;

        // helper: compute a predicted final score from predictionBlock OR comparison.poisson distribution OR winner fallback
        const getPredictedScore = () => {
            // 1) explicit goals in predictions
            if (predictionBlock?.goals && (predictionBlock.goals.home != null || predictionBlock.goals.away != null)) {
                return {
                    home: Number(predictionBlock.goals.home ?? 0),
                    away: Number(predictionBlock.goals.away ?? 0),
                    source: "predictions.goals"
                };
            }

            // 2) try comparison.poisson_distribution or expected numbers in comparison block
            const comp = predictionRoot?.comparison || dt?.comparison || {};
            const tryNum = (v) => {
                if (v == null) return null;
                const n = Number(v);
                return Number.isFinite(n) ? n : null;
            };
            const hExp = tryNum(comp?.poisson_distribution?.home ?? comp?.expected_goals?.home ?? comp?.total?.home);
            const aExp = tryNum(comp?.poisson_distribution?.away ?? comp?.expected_goals?.away ?? comp?.total?.away);
            if ((hExp != null) || (aExp != null)) {
                return {
                    home: Math.max(0, Math.round(hExp ?? aExp ?? 1)),
                    away: Math.max(0, Math.round(aExp ?? hExp ?? 1)),
                    source: "comparison.poisson"
                };
            }

            // 3) fallback from winner/draw probabilities
            const winner = predictionBlock?.winner ?? predictionRoot?.winner;
            if (winner) {
                const winnerName = winner?.name ?? winner;
                const homeName = teamsFromFixture?.home?.name;
                const awayName = teamsFromFixture?.away?.name;
                if (winnerName === homeName) return { home: 1, away: 0, source: "winner" };
                if (winnerName === awayName) return { home: 0, away: 1, source: "winner" };
                if (/draw/i.test(String(winnerName))) return { home: 1, away: 1, source: "winner" };
            }

            // 4) percent-based heuristic: highest percent -> 1-0 or 0-1, draw -> 1-1
            const pct = predictionBlock?.percent ?? predictionRoot?.percent;
            if (pct) {
                const ph = Number(pct.home ?? pct?.H ?? 0);
                const pd = Number(pct.draw ?? pct?.D ?? 0);
                const pa = Number(pct.away ?? pct?.A ?? 0);
                if (pd > ph && pd > pa) return { home: 1, away: 1, source: "percent.draw" };
                if (ph > pa) return { home: 1, away: 0, source: "percent.home" };
                if (pa > ph) return { home: 0, away: 1, source: "percent.away" };
            }

            // default: low-scoring draw
            return { home: 1, away: 1, source: "default" };
        };

        const predicted = getPredictedScore();

        // small framer-motion variants shared by cards
        const cardVariants = {
            initial: { opacity: 0, y: 8 },
            enter: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -8 }
        };

        // render per-category. wrap each return in AnimatePresence + motion.div keyed by category+subIndex
        const key = `${categories[currentCategoryIndex]}-${subIndex}`;

        switch (categories[currentCategoryIndex]) {
            case "Fixture Overview": {
                const homeName = teamsFromFixture?.home?.name ?? "Home";
                const awayName = teamsFromFixture?.away?.name ?? "Away";
                return (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={key}
                            variants={cardVariants}
                            initial="initial"
                            animate="enter"
                            exit="exit"
                            transition={{ duration: 0.45 }}
                            className="text-center"
                        >
                            <h3 className="text-lg font-semibold text-purple-400 mb-2">Fixture</h3>
                            <p className="font-semibold">{homeName} vs {awayName}</p>
                            <p>{fixtureMeta?.venue?.name ?? fixtureObj?.venue?.name ?? "-"}</p>
                            <p>{new Date(fixtureMeta?.date ?? fixtureObj?.date ?? "").toLocaleString()}</p>
                            <p className="text-sm text-gray-400 mt-2">Status: {fixtureMeta?.status?.long ?? fixtureMeta?.status?.short ?? "-"}</p>
                        </motion.div>
                    </AnimatePresence>
                );
            }

            case "Venue & League": {
                const league = fixtureObj?.league || dt?.league || {};
                const f = fixtureMeta;
                return (
                    <AnimatePresence mode="wait">
                        <motion.div key={key} variants={cardVariants} initial="initial" animate="enter" exit="exit" transition={{ duration: 0.45 }} className="text-center">
                            <h3 className="text-lg font-semibold text-purple-400 mb-2">{league?.name ?? "League"}</h3>
                            {league?.logo && <img src={league.logo} alt={league.name} className="mx-auto w-10 h-10 mb-2" />}
                            <p>Season: {league?.season ?? "-"} · Round: {league?.round ?? "-"}</p>
                            <p className="mt-2">{f?.venue?.name ?? "-"} — Timezone: {f?.timezone ?? "-"}</p>
                        </motion.div>
                    </AnimatePresence>
                );
            }

            case "Team Snapshot (Home)": {
                const home = predictionRoot?.teams?.home ?? dt?.teams?.home ?? teamsFromFixture?.home ?? {};
                const league = home?.league ?? {};
                const last5 = home?.last_5 ?? home?.last5 ?? {};
                return (
                    <AnimatePresence mode="wait">
                        <motion.div key={key} variants={cardVariants} initial="initial" animate="enter" exit="exit" transition={{ duration: 0.45 }} className="p-3 bg-gray-800 rounded-lg">
                            <div className="flex items-center gap-3">
                                {home?.logo && <img src={home.logo} alt={home.name} className="w-12 h-12" />}
                                <div>
                                    <div className="font-semibold text-lg">{home?.name ?? "-"}</div>
                                    <div className="text-sm text-gray-400">Last 5: {last5?.form ?? last5?.played ?? "N/A"}</div>
                                </div>
                            </div>
                            <div className="mt-3 text-sm">
                                <div>Played (H/A/T): {league?.fixtures?.played?.home ?? "-"} / {league?.fixtures?.played?.away ?? "-"} / {league?.fixtures?.played?.total ?? "-"}</div>
                                <div>Wins W/D/L: {league?.fixtures?.wins?.total ?? "-"} · {league?.fixtures?.draws?.total ?? "-"} · {league?.fixtures?.loses?.total ?? "-"}</div>
                                <div className="mt-2">Goals Avg: {league?.goals?.for?.average?.total ?? "-"} / {league?.goals?.against?.average?.total ?? "-"}</div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                );
            }

            case "Team Snapshot (Away)": {
                const away = predictionRoot?.teams?.away ?? dt?.teams?.away ?? teamsFromFixture?.away ?? {};
                const league = away?.league ?? {};
                const last5 = away?.last_5 ?? away?.last5 ?? {};
                return (
                    <AnimatePresence mode="wait">
                        <motion.div key={key} variants={cardVariants} initial="initial" animate="enter" exit="exit" transition={{ duration: 0.45 }} className="p-3 bg-gray-800 rounded-lg">
                            <div className="flex items-center gap-3">
                                {away?.logo && <img src={away.logo} alt={away.name} className="w-12 h-12" />}
                                <div>
                                    <div className="font-semibold text-lg">{away?.name ?? "-"}</div>
                                    <div className="text-sm text-gray-400">Last 5: {last5?.form ?? last5?.played ?? "N/A"}</div>
                                </div>
                            </div>
                            <div className="mt-3 text-sm">
                                <div>Goals For Avg (H/A/T): {league?.goals?.for?.average?.home ?? "-"} / {league?.goals?.for?.average?.away ?? "-"} / {league?.goals?.for?.average?.total ?? "-"}</div>
                                <div>Clean Sheets: {league?.clean_sheet?.total ?? "-"}</div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                );
            }

            case "Form (Home)": {
                const base = dt?.home_form?.[subIndex] ?? dt?.form?.[subIndex] ?? {};
                if (!base || Object.keys(base).length === 0) {
                    return <div className="text-sm text-gray-400">No home form data</div>;
                }
                const homeMatch = base?.teams?.home;
                const awayMatch = base?.teams?.away;
                const score = base?.score?.fulltime ?? {};
                return (
                    <AnimatePresence mode="wait">
                        <motion.div key={key} variants={cardVariants} initial="initial" animate="enter" exit="exit" transition={{ duration: 0.45 }} className="flex flex-col gap-3">
                            <div className="text-xs text-gray-400">{new Date(base?.fixture?.date).toLocaleDateString()}</div>
                            <div className="flex items-center justify-between">
                                <div className="text-center">
                                    {homeMatch?.logo && <img src={homeMatch.logo} className="w-8 h-8 mx-auto" />}
                                    <div className="font-semibold">{homeMatch?.name}</div>
                                </div>
                                <div className="text-xl font-bold">{score?.home ?? "-"} — {score?.away ?? "-"}</div>
                                <div className="text-center">
                                    {awayMatch?.logo && <img src={awayMatch.logo} className="w-8 h-8 mx-auto" />}
                                    <div className="font-semibold">{awayMatch?.name}</div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                );
            }

            case "Form (Away)": {
                const base = dt?.away_form?.[subIndex] ?? dt?.form?.[subIndex] ?? {};
                if (!base || Object.keys(base).length === 0) {
                    return <div className="text-sm text-gray-400">No away form data</div>;
                }
                const homeMatch = base?.teams?.home;
                const awayMatch = base?.teams?.away;
                const score = base?.score?.fulltime ?? {};
                return (
                    <AnimatePresence mode="wait">
                        <motion.div key={key} variants={cardVariants} initial="initial" animate="enter" exit="exit" transition={{ duration: 0.45 }} className="flex flex-col gap-3">
                            <div className="text-xs text-gray-400">{new Date(base?.fixture?.date).toLocaleDateString()}</div>
                            <div className="flex items-center justify-between">
                                <div className="text-center">
                                    {homeMatch?.logo && <img src={homeMatch.logo} className="w-8 h-8 mx-auto" />}
                                    <div className="font-semibold">{homeMatch?.name}</div>
                                </div>
                                <div className="text-xl font-bold">{score?.home ?? "-"} — {score?.away ?? "-"}</div>
                                <div className="text-center">
                                    {awayMatch?.logo && <img src={awayMatch.logo} className="w-8 h-8 mx-auto" />}
                                    <div className="font-semibold">{awayMatch?.name}</div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                );
            }

            case "Head-to-Head": {
                const h2hArray = dt?.predictions[0]?.h2h ?? predictionRoot?.h2h ?? dt?.head_to_head ?? [];
                if (!h2hArray?.length) return <div className="text-sm text-gray-400">No H2H history</div>;
                const base = h2hArray[subIndex] ?? h2hArray[0];
                const homeMatch = base?.teams?.home;
                const awayMatch = base?.teams?.away;
                const score = base?.score?.fulltime ?? {};
                return (
                    <AnimatePresence mode="wait">
                        <motion.div key={key} variants={cardVariants} initial="initial" animate="enter" exit="exit" transition={{ duration: 0.45 }} className="flex flex-col gap-4">
                            <div className="text-sm text-gray-400">{new Date(base?.fixture?.date).toLocaleString()}</div>
                            <div className="flex items-center gap-4 justify-between">
                                <div className="flex flex-col items-center">
                                    {homeMatch?.logo && <img src={homeMatch.logo} className="w-10 h-10" />}
                                    <div className="font-semibold">{homeMatch?.name}</div>
                                    <div className="text-xs text-gray-400">{homeMatch?.winner === true ? "W" : homeMatch?.winner === false ? "L" : "-"}</div>
                                </div>
                                <div className="text-2xl font-bold">{score?.home ?? "-"} — {score?.away ?? "-"}</div>
                                <div className="flex flex-col items-center">
                                    {awayMatch?.logo && <img src={awayMatch.logo} className="w-10 h-10" />}
                                    <div className="font-semibold">{awayMatch?.name}</div>
                                    <div className="text-xs text-gray-400">{awayMatch?.winner === true ? "W" : awayMatch?.winner === false ? "L" : "-"}</div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-300">Venue: {base?.fixture?.venue?.name ?? "-"}</div>
                        </motion.div>
                    </AnimatePresence>
                );
            }

            case "Team Comparison": {
                const comp = predictionRoot?.comparison ?? dt?.comparison ?? {};
                if (!comp) return <div className="text-sm text-gray-400">No comparison</div>;
                return (
                    <AnimatePresence mode="wait">
                        <motion.div key={key} variants={cardVariants} initial="initial" animate="enter" exit="exit" transition={{ duration: 0.45 }} className="p-3 bg-gray-800 rounded-lg">
                            <h4 className="text-purple-400 font-semibold">Comparison</h4>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                <div>
                                    <div className="text-gray-400">Form</div>
                                    <div>{comp?.form?.home ?? "-"} / {comp?.form?.away ?? "-"}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400">Attack</div>
                                    <div>{comp?.att?.home ?? "-"} / {comp?.att?.away ?? "-"}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400">Defense</div>
                                    <div>{comp?.def?.home ?? "-"} / {comp?.def?.away ?? "-"}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400">Poisson</div>
                                    <div>{comp?.poisson_distribution?.home ?? "-"} / {comp?.poisson_distribution?.away ?? "-"}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400">H2H expectation</div>
                                    <div>{comp?.h2h?.home ?? "-"} / {comp?.h2h?.away ?? "-"}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400">Total</div>
                                    <div>{comp?.total?.home ?? "-"} / {comp?.total?.away ?? "-"}</div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                );
            }

            case "Player Stats": {
                const playersArr = dt?.players?.[0]?.players ?? dt?.players ?? [];
                const player = playersArr?.[subIndex] ?? playersArr?.[0];
                if (!player) return <div className="text-sm text-gray-400">No player data</div>;

                const p = player.player ?? player;
                return (
                    <AnimatePresence mode="wait">
                        <motion.div key={key} variants={cardVariants} initial="initial" animate="enter" exit="exit" transition={{ duration: 0.45 }} className="flex flex-col items-center">
                            {p.photo && <img src={p.photo} alt={p.name} className="w-16 h-16 rounded-full mb-2" />}
                            <p className="text-sm font-semibold">{p.id ?? p.player?.id} — {p.name ?? p.player?.name}</p>
                            <p className="text-xs text-gray-400">{p.position ?? p.player?.position}</p>
                            {player.statistics && (
                                <div className="mt-2 text-xs text-gray-300">
                                    {player.statistics.map((statset, i) => (
                                        <div key={i} className="mb-1">
                                            <div className="text-gray-400">{statset?.team?.name ?? statset?.league?.name}</div>
                                            {statset?.games && <div>Minutes: {statset.games.minutes ?? "-"}, Apps: {statset.games.appearances ?? "-"}</div>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                );
            }

            case "Predictions Matchup": {
                if (!predictionBlock) return <div className="text-sm text-gray-400">No predictions available</div>;
                const winner = predictionBlock.winner ?? predictionBlock?.winner;
                return (
                    <AnimatePresence mode="wait">
                        <motion.div key={key} variants={cardVariants} initial="initial" animate="enter" exit="exit" transition={{ duration: 0.45 }} className="text-center">
                            <h3 className="text-lg font-semibold text-purple-400 mb-2">Predictions</h3>
                            <div className="text-sm text-gray-300 mb-2">{predictionBlock.advice ?? predictionBlock.comment ?? "Suggested bets"}</div>
                            <div className="font-bold text-xl">{winner?.name ?? "—"}</div>
                            <div className="text-sm text-gray-400 mt-2">Win% — Home: {predictionBlock.percent?.home ?? "-"} · Draw: {predictionBlock.percent?.draw ?? "-"} · Away: {predictionBlock.percent?.away ?? "-"}</div>
                            <div className="mt-2 text-xs">Win or Draw: {String(predictionBlock.win_or_draw ?? predictionBlock.win_or_draw === undefined ? "-" : predictionBlock.win_or_draw)}</div>
                            {predictionBlock.goals && <div className="mt-1 text-xs">Goals line: H {predictionBlock.goals.home} · A {predictionBlock.goals.away}</div>}
                        </motion.div>
                    </AnimatePresence>
                );
            }

            case "Final Outcome": {
                // since the real score is null (pre-match), populate result from predictions
                const predictedHome = predicted.home ?? "-";
                const predictedAway = predicted.away ?? "-";
                const source = predicted.source ?? "predictions";
                return (
                    <AnimatePresence mode="wait">
                        <motion.div key={key} variants={cardVariants} initial="initial" animate="enter" exit="exit" transition={{ duration: 0.45 }} className="text-center">
                            <h3 className="text-lg font-semibold text-purple-400 mb-2">Predicted Result</h3>
                            <p className="text-2xl font-bold">{predictedHome} - {predictedAway}</p>
                            <p className="text-sm text-gray-400 mt-1">Source: {source}</p>
                            <p className="text-xs mt-1 text-gray-300">Predicted winner: {predictionBlock?.winner?.name ?? (predictedHome === predictedAway ? "Draw" : (predictedHome > predictedAway ? teamsFromFixture?.home?.name : teamsFromFixture?.away?.name))}</p>
                        </motion.div>
                    </AnimatePresence>
                );
            }

            default:
                return null;
        }
    };

    const getProgress = useCallback(() => {
        const totalCategories = categories.length;
        const dt = fixtureStats || {};

        switch (categories[currentCategoryIndex]) {
            case "Head-to-Head": {
                const totalSub = dt?.predictions[0]?.h2h?.length ?? dt?.predictions.h2h?.length ?? dt?.head_to_head?.length ?? 1
                return ((currentCategoryIndex + subIndex / totalSub) / totalCategories) * 100;
            }

            case "Player Stats": {
                const totalSub = dt?.players?.[0]?.players?.length ?? dt?.players?.length ?? 1;
                return ((currentCategoryIndex + subIndex / totalSub) / totalCategories) * 100;
            }

            case "Form (Home)": {
                const totalSub = dt.home_form?.length || 1;
                console.log(subIndex, totalSub, currentCategoryIndex, totalCategories)
                return ((currentCategoryIndex + subIndex / totalSub) / totalCategories) * 100;
            }

            case "Form (Away)": {
                const totalSub = dt.away_form?.length || 1;
                return ((currentCategoryIndex + subIndex / totalSub) / totalCategories) * 100;
            }

            default:
                return ((currentCategoryIndex + 1) / totalCategories) * 100;
        }
    }, [currentCategoryIndex, subIndex, categories, fixtureStats]);

    const progress = useMemo(() => getProgress(), [getProgress]);


    console.log("Category Indeex: ",);

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
                                    <div className="px-2 py-1 bg-[rgba(255,255,255,0.03)] rounded-lg border border-gray-800 text-sm orbitron-regular">{data?.accuracy}%</div>
                                </div>
                            </div>
                            <div className="relative flex flex-col lg-custom:flex-row gap-6 flex-1">
                                <div className="flex-1 rounded-2xl p-4 bg-[rgba(255,255,255,0.015)] border border-gray-800 relative overflow-hidden flex items-center justify-center">
                                    <div className="relative w-full min-h-[35vh] max-w-md aspect-video rounded-xl bg-[#05060a] border border-gray-800 shadow-inner flex items-center justify-center p-5">
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
                                            initial={{ opacity: 0, x: 50, height: 200 }}
                                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                                            exit={{ opacity: 0, x: -50, position: "absolute", right: 0 }}
                                            transition={{ duration: 0.8 }}
                                            className="w-full lg-custom:w-80 rounded-2xl p-4 bg-[rgba(255,255,255,0.015)] border border-gray-800 flex flex-col gap-3"
                                        >
                                            <div className="text-sm text-gray-400">
                                                <span>Progress: </span>
                                                <span className='text-purple-500 text-shadow-xs text-shadow-purple-500 scale-105 font-extrabold'>
                                                    {categories[currentCategoryIndex]} <LoadingRing size={20} />
                                                </span>
                                            </div>
                                            <ul className="space-y-2 mt-2">
                                                {categories.map((c, idx) => (
                                                    <li key={c} className={`text-sm transition duration-300 ease-in-out ${currentCategoryIndex >= idx ? "text-purple-400" : "text-gray-500 font-normal"} ${currentCategoryIndex === idx ? "text-shadow-xs text-shadow-purple-500 scale-105 font-extrabold" : "font-bold"}`}>
                                                        {idx < currentCategoryIndex ? `✔ ` : idx === currentCategoryIndex ? <LoadingRing size={20} /> : `• `} {c}
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
                                        <motion.div
                                            key="available"
                                            initial={{ opacity: 0, x: 50, height: 200 }}
                                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                                            exit={{ opacity: 0, x: -50, position: "absolute", right: 0 }}
                                            transition={{ duration: 0.8 }}
                                            onClick={() => handleStart()}
                                            className="right-0 w-full lg-custom:w-80 rounded-2xl p-4 bg-[rgba(255,255,255,0.015)] border border-gray-800 flex flex-col gap-3"
                                        >
                                            <div className="text-sm text-gray-400">Available Analysis</div>
                                            <ul className="space-y-2 mt-2">
                                                <li className="text-sm">• Full Time Winner with {data?.accuracy}% accuracy.</li>
                                                <li className="text-sm">• League Backtracking And Extended Analysis ({data.league?.name})</li>
                                                {/* <li className="text-sm">• Defensive line drifted wider at minute 62, creating 12% more space on left.</li> */}
                                            </ul>
                                            <div className="mt-auto orbitron-regular    ">
                                                <button className="w-full py-2 rounded-lg border border-gray-700 text-sm" style={{
                                                    background: "linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.00) 100%)"
                                                }}>START ANALYZING</button>
                                            </div>
                                        </motion.div>
                                    }

                                </AnimatePresence>
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
