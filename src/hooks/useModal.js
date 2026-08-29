import { useSearchParams, useNavigate } from 'react-router';
import { useCallback } from 'react';

/**
 * Universal hook for managing modal overlays via URL query parameters (?modal=...&sub=...).
 * Keeps underlying page routes, scroll positions, and state intact.
 * Uses history-aware navigate(-1) on close with fallback when history is nonexistent.
 */
export function useModal() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const modal = searchParams.get('modal');
    const sub = searchParams.get('sub');

    const openModal = useCallback((modalName, extraParams = {}, state = undefined) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set('modal', modalName);
            Object.entries(extraParams).forEach(([k, v]) => {
                if (v !== undefined && v !== null && v !== '') {
                    next.set(k, String(v));
                }
            });
            return next;
        }, { state });
    }, [setSearchParams]);

    const openSubModal = useCallback((subName, extraParams = {}, state = undefined) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set('sub', subName);
            Object.entries(extraParams).forEach(([k, v]) => {
                if (v !== undefined && v !== null && v !== '') {
                    next.set(k, String(v));
                }
            });
            return next;
        }, { state });
    }, [setSearchParams]);

    const canGoBack = useCallback(() => {
        return window.history.state && typeof window.history.state.idx === 'number' && window.history.state.idx > 0;
    }, []);

    const closeSubModal = useCallback(() => {
        if (canGoBack()) {
            navigate(-1);
        } else {
            setSearchParams(prev => {
                const next = new URLSearchParams(prev);
                next.delete('sub');
                return next;
            }, { replace: true });
        }
    }, [canGoBack, navigate, setSearchParams]);

    const closeModal = useCallback(() => {
        if (canGoBack()) {
            navigate(-1);
        } else {
            setSearchParams(prev => {
                const next = new URLSearchParams(prev);
                next.delete('modal');
                next.delete('sub');
                next.delete('type');
                next.delete('amount');
                next.delete('duration');
                next.delete('tier');
                return next;
            }, { replace: true });
        }
    }, [canGoBack, navigate, setSearchParams]);

    return {
        modal,
        sub,
        isOpen: (name) => modal === name || sub === name,
        openModal,
        openSubModal,
        closeSubModal,
        closeModal,
        searchParams,
    };
}
