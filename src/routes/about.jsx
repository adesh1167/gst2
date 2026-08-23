import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import {
    Brain,
    ShieldCheck,
    TrendingUp,
    Sparkles,
    CheckCircle2,
    DollarSign,
    Target,
    Cpu,
    BarChart3,
    ArrowRight,
    Lock,
    Zap,
    Scale,
    Layers,
    AlertCircle
} from 'lucide-react';
import './styles/about.css';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
};

const STATS = [
    { label: 'Safety Threshold', value: '94%+', sub: 'Minimum model conviction for listing' },
    { label: 'Historical Accuracy', value: '92.4%', sub: 'Validated across trial match days' },
    { label: 'ML Training Epochs', value: '3+ Yrs', sub: 'Continuously refined since Dec 2021' },
    { label: 'Bookmaker Bias', value: '0%', sub: '100% independent data analytics' },
];

const WORKFLOW = [
    {
        step: '01',
        title: 'Multi-Dimensional Data Ingestion',
        desc: 'Our data engines ingest thousands of variables per fixture — team momentum, injury reports, xG trends, tactical matchups, and market dynamics.',
        icon: Cpu,
        color: 'text-blue-500 dark:text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'group-hover:border-blue-500/50',
    },
    {
        step: '02',
        title: 'Deep Neural Processing',
        desc: 'Advanced neural networks simulate millions of game trajectories, computing true probability distributions free from human emotion or hype.',
        icon: Brain,
        color: 'text-purple-500 dark:text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'group-hover:border-purple-500/50',
    },
    {
        step: '03',
        title: 'Strict Safe Staking Filter',
        desc: 'Any prediction falling below our strict 94% statistical threshold is automatically discarded. Only maximum-confidence matches are approved.',
        icon: Target,
        color: 'text-orange-500 dark:text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'group-hover:border-orange-500/50',
    },
    {
        step: '04',
        title: 'Instant Selection Delivery',
        desc: 'Unlocked matches appear instantly under My Matches on your dashboard, giving you clear, high-probability selections ready to stake.',
        icon: Zap,
        color: 'text-emerald-500 dark:text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'group-hover:border-emerald-500/50',
    },
];

const PILLARS = [
    {
        title: 'Consistency',
        badge: 'Neural Objectivity',
        desc: 'AI models operate strictly on cold empirical evidence and mathematical models. Human emotions, loyalty, and bias are entirely eliminated, ensuring reliable outcomes trial after trial.',
        icon: Layers,
        highlight: 'Tested over thousands of simulation trials.',
        gradient: 'from-blue-600/20 via-indigo-500/10 to-transparent',
        tagColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        bgImage: 'hero-consistency',
    },
    {
        title: 'Accuracy',
        badge: '94%+ Threshold',
        desc: 'Trained continuously since December 2021, our predictive models average over 92% accuracy across major leagues. Only top-tier forecasts exceeding 94% certainty are published.',
        icon: Target,
        highlight: 'Strict thresholding protects your bankroll.',
        gradient: 'from-orange-600/20 via-amber-500/10 to-transparent',
        tagColor: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
        bgImage: 'hero-accuracy',
    },
    {
        title: 'Affordability',
        badge: 'For The Masses',
        desc: 'While high-end quantitative sports analytics is usually reserved for hedge funds and syndicates, we subsidize our technology through investor backing so everyday bettors gain an unfair edge.',
        icon: DollarSign,
        highlight: 'Institutional intelligence at everyday pricing.',
        gradient: 'from-emerald-600/20 via-teal-500/10 to-transparent',
        tagColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        bgImage: 'hero-affordability',
    },
];

const ADVANTAGES = [
    {
        title: 'Safe Staking Philosophy',
        desc: 'We focus on sustainable, high-probability singles rather than reckless long-shot accumulators.',
        icon: ShieldCheck,
    },
    {
        title: '100% Independent Analytics',
        desc: 'GST is never affiliated with bookmakers. We profit only when our analytics help you succeed.',
        icon: Scale,
    },
    {
        title: 'Continuous Deep Learning',
        desc: 'Our models update daily, absorbing fresh team dynamics, tactical evolutions, and lineup shifts.',
        icon: TrendingUp,
    },
    {
        title: 'Instant Transparent Tracking',
        desc: 'View your purchased predictions with full clarity in your personal dashboard whenever you want.',
        icon: BarChart3,
    },
];

const About = () => {
    return (
        <div className="w-full min-h-full overflow-y-auto bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary transition-colors duration-300">
            {/* ── HERO SECTION ────────────────────────────────────────────── */}
            <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden">
                {/* Background decorative ambient glow */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/15 dark:bg-orange-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center text-center space-y-6"
                >
                    {/* Top pill badge */}
                    <motion.div variants={itemVariants}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 shadow-sm shadow-orange-500/10">
                            <Sparkles className="w-4 h-4 animate-pulse" />
                            <span>Next-Generation Sports Intelligence</span>
                        </div>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-3xl sm:text-5xl lg:text-4xl font-black tracking-tight leading-tight sm:leading-tight max-w-4xl"
                    >
                        Transforming Sports Predictions With{' '}
                        <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 bg-clip-text text-transparent">
                            Artificial Intelligence
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        variants={itemVariants}
                        className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed"
                    >
                        <strong className="text-gray-900 dark:text-white font-semibold">Global Sports Trade (GST)</strong>{' '}
                        harnesses deep neural networks and quantitative modeling to deliver safe, consistent, and mathematically sound sports forecasts.
                    </motion.p>

                    {/* Stats strip */}
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-2 2xl:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl pt-8"
                    >
                        {STATS.map((stat, idx) => (
                            <div
                                key={idx}
                                className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-[#121320]/80 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-lg shadow-black/[0.02] dark:shadow-black/20 flex flex-col items-center text-center hover:border-orange-500/40 transition-all"
                            >
                                <span className="text-2xl sm:text-3xl font-extrabold text-orange-600 dark:text-orange-400 font-mono">
                                    {stat.value}
                                </span>
                                <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mt-1">
                                    {stat.label}
                                </span>
                                <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-tight">
                                    {stat.sub}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* ── HOW IT WORKS SECTION ───────────────────────────────────── */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-black/5 dark:border-white/10">
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 dark:text-orange-400">
                        Our Architecture
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        How Does GST Work?
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        From raw telemetry to high-probability selections in four automated stages.
                    </p>
                </div>

                <div className="grid grid-cols-1 2md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                    {WORKFLOW.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className={`group relative p-6 rounded-2xl bg-white/70 dark:bg-[#121320]/80 backdrop-blur-md
                                            border border-black/5 dark:border-white/10 ${step.border}
                                            hover:shadow-xl hover:shadow-orange-500/5 [transition-property:color,background-color,border-color,box-shadow] duration-300 flex flex-col justify-between`}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl ${step.bg}`}>
                                            <Icon className={`w-6 h-6 ${step.color}`} />
                                        </div>
                                        <span className="font-mono text-2xl font-black text-black/15 dark:text-white/15 group-hover:text-orange-500/30 transition-colors">
                                            {step.step}
                                        </span>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                                        {step.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>

                                <div className="mt-6 pt-3 border-t border-black/5 dark:border-white/5 flex items-center text-xs font-semibold text-orange-600 dark:text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span>Learn more</span>
                                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ── CORE PILLARS SECTION ───────────────────────────────────── */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-black/5 dark:border-white/10">
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 dark:text-orange-400">
                        Our Foundational Core
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Built On Three Pillars
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Engineered to maximize success, protect capital, and remain accessible.
                    </p>
                </div>

                <div className="grid grid-cols-1 md xl:grid-cols-2 gap-6">
                    {PILLARS.map((pillar, idx) => {
                        const Icon = pillar.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.15 }}
                                className={`${idx === 0 ? 'xl:col-span-2' : ''} relative rounded-3xl bg-white/80 dark:bg-[#121320]/90 backdrop-blur-md border border-black/10 dark:border-white/10 overflow-hidden shadow-xl shadow-black/5 hover:border-orange-500/40 [transition-property:color,background-color,border-color,box-shadow] duration-300 flex flex-col justify-between p-6 sm:p-8`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient} pointer-events-none`} />

                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${pillar.tagColor}`}>
                                            {pillar.badge}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                                        {pillar.title}
                                    </h3>

                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {pillar.desc}
                                    </p>
                                </div>

                                <div className="relative z-10 mt-6 pt-4 border-t border-black/5 dark:border-white/10 flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                                    <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                                    <span>{pillar.highlight}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ── ADVANTAGES GRID ────────────────────────────────────────── */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-black/5 dark:border-white/10">
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 dark:text-orange-400">
                        The GST Advantage
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Why Bettors Choose GST
                    </h2>
                </div>

                <div className="grid grid-cols-1 2md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                    {ADVANTAGES.map((adv, idx) => {
                        const Icon = adv.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.96 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                className="flex items-start gap-4 p-5 sm:p-6 rounded-2xl bg-white/60 dark:bg-[#121320]/60 backdrop-blur-md border border-black/5 dark:border-white/10 hover:border-orange-500/30 [transition-property:color,background-color,border-color,box-shadow] duration-300"
                            >
                                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500 shrink-0">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                                        {adv.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {adv.desc}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ── RESPONSIBLE GAMING & DISCLAIMER ───────────────────────── */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <div className="p-6 sm:p-8 rounded-3xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-center space-y-4">
                    <div className="inline-flex p-3 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Responsible Gaming & Legal Notice
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                        Global Sports Trade is an independent sports analytics platform and is not affiliated with any bookmaker or wagering syndicate. Predictions represent statistical probabilities and do not guarantee future results.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-bold text-amber-700 dark:text-amber-300">
                        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">18+ Legal Betting</span>
                        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">Gamble Responsibly</span>
                        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">Independent Analytics</span>
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ─────────────────────────────────────────────── */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white shadow-2xl shadow-orange-600/30"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/30 pointer-events-none" />

                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                            Ready to Experience AI-Powered Safe Staking?
                        </h2>
                        <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                            Discover today’s verified fixtures, backed by neural predictive intelligence with a 94%+ safety threshold.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                            <Link
                                to="/"
                                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white text-orange-600 hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/20 flex items-center gap-2"
                            >
                                <span>Explore Today's Fixtures</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/deep-analyzer"
                                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-black/20 hover:bg-black/30 text-white border border-white/30 backdrop-blur-sm transition-all"
                            >
                                Explore Deep Analyzer
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ── FOOTER ─────────────────────────────────────────────────── */}
            <footer className="py-10 border-t border-black/5 dark:border-white/10 text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                    <img src="/assets/logo.png" alt="GST Logo" className="w-6 h-6 rounded object-cover" />
                    <span className="font-extrabold text-sm tracking-wide text-gray-900 dark:text-white">GST</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} Global Sports Trade. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default About;
