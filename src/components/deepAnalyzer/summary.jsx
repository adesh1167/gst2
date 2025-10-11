import { AnimatePresence, motion } from "framer-motion";

function SummaryPanel({ open, onClose, report }) {
    if (!open || !report) return null;

    const { predictedWinner, accuracy, timeSpentMs, parameters, processedCounts } = report;
    const seconds = Math.round((timeSpentMs || 0) / 1000);

    return (

        <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1  }}
            exit={{ opacity: 0, y: 100, scale: 2 }}
            className="fixed top-[50px] inset-0 z-5 flex items-center justify-center p-6"
        >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div
                className="relative z-10 max-w-2xl w-full p-[1px] rounded-2xl border border-gray-800 text-gray-100 shadow-2xl overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-full h-full flex items-center justify-center">
                    <div className='animate-spin-slow' style={{
                        position: "absolute",
                        background: "conic-gradient(transparent, transparent, rgb(192 132 252), transparent, transparent, #00f8, transparent, transparent)",
                        width: "400%",
                        height: "400%",
                        // top: "-2.5%",
                        // left: "-2.5%",
                        // aspectRatio: "1/1",
                        animationDuration: "3s",
                        animationTimingFunction: "cubic-bezier(0.5, 0, 0.5, 1)"
                    }} />
                </div>
                <motion.div
                    // initial={{ y: 20, opacity: 0 }}
                    // animate={{ y: 0, opacity: 1 }}
                    // exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="relative max-h-[80vh] w-full h-full p-6 overflow-scroll bg-gradient-to-b from-[#05060a] to-[#07070a] rounded-2xl overflow-scroll"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-2xl font-bold text-purple-400 max-sm:text-xl">Analysis Summary</h3>
                            <p className="text-sm text-gray-400 max-sm:text-xs">Final prediction & breakdown</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-400">Time spent</div>
                            <div className="text-xl font-semibold max-sm:text-lg">{seconds}s</div>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="col-span-1 md:col-span-2 p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-gray-800">
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <div className="text-xs text-gray-400">Predicted Winner</div>
                                    <div className="text-2xl font-bold text-purple-400 max-sm:text-xl">{predictedWinner || "—"}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-400">Confidence</div>
                                    <div className="text-xl font-semibold">{accuracy ?? "—"}%</div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="text-xs text-gray-400">Parameters considered</div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {parameters?.map((p) => (
                                        <span key={p} className="text-xs px-2 py-1 bg-gray-800 rounded-full text-gray-300">{p}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="text-xs text-gray-400">Processed items</div>
                                <ul className="mt-2 text-sm space-y-1">
                                    {Object.entries(processedCounts || {}).map(([k, v]) => (
                                        <li key={k} className="flex justify-between"><span className="text-gray-300">{k}</span><span className="text-gray-400">{v}</span></li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-gray-800">
                            <div className="h-full flex flex-col">
                                <div className="text-xs text-gray-400">Quick Metrics</div>
                                <div className="mt-3 space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-300">Categories processed</span><span className="text-gray-400">{parameters?.length ?? 0}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-300">Total sub-items</span><span className="text-gray-400">{Object.values(processedCounts || {}).reduce((a, b) => a + (Number(b) || 0), 0)}</span></div>
                                </div>

                                <div className="pt-4 mt-auto">
                                    <button className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm" onClick={() => {
                                        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
                                        const dl = document.createElement('a'); dl.setAttribute('href', dataStr); dl.setAttribute('download', `analysis_${Date.now()}.json`); dl.click();
                                    }}>Export JSON</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 text-right"><button className="text-sm font-bold text-gray-200 hover:underline bg-gray-800 p-3 rounded-md" onClick={onClose}>Close</button></div>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default SummaryPanel;