import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import { useModal } from '../hooks/useModal';
import SelectCountry from '../routes/selectCountry';
import SelectCurrency from '../routes/selectCurrency';
import MainCart from './mainCart';
import ManualPayment from './manualPayment';
import Welcome from './welcome';

/**
 * GlobalModals renders all overlay modals centrally based on query parameters (?modal=...&sub=...).
 * This separates modals completely from regular direct route paths and allows stacked submodals.
 */
const GlobalModals = () => {
    const { modal, sub, searchParams } = useModal();
    const { country, currency, continent, tAndCAccepted } = useSelector((state) => state.data);
    const { pathname, state: locationState } = useLocation();

    const isAfrica = continent === 'AF';
    const isCountrySelected = Boolean((isAfrica && country) || (!isAfrica && currency));

    const showCountryModal = modal === 'country' || modal === 'change-country';
    const showCartModal = modal === 'cart';
    const showManualPayment = sub === 'manual-payment' || modal === 'manual-payment';
    const showWelcome = (!tAndCAccepted && pathname !== '/about') || modal === 'welcome';

    return (
        <AnimatePresence mode="sync">
            {/* 1. Terms & Conditions / Welcome Modal */}
            {showWelcome && <Welcome key="welcome-modal" />}

            {/* 2. Country / Currency Selector Modal */}
            {showCountryModal && (
                isAfrica ? (
                    <SelectCountry key="country-modal" exitable={isCountrySelected} />
                ) : (
                    <SelectCurrency key="currency-modal" exitable={isCountrySelected} />
                )
            )}

            {/* 3. Mobile/Tablet Cart Slide-Over */}
            {showCartModal && (
                <div key="cart-modal" className="block lg:hidden">
                    <MainCart />
                </div>
            )}

            {/* 4. Manual Payment Modal (renders on top of cart if sub === 'manual-payment' or as standalone modal) */}
            {showManualPayment && (
                <ManualPayment
                    key="manual-payment-modal"
                    type={locationState?.type || searchParams.get('type') || 'matches'}
                    amount={locationState?.amount ?? (searchParams.get('amount') ? Number(searchParams.get('amount')) : undefined)}
                    duration={locationState?.duration || searchParams.get('duration') || undefined}
                />
            )}
        </AnimatePresence>
    );
};

export default GlobalModals;
