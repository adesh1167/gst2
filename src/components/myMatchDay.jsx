import React, { memo } from 'react';
import formatNumber from '../functions/formatNumber';
import { getMyMatchTime } from '../functions/formatDate';
import { useSelector } from 'react-redux';

const MyMatchDay = memo(({ day }) => {
    const country = useSelector(state => state.data.country);

    return (
        <div className="w-full rounded-2xl overflow-hidden
                        bg-white dark:bg-[#13131f]
                        border border-gray-200/80 dark:border-white/10
                        shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]
                        hover:border-orange-300 dark:hover:border-orange-500/30
                        transition-colors duration-300">
            {/* Day header */}
            <div className="px-5 py-3.5 flex items-center justify-between
                            bg-gray-50 dark:bg-white/[0.03]
                            border-b border-gray-100 dark:border-white/10
                            transition-colors duration-300">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
                    Matches Bought {getMyMatchTime(day.time, country)}
                </span>
            </div>

            {/* Matches */}
            <div className="flex flex-col">
                {day.matches.map((item, i) => (
                    <MyMatchItem key={item.id || i} item={item} />
                ))}
            </div>
        </div>
    );
});

const MyMatchItem = memo(({ item }) => {
    return (
        <div className="group flex items-start justify-between px-4 py-3
                        border-b border-gray-100 dark:border-white/5 last:border-0
                        transition-colors duration-300 text-sm">

            {/* Teams + league info */}
            <div className="flex flex-col w-full gap-1.5">
                <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white/90 overflow-hidden text-sm transition-colors duration-300">
                    <div className="overflow-hidden flex-shrink truncate">
                        <span className="team-name">{item.home}</span>
                    </div>
                    <span className="text-gray-400 dark:text-white/30 shrink-0 font-medium text-xs transition-colors duration-300">vs</span>
                    <div className="overflow-hidden flex-shrink truncate">
                        <span className="team-name">{item.away}</span>
                    </div>
                </div>

                <div className="flex w-full items-center">
                    <div className="flex-1 flex flex-col justify-between pr-4 overflow-hidden gap-0.5">
                        {/* League */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/50 overflow-hidden font-medium transition-colors duration-300">
                            <span className="league-name truncate">{item.league}</span>
                            <span className="opacity-40 shrink-0 text-gray-400 dark:text-white transition-colors duration-300">|</span>
                            <span className="shrink-0">{item.country}</span>
                        </div>

                        {/* Game type & Odds */}
                        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-white/40 transition-colors duration-300">
                            <span>
                                Type: <strong className="text-gray-600 dark:text-white/70 font-medium transition-colors duration-300">{item.gameType}</strong>
                            </span>
                            <div className="flex items-center gap-1 text-[11px]">
                                <span className="uppercase tracking-wider font-semibold">Odds:</span>
                                <span className="font-bold text-emerald-500 text-xs">{formatNumber(item.odds)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Selection Pill */}
                    <div className="flex flex-col items-center shrink-0">
                        <div className="flex flex-col items-center px-3.5 py-1.5
                                        bg-orange-500/10 dark:bg-orange-500/15 
                                        border border-orange-500/30 
                                        rounded-xl min-w-[76px] 
                                        shadow-sm dark:shadow-none 
                                        transition-colors duration-300">
                            <span className="text-[10px] text-gray-500 dark:text-white/40 uppercase tracking-wider font-bold mb-0.5 transition-colors duration-300">
                                Selection
                            </span>
                            <span className="font-black text-orange-500 text-sm leading-none">
                                {item.selection}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
});

export default MyMatchDay;