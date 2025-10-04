import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Routes, Route } from "react-router";
import AnalyzerHome from "./deepAnalyzer/home";
import DeepAnalyzerTool from "./deepAnalyzer/analyze";
import { useApp } from "../contexts/appContext";
import axios from 'axios';
import { pre } from 'framer-motion/client';
import { baseApiUrl } from "../data/url";
import { useSelector } from "react-redux";
import AnalyzerComing from "./deepAnalyzer/coming";

import "./styles/deepAnalyzer.css";

export default function DeepAnalyzer() {

    const { isAuthenticated } = useSelector(state => state.user);

    const {deepAnalyzerSubscription} = useSelector(state => state.subscriptions);

    const { deepAnalyzerMatches, fetchDeepAnalyzerMatches, fetchDeepAnalyzerSubscription } = useApp();

    useEffect(() => {
        if (!deepAnalyzerMatches.loaded) {
            fetchDeepAnalyzerMatches();
        }
    }, [])

    useEffect(() => {
        if(isAuthenticated && !deepAnalyzerSubscription.queried){
            fetchDeepAnalyzerSubscription();
        }
    }, [isAuthenticated])


    const matches = [
        { id: 1, title: "Eagles vs Tigers", subtitle: "Full match — 12 May 2025", score: "2 - 1" },
        { id: 2, title: "Rangers vs Hawks", subtitle: "Highlights — 09 Sep 2025", score: "1 - 3" },
        { id: 3, title: "City FC vs United", subtitle: "Tactical — 03 Sep 2025", score: "0 - 0" },
    ];

    return (
        <div className="min-h-screen h-full pt-10 bg-gradient-to-b from-black via-gray-900 to-[#07070a] text-gray-100 font-sans overflow-hidden margin orbitron-regular">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 h-full">
                <AnimatePresence mode="sync">
                    <Routes>
                        <Route path="*">
                            <Route path="*" element={<AnalyzerComing />} />
                            {/* <Route path="*" element={<AnalyzerHome />} /> */}
                            {/* <Route index element={<AnalyzerHome />} /> */}
                            {/* <Route path="analyze/:id" element={<DeepAnalyzerTool />} /> */}
                        </Route>
                    </Routes>
                </AnimatePresence>

                <footer className="mt-12 text-xs text-gray-500 text-center">© {new Date().getFullYear()} AI Game Labs — DeepAnalyzer · GST </footer>
            </div>

            <style>{`
                .animate-spin-slow { animation: spin 12s linear infinite; }
                .animate-pulse-slow { animation: pulse 4s ease-in-out infinite; }
                @keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
                @keyframes pulse { 0%{ transform: scale(1); opacity: .25 } 50%{ transform: scale(1.12); opacity:.6 } 100%{ transform: scale(1); opacity:.25 } }

                .ring-anim { position: absolute; border-radius: 9999px; filter: blur(36px); mix-blend-mode: screen; opacity: .7 }
                .ring-anim.ring-1 { width: 420px; height: 420px; background: radial-gradient(circle at 30% 20%, rgba(120,75,255,0.35), transparent 25%); animation: ring1 10s linear infinite; }
                .ring-anim.ring-2 { width: 360px; height: 360px; background: radial-gradient(circle at 70% 80%, rgba(0,200,255,0.25), transparent 25%); animation: ring2 12s linear infinite reverse; }
                .ring-anim.ring-3 { width: 300px; height: 300px; background: radial-gradient(circle at 50% 50%, rgba(255,100,120,0.22), transparent 25%); animation: ring3 8s linear infinite; }

                @keyframes ring1 { 0%{ transform: rotate(0deg) } 100%{ transform: rotate(360deg) } }
                @keyframes ring2 { 0%{ transform: rotate(0deg) } 100%{ transform: rotate(-360deg) } }
                @keyframes ring3 { 0%{ transform: translateY(-4px) } 50%{ transform: translateY(4px) } 100%{ transform: translateY(-4px) } }

                .ring-color-1 { background: radial-gradient(circle at 30% 20%, rgba(110, 92, 255, 0.14), transparent 40%); }
                .ring-color-2 { background: radial-gradient(circle at 60% 70%, rgba(0, 200, 255, 0.10), transparent 40%); }
            `}</style>
        </div>
    );
}
