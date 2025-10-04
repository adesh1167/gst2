import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router'
import { setTAndCAccepted } from '../slices/dataReducer';

const Welcome = () => {

    const dispatch = useDispatch();

    return (
        <div className="notice-window fixed">
            <div className="blank-space " />
            <div className="notice-body">
                <div className="notice-title">Getting Started</div>
                <div className="notice-content">
                    <p>
                        Global Sports Trade is a prediction platform which uses Artificial
                        Intelligence to make accurate prediction of sport events.
                    </p>
                    <p>
                        All available predictions are listed on the homepage with their prices.
                    </p>
                    <ul>
                        <li>Select the matches you want</li>
                        <li>Make payment for them</li>
                        <li>Their selections will be revealed under <b>My Matches</b>.</li>
                    </ul>
                    <p />
                    <p>
                        You can then proceed to stake these matches on any betting site of your
                        choice.
                    </p>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline"
                        }}
                    >
                        <Link className="close-notice" to="/about">
                            Learn More
                        </Link>
                        <button onClick={()=>dispatch(setTAndCAccepted(true))} className="close-notice" style={{fontSize: 16}}>I Understand</button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Welcome
