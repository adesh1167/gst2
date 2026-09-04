import axios from 'axios';
import React, { useMemo, useState } from 'react';
import { baseApiUrl } from '../data/url';
import { useDispatch, useSelector } from 'react-redux';
import { setCountry, setFactor } from '../slices/dataReducer';
import LoadingButton from '../components/loadingButton';
import { showToast } from '../slices/toastsReducer';
import ModalWrapper from '../components/modalWrapper';
import { Globe, Check } from 'lucide-react';
import { countries } from '../data/countries';
import { useModal } from '../hooks/useModal';

const SelectCountry = ({ exitable = true }) => {
    const country = useSelector(state => state.data.country);
    const [localCountry, setLocalCountry] = useState(country);
    const [loading, setLoading] = useState(false);
    const countriesList = useMemo(() => Object.values(countries), []);

    const { closeModal } = useModal();
    const dispatch = useDispatch();

    function handleSubmit(e) {
        e.preventDefault();

        if (!localCountry) {
            dispatch(showToast({
                message: 'Please select a country',
                type: 'warning',
                duration: 3000
            }));
            return;
        }
        setLoading(true);

        axios({
            url: `${baseApiUrl}/update-country.php`,
            method: 'POST',
            data: { country: localCountry },
        }).then(res => {
            if (res.data.status === 'success') {
                dispatch(showToast({
                    message: 'Country updated successfully',
                    type: 'success',
                    duration: 3000
                }));
                if(exitable){
                    closeModal();
                }
                dispatch(setCountry(res.data.country));
                dispatch(setFactor(res.data.factor));
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
            title="Select Your Country"
            subtitle="Choose your region for local currency & odds"
            icon={Globe}
        >
            <form onSubmit={loading ? e => e.preventDefault() : handleSubmit} className="flex flex-col flex-1 overflow-hidden p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
                    {countriesList.map(country => {
                        const isSelected = localCountry === country.code;
                        return (
                            <button
                                key={country.code}
                                type="button"
                                onClick={() => setLocalCountry(country.code)}
                                className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                                    isSelected
                                        ? 'border-orange-500 bg-orange-500/10 dark:bg-orange-500/15 shadow-sm shadow-orange-500/20'
                                        : 'border-black/10 dark:border-white/10 hover:border-orange-500/40 bg-black/[0.02] dark:bg-white/[0.02]'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <img
                                        src={`https://flagcdn.com/w40/${country.symbol.toLowerCase()}.png`}
                                        srcSet={`https://flagcdn.com/w80/${country.symbol.toLowerCase()}.png 2x`}
                                        alt={country.name}
                                        className="w-8 h-6 rounded-sm object-cover"
                                        loading="lazy"
                                    />
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {country.name}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                            {country.code}
                                        </div>
                                    </div>
                                </div>

                                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                                    isSelected
                                        ? 'border-orange-500 bg-orange-500 text-white'
                                        : 'border-gray-300 dark:border-gray-600'
                                }`}>
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
                        Update Country
                    </LoadingButton>
                </button>

                <p className="text-center text-xs text-gray-500 dark:text-gray-400 leading-relaxed px-2">
                    These are the available countries in your region. More regions will be supported soon.
                </p>
            </form>
        </ModalWrapper>
    );
};

export default SelectCountry;
