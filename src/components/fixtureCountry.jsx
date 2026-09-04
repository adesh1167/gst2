import React, { useCallback, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addItem, removeItem } from '../slices/cartReducer'
import { getFixtureDate } from '../functions/formatDate'
import formatNumber from '../functions/formatNumber'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { CartSvg } from './svgs'
import { useIsAdmin } from '../hooks/useIsAdmin'

/* ════════════════════════════════════════════════
   COUNTRY SECTION — memoized so it only re-renders
   when its own `country` prop reference changes.
════════════════════════════════════════════════ */
const FixtureCountry = memo(({ country }) => {

    console.log("Country Rendered", country.name);

    return (
        <div className="w-full px-3 sm:px-5 mb-1">
            <div className="flex items-center gap-3 py-3 mt-3">
                <img
                    src={country.flag || '/assets/earth.svg'}
                    alt={country.name}
                    className="h-5 w-5 object-contain rounded-sm shrink-0"
                />
                <span className="text-[11px] font-black uppercase tracking-[0.18em]
                             text-gray-500 dark:text-white/60 whitespace-nowrap">
                    {country.name}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-500/20 to-transparent" />
            </div>

            {Object.values(country.leagues).map(league => (
                <FixtureLeague key={league.name} league={league} />
            ))}
        </div>
    )
});

/* ════════════════════════════════════════════════
   LEAGUE SECTION — memoized; only re-renders when
   its `league` prop reference changes.
════════════════════════════════════════════════ */
const FixtureLeague = memo(({ league }) => {
    console.log("League Rendered", league.name)
    return (
        <div className="pb-4 px-2">
            <div className="flex items-center gap-2 px-1 mb-2.5">
                {league.logo && (
                    <img src={league.logo} alt={league.name}
                        className="h-4 w-4 object-contain opacity-60 shrink-0" />
                )}
                <span className="text-[11px] font-semibold text-gray-400 dark:text-white/30 tracking-wide">
                    {league.name}
                </span>
            </div>

            <div className="flex flex-col gap-3">
                {Object.values(league.fixtures).map(fixture => (
                    <Fixture key={fixture.id} fixture={fixture} />
                ))}
            </div>
        </div>
    );
});

/* ════════════════════════════════════════════════
   FIXTURE CARD
   Key optimisations:
   • Targeted cart selector → only this card re-renders
     when its own cart membership changes, not all cards.
   • Dropped useState + useEffect for inCart.
   • addToCart / removeFromCart wrapped in useCallback.
   • useIsAdmin hook replaces duplicated selector logic.
════════════════════════════════════════════════ */
function Fixture({ fixture }) {
    const { country, factor } = useSelector(state => state.data);
    const isAdminShown = useIsAdmin();
    const dispatch = useDispatch();

    // ✅ Targeted selector: only re-renders this card when its own cart state changes
    const inCart = useSelector(
        state => state.cart.items.some(item => item.id === fixture.id)
    );

    const teams = fixture.match_data.teams;

    // ✅ Stable references — won't trigger downstream re-renders
    const addToCart = useCallback(() => {
        dispatch(addItem({
            home: teams.home.name,
            away: teams.away.name,
            price: fixture.price,
            game_type: fixture.game_type,
            odds: fixture.odds,
            id: fixture.id,
        }));
    }, [dispatch, fixture.id, fixture.price, fixture.game_type, fixture.odds, teams.home.name, teams.away.name]);

    const removeFromCart = useCallback(() => {
        dispatch(removeItem(fixture.id));
    }, [dispatch, fixture.id]);

    const priceLabel = formatNumber(fixture.price * (factor || 1));

    console.log("Fixture Rendered", fixture.id)

    return (
        <motion.div
            // whileTap={{ scale: 0.975 }}
            onClick={inCart ? removeFromCart : addToCart}
            className={`
                relative w-full rounded-2xl overflow-hidden cursor-pointer select-none
                transition-colors duration-300
                ${inCart
                    /* in-cart: green glow ring */
                    ? 'shadow-[0_0_0_1px_rgba(34,197,94,0.55),0_6px_24px_rgba(34,197,94,0.12)] border border-transparent'
                    /* default light: elevated shadow + faint border */
                    : 'shadow-[0_2px_12px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.06)] border border-gray-200/80'
                    + ' dark:border dark:border-white/[0.10]'
                    + ' dark:shadow-[0_2px_16px_rgba(0,0,0,0.4)]'
                    + ' hover:shadow-[0_6px_24px_rgba(0,0,0,0.13)] dark:hover:shadow-[0_6px_24px_rgba(234,88,12,0.14)]'
                    + ' hover:border-orange-200 dark:hover:border-orange-500/30'
                }
            `}
        >
            {/* ── Background ───────────────────────────────── */}
            <div className={`
                absolute inset-0 transition-colors duration-300
                ${inCart
                    ? 'bg-gradient-to-br from-green-500/10 via-green-300/5 to-emerald-500/10'
                    : 'bg-white dark:bg-[#13131f]'
                }
            `} />

            {/* Subtle pitch stripes – decorative, dark mode only */}
            <div className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-[0.035]"
                style={{
                    backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 30px,#aaa 30px,#aaa 31px)',
                }} />

            {/* ── TOP BAR ──────────────────────────────────── */}
            <div className="relative z-10 flex items-center justify-between gap-2
                            px-4 pt-3 pb-2.5
                            border-b border-black/[0.06] dark:border-white/[0.07]">

                {/* Left: date + game-type badge + admin ID */}
                <div className={`flex items-center gap-2 min-w-0 ${inCart ? 'text-green-600' : 'text-gray-500 dark:text-white/85'}`}>
                    <Calendar size={14} />
                    <span className={`text-[11px] font-medium truncate`}>
                        {getFixtureDate(fixture.match_data.fixture.date, country)}
                    </span>

                    <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-semibold border transition-colors duration-300
                        ${inCart
                            ? 'bg-green-500 dark:bg-green-500/15 text-white dark:text-green-500 border-green-400 dark:border-green-500/25'
                            : 'bg-gray-400/15 text-gray-500 dark:text-white/80 border-transparent'
                        }`}>
                        {fixture.game_type}
                    </span>

                    {isAdminShown && (
                        <span className="text-[10px] text-orange-400 font-mono shrink-0">
                            #{fixture.id}
                        </span>
                    )}
                </div>

                {/* Right: price tag */}
                <div className={`
                    shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-colors duration-300
                    ${inCart
                        ? 'bg-green-500 dark:bg-green-500/15 text-white dark:text-green-500 border-green-400 dark:border-green-500/25'
                        : 'bg-orange-500 text-white shadow-sm shadow-orange-900/25 border-transparent'
                    }
                `}>
                    {inCart && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                            className="w-3 h-3 fill-current shrink-0">
                            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                        </svg>
                    )}
                    <span>
                        {country} <span className="sans">{priceLabel}</span>
                        {isAdminShown && (
                            <span className="opacity-90 font-semibold"> · {fixture.selection}</span>
                        )}
                    </span>
                </div>
            </div>

            {/* ── MATCH ROW ────────────────────────────────── */}
            <div className="relative z-10 flex items-stretch justify-between px-5 py-5 gap-2">

                {/* Home team */}
                <div className="flex-1 flex flex-col items-center gap-2.5 min-w-0">
                    <div className={`
                        w-14 h-14 rounded-2xl flex items-center justify-center
                        ${inCart
                            ? 'bg-green-500/5'
                            : 'bg-gray-500/5 dark:bg-white/[0.07]'
                        }
                    `}>
                        <img src={teams.home.logo} alt={teams.home.name}
                            className="w-9 h-9 object-contain" />
                    </div>
                    <span className={`
                        text-xs font-bold text-center leading-snug w-full line-clamp-2
                        ${inCart ? 'text-green-600/90 dark:text-green-400' : 'text-gray-800 dark:text-white/90'}
                    `}>
                        {teams.home.name}
                    </span>
                </div>

                {/* VS chip */}
                <div className="flex flex-col self-center items-center shrink-0 gap-1.5 px-1">
                    <div className={`
                        w-11 h-11 rounded-full flex items-center justify-center
                        border-2 text-[11px] font-black tracking-tight
                        ${inCart
                            ? 'border-green-500/5 text-green-500/70 bg-green-500/10'
                            : 'border-gray-400/20 text-gray-400 dark:text-white/40 bg-gray-500/5'
                        }
                    `}>
                        VS
                    </div>
                    <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className={`w-1 h-1 rounded-full
                                ${inCart ? 'bg-green-200/60 dark:bg-green-500/40' : 'bg-gray-400/20'}`} />
                        ))}
                    </div>
                </div>

                {/* Away team */}
                <div className="flex-1 flex flex-col items-center gap-2.5 min-w-0">
                    <div className={`
                        w-14 h-14 rounded-2xl flex items-center justify-center
                        ${inCart
                            ? 'bg-green-500/5'
                            : 'bg-gray-500/5 dark:bg-white/[0.07]'
                        }
                    `}>
                        <img src={teams.away.logo} alt={teams.away.name}
                            className="w-9 h-9 object-contain" />
                    </div>
                    <span className={`
                        text-xs font-bold text-center leading-snug w-full line-clamp-2
                        ${inCart ? 'text-green-600/90 dark:text-green-400' : 'text-gray-800 dark:text-white/90'}
                    `}>
                        {teams.away.name}
                    </span>
                </div>
            </div>

            {/* ── ACTION STRIP ─────────────────────────────── */}
            <div className={`
                relative z-10 flex items-center justify-between gap-3 min-h-[52px]
                px-4 py-2.5
                border-t border-black/[0.05] dark:border-white/[0.06]
                transition-colors duration-300
                ${inCart
                    ? 'bg-green-500/[0.08]'
                    : 'bg-gray-400/5'
                }
            `}>

                {inCart ? (
                    /* ── In-cart: status on left ── */
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-500
                                        flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                                className="w-3 h-3 fill-white">
                                <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                            </svg>
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-xs font-bold text-green-500">Added to cart</span>
                            <span className="text-[10px] text-green-500/80">Tap to remove</span>
                        </div>
                    </div>
                ) : (
                    /* ── Default: nothing on the left (spacer) ── */
                    <div />
                )}

                {/* Right side: admin odds pill OR cart button */}
                <div className="flex items-center gap-2 shrink-0">

                    {/* Odds — admin only */}
                    {isAdminShown && (
                        <div className={`
                            flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-colors duration-300
                            ${inCart
                                ? 'bg-green-500 dark:bg-green-500/15 text-white dark:text-green-500 border-green-400 dark:border-green-500/25'
                                : 'bg-white dark:bg-white/[0.08] text-gray-600 dark:text-white/55 border-gray-200 dark:border-white/[0.12]'
                            }
                        `}>
                            <span className="text-[9px] font-semibold opacity-85 uppercase tracking-wide">
                                odds
                            </span>
                            <span className="font-extrabold">{formatNumber(fixture.odds)}</span>
                        </div>
                    )}

                    {/* Add/remove button */}
                    <button
                        type="button"
                        aria-label={inCart ? 'Remove from cart' : 'Add to cart'}
                        className={`
                            flex items-center justify-center gap-1.5 px-4 h-9 rounded-xl
                            text-xs font-bold border transition-colors duration-300 shrink-0
                            ${inCart
                                ? 'bg-red-500/20 text-red-500/90 border-red-500/45 hover:bg-red-500/25'
                                : 'bg-orange-500 hover:bg-orange-400 text-white shadow-sm shadow-orange-900/20 border-transparent'
                            }
                        `}
                    >
                        {inCart ? (
                            <>
                                {/* X icon */}
                                <svg viewBox="0 0 1024 1024" className="w-3.5 h-3.5 fill-current shrink-0">
                                    <path d="M1014.662 822.66l-310.644-310.65 310.644-310.65c3.344-3.346 5.762-7.254 7.312-11.416 4.246-11.376 1.824-24.682-7.324-33.83l-146.746-146.746c-9.148-9.146-22.45-11.566-33.828-7.32-4.16 1.55-8.07 3.968-11.418 7.31l-310.648 310.652-310.648-310.65c-3.346-3.342-7.254-5.76-11.414-7.31-11.38-4.248-24.682-1.826-33.83 7.32l-146.748 146.748c-9.148 9.148-11.568 22.452-7.322 33.828 1.552 4.16 3.97 8.072 7.312 11.416l310.65 310.648-310.65 310.652c-3.342 3.346-5.76 7.254-7.314 11.414-4.248 11.376-1.826 24.682 7.322 33.83l146.748 146.746c9.15 9.148 22.452 11.568 33.83 7.322 4.16-1.552 8.07-3.97 11.416-7.312l310.648-310.65 310.648 310.65c3.348 3.344 7.254 5.762 11.414 7.314 11.378 4.246 24.684 1.826 33.828-7.322l146.746-146.748c9.148-9.148 11.57-22.454 7.324-33.83-1.552-4.16-3.97-8.068-7.314-11.414z" />
                                </svg>
                                Remove
                            </>
                        ) : (
                            <>
                                {/* Cart + icon */}
                                <CartSvg size={15} />
                                Add
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* In-cart animated border */}
            <AnimatePresence>
                {inCart && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 rounded-2xl pointer-events-none
                                   ring-2 ring-green-500/50"
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default FixtureCountry;
