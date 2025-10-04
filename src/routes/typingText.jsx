// TypingText.jsx
import React, { useEffect, useState, useRef } from "react";

/**
 * TypingText
 * props:
 *  - texts: string | string[]         (what to type; single or multiple)
 *  - typeSpeed: number                (ms per char typed)
 *  - deleteSpeed: number              (ms per char deleted)
 *  - pauseBetween: number             (ms pause after a full text)
 *  - loop: boolean                    (whether to cycle texts)
 *  - cursor: string                   (cursor character)
 */
export default function TypingText({
    texts = "Loading AI insights...",
    typeSpeed = 200,
    deleteSpeed = 80,
    pauseBetween = 1200,
    loop = true,
    cursor = "|",
    className = ""
}) {
    const list = Array.isArray(texts) ? texts : [texts];
    const [text, setText] = useState("");
    const [itemIndex, setItemIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (!mounted.current) return;

        const full = list[itemIndex] ?? "";
        const delta = isDeleting ? deleteSpeed : typeSpeed;

        const tick = () => {
            setText((prev) => {
                if (isDeleting) {
                    // remove one char
                    return full.substring(0, Math.max(0, prev.length - 1));
                } else {
                    // add one char
                    return full.substring(0, Math.min(full.length, prev.length + 1));
                }
            });
        };

        const t = setTimeout(() => {
            tick();

            // after updating, check next step
            setTimeout(() => {
                // if finished typing full text
                if (!isDeleting && text === full) {
                    // pause then start deleting (if we should delete)
                    if (loop || itemIndex < list.length - 1) {
                        // delay then switch to deleting
                        setTimeout(() => {
                            if (mounted.current) setIsDeleting(true);
                        }, pauseBetween);
                    }
                }

                // if finished deleting, advance to next text
                if (isDeleting && text === "") {
                    setIsDeleting(false);
                    setItemIndex((prev) => {
                        const next = prev + 1;
                        if (next >= list.length) return loop ? 0 : prev; // if not looping, stay on last
                        return next;
                    });
                }
            }, 0);
        }, delta);

        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, isDeleting, itemIndex, list, typeSpeed, deleteSpeed, pauseBetween, loop]);

    return (
        <span className={`inline-flex items-center gap-2 select-none ${className}`}>
            <span className="">&nbsp;{text}</span>
            <span
                aria-hidden
                style={{
                    // blinking cursor: fallback if no Tailwind animation present
                    animation: "blink 1s steps(2, start) infinite",
                }}
                className="text-purple-400 font-medium"
            >
                {cursor}
            </span>

            {/* small keyframes inserted so this component is standalone */}
            <style>{`
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
        </span>
    );
}
