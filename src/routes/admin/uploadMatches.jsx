import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { DateTime } from 'luxon';
import axios from 'axios';
import { baseApiUrl } from '../../data/url';
import Loading from '../../components/loading';
import { useDispatch } from 'react-redux';
import { showToast } from '../../slices/toastsReducer';
import LoadingButton from '../../components/loadingButton';
import {
  Search,
  X,
  Calendar,
  Filter,
  ArrowUp,
  Upload,
  Clock,
  Trophy,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowDown,
  TextWrap
} from 'lucide-react';

const LENGTH_CAP = 20;

const UploadMatches = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatches, setSelectedMatches] = useState({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [customDate, setCustomDate] = useState(DateTime.now().toFormat('yyyy-MM-dd'));
  const [titleDate, setTitleDate] = useState(null);
  const [activeDateOffset, setActiveDateOffset] = useState(null);
  const [filtered, setFiltered] = useState(false);
  const [renderAll, setRenderAll] = useState(false);

  const searchRef = useRef(null);
  const scrollRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setSearch('');
  }, [filtered]);

  useEffect(() => {
    setFiltered(false);
  }, [matches]);

  useLayoutEffect(() => {
    const sessionSelectedMatchesJSON = sessionStorage.getItem('selectedMatches');
    if (sessionSelectedMatchesJSON) {
      try {
        const sessionSelectedMatches = JSON.parse(sessionSelectedMatchesJSON);
        setSelectedMatches(sessionSelectedMatches);
      } catch (error) {
        console.error('Failed to parse cached selected matches:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (Object.keys(selectedMatches).length > 0) {
      sessionStorage.setItem('selectedMatches', JSON.stringify(selectedMatches));
    }
  }, [selectedMatches]);

  function fetchMatches(offset, typeOffset = true) {
    let date;
    if (typeOffset) {
      const now = DateTime.now();
      date = now.plus({ days: Number(offset) }).toFormat('yyyy-MM-dd');
      setActiveDateOffset(offset);
    } else {
      if (!customDate) {
        dispatch(
          showToast({
            type: 'warning',
            message: 'Please select a date to fetch matches',
            duration: 3000,
          })
        );
        return;
      }
      date = customDate;
      setActiveDateOffset('custom');
    }

    setTitleDate(date);
    setLoading(true);

    axios({
      url: `${baseApiUrl}/get-fixtures.php`,
      method: 'POST',
      data: { date: date },
    })
      .then((response) => {
        setMatches(response.data.response || []);
      })
      .catch((error) => {
        console.error(error);
        dispatch(
          showToast({
            type: 'error',
            message: 'Failed to fetch matches. Check network and try again.',
            duration: 3000,
          })
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function addMatchToList(match, id) {
    if (match === null) {
      setSelectedMatches((prev) => {
        const { [id]: omit, ...rest } = prev;
        sessionStorage.setItem('selectedMatches', JSON.stringify(rest));
        return rest;
      });
    } else {
      setSelectedMatches((prev) => {
        const updated = {
          ...prev,
          [id]: match,
        };
        sessionStorage.setItem('selectedMatches', JSON.stringify(updated));
        return updated;
      });
    }
  }

  function uploadMatches() {
    const matchesArray = Object.values(selectedMatches);

    if (matchesArray.length === 0) {
      dispatch(
        showToast({
          type: 'warning',
          message: 'Add at least one match to upload',
          duration: 3000,
        })
      );
      return;
    }

    if (matchesArray.find((match) => !match.selection || match.selection.trim() === '')) {
      dispatch(
        showToast({
          type: 'warning',
          message: 'One of the staged matches has an invalid or empty selection',
          duration: 3000,
        })
      );
      return;
    }

    if (matchesArray.find((match) => match.odds === '' || isNaN(Number(match.odds)))) {
      dispatch(
        showToast({
          type: 'warning',
          message: 'One of the staged matches has an invalid odds value',
          duration: 3000,
        })
      );
      return;
    }

    if (matchesArray.find((match) => match.price === '' || isNaN(Number(match.price)))) {
      dispatch(
        showToast({
          type: 'warning',
          message: 'One of the staged matches has an invalid price',
          duration: 3000,
        })
      );
      return;
    }

    if (matchesArray.find((match) => !match.type || match.type.trim() === '')) {
      dispatch(
        showToast({
          type: 'warning',
          message: 'One of the staged matches has an invalid game type',
          duration: 3000,
        })
      );
      return;
    }

    if (!window.confirm(`Upload ${matchesArray.length} staged match(es) to public database?`)) {
      return;
    }

    setUploading(true);
    axios({
      url: `${baseApiUrl}/add-matches.php`,
      method: 'POST',
      data: { data: matchesArray },
    })
      .then((response) => {
        dispatch(
          showToast({
            type: 'success',
            message: 'Matches uploaded successfully!',
            duration: 3000,
          })
        );
        setSelectedMatches({});
        sessionStorage.setItem('selectedMatches', JSON.stringify({}));
      })
      .catch((error) => {
        console.error(error);
        dispatch(
          showToast({
            type: 'error',
            message: 'Unable to upload matches, please try again.',
            duration: 3000,
          })
        );
      })
      .finally(() => {
        setUploading(false);
      });
  }

  const selectedCount = Object.keys(selectedMatches).length;

  const displayedList = useMemo(() => {
    if (filtered) {
      return Object.values(selectedMatches);
    }
    const returnValue = matches.filter((item) => {
      if (!search) return true;
      const q = search.toLowerCase();
      const home = item.teams?.home?.name || '';
      const away = item.teams?.away?.name || '';
      const league = item.league?.name || '';
      const country = item.league?.country || '';
      return `${home} ${away} ${league} ${country}`.toLowerCase().includes(q);
    });

    return renderAll ? returnValue : returnValue.slice(0, LENGTH_CAP);
  }, [filtered, selectedMatches, matches, search, renderAll]);

  return (
    <div className="relative w-full h-[calc(100dvh-60px)] lg:h-[calc(100dvh-80px)] overflow-hidden bg-gray-50 dark:bg-[#080810] text-gray-900 dark:text-white flex flex-col">
      {/* ══════════════════════════════════════════════
          TOP CONTROLS & HEADER
      ══════════════════════════════════════════════ */}
      <div className="shrink-0 border-b border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0d0e1a]/95 backdrop-blur-md z-20">
        {/* Search Bar */}
        <div className="max-w-5xl mx-auto px-4 pt-4 pb-3">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by team, league, or country..."
              className="w-full pl-10 pr-10 py-2 rounded-xl text-base font-medium
                         bg-black/[0.04] dark:bg-white/[0.06]
                         border border-black/20 dark:border-white/20
                         text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                         outline-none focus:outline-none focus:border-orange-500/60 dark:focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20
                         transition-all"
            />
            {search.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  searchRef.current?.focus();
                }}
                className="absolute right-3 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>


        {/* Status Bar */}
        <div className="max-w-5xl mx-auto px-4 py-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
          <div className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            {/* <Trophy className="w-3.5 h-3.5 text-orange-500" /> */}
            {titleDate ? (
              filtered ? (
                <span>
                  Showing Staged Matches <strong className="text-orange-500">({selectedCount})</strong>
                </span>
              ) : (
                <span>
                  Matches for {titleDate}{' '}
                  {loading ? (
                    <span className="text-gray-400">(Loading...)</span>
                  ) : (renderAll ?
                    <strong className="text-orange-500">({displayedList.length})</strong>
                    :
                    <strong className="text-orange-500">({displayedList.length}/{matches.length})</strong>
                  )}
                </span>
              )
            ) : (
              <span className="text-gray-400">Select a date above to fetch matches</span>
            )}
          </div>

          {/* Filter View Toggle */}
          <button
            type="button"
            onClick={() => setFiltered((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${filtered
              ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30'
              : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
          >
            <Filter className="w-3 h-3" />
            <span className="whitespace-nowrap">{filtered ? 'Show All' : `Show Staged (${selectedCount})`}</span>
          </button>
        </div>

      </div>

      {/* ══════════════════════════════════════════════
          SCROLLABLE MATCH LIST
      ══════════════════════════════════════════════ */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 pb-28">
        {/* Date Fetch Controls */}
        <div className="max-w-5xl mx-auto px-0 pb-3 flex flex-col w-full justify-between gap-3 text-xs sm:text-sm">
          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mr-1 hidden sm:inline-block">
              Fetch:
            </span>
            <button
              type="button"
              onClick={() => fetchMatches(0)}
              className={`flex-1 px-3 py-2.5 rounded-lg font-bold transition-all ${activeDateOffset === 0
                ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                : 'bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-gray-700 dark:text-gray-300'
                }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => fetchMatches(1)}
              className={`flex-1 px-3 py-2.5 rounded-lg font-bold transition-all ${activeDateOffset === 1
                ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                : 'bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-gray-700 dark:text-gray-300'
                }`}
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => fetchMatches(2)}
              className={`flex-1 px-3 py-2.5 rounded-lg font-bold transition-all ${activeDateOffset === 2
                ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                : 'bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-gray-700 dark:text-gray-300'
                }`}
            >
              Day After
            </button>
          </div>

          {/* Custom Date Picker */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center h-9 gap-1.5 bg-black/[0.04] dark:bg-white/[0.06] border border-black/20 dark:border-white/20 rounded-lg px-2.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-orange-500"
              />
            </div>
            <button
              type="button"
              onClick={() => fetchMatches(undefined, false)}
              className="px-6 py-2.5 rounded-lg font-bold text-xs text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 shadow-sm active:scale-95 transition-all"
            >
              Fetch
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loading color="#ea580c" width={48} height={48} />
              <p className="text-xs font-semibold text-gray-400 animate-pulse">
                Fetching fixtures from data provider...
              </p>
            </div>
          ) : displayedList.length > 0 ? (
            displayedList.map((item) => {
              const fixtureItem = filtered ? item.data : item;
              const fixtureId = filtered ? item.fixture_id : item.fixture?.id;
              const isAdded = Boolean(selectedMatches[fixtureId]);

              return (
                <UploadMatchesItem
                  key={fixtureId}
                  item={fixtureItem}
                  addMatchToList={addMatchToList}
                  selectedMatches={selectedMatches}
                  prevData={
                    selectedMatches[fixtureId]
                      ? {
                        selection: selectedMatches[fixtureId].selection,
                        odds: selectedMatches[fixtureId].odds,
                        price: selectedMatches[fixtureId].price,
                        type: selectedMatches[fixtureId].type,
                      }
                      : null
                  }
                />
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400 dark:text-gray-500">
              <AlertCircle className="w-10 h-10 mb-2 opacity-40 text-orange-500" />
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">No matches found</p>
              <p className="text-xs max-w-xs mt-1">
                {titleDate
                  ? 'No fixtures match your current search query or date.'
                  : 'Select "Today", "Tomorrow", or choose a custom date above to load fixtures.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          FLOATING ACTION FOOTER
      ══════════════════════════════════════════════ */}
      <div className="absolute bottom-4 left-0 right-0 z-30 px-8 pointer-events-none">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/90 dark:bg-[#121320]/90 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl shadow-black/30 pointer-events-auto">
          <div className="flex items-center gap-2">
            {/* Filter Toggle */}
            <button
              type="button"
              onClick={() => setRenderAll((prev) => !prev)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${renderAll
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'bg-black/[0.04] dark:bg-white/[0.06] text-gray-700 dark:text-gray-300 hover:bg-black/[0.08] dark:hover:bg-white/[0.1]'
                }`}
              title="Toggle staged matches"
            >
              <TextWrap className="w-3.5 h-3.5" />
              <span>{renderAll ? 'All' : `(${Math.min(LENGTH_CAP, matches.length)})`}</span>
            </button>

            {/* Scroll to Top */}
            <button
              type="button"
              onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-gray-700 dark:text-gray-300 hover:bg-black/[0.08] dark:hover:bg-white/[0.1] transition-all"
              title="Scroll to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })}
              className="p-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-gray-700 dark:text-gray-300 hover:bg-black/[0.08] dark:hover:bg-white/[0.1] transition-all"
              title="Scroll to Top"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>

          {/* Staged Counter & Upload Button */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                Staged Matches
              </span>
              <span className="text-sm font-extrabold text-orange-600 dark:text-orange-400 font-mono">
                {selectedCount} Selected
              </span>
            </div>

            <button
              type="button"
              onClick={uploading ? null : uploadMatches}
              disabled={uploading || selectedCount === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white
                         bg-gradient-to-r from-emerald-600 to-emerald-500
                         hover:from-emerald-500 hover:to-emerald-400
                         active:scale-95 transition-all shadow-md shadow-emerald-900/30
                         disabled:opacity-50 disabled:pointer-events-none"
            >
              <Upload className="w-4 h-4" />
              <LoadingButton color="#fff" width={18} height={18} loading={uploading}>
                <span>UPLOAD | {selectedCount}</span>
              </LoadingButton>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   MATCH ITEM COMPONENT
══════════════════════════════════════════════ */
const UploadMatchesItem = ({ prevData, item, addMatchToList, selectedMatches }) => {
  const [data, setData] = useState(
    prevData || {
      type: '1 X 2',
      selection: '',
      odds: '',
      price: 1000,
    }
  );

  useEffect(() => {
    if (prevData) {
      setData(prevData);
    }
  }, [prevData]);

  if (!item || !item.fixture) return null;

  const isAdded = Boolean(selectedMatches[item.fixture.id]);

  const handleFieldChange = (field, value) => {
    const updated = { ...data, [field]: value };
    setData(updated);
    // if (isAdded) {
      addMatchToList(
        {
          ...updated,
          fixture_id: item.fixture.id,
          home: item.teams.home.name,
          away: item.teams.away.name,
          country: item.league?.country,
          league: item.league?.name,
          fixture: item.fixture.date,
          data: item,
        },
        item.fixture.id
      );
    // }
  };

  function toggleMatch() {
    if (isAdded) {
      addMatchToList(null, item.fixture.id);
    } else {
      const matchData = {
        ...data,
        fixture_id: item.fixture.id,
        home: item.teams.home.name,
        away: item.teams.away.name,
        country: item.league?.country,
        league: item.league?.name,
        fixture: item.fixture.date,
        data: item,
      };
      addMatchToList(matchData, item.fixture.id);
    }
  }

  const kickoffTime = item.fixture?.date
    ? DateTime.fromISO(item.fixture.date).toFormat('HH:mm')
    : null;

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isAdded
        ? 'border-emerald-500/60 dark:border-emerald-500/50 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-md shadow-emerald-950/10'
        : 'border-black/10 dark:border-white/10 bg-white dark:bg-[#121320] hover:border-black/20 dark:hover:border-white/20'
        }`}
    >
      {/* Top Header: League, Country, Kickoff Time */}
      <div className="px-4 py-2.5 border-b border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2 truncate">
          {/* {item.league?.logo && (
            <img
              src={item.league.logo}
              alt=""
              className="w-4 h-4 object-contain opacity-70 shrink-0"
            />
          )} */}
          <span className="font-semibold text-gray-700 dark:text-gray-300 truncate">
            {item.league?.name}
          </span>
          {item.league?.country && (
            <span className="text-[11px] text-gray-400 truncate">
              ({item.league.country})
            </span>
          )}
        </div>

        {kickoffTime && (
          <div className="flex items-center gap-1 shrink-0 font-mono text-[11px]">
            <Clock className="w-3 h-3 text-orange-500" />
            <span>{kickoffTime}</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-0.5 md:space-y-3.5">
        {/* Teams Matchup Header */}
        <div className="flex items-center justify-between gap-3 -mb-3 md:mb-0">
          <div className="flex-1 text:sm 2md:flex lg:block xl:flex gap-2 min-w-0">
            <div className="flex items-center gap-2">
              {/* {item.teams?.home?.logo && (
                <img
                  src={item.teams.home.logo}
                  alt=""
                  className="w-5 h-5 object-contain shrink-0"
                />
              )} */}
              <span className="font-bold text-xs text-gray-600 dark:text-gray-400 truncate">
                {item.teams?.home?.name}
              </span>
            </div>
            <div className="flex items-end text-[10px] font-bold text-orange-500/70 pl-0 py-0.5">VS</div>
            <div className="flex items-center gap-2">
              {/* {item.teams?.away?.logo && (
                <img
                  src={item.teams.away.logo}
                  alt=""
                  className="w-5 h-5 object-contain shrink-0"
                />
              )} */}
              <span className="font-bold text-xs text-gray-600 dark:text-gray-400 truncate">
                {item.teams?.away?.name}
              </span>
            </div>
          </div>

          {/* Add / Staged Toggle Button */}
          <button
            type="button"
            onClick={toggleMatch}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 active:scale-95 ${isAdded
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-500/30'
              : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white shadow-sm shadow-orange-500/20'
              }`}
          >
            {isAdded ? (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add Match</span>
              </>
            )}
          </button>
        </div>

        {/* Input Configuration Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-1 scale-[0.8] origin-bottom-left w-[125%] md:scale-[1] md:w-full">
          {/* Type */}
          <div>
            {/* <label className="block text-[10px] pl-1 uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500 mb-1">
              Type
            </label> */}
            <input
              type="text"
              placeholder="GameType"
              value={data.type}
              onChange={(e) => handleFieldChange('type', e.target.value)}
              className="w-full px-3 py-2.5 md:py-1.5 rounded-xl text-base font-semibold
                         bg-black/[0.03] dark:bg-black/30
                         border-2 border-black/10 dark:border-white/20
                         text-gray-700 dark:text-gray-300 placeholder-gray-400/50
                         outline-none focus:outline-none focus:border-2 focus:border-orange-500/60 focus:bg-white/30 dark:focus:bg-black/30 dark:focus:border-orange-500/60
                         transition-all text-center"
            />
          </div>

          {/* Selection */}
          <div>
            {/* <label className="block text-[10px] pl-1 uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500 mb-1">
              Selection
            </label> */}
            <input
              type="text"
              placeholder="Selection"
              value={data.selection}
              onChange={(e) => handleFieldChange('selection', e.target.value)}
              className="w-full px-3 py-2.5 md:py-1.5 rounded-xl text-base font-semibold
                         bg-black/[0.03] dark:bg-black/30
                         border-2 border-black/10 dark:border-white/20
                         text-gray-700 dark:text-gray-300 placeholder-gray-400/50
                         outline-none focus:outline-none focus:border-2 focus:border-orange-500/60 focus:bg-white/30 dark:focus:bg-black/30 dark:focus:border-orange-500/60
                         transition-all text-center"
            />
          </div>

          {/* Odds */}
          <div>
            {/* <label className="block text-[10px] pl-1 uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500 mb-1">
              Odds
            </label> */}
            <input
              type="number"
              step="0.01"
              placeholder="Odds"
              value={data.odds}
              onChange={(e) => handleFieldChange('odds', e.target.value)}
              className="w-full px-3 py-2.5 md:py-1.5 rounded-xl text-base font-semibold font-mono
                         bg-black/[0.03] dark:bg-black/30
                         border-2 border-black/10 dark:border-white/20
                         text-gray-700 dark:text-gray-300 placeholder-gray-400/50
                         outline-none focus:outline-none focus:border-2 focus:border-orange-500/60 focus:bg-white/30 dark:focus:bg-black/30 dark:focus:border-orange-500/60
                         transition-all text-center"
            />
          </div>

          {/* Price */}
          <div>
            {/* <label className="block text-[10px] pl-1 uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500 mb-1">
              Price
            </label> */}
            <input
              type="number"
              placeholder="Price"
              value={data.price}
              onChange={(e) => handleFieldChange('price', e.target.value)}
              className="w-full px-3 py-2.5 md:py-1.5 rounded-xl text-base font-semibold font-mono
                         bg-black/[0.03] dark:bg-black/30
                         border-2 border-black/10 dark:border-white/20
                         text-gray-700 dark:text-gray-300 placeholder-gray-400/50
                         outline-none focus:outline-none focus:border-2 focus:border-orange-500/60 focus:bg-white/30 dark:focus:bg-black/30 dark:focus:border-orange-500/60
                         transition-all text-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadMatches;
