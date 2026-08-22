import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FixtureCountry from './fixtureCountry';
import axios from 'axios';
import { baseApiUrl } from '../data/url';
import { setFixtures, setFixturesLoaded } from '../slices/fixturesReducer';
import Loading from './loading';
import { Link, useNavigationType } from 'react-router';
import Banners from './banners';
import { motion } from 'framer-motion';

const Fixtures = () => {
    const { fixtures, fixturesLoaded } = useSelector(state => state.fixtures);
    const { isAdmin, dashboard } = useSelector(state => state.user);
    const isAdminShown = isAdmin && dashboard === "admin";
    const [error, setError] = useState(null);
    const navType = useNavigationType();
    const [firstLoad, setFirstLoad] = useState(false);
    const [loading, setLoading] = useState(true);

    const roleData = useRef({
        fixturesUrl: isAdminShown
            ? `${baseApiUrl}/get-matches-admin.php`
            : `${baseApiUrl}/get-matches.php`,
    });

    const dispatch = useDispatch();

    useLayoutEffect(() => {
        if (!firstLoad) {
            if (fixturesLoaded) { if (navType !== "PUSH") setLoading(false); else fetchFixtures(); }
            else fetchFixtures();
        } else {
            if (fixturesLoaded) { if (navType !== "PUSH") setLoading(false); }
            else fetchFixtures();
        }
        if (!firstLoad) setFirstLoad(true);
    }, [fixturesLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

    function fetchFixtures() {
        setLoading(true);
        axios({ url: roleData.current.fixturesUrl, method: "GET" })
            .then(res => { if (error) setError(null); dispatch(setFixtures(res.data.matches)); })
            .catch(() => setError("Please check your network and reload"))
            .finally(() => { setLoading(false); if (!fixturesLoaded) dispatch(setFixturesLoaded(true)); });
    }

    const fixturesLength = useMemo(() =>
        Object.values(fixtures)
            .flatMap(c => Object.values(c.leagues))
            .flatMap(l => Object.values(l.fixtures)).length
        , [fixtures]);

    const countryList = Object.values(fixtures);

    return (
        <div className="w-full bg-gray-50 dark:bg-[#080810]">

            {/* ── Deep Analyzer promo banner ──── */}
            <div className="px-4 pt-6">
                <Banners />
            </div>

            {/* ── Section header ─────────────── */}
            {fixturesLength > 0 && (
                <div className="flex items-center justify-between px-5 pt-2 pb-4">
                    <div>
                        <h2 className="text-base font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Today's Fixtures
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                            {firstLoad ? `${fixturesLength} match${fixturesLength !== 1 ? 'es' : ''} available` : 'Loading...'}
                        </p>
                    </div>
                    {/* Live indicator */}
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-green-500
                                     bg-green-500/10 border border-green-500/25 rounded-full px-3 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Live
                    </span>
                </div>
            )}

            {/* ── Main content ───────────────── */}
            <div className="w-full pb-4">
                {error ? (
                    <EmptyState
                        icon="😞"
                        title="Unable To Load Fixtures"
                        body={error}
                    />
                ) : !loading ? (
                    countryList.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            {countryList.map((country, i) => (
                                <React.Fragment key={country.name}>
                                    <FixtureCountry country={country} />
                                    {/* Mid-list promo card after first country */}
                                    {i === 0 && countryList.length > 1 && (
                                        <MidBanner />
                                    )}
                                </React.Fragment>
                            ))}
                        </motion.div>
                    ) : (
                        <EmptyState
                            icon="🔮"
                            title="No Fixtures Online"
                            body="Contact your local agent for exclusive fixtures today"
                        />
                    )
                ) : (
                    <div className="flex flex-col items-center gap-3 py-20">
                        <Loading color="#ea580c" />
                        <p className="text-xs text-gray-500 dark:text-gray-600 mt-2 animate-pulse">
                            Fetching fixtures
                        </p>
                    </div>
                )}
            </div>

            {/* ── Footer ─────────────────────── */}
            <footer className="flex flex-col items-center py-8 px-4 pb-24 md:pb-8
                               border-t border-gray-200 dark:border-white/5">
                <div className="flex items-center gap-2 mb-2">
                    <img src="/assets/logo.png" alt="GST" className="w-6 h-6 rounded object-cover" />
                    <span className="font-extrabold text-sm text-gray-700 dark:text-white/60">GST</span>
                </div>
                <p className="text-xs text-gray-400 dark:text-white/25">
                    Gamble Responsibly &nbsp;·&nbsp; 18+ Legal Betting
                </p>
            </footer>
        </div>
    );
};

/* ── Reusable empty/error state ── */
function EmptyState({ icon, title, body }) {
    return (
        <div className="flex flex-col items-center justify-center px-8 py-20 gap-3 text-center">
            <span className="text-5xl mb-2">{icon}</span>
            <p className="font-bold text-gray-700 dark:text-white/60 text-base">{title}</p>
            <p className="text-sm text-gray-400 dark:text-white/30 max-w-xs">{body}</p>
        </div>
    );
}

/* ── Mid-list "how it works" card ── */
function MidBanner() {
    return (
        <div className="text-center mx-4 my-6 rounded-2xl overflow-hidden
                        bg-gradient-to-br from-gray-900 to-gray-800
                        dark:from-white/5 dark:to-white/3
                        border border-gray-700 dark:border-white/8
                        p-5">
            <h3 className="text-white font-bold text-base mb-3">How GST Works</h3>
            <div className="grid grid-cols-3 gap-3">
                {[
                    { step: '01', label: 'Pick matches', icon: '🎯' },
                    { step: '02', label: 'Pay & unlock', icon: '🔓' },
                    { step: '03', label: 'Stake & win', icon: '🏆' },
                ].map(s => (
                    <div key={s.step} className="flex flex-col items-center text-center gap-1">
                        <span className="text-2xl">{s.icon}</span>
                        <span className="text-[10px] font-black text-orange-400 tracking-widest">{s.step}</span>
                        <span className="text-[11px] text-gray-300 dark:text-white/50 font-medium">{s.label}</span>
                    </div>
                ))}
            </div>
            <div className='text-right'>
                <Link
                    to="/about"
                    className="mt-6 inline-flex items-center gap-1 text-xs text-orange-400
                           hover:text-orange-300 font-semibold transition-colors"
                >
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </Link>

            </div>
        </div>
    );
}

export default Fixtures;
