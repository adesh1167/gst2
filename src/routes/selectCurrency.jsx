import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { baseApiUrl } from '../data/url';
import { useDispatch } from 'react-redux';
import { setCountry, setCurrency, setFactor } from '../slices/dataReducer';
import { useLocation, useNavigate } from 'react-router';
import Loading from '../components/loading';
import LoadingButton from '../components/loadingButton';
import { showToast } from '../slices/toastsReducer';

const SelectCurrency = ({ exitable = true }) => {

    const [localCountry, setLocalCountry] = useState(null);
    const [loading, setLoading] = useState(false);

    const { pathname } = useLocation();
    const navigate = useNavigate();

    const dispatch = useDispatch();

    function handleSubmit(e) {
        e.preventDefault();
        // console.log(localCountry);

        if (!localCountry) {
            dispatch(showToast({
                message: "Select Currency",
                type: "warning",
                duration: 3000
            }))
            return;
        }
        setLoading(true);

        axios({
            url: `${baseApiUrl}/update-currency.php`,
            method: "POST",
            data: {
                currency: localCountry
            },
        }).then(res => {
            // console.log(res.data);
            if (res.data.status === "success") {
                dispatch(showToast({
                    message: "Currency Updated",
                    type: "success",
                    duration: 2000
                }))
                // if (pathname !== "/country") {
                    navigate(-1);
                // }
                dispatch(setCurrency(res.data.currency))
                dispatch(setCountry(res.data.currency))
                dispatch(setFactor(res.data.factor))
            } else{
                dispatch(showToast({
                    message: res.data.message,
                    type: "error",
                    duration: 3000
                }))
            }
        }).catch(err => {
            dispatch(showToast({
                message: "An error occurred, check your network and try again",
                type: "error",
                duration: 3000
            }))
            console.log(err);
        }).finally(() => {
            setLoading(false);
        })
    }

    useEffect(() => {
        console.log("Country Changed: ", localCountry);
    }, [localCountry])

    // console.log(localCountry);

    return (
        <div className="choose-country-window fixed">
            <div className="blank-space" onClick={exitable ? () => navigate(-1) : () => { }} />
            <div className="choose-country-body">
                <div className="choose-country-title">Select Your Currency</div>
                <form className="choose-country-form" id="chooseCountryForm" onSubmit={loading ? e=>e.preventDefault() : handleSubmit}>
                    <div className="country-input-group">
                        <input
                            type="radio"
                            name="country"
                            id="countryGH"
                            required=""
                            checked={localCountry === "EUR"}
                        />
                        <label htmlFor="countryGH" onClick={() => { setLocalCountry("EUR") }}>Euro</label>
                    </div>
                    <div className="country-input-group">
                        <input
                            type="radio"
                            name="country"
                            id="countryZM"
                            checked={localCountry === "USD"}
                        />
                        <label htmlFor="countryZM" onClick={() => { setLocalCountry("USD") }}>US Dollar</label>
                    </div>
                    <div className="country-input-group">
                        <input
                            type="radio"
                            name="country"
                            id="countryUG"
                            checked={localCountry === "GBP"}
                        />
                        <label htmlFor="countryUG" onClick={() => { setLocalCountry("GBP") }}>GB Pound</label>
                    </div>
                    <button type="submit" id="countrySubmitButton">
                        <LoadingButton width={18} height={18} color='#fff' loading={loading}>Update</LoadingButton>

                    </button>
                    <div className="choose-country-description">
                        These are the only available currencies in your region for now. If your
                        currency is not here, we are coming soon.
                    </div>
                </form>
            </div>
        </div>

    )
}

export default SelectCurrency;
