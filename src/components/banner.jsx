import { motion } from "framer-motion";
import { Link } from "react-router";

export default function Banner() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/100 to-red-900/100 border border-purple-700/40 shadow-xl p-6 flex flex-col md:flex-row items-center justify-around gap-4 text-white"
        >


            <div className="relative w-[120px] h-[115px] md:w-[145px] md:h-[140px] flex items-center justify-center shrink-0 max-md:absolute max-md:opacity-50 max-md:aspect-[1.05] max-md:w-auto max-md:h-[85%]">
                <motion.div
                    aria-hidden
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.06, 1], rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full border border-purple-400/30"
                />

                <motion.div
                    aria-hidden
                    initial={{ rotate: 0 }}
                    animate={{ scale: [1, 1.06, 1], rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 rounded-full border border-red-400/40"
                />

                <motion.div
                    aria-hidden
                    initial={{ rotate: 0 }}
                    animate={{ scale: [1, 1.06, 1], rotate: -360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-8 rounded-full border border-purple-500/50"
                />

                <span className="relative z-10 text-xs text-purple-300 tracking-widest font-mono max-md:hidden">
                    AI CORE
                </span>
            </div>

            <div className="relative max-w-xl">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-purple-200 to-red-200 bg-clip-text text-transparent">
                    Introducing Deep Analyzer
                </h2>
                <p className="text-gray-300 mt-2 text-sm sm:text:md">
                    Experience AI-powered match predictions and real-time tactical insights. Analyze smarter, predict better.
                </p>
                <Link
                    to="/deep-analyzer"
                    aria-label="Open Deep Analyzer"
                    className="inline-block mt-4 px-6 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-400 hover:to-red-400 transition duration-300 shadow-lg"
                    rel="noopener noreferrer"
                >
                    Try Deep Analyzer
                </Link>
            </div>

            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at center, rgba(155,92,246,0.12), transparent 60%)'
                }}
            />
        </motion.div>
    );
}
