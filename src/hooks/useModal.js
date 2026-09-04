import { useSearchParams, useNavigate } from 'react-router';
import { useCallback } from 'react';
import { getDepth } from '../services/navigationDepth';

/**
 * Universal hook for managing modal overlays via URL query parameters (?modal=...&sub=...).
 * Keeps underlying page routes, scroll positions, and state intact.
 * Uses session navigation depth tracking to safely navigate(-1) within the app
 * and fallback to navigate('/', { replace: true }) if no in-app history exists.
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
        return getDepth() > 0;
    }, []);

    const closeSubModal = useCallback(() => {
        if (canGoBack()) {
            navigate(-1);
        } else {
            navigate('/', { replace: true });
        }
    }, [canGoBack, navigate]);

    const closeModal = useCallback(() => {
        if (canGoBack()) {
            navigate(-1);
        } else {
            navigate('/', { replace: true });
        }
    }, [canGoBack, navigate]);

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
