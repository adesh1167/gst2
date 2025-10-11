import { Link, useNavigate } from 'react-router';
import { motion } from "framer-motion";
import { useApp } from "../../contexts/appContext";
import { useSelector } from 'react-redux';
import { monthlySubscriptionPrice, weeklySubscriptionPrice } from '../../data/prices';
import formatNumber from '../../functions/formatNumber';
import SubscriptionCard from '../../components/subscriptionCard';
import neural from "../../assets/neural.gif";
import NeuralBackground from '../neuralBackground';
import { useMemo } from 'react';
import NeuralBackground2 from '../neuralBackground copy';

const AnalyzerHome = () => {

    const { country, factor, continent } = useSelector(state => state.data);
    const { deepAnalyzerMatches, setDeepAnalyzerMatches } = useApp();
    const navigate = useNavigate();

    const isAfrica = useMemo(() => continent === "AF", [continent]);

    return (
        <motion.div
            key="home"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: .6 }}
        >
            {/* Home Screen Section */}
            <header className="text-center mb-12 min-h-[calc(100vh/2)] flex flex-col justify-center relative">
                <NeuralBackground opacity={0.3} animate/>
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-red-400 mb-6 relative">
                    DEEP ANALYZER
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto relative">
                    Step into the future of sports analytics. Harness neural intelligence to uncover tactical insights, live predictions, and performance metrics like never before.
                </p>
            </header>

            {/* Subscription Plans */}
            <section className="mb-12 font-[raleway]">
                <h2 className="text-2xl font-semibold text-purple-300 mb-6">Subscription Plans</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <SubscriptionCard
                        price={weeklySubscriptionPrice}
                        title={"Weekly Plan"}
                        description={"Access AI-powered analysis and predictions weekly."}
                        frequency={"week"}
                    />
                    <SubscriptionCard
                        price={monthlySubscriptionPrice}
                        title={"Monthly Plan"}
                        description={"Unlimited access to deep AI insights for the month."}
                        frequency={"month"}
                    />
                </div>
                <Link to={"/change-country"} className='block text-center font-bold opacity-50 mt-5 md:mt-10 cursor-pointer'>CHANGE {isAfrica ? "COUNTRY" : "CURRENCY"}</Link>
            </section>

            {/* Matches List */}
            <section className="mb-12 font-[raleway]">
                <h2 className="text-2xl font-semibold text-purple-300 mb-6">Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {deepAnalyzerMatches.matches.map((m) => (
                        <motion.button
                            key={m.id}
                            onClick={() => navigate(`/deep-analyzer/analyze/${m.id}`)}
                            className={`relative w-full text-left p-4 rounded-2xl border transition "bg-gray-800 border-purple-500"
                                // : "bg-[rgba(255,255,255,0.02)] border-gray-800 hover:border-gray-700"
                                }`}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.995 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-gray-400">{m?.league?.name}</div>
                                    <div className="text-lg font-medium mt-1 orbitron-regular">{m?.teams?.home?.name} v {m?.teams?.away?.name}</div>
                                </div>
                                <div className="text-lg font-semibold ml-2 orbitron-regular">{m.accuracy}%</div>
                            </div>
                            <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
                                <div className="absolute -top-6 -right-10 w-36 h-36 animate-spin-slow opacity-40 mix-blend-screen ring-color-1 rounded-full" />
                                <div className="absolute -bottom-10 -left-8 w-44 h-44 animate-pulse-slow opacity-30 mix-blend-screen ring-color-2 rounded-full" />
                            </div>
                        </motion.button>
                    ))}
                </div>
            </section>
        </motion.div>
    )
}

export default AnalyzerHome
