/**
 * In-memory session navigation depth tracker.
 * Tracks internal PUSH / POP navigations within the SPA session.
 * Ensures modals can use navigate(-1) to cleanly pop history without ever
 * exiting to external websites (e.g. Google).
 */
let depth = 0;

export const incrementDepth = () => {
    depth += 1;
};

export const decrementDepth = () => {
    depth = Math.max(0, depth - 1);
};

export const getDepth = () => depth;

export const resetDepth = () => {
    depth = 0;
};

