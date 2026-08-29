import { useSelector } from 'react-redux';

/**
 * Returns a stable boolean indicating whether the current user
 * is viewing the admin dashboard. Centralises the isAdmin check
 * so it isn't duplicated across Fixtures / FixtureCountry.
 */
export function useIsAdmin() {
    return useSelector(
        state => state.user.isAdmin && state.user.dashboard === 'admin'
    );
}
