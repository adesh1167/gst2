import React from 'react'

const Switch = ({on, switching = false, style, toggle}) => {
    return (
        <div onClick={toggle} className={`switch ${((on && switching) || (!on && !switching)) ? "" : "on"}`} />
    )
}

export default Switch
