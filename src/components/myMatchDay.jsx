import React from 'react'
import formatNumber from '../functions/formatNumber'

const MyMatchDay = ({ day }) => {
    return (
        <div className="slip">
            <div className="my-matches-container07">
                <span>Matches bought on May 02 2025</span>
            </div>
            {day.matches.map((item, index) => (
                <MyMatchItem key={index} item={item} />
            ))}
        </div>
    )
}

const MyMatchItem = ({ item }) => {
    return (
        <div className="my-matches-container08 match">
            <div className="my-matches-container09">
                <div className="my-matches-container10">
                    <div className="my-matches-container11">
                        <span className="team-name">{item.home}</span>
                    </div>
                    <span className="match-demacator">v</span>
                    <div className="my-matches-container12">
                        <span className="team-name">{item.away}</span>
                    </div>
                </div>
                <div className="my-matches-container13">
                    <span className="league-name">
                        {item.league}
                    </span>
                    <span className="league-demacator">|</span>
                    <span>{item.country}</span>
                </div>
                <div className="my-matches-container14">
                    <span>
                        Type: <span>{item.gameType}</span>
                    </span>
                </div>
            </div>
            <div className="my-matches-container15">
                <div className="my-matches-container16">
                    <span className="my-matches-text15">Selection</span>
                    <span className="my-matches-text16">{item.selection}</span>
                </div>
                <div className="my-matches-container17">
                    <span className="my-matches-text17">odds:</span>
                    <span className="my-matches-text18">{formatNumber(item.odds)}</span>
                </div>
            </div>
        </div>
    )
}

export default MyMatchDay
