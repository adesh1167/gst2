import React from 'react'

/**
 * Switch – used for admin/user dashboard toggle in the menu.
 * Props: on (bool), switching (bool), toggle (fn)
 */
const Switch = ({ on, switching = false, toggle }) => {
    const isOn = (on && switching) || (!on && !switching) ? false : true;

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isOn}
            onClick={toggle}
            className={`relative inline-flex items-center w-9 h-5 rounded-full border-2 transition-all duration-[0.4s] cursor-pointer ml-2 focus:outline-none
                ${isOn
                    ? 'border-green-500 shadow-[0_0_6px_0_rgba(0,200,0,0.4)]'
                    : 'border-gray-500 dark:border-gray-500'
                }`}
        >
            <span
                className={`absolute w-3 h-3 rounded-full transition-all duration-[0.4s]
                    ${isOn
                        ? 'left-[17px] bg-green-500'
                        : 'left-[2px] bg-gray-500 dark:bg-gray-400'
                    }`}
            />
        </button>
    );
};

export default Switch;
