

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FixtureCountry from './fixtureCountry';
import axios from 'axios';
import { baseApiUrl } from '../data/url';
import { setFixtures, setFixturesLoaded } from '../slices/fixturesReducer';
import Loading from './loading';
import { Link, useNavigationType } from 'react-router';

const Fixtures = () => {

  const { fixtures, fixturesLoaded } = useSelector(state => state.fixtures);
  const { user, isAdmin, dashboard } = useSelector(state => state.user);
  const isAdminShown = isAdmin && dashboard === "admin" ? true : false;
  const [error, setError] = useState(null);
  const navType = useNavigationType();
  const [firstLoad, setFirstLoad] = useState(false);
  const [loading, setLoading] = useState(true);

  const roleData = useRef({
    fixturesUrl: isAdminShown ? `${baseApiUrl}/get-matches-admin.php` : `${baseApiUrl}/get-matches.php`,
  })

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if(!firstLoad){
      if(fixturesLoaded){
        if(navType !== "PUSH"){
          setLoading(false);
        } else{
          fetchFixtures();
        }
      } else{
        fetchFixtures();
      }
    } else{
      if(fixturesLoaded){
        if(navType !== "PUSH"){
          setLoading(false);
        } else{
          fetchFixtures();
        }
      } else{
        fetchFixtures();
      }
    }

    if(!firstLoad) setFirstLoad(true);
  }, [fixturesLoaded]) //dashboard change will trigger fixturesLoaded change which will in turn trigger reload here

  function fetchFixtures() {
    setLoading(true);
    axios({
      url: roleData.current.fixturesUrl,
      method: "GET",
    }).then((res) => {
      // console.log(res.data);
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
      setLoading(false);
      // setFirstLoad(true); //setFirstLoad must still be called explicitly because fixturesLoaded won't trigger a rerender (true to true) when a push occurs
      if (!fixturesLoaded) dispatch(setFixturesLoaded(true))
      // else setFirstLoad(true); //called inside else (setFirstLoad will be set implicity in useEffect[fixturesLoaded]) on first visit. will be called expicitly here on subsequent nav pushes
    })
  }

  useEffect(() => {
    // setFirstLoad(fixturesLoaded && navType !== "PUSH");
  }, [fixturesLoaded])

  const fixturesLength = useMemo(() =>
  Object.values(fixtures).flatMap(country => Object.values(country.leagues)).flatMap(league => Object.values(league.fixtures)).length
    , [fixtures])

  // console.log("Fixtures: ", roleData.current, fixturesLoaded, firstLoad, dashboard, isAdmin, navType);

  return (
    <div className="dag-container07">
      <div className="dag-container08" />
      <div className="dag-container09">
        {(!firstLoad || fixturesLength > 0) &&
          <span className="dag-text10">
            Available Predictions <span id="predictionsCount">
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
            !loading ?
              (Object.values(fixtures).length > 0 ?
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
                    <Link className="banner-button" to="/about">
                      Learn More
                    </Link>
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
              )


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
