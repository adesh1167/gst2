

import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FixtureCountry from './fixtureCountry';
import axios from 'axios';
import { baseApiUrl } from '../data/url';
import { setFixtures, setFixturesLoaded } from '../slices/fixturesReducer';
import Loading from './loading';
import { useNavigationType } from 'react-router';

const Fixtures = () => {

  const { fixtures, fixturesLoaded } = useSelector(state => state.fixtures);
  const [error, setError] = useState(null);
  const navType = useNavigationType();
  const [firstLoad, setFirstLoad] = useState(fixturesLoaded && navType !== "PUSH");

  const dispatch = useDispatch();

  useEffect(() => {
    if(firstLoad) return;
    fecthFixtures();
  }, [])

  function fecthFixtures(){
    axios({
      url: `${baseApiUrl}/get-matches.php`,
      method: "GET",
    }).then((res) => {
      console.log(res.data);
      // if(res.status === "success"){
      if (error) setError(null)
      dispatch(setFixtures(res.data.matches))
      // } else {
      //   console.log("Error fetching fixtures");
      // }
    }).catch((err) => {
      console.log(err);
      setError("Please check your network and reload")
    }).finally(() => {
      setFirstLoad(true);
      if(!fixturesLoaded) dispatch(setFixturesLoaded(true))
    })
  }

  const fixturesLength = useMemo(() =>
    Object.values(fixtures).length
    , [fixtures])

  console.log("Fixtures: ", fixtures);

  return (
    <div className="dag-container07">
      <div className="dag-container08" />
      <div className="dag-container09">
        {(!firstLoad || fixturesLength > 0) &&
          <span className="dag-text10">
            Available Predictions<span id="predictionsCount">
              {(firstLoad && fixturesLength > 0) && `(${fixturesLength})`}
            </span>
          </span>}
        <div className="dag-container10" id="countriesContainer">
          {error ?
            <div
              className='home-message'
            >
              <div style={{ fontWeight: "bold" }}>Unable To Load Predictions</div>
              <div style={{ marginTop: 15 }}>
                Please reload or contact us via email if problem persists
              </div>
            </div>
            :
            firstLoad ?
              Object.values(fixtures).length > 0 ?
                <>
                  <FixtureCountry country={Object.values(fixtures)[0]} />
                  <div className="banner">
                    <div className="banner-cont">
                      <h2>Welcome to GST</h2>
                      <div className="">
                        <p> Every game is at least 2 odds </p>
                        <p> Assurance is 99.99+ </p>
                        <p> All games are predicted using AI </p>
                      </div>
                    </div>
                    <a className="banner-button" href="about.html">
                      Learn More
                    </a>
                  </div>
                  {Object.values(fixtures).filter((d, i) => i > 0).map((country, index) => (
                    <FixtureCountry key={index} country={country} />
                  ))}
                </>
                :
                <div
                  className='home-message'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM159.3 388.7c-2.6 8.4-11.6 13.2-20 10.5s-13.2-11.6-10.5-20C145.2 326.1 196.3 288 256 288s110.8 38.1 127.3 91.3c2.6 8.4-2.1 17.4-10.5 20s-17.4-2.1-20-10.5C340.5 349.4 302.1 320 256 320s-84.5 29.4-96.7 68.7zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                  </svg>

                  <div style={{ fontWeight: "bold" }}>No Prediction Online</div>
                  <div style={{ marginTop: 15 }}>
                    Contact your local agent for exclusive fixtures today
                  </div>
                </div>


              :
              <div className="main-loading">
                <Loading />
              </div>
          }
        </div>
        <footer className='home-footer'>
          <div className="dag-container02">
            <img alt="image" src="/assets/logo.png" className="dag-image" />
            <span className="dag-text">
              <span>GST</span>
            </span>
          </div>
          <div className="footer-text">
            <span>Gamble Responsibly</span>
            <span> | </span>
            <span>18+ Legal Betting</span>
          </div>
        </footer>
      </div>
    </div>

  )
}

export default Fixtures
