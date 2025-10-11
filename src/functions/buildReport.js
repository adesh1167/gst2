// utils/buildReport.js

/**
 * buildReport
 *
 * @param {Object} fixtureStats - the fixture stats object returned from your analyzer (the big dt)
 * @param {Object} [opts] - optional parameters:
 *     startTime: number (ms) - when analysis started
 *     endTime: number (ms) - when analysis ended; if omitted Date.now() is used
 *     extraNameHint: string - optional fallback team name hint
 *
 * @returns {Object} report suitable for SummaryPanel:
 *   {
 *     predictedWinner: string,
 *     accuracy: number,           // rounded percent or null
 *     timeSpentMs: number,
 *     parameters: string[],       // list of parameters considered/present
 *     processedCounts: { ... },   // counts of arrays processed
 *     predictedScore: {home, away, source},
 *     predictionBlock: {...},     // the raw prediction object (if present)
 *     notes: string[]             // short diagnostics
 *   }
 */
export function buildReport(fixtureStats = {}, opts = {}) {
    const t0 = opts.startTime || null;
    const t1 = (opts.endTime != null) ? opts.endTime : (t0 ? Date.now() : 0);
    const timeSpentMs = t0 ? Math.max(0, t1 - t0) : 0;

    // helper to safely access prediction block (supports both array or object shapes)
    const predictionRoot = (fixtureStats.predictions && Array.isArray(fixtureStats.predictions) && fixtureStats.predictions[0])
        ? fixtureStats.predictions[0]
        : fixtureStats.predictions ?? {};

    const predictionBlock = predictionRoot.predictions ?? predictionRoot;

    // find plausible team names from fixture shapes
    const fixtureObj = (fixtureStats.fixture?.[0] || fixtureStats.fixture) ?? {};
    const fixtureMeta = fixtureObj.fixture || fixtureObj;
    const teamsFromFixture = fixtureObj.teams || fixtureMeta.teams || fixtureStats.teams || {};
    const homeName = teamsFromFixture?.home?.name ?? (opts.extraNameHint || "Home");
    const awayName = teamsFromFixture?.away?.name ?? (opts.extraNameHint || "Away");

    // compute processed counts from likely arrays/objects in fixtureStats
    const processedCounts = {
        players: (Array.isArray(fixtureStats.players) ? (
            // sometimes players is [ { players: [...] } ] or flat array
            (fixtureStats.players[0] && Array.isArray(fixtureStats.players[0].players))
                ? fixtureStats.players[0].players.length
                : fixtureStats.players.length
        ) : (fixtureStats.players?.length ?? 0)),
        h2h: (fixtureStats.predictions && fixtureStats.predictions[0] && Array.isArray(fixtureStats.predictions[0].h2h))
            ? fixtureStats.predictions[0].h2h.length
            : (Array.isArray(fixtureStats.head_to_head) ? fixtureStats.head_to_head.length : 0),
        home_form: Array.isArray(fixtureStats.home_form) ? fixtureStats.home_form.length : (Array.isArray(fixtureStats.form) ? fixtureStats.form.filter(i => i?.teams?.home).length : 0),
        away_form: Array.isArray(fixtureStats.away_form) ? fixtureStats.away_form.length : (Array.isArray(fixtureStats.form) ? fixtureStats.form.filter(i => i?.teams?.away).length : 0),
        stats: Array.isArray(fixtureStats.stats) ? fixtureStats.stats.length : 0,
        comparison: fixtureStats.comparison ? 1 : (predictionRoot?.comparison ? 1 : 0),
        predictions: predictionBlock ? 1 : 0
    };

    // parameters: list of keys that were present and plausibly used in the prediction
    const parameters = [];
    const addIf = (flag, name) => { if (flag) parameters.push(name); };

    addIf(processedCounts.players > 0, "players");
    addIf(processedCounts.h2h > 0, "head_to_head");
    addIf(processedCounts.home_form > 0, "home_form");
    addIf(processedCounts.away_form > 0, "away_form");
    addIf(processedCounts.stats > 0, "team_stats");
    addIf(processedCounts.comparison > 0, "comparison");
    addIf(processedCounts.predictions > 0, "predictions");

    // accuracy: prefer top-level accuracy if present; otherwise use prediction percent/winner percent if available
    let accuracy = null;
    if (opts.accuracy) {
        accuracy = Math.round(opts.accuracy);
    }
    else if (typeof fixtureStats.accuracy === "number") {
        accuracy = Math.round(fixtureStats.accuracy);
    } else if (typeof fixtureStats.accuracy === "string" && !Number.isNaN(Number(fixtureStats.accuracy))) {
        accuracy = Math.round(Number(fixtureStats.accuracy));
    } else {
        // try to derive from predictionBlock.percent (supports many shapes)
        const pct = predictionBlock?.percent ?? predictionRoot?.percent;
        if (pct) {
            // pct might be { home, draw, away } or { H, D, A } or a flat number
            if (typeof pct === "object") {
                const values = ["home", "H", "h", "Home", "HOME"].map(k => pct[k]).filter(v => v != null);
                const drawValues = ["draw", "D", "d"].map(k => pct[k]).filter(v => v != null);
                const awayValues = ["away", "A", "a", "Away"].map(k => pct[k]).filter(v => v != null);

                // pick maximum among home/away/draw numeric entries if possible
                const numeric = Object.values(pct).map(v => Number(v)).filter(v => Number.isFinite(v));
                if (numeric.length) {
                    const max = Math.max(...numeric);
                    accuracy = Math.round(max);
                }
            } else if (!Number.isNaN(Number(pct))) {
                accuracy = Math.round(Number(pct));
            }
        }
    }

    // predicted winner name fallback
    let predictedWinner = null;
    if (predictionBlock?.winner?.name) predictedWinner = predictionBlock.winner.name;
    else if (predictionBlock?.winner) predictedWinner = String(predictionBlock.winner);
    else if (predictionRoot?.winner?.name) predictedWinner = predictionRoot.winner.name;
    else if (predictionRoot?.winner) predictedWinner = String(predictionRoot.winner);

    // if still missing, try deriving from percent (highest)
    if (!predictedWinner && (predictionBlock?.percent || predictionRoot?.percent)) {
        const pct = predictionBlock?.percent ?? predictionRoot?.percent;
        if (typeof pct === "object") {
            // normalize keys
            const obj = {};
            if (pct.home != null) obj.home = Number(pct.home);
            if (pct.H != null) obj.home = Number(pct.H);
            if (pct.draw != null) obj.draw = Number(pct.draw);
            if (pct.D != null) obj.draw = Number(pct.D);
            if (pct.away != null) obj.away = Number(pct.away);
            if (pct.A != null) obj.away = Number(pct.A);

            const maxKey = Object.keys(obj).reduce((acc, k) => (obj[k] > (obj[acc] ?? -Infinity) ? k : acc), Object.keys(obj)[0]);
            if (maxKey === "home") predictedWinner = homeName;
            else if (maxKey === "away") predictedWinner = awayName;
            else if (maxKey === "draw") predictedWinner = "Draw";
        }
    }

    // fallback to winner encoded under predictionRoot.winner string
    if ((!predictedWinner || typeof predictedWinner !== "string") && typeof predictionRoot?.winner === "string") predictedWinner = predictionRoot.winner;
    else predictedWinner = "Draw";

    // final fallback: empty string
    predictedWinner = predictedWinner ?? null;

    // helper: compute predicted score (same heuristics you used earlier)
    function getPredictedScore() {
        // explicit goals if provided
        if (predictionBlock?.goals && (predictionBlock.goals.home != null || predictionBlock.goals.away != null)) {
            return {
                home: Number(predictionBlock.goals.home ?? 0),
                away: Number(predictionBlock.goals.away ?? 0),
                source: "predictions.goals"
            };
        }

        // comparison-based poisson or expected goals
        const comp = predictionRoot?.comparison ?? fixtureStats?.comparison ?? {};
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
                source: "comparison"
            };
        }

        // winner fallback: map winner to 1-0 or 0-1; draw => 1-1
        const winner = predictionBlock?.winner ?? predictionRoot?.winner;
        if (winner) {
            const winnerName = (winner?.name ?? winner) + "";
            if (winnerName === homeName) return { home: 1, away: 0, source: "winner" };
            if (winnerName === awayName) return { home: 0, away: 1, source: "winner" };
            if (/draw/i.test(winnerName)) return { home: 1, away: 1, source: "winner" };
        }

        // percent-based heuristic
        const pct = predictionBlock?.percent ?? predictionRoot?.percent;
        if (pct) {
            const ph = Number(pct.home ?? pct?.H ?? 0);
            const pd = Number(pct.draw ?? pct?.D ?? 0);
            const pa = Number(pct.away ?? pct?.A ?? 0);
            if (pd > ph && pd > pa) return { home: 1, away: 1, source: "percent.draw" };
            if (ph > pa) return { home: 1, away: 0, source: "percent.home" };
            if (pa > ph) return { home: 0, away: 1, source: "percent.away" };
        }

        // default low scoring draw
        return { home: 1, away: 1, source: "default" };
    }

    const predictedScore = getPredictedScore();

    // small diagnostics / notes
    const notes = [];
    if (!predictionBlock || Object.keys(predictionBlock).length === 0) notes.push("No explicit prediction block found.");
    if (!predictedWinner) notes.push("Predicted winner could not be resolved; using heuristics.");
    if (!accuracy) notes.push("Accuracy not provided; derived from prediction percent where possible.");

    // build final processedCounts summary (also include total count)
    const totalSubItems = Object.values(processedCounts).reduce((a, b) => a + (Number(b) || 0), 0);
    processedCounts.total = totalSubItems;

    return {
        predictedWinner,
        accuracy,
        timeSpentMs,
        parameters,
        processedCounts,
        predictedScore,
        predictionBlock,
        source: predictedScore.source,
        notes
    };
}

export default buildReport;