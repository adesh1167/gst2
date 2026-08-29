import React, { memo } from "react";
import { Link } from "react-router";
import { Sparkles, ArrowRight } from "lucide-react";
import { AiSvg } from "./svgs";

const Banner = memo(() => {
    return (
        <div
            className="group relative overflow-hidden rounded-2xl
                       bg-gradient-to-br from-[#0d0815] via-[#110a20] to-[#0a0612]
                       border border-purple-500/25
                       shadow-xl shadow-purple-900/20
                       hover:shadow-2xl hover:shadow-purple-800/30
                       hover:border-purple-500/40
                       transition-all duration-500"
        >
            {/* ── Ambient glow blobs (Pure CSS) ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute -top-12 -right-12 w-56 h-56 rounded-full
                               bg-purple-600/25 blur-[80px] banner-pulse-slow"
                />
                <div
                    className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full
                               bg-red-600/20 blur-[60px] banner-pulse-med"
                />
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                               w-32 h-32 rounded-full bg-blue-600/15 blur-[60px] banner-pulse-subtle"
                />
            </div>

            {/* ── Subtle grid overlay ── */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                }}
            />

            <div className="relative z-10 flex items-center gap-4 sm:gap-5 p-5 sm:p-6">

                {/* ── Concentric rings (Pure CSS transforms) ── */}
                <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] shrink-0 flex items-center justify-center">
                    {/* Outer ring — slow clockwise spin */}
                    <div className="absolute inset-0 rounded-full banner-spin-slow pointer-events-none">
                        <div className="w-full h-full rounded-full border-2 border-dashed border-purple-500/30
                                        group-hover:border-purple-400/50 transition-colors duration-500" />
                    </div>

                    {/* Middle ring — counter-clockwise spin */}
                    <div
                        className="absolute inset-2 rounded-full border border-red-500/35
                                   group-hover:border-red-400/55 transition-colors duration-500
                                   banner-spin-reverse pointer-events-none"
                    />

                    {/* Inner ring — fast clockwise with glow */}
                    <div
                        className="absolute inset-[14px] rounded-full border border-blue-400/30
                                   shadow-[0_0_12px_rgba(96,165,250,0.15)]
                                   group-hover:border-blue-400/50 transition-colors duration-500
                                   banner-spin-fast pointer-events-none"
                    />

                    {/* Center icon with subtle scale bounce */}
                    <div
                        className="relative z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-xl
                                   bg-gradient-to-br from-purple-600/60 to-red-500/60
                                   flex items-center justify-center
                                   shadow-lg shadow-purple-700/40 banner-icon-bounce"
                    >
                        <AiSvg className="w-5 h-5 md:w-6 md:h-6 text-white fill-white" />
                    </div>
                </div>

                {/* ── Copy ── */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest
                                        text-purple-400 bg-purple-500/10 border border-purple-500/20
                                        rounded-full px-2 py-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            New Feature
                        </span>
                    </div>
                    <h3 className="font-extrabold text-white text-base sm:text-lg leading-tight mb-0.5
                                   group-hover:text-purple-100 transition-colors">
                        Deep Analyzer
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-400 leading-snug
                                  group-hover:text-gray-300 transition-colors">
                        AI-powered tactical insights & match predictions for any fixture
                    </p>
                </div>

                {/* ── CTA ── */}
                <Link
                    to="/deep-analyzer"
                    className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl
                               bg-gradient-to-r from-purple-600 to-red-500
                               hover:from-purple-500 hover:to-red-400
                               text-white text-xs sm:text-sm font-bold
                               transition-all duration-300
                               shadow-lg shadow-purple-900/50
                               hover:shadow-xl hover:shadow-purple-700/50
                               hover:-translate-y-0.5 whitespace-nowrap
                               active:scale-[0.97]"
                >
                    Try it
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            {/* ── Bottom shimmer line ── */}
            <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
                <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent banner-shimmer" />
            </div>

            {/* ── Scoped CSS Keyframes for zero JS thread overhead ── */}
            <style>{`
                .banner-spin-slow {
                    animation: bannerSpinCW 12s linear infinite;
                    will-change: transform;
                }
                .banner-spin-reverse {
                    animation: bannerSpinCCW 8s linear infinite;
                    will-change: transform;
                }
                .banner-spin-fast {
                    animation: bannerSpinCW 5s linear infinite;
                    will-change: transform;
                }
                .banner-pulse-slow {
                    animation: bannerPulse 4s ease-in-out infinite;
                }
                .banner-pulse-med {
                    animation: bannerPulse 5s ease-in-out infinite 1s;
                }
                .banner-pulse-subtle {
                    animation: bannerPulse 6s ease-in-out infinite 2s;
                }
                .banner-icon-bounce {
                    animation: bannerIconScale 2.5s ease-in-out infinite;
                }
                .banner-shimmer {
                    animation: bannerShimmerSlide 4s ease-in-out infinite;
                }

                @keyframes bannerSpinCW {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes bannerSpinCCW {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }
                @keyframes bannerPulse {
                    0%, 100% { transform: scale(1); opacity: 0.2; }
                    50% { transform: scale(1.2); opacity: 0.35; }
                }
                @keyframes bannerIconScale {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); }
                }
                @keyframes bannerShimmerSlide {
                    0% { transform: translateX(-100%); }
                    60%, 100% { transform: translateX(350%); }
                }
            `}</style>
        </div>
    );
});

export default Banner;
