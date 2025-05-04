import { useDispatch } from 'react-redux'
import React from 'react'
import { useSelector } from 'react-redux'
import { removeItem } from '../slices/cartReducer'
import formatNumber from '../functions/formatNumber'

const CartItem = ({item}) => {

    const {factor, country} = useSelector(state => state.data)

    const dispatch = useDispatch();

    function removeFromCart(){
        dispatch(removeItem(item.id))
    }

    return (
        <div className="cart-item cart-container06">
            <div className="cart-container07">
                <div className="cart-container08">
                    <div className="cart-container09">
                        <span className="cart-item-team">{item.home}</span>
                        <span className="cart-text05">v</span>
                        <span className="cart-item-team">{item.away}</span>
                    </div>
                </div>
                <div className="cart-container10">
                    <span className="cart-text11">{item.game_type}</span>
                </div>
                <div className="cart-container11">
                    <span>{country} {formatNumber(item.price * factor)}</span>
                </div>
            </div>
            <div className="cart-container12 delete-item" onClick={removeFromCart}>
                <svg viewBox="0 0 1024 1024" className="cart-icon03">
                    <path d="M512 0c-282.77 0-512 229.23-512 512s229.23 512 512 512 512-229.23 512-512-229.23-512-512-512zM512 928c-229.75 0-416-186.25-416-416s186.25-416 416-416 416 186.25 416 416-186.25 416-416 416z" />
                    <path d="M672 256l-160 160-160-160-96 96 160 160-160 160 96 96 160-160 160 160 96-96-160-160 160-160z" />
                </svg>
            </div>
        </div>
    )
}

export default CartItem;
