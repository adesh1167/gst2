import { use, useEffect, useMemo, useState } from 'react'
import Header from '../../components/header';
import './styles/uploadMatches.css';
import { DateTime } from 'luxon';
import axios from 'axios';
import { baseApiUrl } from '../../data/url';
import Loading from '../../components/loading';
import { useDispatch } from 'react-redux';
import { showToast } from '../../slices/toastsReducer';
import { addItem } from '../../slices/cartReducer';
import LoadingButton from '../../components/loadingButton';

const UploadMatches = () => {

  const [matches, setMatches] = useState([]);
  const [selectedMatches, setSelectedMatches] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [customDate, setCustomDate] = useState(DateTime.now().toFormat("yyyy-MM-dd"));
  const [titleDate, setTitleDate] = useState(null);

  const filteredMatches = useMemo(() =>
    matches.filter(match => search === "" || (match.teams.home.name + match.teams.away.name).toLowerCase().indexOf(search.toLowerCase()) > -1)
    , [matches, search]);

  const dispatch = useDispatch();

  function fetchMatches(offset, typeOffset = true) {
    let date;
    if (typeOffset) {
      const now = DateTime.now();
      date = now.plus({ days: Number(offset) }).toFormat('yyyy-MM-dd');
    } else {
      if (!customDate) {
        dispatch(showToast({
          type: "warn",
          message: "Please select a date to fetch matches",
          duration: 3000,
        }))
        return;
      }
      date = customDate;
    }

    setTitleDate(date);

    setLoading(true);
    axios({
      url: `${baseApiUrl}/get-fixtures.php`,
      method: "POST",
      data: { date: date },
    }).then((response) => {
      setMatches(response.data.response);
      // console.log(response.data);
    }).catch((response) => {
      console.log(response);
    }).finally(() => {
      setLoading(false);
    })
  }

  function addMatchhToList(match, id) {
    if (match === null) {
      setSelectedMatches(prev => {
        const { [id]: omit, ...rest } = prev;
        return rest;
      })
    } else {
      setSelectedMatches(prev => ({
        ...prev,
        [id]: match,
      }))
    }
  }

  function uploadMatches() {

    const matchesArray = Object.values(selectedMatches);

    if (matchesArray.length === 0) {
      dispatch(showToast({
        type: "warn",
        message: "Add at least one match",
        duration: 3000,
      }))
      return;
    }

    if (matchesArray.find(match => match.selection === "")) {
      dispatch(showToast({
        type: "warn",
        message: "One of the added matches has invalid selection",
        duration: 3000,
      }))

      return;
    }

    if (matchesArray.find(match => match.odds === "")) {
      dispatch(showToast({
        type: "warn",
        message: "One of the added matches has invalid odds",
        duration: 3000,
      }))

      return;
    }

    if (matchesArray.find(match => match.price === "")) {
      dispatch(showToast({
        type: "warn",
        message: "One of the added matches has invalid price",
        duration: 3000,
      }))

      return;
    }

    if (matchesArray.find(match => match.type === "")) {
      dispatch(showToast({
        type: "warn",
        message: "One of the added matches has invalid game type",
        duration: 3000,
      }))

      return;
    }

    setUploading(true);
    axios({
      url: `${baseApiUrl}/add-matches.php`,
      method: "POST",
      data: { data: matchesArray },
    }).then((response) => {
      // console.log(response.data);
      dispatch(showToast({
        type: "success",
        message: "Matches uploaded successfully",
        duration: 3000,
      }))
      setSelectedMatches({});
    }).catch((response) => {
      dispatch(showToast({
        type: "error",
        message: "Unable to upload, chek your network and try again",
        duration: 3000,
      }))
      // console.log(response);
    }).finally(() => {
      setUploading(false);
    })
  }

  return (
    <div className='upload-matches'>
      <Header />
      <div className='upload-matches-search'>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Search Matches...' />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" onClick={() => setSearch("")}>
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
        </svg>

      </div>
      <div className='fetch-options'>
        <div className='fetch-options-row'>
          <div className='fetch-options-row-item' onClick={() => fetchMatches(0)}>
            Today
          </div>
          <div className='fetch-options-row-item' onClick={() => fetchMatches(1)}>
            Tomorrow
          </div>
          <div className='fetch-options-row-item' onClick={() => fetchMatches(2)}>
            N. Tomorrow
          </div>
        </div>
        <div className='fetch-options-row'>
          <div className='fetch-options-row-title'>
            Custom
          </div>
          <div className='fetch-options-row-date'>
            <input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)} />
          </div>
          <div className='fetch-options-row-button' onClick={() => fetchMatches(undefined, false)}>GO</div>
        </div>
      </div>
      <div className='upload-matches-head'>
        <div className='upload-matches-head-text'>
          {titleDate ?
            <span>Results for {titleDate} Matches ({matches.length})</span>
            :
            <span>Select a date to fetch matches</span>
          }
        </div>
      </div>

      {loading ?

        <div className='upload-matches-loading'>
          <Loading width={60} height={60} />
        </div>
        :
        <div className='upload-matches-body'>
          {filteredMatches.map((item, index) =>
            <UploadMatchesItem key={item.fixture.id} item={item} addMatchhToList={addMatchhToList} selectedMatches={selectedMatches} />
          )}
        </div>

      }
      <div className='upload-matches-footer'>
        <div className='uplaod-matches-footer-filter'></div>
        <div className='uplaod-matches-footer-scroll' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <svg className='icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8l256 0c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" />
          </svg>

        </div>
        <div className='upload-matches-footer-button' onClick={uploading ? null : uploadMatches}>
          <LoadingButton color='#fff' width={25} height={25} loading={uploading}>
            UPLOAD | {Object.keys(selectedMatches).length}
          </LoadingButton>
        </div>
      </div>
    </div>
  )
}

const UploadMatchesItem = ({ item, addMatchhToList, selectedMatches }) => {

  const [data, setData] = useState({
    type: "1 X 2",
    selection: "",
    odds: "",
    price: 500,
  });

  useEffect(() => {
    if (data.selection !== "") addMatch();
  }, [data])

  function addMatch() {
    const matchData = {
      ...data,
      country: item.league.country,
      league: item.league.name,
      fixture: item.fixture.date,
      data: item
    }

    addMatchhToList(matchData, item.fixture.id);
  }

  function removeMatch() {
    addMatchhToList(null, item.fixture.id);
  }

  const added = useMemo(() => {
    return selectedMatches[item.fixture.id] ? true : false;
  }, [selectedMatches])

  return (
    <div className={`upload-matches-item ${added ? "added" : ""} `}>
      <div className='upload-matches-item-column'>
        <div className='upload-matches-item-row top'>
          {item.teams.home.name} v {item.teams.away.name}
        </div>
        <div className='upload-matches-item-row'>
          <input type='text' placeholder='Type' onChange={e => setData(prev => ({ ...prev, type: e.target.value }))} value={data.type} />
          <input type='text' placeholder='Selection' onChange={e => setData(prev => ({ ...prev, selection: e.target.value }))} value={data.selection} />
          <input type='number' placeholder='Odds' onChange={e => setData(prev => ({ ...prev, odds: e.target.value }))} value={data.odds} />
          <input type='number' placeholder='Price' onChange={e => setData(prev => ({ ...prev, price: e.target.value }))} value={data.price} />
        </div>
      </div>
      <div className='upload-matches-item-button' onClick={added ? removeMatch : addMatch}>
        {added ? "REM" : "ADD"}
      </div>
    </div>
  )
}

export default UploadMatches
