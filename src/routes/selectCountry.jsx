import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { baseApiUrl } from '../data/url';
import { useDispatch } from 'react-redux';
import { setCountry, setFactor } from '../slices/dataReducer';
import { useLocation, useNavigate } from 'react-router';

const SelectCountry = ({exitable = true}) => {

    const [localCountry, setLocalCountry] = useState(null);
    const {pathname} = useLocation();
    const navigate = useNavigate();

    const dispatch = useDispatch();

    function handleSubmit(e) {
        e.preventDefault();
        console.log(localCountry);

        axios({
            url: `${baseApiUrl}/update-country.php`,
            method: "POST",
            data: {
                country: localCountry
            },
        }).then(res=>{
            console.log(res.data);
            if(res.data.status === "success"){
                console.log("Country Updated");
                if(pathname !== "/country"){
                    navigate(-1);
                }
                dispatch(setCountry(res.data.country))
                dispatch(setFactor(res.data.factor))
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    useEffect(()=>{
        console.log("Country Changed: ", localCountry);
    }, [localCountry])

    return (
        <div className="choose-country-window">
            <div className="blank-space" onClick={exitable ? ()=>navigate(-1) : ()=>{}}/>
            <div className="choose-country-body">
                <div className="choose-country-title">Select Your Country</div>
                <form className="choose-country-form" id="chooseCountryForm" onSubmit={handleSubmit}>
                    <div className="country-input-group">
                        <input
                            type="radio"
                            name="country"
                            id="countryGH"
                            required=""
                            checked={localCountry === "GHS"}
                        />
                        <label htmlFor="countryGH" onClick={()=>{setLocalCountry("GHS")}}>Ghana</label>
                    </div>
                    <div className="country-input-group">
                        <input
                            type="radio"
                            name="country"
                            id="countryZM"
                            checked={localCountry === "ZMW"}
                        />
                        <label htmlFor="countryZM" onClick={()=>{setLocalCountry("ZMW")}}>Zambia</label>
                    </div>
                    <div className="country-input-group">
                        <input
                            type="radio"
                            name="country"
                            id="countryUG"
                            checked={localCountry === "UGX"}
                        />
                        <label htmlFor="countryUG" onClick={()=>{setLocalCountry("UGX")}}>Uganda</label>
                    </div>
                    <div className="country-input-group">
                        <input
                            type="radio"
                            name="country"
                            id="countryNG"
                            checked={localCountry === "NGN"}
                        />
                        <label htmlFor="countryNG" onClick={()=>{setLocalCountry("NGN")}}>Nigeria</label>
                    </div>
                    <div className="country-input-group">
                        <input
                            type="radio"
                            name="country"
                            id="countryMW"
                            checked={localCountry === "MWK"}
                        />
                        <label htmlFor="countryMW" onClick={()=>{setLocalCountry("MWK")}}>Malawi</label>
                    </div>
                    <div className="country-input-group">
                        <input
                            type="radio"
                            name="country"
                            id="countrySA"
                            checked={localCountry === "ZAR"}
                        />
                        <label htmlFor="countrySA" onClick={()=>{setLocalCountry("ZAR")}}>South Africa</label>
                    </div>
                    <button type="submit" id="countrySubmitButton">
                        Update
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
