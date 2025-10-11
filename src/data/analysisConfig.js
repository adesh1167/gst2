// src/features/deepAnalyzer/categoriesConfig.js
// Export an array of category configs. Each config has:
// id, title, interval (ms), getMaxLen(dt) => number, render({ dt, subIndex, teamsFromFixture, predictionRoot, fixtureMeta, country })

const analysisConfig = [
    {
        id: "fixture_overview",
        title: "Fixture Overview",
        interval: 4000,
        getMaxLen: (dt) => 1,
        render: ({ dt, teamsFromFixture, fixtureMeta }) => {
            const homeName = teamsFromFixture?.home?.name ?? "Home";
            const awayName = teamsFromFixture?.away?.name ?? "Away";
            return (
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-purple-400 mb-2">Fixture</h3>
                    <p className="font-semibold">{homeName} vs {awayName}</p>
                    <p>{fixtureMeta?.venue?.name ?? "-"}</p>
                    <p>{new Date(fixtureMeta?.date ?? "").toLocaleString()}</p>
                    <p className="text-sm text-gray-400 mt-2">Status: {fixtureMeta?.status?.long ?? fixtureMeta?.status?.short ?? "-"}</p>
                </div>
            );
        }
    },

    {
        id: "venue_league",
        title: "Venue & League",
        interval: 4000,
        getMaxLen: (dt) => 1,
        render: ({ dt, fixtureLeague, fixtureMeta }) => {
            const league = fixtureLeague || dt?.league || {};
            const f = fixtureMeta;
            return (
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-purple-400 mb-2">{league?.name ?? "League"}</h3>
                    {league?.logo && <img src={league.logo} alt={league.name} className="mx-auto w-10 h-10 mb-2" />}
                    <p>Season: {league?.season ?? "-"} · Round: {league?.round ?? "-"}</p>
                    <p className="mt-2">{f?.venue?.name ?? "-"} — Timezone: {f?.timezone ?? "-"}</p>
                </div>
            );
        }
    },

    {
        id: "team_home",
        title: "Team Snapshot (Home)",
        interval: 4000,
        getMaxLen: (dt) => 1,
        render: ({ predictionRoot, dt, teamsFromFixture }) => {
            const home = predictionRoot?.teams?.home ?? dt?.teams?.home ?? teamsFromFixture?.home ?? {};
            const league = home?.league ?? {};
            const last5 = home?.last_5 ?? home?.last5 ?? {};
            return (
                <div className="p-3 bg-gray-800 rounded-lg">
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
                </div>
            );
        }
    },

    {
        id: "team_away",
        title: "Team Snapshot (Away)",
        interval: 4000,
        getMaxLen: (dt) => 1,
        render: ({ predictionRoot, dt, teamsFromFixture }) => {
            const away = predictionRoot?.teams?.away ?? dt?.teams?.away ?? teamsFromFixture?.away ?? {};
            const league = away?.league ?? {};
            const last5 = away?.last_5 ?? away?.last5 ?? {};
            return (
                <div className="p-3 bg-gray-800 rounded-lg">
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
                </div>
            );
        }
    },

    {
        id: "h2h",
        title: "Head-to-Head",
        interval: 1200,
        getMaxLen: (dt) => dt?.predictions?.[0]?.h2h?.length ?? dt?.predictions?.h2h?.length ?? dt?.head_to_head?.length ?? 0,
        render: ({ dt, subIndex }) => {
            const h2hArray = dt?.predictions?.[0]?.h2h ?? dt?.predictions?.h2h ?? dt?.head_to_head ?? [];
            if (!h2hArray?.length) return <div className="text-sm text-gray-400">No H2H history</div>;
            const base = h2hArray[subIndex] ?? h2hArray[0];
            const homeMatch = base?.teams?.home;
            const awayMatch = base?.teams?.away;
            const score = base?.score?.fulltime ?? {};
            return (
                <div className='flex flex-col gap-4'>
                    <div className='text-sm text-gray-400'>{new Date(base?.fixture?.date).toLocaleString()}</div>
                    <div className="flex items-stretch gap-4 justify-between gap-1">
                        <div className="flex flex-col items-center w-[50%] justify-between">
                            {homeMatch?.logo && <img src={homeMatch.logo} className="w-10 h-10" />}
                            <div className="font-semibold">{homeMatch?.name}</div>
                            <div className="text-xs text-gray-400">{homeMatch?.winner === true ? "W" : homeMatch?.winner === false ? "L" : "-"}</div>
                        </div>
                        <div className="flex text-2xl font-bold max-xs:hidden shrink-0 items-center">
                            <span>{score?.home ?? "-"}</span>
                            <span>&nbsp;-&nbsp;</span>
                            <span>{score?.away ?? "-"}</span>
                        </div>
                        <div className="flex flex-col items-center w-[50%] justify-between">
                            {awayMatch?.logo && <img src={awayMatch.logo} className="w-10 h-10" />}
                            <div className="font-semibold">{awayMatch?.name}</div>
                            <div className="text-xs text-gray-400">{awayMatch?.winner === true ? "W" : awayMatch?.winner === false ? "L" : "-"}</div>
                        </div>
                    </div>
                    <div className=" flex text-2xl font-bold xs:hidden shrink-0">
                        <div className="w-[50%] text-center">{score?.home ?? "-"}</div>
                        <span> — </span>
                        <div className="w-[50%] text-center">{score?.away ?? "-"}</div>
                    </div>
                    <div className="text-xs text-gray-300">Venue: {base?.fixture?.venue?.name ?? "-"}</div>
                </div>
            );
        }
    },

    {
        id: "form_home",
        title: "Form (Home)",
        interval: 1200,
        getMaxLen: (dt) => dt?.home_form?.length ?? 0,
        render: ({ dt, subIndex }) => {
            const base = dt?.home_form?.[subIndex] ?? dt?.form?.[subIndex] ?? {};
            if (!base || Object.keys(base).length === 0) {
                return <div className="text-sm text-gray-400">No home form data</div>;
            }
            const homeMatch = base?.teams?.home;
            const awayMatch = base?.teams?.away;
            const score = base?.score?.fulltime ?? {};
            return (
                <div className='flex flex-col gap-3'>
                    <div className='text-xs text-gray-400'>{new Date(base?.fixture?.date).toLocaleDateString()}</div>
                    <div className="flex items-stretch gap-4 justify-between gap-1">
                        <div className="flex flex-col items-center w-[50%] justify-between">
                            {homeMatch?.logo && <img src={homeMatch.logo} className="w-8 h-8 mx-auto" />}
                            <div className="font-semibold">{homeMatch?.name}</div>
                        </div>
                        <div className="flex text-2xl font-bold max-xs:hidden shrink-0 items-center">
                            <span>{score?.home ?? "-"}</span>
                            <span>&nbsp;-&nbsp;</span>
                            <span>{score?.away ?? "-"}</span>
                        </div>
                        <div className="flex flex-col items-center w-[50%] justify-between">
                            {awayMatch?.logo && <img src={awayMatch.logo} className="w-8 h-8 mx-auto" />}
                            <div className="font-semibold">{awayMatch?.name}</div>
                        </div>
                    </div>
                    <div className=" flex text-2xl font-bold xs:hidden shrink-0">
                        <div className="w-[50%] text-center">{score?.home ?? "-"}</div>
                        <span> — </span>
                        <div className="w-[50%] text-center">{score?.away ?? "-"}</div>
                    </div>
                </div>
            );
        }
    },

    {
        id: "form_away",
        title: "Form (Away)",
        interval: 1200,
        getMaxLen: (dt) => dt?.away_form?.length ?? 0,
        render: ({ dt, subIndex }) => {
            const base = dt?.away_form?.[subIndex] ?? dt?.form?.[subIndex] ?? {};
            if (!base || Object.keys(base).length === 0) {
                return <div className="text-sm text-gray-400">No away form data</div>;
            }
            const homeMatch = base?.teams?.home;
            const awayMatch = base?.teams?.away;
            const score = base?.score?.fulltime ?? {};
            return (
                <div className='flex flex-col gap-3'>
                    <div className='text-xs text-gray-400'>{new Date(base?.fixture?.date).toLocaleDateString()}</div>
                    <div className="flex items-stretch gap-4 justify-between gap-1">
                        <div className="flex flex-col items-center w-[50%] justify-between">
                            {homeMatch?.logo && <img src={homeMatch.logo} className="w-8 h-8 mx-auto" />}
                            <div className="font-semibold">{homeMatch?.name}</div>
                        </div>
                        <div className="flex text-2xl font-bold max-xs:hidden shrink-0 items-center">
                            <span>{score?.home ?? "-"}</span>
                            <span>&nbsp;-&nbsp;</span>
                            <span>{score?.away ?? "-"}</span>
                        </div>
                        <div className="flex flex-col items-center w-[50%] justify-between">
                            {awayMatch?.logo && <img src={awayMatch.logo} className="w-8 h-8 mx-auto" />}
                            <div className="font-semibold">{awayMatch?.name}</div>
                        </div>
                    </div>
                    <div className=" flex text-2xl font-bold xs:hidden shrink-0">
                        <div className="w-[50%] text-center">{score?.home ?? "-"}</div>
                        <span> — </span>
                        <div className="w-[50%] text-center">{score?.away ?? "-"}</div>
                    </div>
                </div>
            );
        }
    },

    {
        id: "comparison",
        title: "Team Comparison",
        interval: 12000,
        getMaxLen: (dt) => 1,
        render: ({ predictionRoot, dt }) => {
            const comp = predictionRoot?.comparison ?? dt?.comparison ?? {};
            if (!comp) return <div className="text-sm text-gray-400">No comparison</div>;
            return (
                <div className="p-3 bg-gray-800 rounded-lg">
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
                </div>
            );
        }
    },

    {
        id: "players",
        title: "Player Stats",
        interval: 1200,
        getMaxLen: (dt) => dt?.players?.[0]?.players?.length ?? dt?.players?.length ?? 0,
        render: ({ dt, subIndex }) => {
            const playersArr = dt?.players?.[0]?.players ?? dt?.players ?? [];
            const player = playersArr?.[subIndex] ?? playersArr?.[0];
            if (!player) return <div className="text-sm text-gray-400">No player data</div>;
            const p = player.player ?? player;
            return (
                <div className="flex flex-col items-center">
                    {p.photo && <img src={p.photo} alt={p.name} className="w-16 h-16 rounded-full mb-2" />}
                    <p className="text-sm font-semibold">{p.name ?? p.player?.name}</p>
                    <p className="text-xs text-gray-400">Injured: {p.injured ? "Yes" : "No"}</p>
                    {player.statistics && (
                        <div className="mt-2 text-xs text-gray-300">
                            {player.statistics.map((statset, i) => (
                                <div key={i} className="mb-1">
                                    <div className="text-gray-400">{statset?.team?.name ?? statset?.league?.name}</div>
                                    {statset?.games &&
                                        statset.games.minutes ?
                                        <span>Minutes: {statset.games.minutes},</span>
                                        : statset.games.appearences ?
                                            <span>Apps: {statset.games.appearences},</span>
                                            : null
                                    }
                                    {statset?.games &&
                                        <span>{" "}
                                            {statset.cards?.red > 0 ?
                                                `Red: ${statset.cards.red}`
                                                : statset.goals?.total > 0 ?
                                                    `Goals: ${statset.goals.total}`
                                                    : statset.shots?.total > 0 ?
                                                        `Shots: ${statset.shots.total}`
                                                        : statset.games.appearences ?
                                                            `Apps: ${statset.games.appearences}`
                                                            : "-"
                                            }
                                        </span>
                                    }
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }
    },

    {
        id: "predictions",
        title: "Predictions Matchup",
        interval: 12000,
        getMaxLen: (dt) => 1,
        render: ({ predictionRoot }) => {
            const predictionBlock = predictionRoot.predictions ?? predictionRoot;
            if (!predictionBlock) return <div className="text-sm text-gray-400">No predictions available</div>;
            const winner = predictionBlock.winner ?? predictionBlock?.winner;
            return (
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-purple-400 mb-2">Predictions</h3>
                    <div className="text-sm text-gray-300 mb-2">{predictionBlock.advice ?? predictionBlock.comment ?? "Suggested bets"}</div>
                    <div className="font-bold text-xl">{winner?.name ?? "—"}</div>
                    <div className="text-sm text-gray-400 mt-2">Win% — Home: {predictionBlock.percent?.home ?? "-"} · Draw: {predictionBlock.percent?.draw ?? "-"} · Away: {predictionBlock.percent?.away ?? "-"}</div>
                    <div className="mt-2 text-xs">Win or Draw: {String(predictionBlock.win_or_draw ?? predictionBlock.win_or_draw === undefined ? "-" : predictionBlock.win_or_draw)}</div>
                    {predictionBlock.goals && <div className="mt-1 text-xs">Goals line: H {predictionBlock.goals.home} · A {predictionBlock.goals.away}</div>}
                </div>
            );
        }
    },

    {
        id: "final",
        title: "Final Outcome",
        interval: 15000,
        getMaxLen: (dt) => 1,
        render: ({ dt, predictionRoot, teamsFromFixture }) => {
            const predictionBlock = predictionRoot.predictions ?? predictionRoot;

            // getPredictedScore logic preserved exactly as your file
            const getPredictedScore = () => {
                if (predictionBlock?.goals && (predictionBlock.goals.home != null || predictionBlock.goals.away != null)) {
                    return {
                        home: Number(predictionBlock.goals.home ?? 0),
                        away: Number(predictionBlock.goals.away ?? 0),
                        source: "analysis.goals"
                    };
                }

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

                const winner = predictionBlock?.winner ?? predictionRoot?.winner;
                if (winner) {
                    const winnerName = winner?.name ?? winner;
                    const homeName = teamsFromFixture?.home?.name;
                    const awayName = teamsFromFixture?.away?.name;
                    if (winnerName === homeName) return { home: 1, away: 0, source: "winner" };
                    if (winnerName === awayName) return { home: 0, away: 1, source: "winner" };
                    if (/draw/i.test(String(winnerName))) return { home: 1, away: 1, source: "winner" };
                }

                const pct = predictionBlock?.percent ?? predictionRoot?.percent;
                if (pct) {
                    const ph = Number(pct.home ?? pct?.H ?? 0);
                    const pd = Number(pct.draw ?? pct?.D ?? 0);
                    const pa = Number(pct.away ?? pct?.A ?? 0);
                    if (pd > ph && pd > pa) return { home: 1, away: 1, source: "percent.draw" };
                    if (ph > pa) return { home: 1, away: 0, source: "percent.home" };
                    if (pa > ph) return { home: 0, away: 1, source: "percent.away" };
                }

                return { home: 1, away: 1, source: "default" };
            };

            const predicted = getPredictedScore();
            const predictedHome = predicted.home ?? "-";
            const predictedAway = predicted.away ?? "-";
            const source = predicted.source ?? "predictions";
            return (
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-purple-400 mb-2">Predicted Result</h3>
                    <p className="text-2xl font-bold flex gap-2 py-4">
                        <span className="w-[50%] text-center">[{predictedHome}]</span>
                        <span className="text-gray-400"> — </span>
                        <span className="w-[50%] text-center">[{predictedAway}]</span>
                    </p>
                    <p className="text-sm text-gray-400 mt-1">Source: {source}</p>
                    <p className="text-xl mt-1 text-gray-300">Predicted winner: {predictionBlock?.winner?.name ?? (predictedHome === predictedAway ? "Draw" : (predictedHome > predictedAway ? teamsFromFixture?.home?.name : teamsFromFixture?.away?.name))}</p>
                </div>
            );
        }
    }
];

export default analysisConfig;
