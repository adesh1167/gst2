import React from 'react';
import { Check } from 'lucide-react';

const Tick = ({ checked, width = 18, height = 18, className = "" }) => {

    console.log("Tick component rendered with checked:", checked,);
    return (
        <div
            className="flex items-center justify-center rounded-sm border border-current shrink-0 select-none"
            style={{
                width: width,
                height: height,
            }}
        >
            {/* {checked.toString()} */}
            {checked && (
                <Check
                    className={className}
                    width={width - 4}
                    height={height - 4}
                    strokeWidth={3}
                    stroke="currentColor"
                />
            )}
        </div>
    );
};

export default Tick;
