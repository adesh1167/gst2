import { useSelector } from "react-redux";
import { getMyMatchTime } from "../functions/formatDate";

export function ActiveSubscriberCard({ startDateSql, endDateSql, planName = 'Monthly', price = null, features = [], onRenew = null, onCancel = null, renewable = false }) {

    const { country } = useSelector(state => state.data);

    const parseSql = (s) => {
        if (!s) return null;
        if (typeof s !== 'string') return new Date(s);
        const t = s.replace(' ', 'T');
        const d = new Date(t);
        if (isNaN(d)) return new Date(s);
        return d;
    };

    const start = parseSql(startDateSql);
    const end = parseSql(endDateSql);
    const now = new Date();

    const isActive = start && end && now >= start && now <= end;
    const expired = start && end && now > end;
    const notStarted = start && now < start;

    const totalMs = (end && start) ? Math.max(1, end - start) : 1;
    const elapsedMs = (now - start) > 0 ? Math.min(totalMs, now - start) : 0;
    const progress = Math.round((elapsedMs / totalMs) * 100);

    const daysLeft = end ? Math.ceil(Math.max(0, (end - now) / (1000 * 60 * 60 * 24))) : null;

    const fmt = (d) => {
        if (!d) return '—';
        return d.toLocaleString();
    };

    return (
        <div className="w-full max-w-lg mx-auto p-4 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-gray-800 text-gray-100">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <div className="text-sm text-gray-400">Subscription</div>
                    <div className="text-xl font-semibold orbitron-regular">{planName}</div>
                </div>
                <div className="text-right">
                    <div className={`text-lg orbitron-regular font-medium ${isActive ? 'text-emerald-400' : expired ? 'text-rose-400' : 'text-yellow-400'}`}>
                        {isActive ? 'Active' : expired ? 'Expired' : notStarted ? 'Upcoming' : 'Unknown'}
                    </div>
                    {price && <div className="text-sm text-gray-400">{price}</div>}
                </div>
            </div>

            <div className="mb-3 mt-12">
                <div className="text-sm text-gray-400">Period</div>
                <div className="text-xl orbitron-regular">{getMyMatchTime(startDateSql, country, "")} &nbsp; — &nbsp;  {getMyMatchTime(endDateSql, country, "")}</div>
            </div>

            <div className="mb-12">
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-red-400 transition-all" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400 mt-2">
                    <div>{isActive ? `${daysLeft} day${daysLeft === 1 ? '' : 's'} left` : expired ? 'Expired' : notStarted ? 'Starts soon' : ''}</div>
                    <div>{Math.max(0, Math.min(100, progress))}%</div>
                </div>
            </div>

            {features && features.length > 0 && (
                <div className="mb-3">
                    <div className="text-xs text-gray-400">Includes</div>
                    <ul className="mt-2 space-y-1 text-sm">
                        {features.map((f, i) => (<li key={i} className="text-gray-200">• {f}</li>))}
                    </ul>
                </div>
            )}
            {renewable &&
            <div className="flex items-center gap-3 mt-4">
                <button onClick={() => onRenew && onRenew()} className="flex-1 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-lg font-bold">RENEW</button>
                {/* <button onClick={() => onCancel && onCancel()} className="px-3 py-2 rounded-lg border border-gray-700 text-sm">Cancel</button> */}
            </div> }

            <div className=" text-gray-400 font-extralight items-center gap-3 mt-12 text-center">
               This subscription {isActive ? "will" : "did"} not renew automatically upon expiry
            </div>
        </div>
    );
}