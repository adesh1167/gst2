import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addItem, removeItem } from '../slices/cartReducer'
import { getFixtureDate } from '../functions/formatDate'

const FixtureCountry = ({ country }) => {

    return (
        <div className="dag-country">
            <div className="country-name">
                <img
                    alt="image"
                    src={country.flag || "assets/earth.svg"}
                    className="dag-image2"
                />
                <span className="dag-text11">{country.name}</span>
            </div>
            {Object.values(country.leagues).map(league =>
                <FixtureLeague key={league.name} league={league} />
            )}
        </div>
    )
}

function FixtureLeague({ league }) {

    // console.log("Here: ", league.fixtures)

    return (
        <div className="dag-league">
            <div className='dag-league-name'>
                <span className="dag-text12">{league.name}</span>
                <img
                    alt="image"
                    src={league.logo}
                    className="dag-league-logo"
                />
            </div>
            {Object.values(league.fixtures).map((fixture) =>
                <Fixture key={fixture.id} fixture={fixture} />
            )}
        </div>
    )
}

function Fixture({ fixture }) {

    const { country, factor } = useSelector(state => state.data);
    const cart = useSelector(state => state.cart.items);
    const [inCart, setInCart] = useState(false);
    const dispatch = useDispatch();

    // console.log(fixture);

    const teams = fixture.match_data.teams;

    useEffect(() => {
        setInCart(cart.find(item => item.id === fixture.id) || false)
    }, [cart])

    function addToCart() {
        // console.log("Added to cart: ", fixture)
        dispatch(addItem({
            home: teams.home.name,
            away: teams.away.name,
            price: fixture.price,
            game_type: fixture.game_type,
            odds: fixture.odds,
            id: fixture.id
        }))
    }

    function removeFromCart(){
        dispatch(removeItem(fixture.id))
    }

    return (
        <div className={`dag-match ${inCart ? "match-added" : ""}`}>
            <div className="dag-container11">
                <span>
                    {/* <span>{fixture.id}</span> */}
                    {/* <br /> */}
                    {/* <span>{fixture.selection}</span> */}
                    {/* <br /> */}
                    <span>{fixture.odds}</span>
                    {/* <br /> */}
                    <span>{country}</span>
                    <br />
                    <span>{fixture.price * (factor || 1)}</span>
                    {/* <br /> */}
                    {/* <span>{fixture.selection}</span>
                    <br /> */}
                </span>
            </div>
            <div className="dag-container12">
                <div
                    className="dag-container13"
                    style={{ flexDirection: "column" }}
                >
                    <div className="dag-container14">
                        <img
                            alt="image"
                            src={teams.home.logo}
                            className="dag-image2"
                        />
                        <span className="dag-text17">
                            <span>{teams.home.name}</span>
                            <br />
                        </span>
                    </div>
                    <div
                        className="dag-container15"
                        style={{ alignSelf: "flex-start" }}
                    >
                        <span className="dag-text21">
                            <span>{teams.away.name}</span>
                            <br />
                        </span>
                        <img
                            alt="image"
                            src={teams.away.logo}
                            className="dag-image3"
                        />
                    </div>
                </div>
                <div className="dag-container16">
                    <span>{getFixtureDate(fixture.match_data.fixture.date)}</span>
                    <span>Game Type: {fixture.game_type}</span>
                </div>
            </div>
            {inCart ?
                <div className="dag-container17 add-to-cart" onClick={removeFromCart}>
                    <svg viewBox="0 0 1024 1024" className="dag-icon4">
                        <path d="M1014.662 822.66c-0.004-0.004-0.008-0.008-0.012-0.010l-310.644-310.65 310.644-310.65c0.004-0.004 0.008-0.006 0.012-0.010 3.344-3.346 5.762-7.254 7.312-11.416 4.246-11.376 1.824-24.682-7.324-33.83l-146.746-146.746c-9.148-9.146-22.45-11.566-33.828-7.32-4.16 1.55-8.070 3.968-11.418 7.31 0 0.004-0.004 0.006-0.008 0.010l-310.648 310.652-310.648-310.65c-0.004-0.004-0.006-0.006-0.010-0.010-3.346-3.342-7.254-5.76-11.414-7.31-11.38-4.248-24.682-1.826-33.83 7.32l-146.748 146.748c-9.148 9.148-11.568 22.452-7.322 33.828 1.552 4.16 3.97 8.072 7.312 11.416 0.004 0.002 0.006 0.006 0.010 0.010l310.65 310.648-310.65 310.652c-0.002 0.004-0.006 0.006-0.008 0.010-3.342 3.346-5.76 7.254-7.314 11.414-4.248 11.376-1.826 24.682 7.322 33.83l146.748 146.746c9.15 9.148 22.452 11.568 33.83 7.322 4.16-1.552 8.070-3.97 11.416-7.312 0.002-0.004 0.006-0.006 0.010-0.010l310.648-310.65 310.648 310.65c0.004 0.002 0.008 0.006 0.012 0.008 3.348 3.344 7.254 5.762 11.414 7.314 11.378 4.246 24.684 1.826 33.828-7.322l146.746-146.748c9.148-9.148 11.57-22.454 7.324-33.83-1.552-4.16-3.97-8.068-7.314-11.414z" />
                    </svg>
                </div>
                :
                <div className="dag-container17 add-to-cart" onClick={addToCart}>
                    <svg viewBox="0 0 1024 1024" className="dag-icon4">
                        <path d="M306 630q0 10 10 10h494v86h-512q-34 0-59-26t-25-60q0-20 10-40l58-106-154-324h-86v-84h140q40 84 80 170 10 18 46 95t56 119h300q150-272 164-300l74 42-164 298q-24 44-74 44h-318l-38 70zM726 768q34 0 59 26t25 60-25 59-59 25-60-25-26-59 26-60 60-26zM298 768q34 0 60 26t26 60-26 59-60 25-59-25-25-59 25-60 59-26zM470 384v-128h-128v-86h128v-128h84v128h128v86h-128v128h-84z" />
                    </svg>
                </div>
            }
        </div>
    )
}

export default FixtureCountry
