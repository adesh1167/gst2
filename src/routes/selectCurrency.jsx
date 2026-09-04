import axios from 'axios';
import React, { useState } from 'react';
import { baseApiUrl } from '../data/url';
import { useDispatch } from 'react-redux';
import { setCountry, setCurrency, setFactor } from '../slices/dataReducer';
import LoadingButton from '../components/loadingButton';
import { showToast } from '../slices/toastsReducer';
import ModalWrapper from '../components/modalWrapper';
import { Coins, Check } from 'lucide-react';
import { useModal } from '../hooks/useModal';

const CURRENCIES = [
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'GBP', name: 'GB Pound', symbol: '£' },
];

const SelectCurrency = ({ exitable = true }) => {
    const [localCurrency, setLocalCurrency] = useState(null);
    const [loading, setLoading] = useState(false);

    const { closeModal } = useModal();
    const dispatch = useDispatch();

    function handleSubmit(e) {
        e.preventDefault();

        if (!localCurrency) {
            dispatch(showToast({
                message: 'Please select a currency',
                type: 'warning',
                duration: 3000
            }));
            return;
        }
        setLoading(true);

        axios({
            url: `${baseApiUrl}/update-currency.php`,
            method: 'POST',
            data: { currency: localCurrency },
        }).then(res => {
            if (res.data.status === 'success') {
                dispatch(showToast({
                    message: 'Currency updated successfully',
                    type: 'success',
                    duration: 3000
                }));
                if (exitable) {
                    closeModal();
                }
                dispatch(setCurrency(res.data.currency));
                dispatch(setCountry(res.data.currency));
                dispatch(setFactor(res.data.factor));
            } else {
                dispatch(showToast({
                    message: res.data.message || 'Failed to update currency',
                    type: 'error',
                    duration: 3000
                }));
            }
        }).catch(err => {
            dispatch(showToast({
                message: 'An error occurred, check your network and try again',
                type: 'error',
                duration: 3000
            }));
            console.error(err);
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <ModalWrapper
            exitable={exitable}
            onClose={closeModal}
            title="Select Your Currency"
            subtitle="Choose currency for billing & checkout"
            icon={Coins}
        >
            <form onSubmit={loading ? e => e.preventDefault() : handleSubmit} className="flex flex-col flex-1 overflow-hidden p-6 space-y-4">
                <div className="space-y-2.5">
                    {CURRENCIES.map(currency => {
                        const isSelected = localCurrency === currency.code;
                        return (
                            <button
                                key={currency.code}
                                type="button"
                                onClick={() => setLocalCurrency(currency.code)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${isSelected
                                        ? 'border-orange-500 bg-orange-500/10 dark:bg-orange-500/15 shadow-sm shadow-orange-500/20'
                                        : 'border-black/10 dark:border-white/10 hover:border-orange-500/40 bg-black/[0.02] dark:bg-white/[0.02]'
                                    }`}
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400 font-bold text-lg flex items-center justify-center font-mono">
                                        {currency.symbol}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {currency.name}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                            {currency.code}
                                        </div>
                                    </div>
                                </div>

                                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${isSelected
                                        ? 'border-orange-500 bg-orange-500 text-white'
                                        : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                >
                                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl font-bold text-md text-white
                               bg-gradient-to-r from-orange-600 to-orange-500
                               hover:from-orange-500 hover:to-orange-400
                               active:scale-[0.99] transition-all
                               shadow-sm hover:shadow disabled:opacity-60"
                >
                    <LoadingButton size={22} color="#fff" loading={loading}>
                        Update Currency
                    </LoadingButton>
                </button>

                <p className="text-center text-xs text-gray-500 dark:text-gray-400 leading-relaxed px-2">
                    These are the available currencies in your region for now.
                </p>
            </form>
        </ModalWrapper>
    );
};

export default SelectCurrency;
