import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { baseApiUrl } from '../data/url';
import { useDispatch } from 'react-redux';
import { setCountry, setFactor } from '../slices/dataReducer';
import { useLocation, useNavigate } from 'react-router';
import Loading from '../components/loading';
import LoadingButton from '../components/loadingButton';
import { showToast } from '../slices/toastsReducer';

const SelectCountry = ({ exitable = true }) => {

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
                message: "Select Country",
                type: "warning",
                duration: 3000
            }))
            return;
        }
        setLoading(true);

        axios({
            url: `${baseApiUrl}/update-country.php`,
            method: "POST",
            data: {
                country: localCountry
            },
        }).then(res => {
            // console.log(res.data);
            if (res.data.status === "success") {
                dispatch(showToast({
                    message: "Country Updated",
                    type: "success",
                    duration: 2000
                }))
                if (pathname !== "/country") {
                    navigate(-1);
                }
                dispatch(setCountry(res.data.country))
                dispatch(setFactor(res.data.factor))
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
        <div className="choose-country-window">
            <div className="blank-space" onClick={exitable ? () => navigate(-1) : () => { }} />
            <div className="choose-country-body">
                <div className="choose-country-title">Select Your Country</div>
                <form className="choose-country-form" id="chooseCountryForm" onSubmit={loading ? e=>e.preventDefault() : handleSubmit}>
                    <div className="country-input-group">
                        <input
                            type="radio"
                            name="country"
                            id="countryGH"
                            required=""
                            checked={localCountry === "GHS"}
                        />
                        <label htmlFor="countryGH" onClick={() => { setLocalCountry("GHS") }}>Ghana</label>
                    </div>
                    <div className="country-input-group">
                        <input
                            type="radio"
                            name="country"
                            id="countryZM"
                            checked={localCountry === "ZMW"}
                        />
                        <label htmlFor="countryZM" onClick={() => { setLocalCountry("ZMW") }}>Zambia</label>
                    </div>
                    <div className="country-input-group">
                        <input
                            type="radio"
                            name="country"
                            id="countryUG"
                            checked={localCountry === "UGX"}
                        />
                        <label htmlFor="countryUG" onClick={() => { setLocalCountry("UGX") }}>Uganda</label>
                    </div>
                    <div className="country-input-group">
                        <input
                            type="radio"
                            name="country"
                            id="countryNG"
                            checked={localCountry === "NGN"}
                        />
                        <label htmlFor="countryNG" onClick={() => { setLocalCountry("NGN") }}>Nigeria</label>
                    </div>
                    <div className="country-input-group">
                        <input
                            type="radio"
                            name="country"
                            id="countryMW"
                            checked={localCountry === "MWK"}
                        />
                        <label htmlFor="countryMW" onClick={() => { setLocalCountry("MWK") }}>Malawi</label>
                    </div>
                    <div className="country-input-group">
                        <input
                            type="radio"
                            name="country"
                            id="countrySA"
                            checked={localCountry === "ZAR"}
                        />
                        <label htmlFor="countrySA" onClick={() => { setLocalCountry("ZAR") }}>South Africa</label>
                    </div>
                    <button type="submit" id="countrySubmitButton">
                        <LoadingButton width={18} height={18} color='#fff' loading={loading}>Update</LoadingButton>

                    </button>
                    <div className="choose-country-description">
                        These are the only available countries in your region for now. If your
                        country is not here, we are coming soon.
                    </div>
                </form>
            </div>
        </div>

    )
}

export default SelectCountry;
