import React, { useEffect, useLayoutEffect, useRef, useState, useMemo } from 'react';
import axios from 'axios';
import { baseApiUrl } from '../../data/url';
import { getMyMatchTime } from '../../functions/formatDate';
import Loading from '../../components/loading';
import { useLocation, useNavigate, useOutlet } from 'react-router';
import { useDispatch } from 'react-redux';
import { showToast } from '../../slices/toastsReducer';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Ticket,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Clock,
  Calendar,
  Percent,
  Layers,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  Tag
} from 'lucide-react';
import { DateTime } from 'luxon';

const Coupons = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const outlet = useOutlet();

  const locationState = location.state;

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  function getCoupons() {
    setLoading(true);
    axios({
      url: `${baseApiUrl}/get-coupons.php`,
      method: 'POST',
    })
      .then((res) => {
        setCoupons(res.data.coupons || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setError('Unable to load coupons');
      });
  }

  useLayoutEffect(() => {
    getCoupons();
  }, []);

  function addCoupon() {
    navigate(`/admin/coupons/new`);
  }

  useEffect(() => {
    if (locationState?.updated) {
      if (!loading && !error) {
        setCoupons((prev) => {
          const newCoupons = prev.map((coupon) => {
            if (coupon.id === locationState.id) {
              return locationState.newData;
            } else {
              return coupon;
            }
          });
          return newCoupons;
        });
      }
    }

    if (locationState?.added) {
      if (!loading && !error) {
        if (!coupons.find((coupon) => coupon.id === locationState.newData.id)) {
          setCoupons((prev) => [locationState.newData, ...prev]);
        }
      }
    }
  }, [locationState]);

  const filteredCoupons = useMemo(() => {
    if (!search.trim()) return coupons;
    const q = search.toLowerCase();
    return coupons.filter(
      (c) =>
        c.coupon?.toLowerCase().includes(q) ||
        c.message?.toLowerCase().includes(q) ||
        c.min_matches_message?.toLowerCase().includes(q)
    );
  }, [coupons, search]);

  return (
    <div className="relative w-full h-[calc(100dvh-60px)] lg:h-[calc(100dvh-80px)] overflow-y-auto bg-gray-50 dark:bg-[#080810] text-gray-900 dark:text-white flex flex-col">
      {/* ══════════════════════════════════════════════
          TOP CONTROLS & HEADER
      ══════════════════════════════════════════════ */}
      <div className="shrink-0 border-b border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0d0e1a]/95 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-tight flex items-center gap-2">
                  <span>Manage Coupons</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                    {coupons.length} Active
                  </span>
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Create and manage promotional discount vouchers
                </p>
              </div>
            </div>

            {/* Desktop Add Button */}
            <button
              type="button"
              onClick={addCoupon}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white
                         bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400
                         shadow-sm hover:shadow active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search coupon codes or descriptions..."
              className="w-full pl-10 pr-10 py-1.5 rounded-xl text-base font-medium
                         bg-black/[0.03] dark:bg-white/[0.05]
                         border border-black/10 dark:border-white/10
                         text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                         focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20
                         transition-all"
            />
            {search.length > 0 && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          COUPONS LIST
      ══════════════════════════════════════════════ */}
      <div className="flex-1 px-4 py-6 pb-28 max-w-5xl w-full mx-auto">
        {error ? (
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="font-bold text-sm text-rose-600 dark:text-rose-400">{error}</p>
            <button
              type="button"
              onClick={getCoupons}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-500 text-white hover:bg-rose-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loading color="#ea580c" width={48} height={48} />
            <p className="text-xs font-semibold text-gray-400 animate-pulse">Loading active coupons...</p>
          </div>
        ) : filteredCoupons.length > 0 ? (
          <div className="grid grid-cols-1 2md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredCoupons.map((coupon) => (
              <CouponItem couponData={coupon} key={coupon.id} setCoupons={setCoupons} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400 dark:text-gray-500 p-8 rounded-3xl border border-dashed border-black/10 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01]">
            <Ticket className="w-12 h-12 mb-3 opacity-30 text-orange-500" />
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">No coupons found</h3>
            <p className="text-xs max-w-xs mt-1 text-gray-500">
              {search
                ? `No coupon codes match "${search}".`
                : 'Create your first promotional discount voucher to get started.'}
            </p>
            {!search && (
              <button
                type="button"
                onClick={addCoupon}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white
                           bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400
                           shadow-sm active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Coupon</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile Floating Add Button */}
      <div className="sm:hidden fixed bottom-6 right-6 z-30">
        <button
          type="button"
          onClick={addCoupon}
          className="w-14 h-14 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 text-white
                     flex items-center justify-center shadow-xl shadow-orange-900/30
                     active:scale-90 transition-transform"
          aria-label="Create Coupon"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Outlet Modal for Add/Edit */}
      <AnimatePresence mode="sync">
        {outlet && React.cloneElement(outlet, { key: location.pathname })}
      </AnimatePresence>
    </div>
  );
};

const deleteCountdownFrom = 10;

const CouponItem = ({ couponData, setCoupons }) => {
  const { coupon, id, message, min_matches, percent_off, expires } = couponData;

  const [toDelete, setToDelete] = useState(false);
  const [deleteCountDown, setDeleteCountDown] = useState(deleteCountdownFrom);
  const [copied, setCopied] = useState(false);

  const deleteCountDownInterval = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isExpired = useMemo(() => {
    if (!expires) return false;
    const dt = DateTime.fromSQL(expires).isValid
      ? DateTime.fromSQL(expires)
      : DateTime.fromISO(expires);
    return dt.isValid && dt < DateTime.now();
  }, [expires]);

  function editCoupon() {
    navigate(`/admin/coupons/edit/${id}`, { state: { coupon: couponData } });
  }

  function initiateDelete() {
    setToDelete(true);
    setDeleteCountDown(deleteCountdownFrom - 1);
    deleteCountDownInterval.current = setInterval(() => {
      setDeleteCountDown((prev) => {
        if (prev <= 1) {
          clearInterval(deleteCountDownInterval.current);
          return 0;
        } else {
          return prev - 1;
        }
      });
    }, 400);
  }

  useEffect(() => {
    if (deleteCountDown === 0 && toDelete) {
      doDelete();
    }
  }, [deleteCountDown]);

  function stopDelete() {
    setToDelete(false);
    clearInterval(deleteCountDownInterval.current);
    setDeleteCountDown(deleteCountdownFrom);
  }

  function doDelete() {
    axios({
      url: `${baseApiUrl}/delete-coupon.php`,
      method: 'POST',
      data: { id },
    })
      .then((res) => {
        if (res.data.status === 'success') {
          dispatch(
            showToast({
              type: 'success',
              message: 'Coupon deleted successfully',
              duration: 3000,
            })
          );
          setCoupons((prev) => prev.filter((c) => c.id !== id));
        } else {
          dispatch(
            showToast({
              type: 'error',
              message: res.data.message || 'Failed to delete coupon',
              duration: 3000,
            })
          );
          stopDelete();
        }
      })
      .catch((err) => {
        console.error(err);
        dispatch(
          showToast({
            type: 'error',
            message: 'An error occurred while deleting coupon',
            duration: 3000,
          })
        );
        stopDelete();
      });
  }

  function copyCode() {
    navigator.clipboard.writeText(coupon);
    setCopied(true);
    dispatch(showToast({ type: 'success', message: 'Coupon code copied', duration: 2000 }));
    setTimeout(() => setCopied(false), 2000);
  }

  const discountPercent = Math.round(Number(percent_off || 0) * 100);
  const deleteProgress = ((deleteCountdownFrom - deleteCountDown) / deleteCountdownFrom) * 100;

  return (
    <div className="relative rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121320] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
      {/* Deleting Progress Bar Overlay */}
      {toDelete && (
        <div
          className="absolute top-0 left-0 bottom-0 bg-rose-600/20 border-r-2 border-rose-500 transition-all duration-300 pointer-events-none z-10"
          style={{ width: `${deleteProgress}%` }}
        />
      )}

      {/* Card Content */}
      <div className="p-5 space-y-3.5 relative z-10">
        {/* Top Code & Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyCode}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/20 hover:border-orange-500/40 text-orange-600 dark:text-orange-400 font-mono font-extrabold text-base tracking-wider transition-all group"
              title="Click to copy code"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>{coupon}</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
              ) : (
                <Copy className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <span
              className={`px-2.5 py-1 rounded-full font-bold text-xs flex items-center gap-1 ${
                discountPercent > 0
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-500'
              }`}
            >
              <span>{discountPercent}%</span>
              {/* <Percent className="w-3 h-3" /> */}
            </span>

            {isExpired && (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-extrabold uppercase">
                Expired
              </span>
            )}
          </div>
        </div>

        {/* Message / Description */}
        {message && (
          <p className="text-xs text-gray-600 dark:text-gray-300 italic bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-xl p-2.5">
            "{message}"
          </p>
        )}

        {/* Meta badges (Min Matches, Expiration) */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-500 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block leading-tight">
                Requirement
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {min_matches && Number(min_matches) > 0
                  ? `Min. ${min_matches} matches`
                  : 'No minimum'}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 flex items-center gap-2">
            <Clock className={`w-4 h-4 shrink-0 ${isExpired ? 'text-rose-500' : 'text-orange-500'}`} />
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block leading-tight">
                Expiry
              </span>
              <span
                className={`font-semibold truncate block ${
                  isExpired
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-gray-800 dark:text-gray-200'
                }`}
                title={expires}
              >
                {expires ? getMyMatchTime(expires) : 'No expiration'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 py-3 border-t border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] flex items-center justify-between gap-2 relative z-10">
        {toDelete ? (
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 animate-pulse">
              Deleting in {Math.ceil((deleteCountDown * 400) / 1000)}s...
            </span>
            <button
              type="button"
              onClick={stopDelete}
              className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-gray-700 dark:text-gray-200 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-all"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={editCoupon}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs text-gray-700 dark:text-gray-200 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-orange-500 hover:text-white transition-all"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={initiateDelete}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Coupons;
