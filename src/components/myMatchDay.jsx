import React from 'react'
import formatNumber from '../functions/formatNumber'
import { getMyMatchTime } from '../functions/formatDate'
import { useSelector } from 'react-redux'

const MyMatchDay = ({ day }) => {
    const { country } = useSelector(state => state.data);

    return (
        <div className="w-full rounded-2xl overflow-hidden
                        bg-gradient-to-br from-[#1a1a2e] to-[#16213e]
                        dark:from-[#1a1a2e] dark:to-[#16213e]
                        border border-white/10
                        shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            {/* Day header */}
            <div className="px-4 py-3 flex items-center justify-between
                            border-b border-white/8">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
                    {getMyMatchTime(day.time, country)}
                </span>
            </div>

            {/* Matches */}
            {day.matches.map((item, i) => (
                <MyMatchItem key={i} item={item} />
            ))}
        </div>
    );
};

const MyMatchItem = ({ item }) => {
    return (
        <div className="flex items-start px-3 py-3 border-b border-white/6 last:border-0
                        hover:bg-white/[0.02] transition-colors text-sm">

            {/* Teams + league info */}
            <div className="flex-1 flex flex-col justify-between pr-4 overflow-hidden gap-1">
                {/* Teams */}
                <div className="flex items-center gap-1 font-bold text-white/95 overflow-hidden">
                    <div className="overflow-hidden flex-shrink">
                        <span className="team-name">{item.home}</span>
                    </div>
                    <span className="text-white/40 mx-1 shrink-0">v</span>
                    <div className="overflow-hidden flex-shrink">
                        <span className="team-name">{item.away}</span>
                    </div>
                </div>

                {/* League */}
                <div className="flex items-center gap-1 text-xs text-white/50 overflow-hidden">
                    <span className="league-name">{item.league}</span>
                    <span className="opacity-40 shrink-0">|</span>
                    <span className="shrink-0">{item.country}</span>
                </div>

                {/* Game type */}
                <div className="text-xs text-white/35">
                    Type: <span className="text-white/50">{item.gameType}</span>
                </div>
            </div>

            {/* Selection + odds */}
            <div className="flex flex-col items-end gap-1.5 shrink-0">
                <div className="flex flex-col items-center px-3 py-2
                                bg-orange-500/15 border border-orange-500/30 rounded-xl min-w-[68px]">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">Selection</span>
                    <span className="font-extrabold text-orange-400 text-base leading-tight">{item.selection}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-white/35 uppercase tracking-wide">odds:</span>
                    <span className="font-bold text-green-400">{formatNumber(item.odds)}</span>
                </div>
            </div>
        </div>
    );
};

export default MyMatchDay;
