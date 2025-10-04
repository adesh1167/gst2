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
import TypingText from '../typingText';

const AnalyzerComing = () => {

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
            <header className="text-center mb-12 h-[calc(100vh-160px)] flex flex-col justify-around relative gap-8">
                <NeuralBackground opacity={0.4}/>
                <div>
                    <h1 className="text-5xl max-xs:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-red-400 mb-6 relative">
                        DEEP ANALYZER
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto relative">
                        Step into the future of sports analytics. Harness neural intelligence to uncover tactical insights, live predictions, and performance metrics like never before.
                    </p>
                </div>
                <div className='text-3xl max-xs:text-2xl font-bold pb-10'
                    style={{

                    }}
                >
                    <TypingText texts='COMING SOON...' cursor='_'/>
                </div>
            </header>
        </motion.div>
    )
}

export default AnalyzerComing
