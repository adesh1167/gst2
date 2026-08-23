import React, { useLayoutEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { baseApiUrl } from '../../data/url';
import LoadingButton from '../../components/loadingButton';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showToast } from '../../slices/toastsReducer';
import { DateTime } from 'luxon';
import ModalWrapper from '../../components/modalWrapper';
import { Ticket, Percent, Layers, Clock, MessageSquare, AlertCircle } from 'lucide-react';

const EditCoupon = ({ edit = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const coupon = location.state?.coupon;
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    coupon: '',
    description: '',
    discount: '',
    minimum: 0,
    minMessage: '',
    expiration: '',
  });

  const [loading, setLoading] = useState({
    update: false,
    add: false,
  });

  function formatToInputDate(val) {
    if (!val) return '';
    const dt = DateTime.fromSQL(val).isValid ? DateTime.fromSQL(val) : DateTime.fromISO(val);
    return dt.isValid ? dt.toFormat("yyyy-MM-dd'T'HH:mm") : val;
  }

  function formatToBackendDate(val) {
    if (!val) return '';
    const dt = DateTime.fromISO(val);
    return dt.isValid ? dt.toFormat('yyyy-MM-dd HH:mm:ss') : val;
  }

  useLayoutEffect(() => {
    if (edit) {
      if (coupon) {
        setFormData({
          id: coupon.id,
          coupon: coupon.coupon || '',
          description: coupon.message || '',
          discount: coupon.percent_off !== undefined ? coupon.percent_off : '',
          minimum: coupon.min_matches !== undefined ? coupon.min_matches : 0,
          minMessage: coupon.min_matches_message || '',
          expiration: formatToInputDate(coupon.expires),
        });
      } else {
        navigate('/admin/coupons', { replace: true });
      }
    }
  }, [edit, coupon]);

  function setValue(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function updateCoupon() {
    if (!formData.coupon || !formData.discount) {
      dispatch(showToast({ type: 'warning', message: 'Coupon code and discount are required', duration: 3000 }));
      return;
    }

    const currentData = {
      id: coupon.id,
      coupon: formData.coupon,
      message: formData.description,
      percent_off: Number(formData.discount),
      min_matches: Number(formData.minimum || 0),
      min_matches_message: formData.minMessage,
      expires: formatToBackendDate(formData.expiration),
    };

    setLoading((prev) => ({ ...prev, update: true }));
    axios({
      url: `${baseApiUrl}/update-coupon.php`,
      method: 'POST',
      data: {
        ...formData,
        expiration: formatToBackendDate(formData.expiration),
      },
    })
      .then((res) => {
        if (res.data.status === 'success') {
          dispatch(
            showToast({
              type: 'success',
              message: 'Coupon updated successfully',
              duration: 3000,
            })
          );
          navigate('/admin/coupons', {
            state: {
              updated: true,
              id: coupon.id,
              newData: currentData,
            },
            replace: true,
          });
        } else {
          dispatch(
            showToast({
              type: 'error',
              message: res.data.message || 'Failed to update coupon',
              duration: 3000,
            })
          );
        }
      })
      .catch((err) => {
        console.error(err);
        dispatch(
          showToast({
            type: 'error',
            message: 'An error occurred while updating',
            duration: 3000,
          })
        );
      })
      .finally(() => setLoading((prev) => ({ ...prev, update: false })));
  }

  function addCoupon() {
    if (!formData.coupon || !formData.discount) {
      dispatch(showToast({ type: 'warning', message: 'Coupon code and discount are required', duration: 3000 }));
      return;
    }

    const currentData = {
      coupon: formData.coupon,
      message: formData.description,
      percent_off: Number(formData.discount),
      min_matches: Number(formData.minimum || 0),
      min_matches_message: formData.minMessage,
      expires: formatToBackendDate(formData.expiration),
    };

    setLoading((prev) => ({ ...prev, add: true }));
    axios({
      url: `${baseApiUrl}/add-coupon.php`,
      method: 'POST',
      data: {
        ...formData,
        expiration: formatToBackendDate(formData.expiration),
      },
    })
      .then((res) => {
        if (res.data.status === 'success') {
          dispatch(
            showToast({
              type: 'success',
              message: 'Coupon added successfully',
              duration: 3000,
            })
          );
          navigate('/admin/coupons', {
            state: {
              added: true,
              newData: { ...currentData, id: res.data.id },
            },
            replace: true,
          });
        } else {
          let localMessage = 'An error occurred';
          if (res.data.error_type === 'duplicate_entry') {
            localMessage = `Coupon "${currentData.coupon}" already exists`;
          }
          dispatch(
            showToast({
              type: 'error',
              message: res.data.message || localMessage,
              duration: 3000,
            })
          );
        }
      })
      .catch((err) => {
        console.error(err);
        dispatch(
          showToast({
            type: 'error',
            message: 'An error occurred while adding coupon',
            duration: 3000,
          })
        );
      })
      .finally(() => setLoading((prev) => ({ ...prev, add: false })));
  }

  const discountPercentPreview = formData.discount
    ? Math.round(Number(formData.discount) * 100)
    : 0;

  return (
    <ModalWrapper
      exitable={true}
      onClose={() => navigate('/admin/coupons')}
      title={edit ? 'Edit Coupon' : 'Create New Coupon'}
      subtitle={edit ? `Updating code "${formData.coupon || ''}"` : 'Configure promotional voucher discount parameters'}
      icon={Ticket}
      maxWidth="max-w-lg"
    >
      <form onSubmit={(e) => e.preventDefault()} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        {/* Code & Discount Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Coupon Code */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-orange-500" />
              <span>Coupon Code *</span>
            </label>
            <input
              type="text"
              placeholder="e.g. GST2026"
              value={formData.coupon}
              onChange={(e) => setValue('coupon', e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm font-mono font-bold uppercase
                         bg-black/[0.03] dark:bg-white/[0.05]
                         border border-black/10 dark:border-white/10
                         text-gray-900 dark:text-white placeholder-gray-400
                         focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500
                         transition-all"
            />
          </div>

          {/* Discount Rate */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-orange-500" />
                <span>Discount (0.01 - 1.0) *</span>
              </label>
              {discountPercentPreview > 0 && (
                <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {discountPercentPreview}% OFF
                </span>
              )}
            </div>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="1.0"
              placeholder="e.g. 0.20 for 20%"
              value={formData.discount}
              onChange={(e) => setValue('discount', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm font-mono font-semibold
                         bg-black/[0.03] dark:bg-white/[0.05]
                         border border-black/10 dark:border-white/10
                         text-gray-900 dark:text-white placeholder-gray-400
                         focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500
                         transition-all"
            />
          </div>
        </div>

        {/* Minimum Matches & Error Message */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Min Matches */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-orange-500" />
              <span>Min. Matches</span>
            </label>
            <input
              type="number"
              min="0"
              placeholder="0 for no minimum"
              value={formData.minimum}
              onChange={(e) => setValue('minimum', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm font-mono font-semibold
                         bg-black/[0.03] dark:bg-white/[0.05]
                         border border-black/10 dark:border-white/10
                         text-gray-900 dark:text-white placeholder-gray-400
                         focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500
                         transition-all"
            />
          </div>

          {/* Expiration DateTime */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              <span>Expiration Date & Time</span>
            </label>
            <input
              type="datetime-local"
              value={formData.expiration}
              onChange={(e) => setValue('expiration', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold
                         bg-black/[0.03] dark:bg-white/[0.05]
                         border border-black/10 dark:border-white/10
                         text-gray-900 dark:text-white placeholder-gray-400
                         focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500
                         transition-all"
            />
          </div>
        </div>

        {/* Customer Description / Success Message */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
            <span>Success Message (Shown to User)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. 20% discount applied to your order!"
            value={formData.description}
            onChange={(e) => setValue('description', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm font-medium
                       bg-black/[0.03] dark:bg-white/[0.05]
                       border border-black/10 dark:border-white/10
                       text-gray-900 dark:text-white placeholder-gray-400
                       focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500
                       transition-all"
          />
        </div>

        {/* Min Matches Warning Message */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
            <span>Min. Matches Error Message</span>
          </label>
          <input
            type="text"
            placeholder="e.g. This coupon only applies on 3 or more matches"
            value={formData.minMessage}
            onChange={(e) => setValue('minMessage', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm font-medium
                       bg-black/[0.03] dark:bg-white/[0.05]
                       border border-black/10 dark:border-white/10
                       text-gray-900 dark:text-white placeholder-gray-400
                       focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500
                       transition-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-3 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/admin/coupons')}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            Cancel
          </button>

          {edit ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loading.add ? null : addCoupon}
                disabled={loading.add}
                className="px-4 py-2.5 rounded-xl font-bold text-xs text-orange-600 dark:text-orange-400 border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 active:scale-95 transition-all"
              >
                <LoadingButton loading={loading.add} color="#ea580c" height={16} width={16}>
                  Clone as New
                </LoadingButton>
              </button>

              <button
                type="button"
                onClick={loading.update ? null : updateCoupon}
                disabled={loading.update}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white
                           bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400
                           shadow-sm active:scale-95 transition-all"
              >
                <LoadingButton loading={loading.update} color="#fff" height={16} width={16}>
                  Update Coupon
                </LoadingButton>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={loading.add ? null : addCoupon}
              disabled={loading.add}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white
                         bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400
                         shadow-sm active:scale-95 transition-all"
            >
              <LoadingButton loading={loading.add} color="#fff" height={16} width={16}>
                Create Coupon
              </LoadingButton>
            </button>
          )}
        </div>
      </form>
    </ModalWrapper>
  );
};

export default EditCoupon;