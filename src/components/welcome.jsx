import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router';
import { setTAndCAccepted } from '../slices/dataReducer';
import ModalWrapper from './modalWrapper';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

const Welcome = () => {
    const dispatch = useDispatch();

    const handleAccept = () => {
        dispatch(setTAndCAccepted(true));
    };

    return (
        <ModalWrapper
            exitable={false}
            title={
                <div>
                    <span className="text-[11px] font-bold tracking-wider uppercase text-orange-600 dark:text-orange-400">
                        Welcome to GST
                    </span>
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        Getting Started
                    </h2>
                </div>
            }
            icon={Sparkles}
            headerGradient="from-orange-500/10 via-amber-500/5 to-transparent"
            footer={
                <div className="w-full flex items-center justify-between gap-3">
                    <Link
                        to="/about"
                        onClick={handleAccept}
                        className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                        <span>Learn More</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                        type="button"
                        onClick={handleAccept}
                        className="py-2.5 px-5 rounded-xl font-bold text-xs sm:text-sm text-white
                                   bg-gradient-to-r from-orange-600 to-orange-500
                                   hover:from-orange-500 hover:to-orange-400
                                   active:scale-[0.98] transition-all
                                   shadow-sm hover:shadow"
                    >
                        I Understand
                    </button>
                </div>
            }
        >
            <div className="p-6 space-y-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-h-[65vh] overflow-y-auto">
                <p>
                    <strong className="text-orange-600 dark:text-orange-400">Global Sports Trade</strong> uses advanced
                    Artificial Intelligence to make highly consistent and safe predictions for sports events.
                </p>

                <div className="p-3.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 space-y-2.5">
                    <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        How it works:
                    </div>
                    <ul className="space-y-2 pl-1">
                        <li className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                            <span>Browse high-confidence predictions on the homepage.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                            <span>Add your selected games to cart and checkout securely.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                            <span>Unlocked selections appear immediately under <strong className="text-orange-600 dark:text-orange-400 font-semibold">My Matches</strong>.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                            <span>Stake the matches with confidence on any betting platform of your choice.</span>
                        </li>
                    </ul>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                    GST is 100% independent and not affiliated with any bookmaker. Gamble responsibly (18+).
                </p>
            </div>
        </ModalWrapper>
    );
};

export default Welcome;
