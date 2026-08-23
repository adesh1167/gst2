import { useDispatch, useSelector } from 'react-redux'
import React from 'react'
import { removeItem } from '../slices/cartReducer'
import formatNumber from '../functions/formatNumber'

const CartItem = ({ item }) => {
    const { factor, country } = useSelector(state => state.data);
    const dispatch = useDispatch();

    return (
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 w-full mb-2">
            {/* Item details */}
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl
                            bg-white/8 border border-black/10 dark:border-white/10 hover:border-orange-500/30 dark:hover:border-orange-500/30
                            transition-colors overflow-hidden">
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex flex-col overflow-hidden mb-1">
                        <span className="font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                            {item.home}
                        </span>
                        {/* <span className="text-black/60 dark:text-white/60 text-[10px] text-center leading-none">v</span> */}
                        <div className="h-[1.5px] my-2 w-full bg-gradient-to-r from-transparent via-gray-500/20 to-transparent" />
                        <span className="font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                            {item.away}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col justify-between items-end self-stretch">
                    <span className="text-sm font-semibold shrink-0 sans">
                        {country} {formatNumber(item.price * factor, 0, 0)}
                    </span>
                    <span className="text-black/60 dark:text-white/60 text-xs pb-1.5">{item.game_type}</span>

                </div>
            </div>

            {/* Remove button */}
            <button
                onClick={() => dispatch(removeItem(item.id))}
                className="shrink-0 text-red-400 hover:text-red-300 transition-colors p-1"
                aria-label="Remove item"
            >
                <svg viewBox="0 0 1024 1024" className="w-5 h-5 fill-current">
                    <path d="M512 0c-282.77 0-512 229.23-512 512s229.23 512 512 512 512-229.23 512-512-229.23-512-512-512zM512 928c-229.75 0-416-186.25-416-416s186.25-416 416-416 416 186.25 416 416-186.25 416-416 416z" />
                    <path d="M672 256l-160 160-160-160-96 96 160 160-160 160 96 96 160-160 160 160 96-96-160-160 160-160z" />
                </svg>
            </button>
        </div>
    );
};

export default CartItem;
