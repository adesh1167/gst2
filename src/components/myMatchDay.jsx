import React from 'react';
import formatNumber from '../functions/formatNumber';
import { getMyMatchTime } from '../functions/formatDate';
import { useSelector } from 'react-redux';

const MyMatchDay = ({ day }) => {
    const { country } = useSelector(state => state.data);

    return (
        <div className="w-full rounded-2xl overflow-hidden
                        bg-white dark:bg-black dark:bg-gradient-to-br dark:from-[#1a1a2e]/30 dark:to-[#16213e]/30
                        border border-gray-200 dark:border-white/10
                        shadow-md hover:border-orange-300 dark:hover:border-orange-500/30  dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]
                        transition-all duration-300">
            {/* Day header */}
            <div className="px-5 py-5 flex items-center justify-between
                            bg-gray-50/80 dark:bg-transparent
                            border-b border-gray-100 dark:border-white/10">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
                    Matches Bought {getMyMatchTime(day.time, country)}
                </span>
            </div>

            {/* Matches */}
            <div className="flex flex-col">
                {day.matches.map((item, i) => (
                    <MyMatchItem key={i} item={item} />
                ))}
            </div>
        </div>
    );
};

const MyMatchItem = ({ item }) => {
    return (
        <div className="group flex items-start justify-between px-4 py-2 
                        border-b border-gray-100 dark:border-white/5 last:border-0
                        transition-colors duration-200 text-sm">

            {/* Teams + league info */}
            <div className="flex flex-col w-full gap-2">
                <div className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-300 overflow-hidden text-base">
                    <div className="overflow-hidden flex-shrink truncate">
                        <span className="team-name">{item.home}</span>
                    </div>
                    <span className="text-gray-400 dark:text-white/30 shrink-0 font-medium text-sm">vs</span>
                    <div className="overflow-hidden flex-shrink truncate">
                        <span className="team-name">{item.away}</span>
                    </div>
                </div>

                <div className="flex w-full">
                    <div className="flex-1 flex flex-col justify-between pr-4 overflow-hidden">
                        {/* Teams */}

                        {/* League */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/50 overflow-hidden font-medium">
                            <span className="league-name truncate">{item.league}</span>
                            <span className="opacity-30 shrink-0 text-gray-400 dark:text-white">|</span>
                            <span className="shrink-0">{item.country}</span>
                        </div>

                        {/* Game type */}
                        <div className="text-xs text-gray-400 dark:text-white/40 mt-0.5">
                            Type: <span className="text-gray-600 dark:text-white/60 font-medium">{item.gameType}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]">
                            <span className="text-gray-400 dark:text-white/40 uppercase tracking-wider font-semibold">Odds:</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">{formatNumber(item.odds)}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2 shrink-0 pt-0.5">
                        <div className="flex flex-col items-center px-4 py-2
                                        bg-orange-50 dark:bg-orange-500/15 
                                        border border-orange-200 dark:border-orange-500/30 
                                        rounded-xl min-w-[76px] 
                                        shadow-sm dark:shadow-none 
                                        transition-colors duration-200">
                            <span className="text-[10px] text-orange-600/70 dark:text-white/50 uppercase tracking-wider font-bold mb-0.5">
                                Selection
                            </span>
                            <span className="font-black text-orange-600 dark:text-orange-400 text-base leading-none">
                                {item.selection}
                            </span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Selection + odds */}
        </div>
    );
};

export default MyMatchDay;