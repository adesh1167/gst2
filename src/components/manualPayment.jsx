import { useNavigate, useParams } from 'react-router';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { countries } from '../data/countries';
import { selectNetTotal } from '../slices/netTotal';
import { unavailablePayments } from '../data/unavaiablePayments';
import formatNumber from '../functions/formatNumber';
import { showToast } from '../slices/toastsReducer';
import ModalWrapper from './modalWrapper';
import { AlertTriangle, Building2, Ticket, Mail, Copy, Check } from 'lucide-react';

const ManualPayment = ({ type = "matches", duration, amount }) => {
    const cartObj = useSelector(state => state.cart);
    const cart = cartObj.items;
    const { factor, country } = useSelector(state => state.data);
    const netTotal = useSelector(selectNetTotal) * factor;

    const total = type === "matches" ? formatNumber(netTotal) : formatNumber(amount);
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [copiedKey, setCopiedKey] = useState(null);

    if (!country) return null;

    const countryDetails = countries[country];
    if (!countryDetails) return null;

    if (!unavailablePayments.includes(country)) {
        navigate("/cart");
        return null;
    }

    const copyToClipboard = (text, key) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        dispatch(showToast({ message: "Copied to clipboard", type: "success", duration: 2000 }));
        setTimeout(() => setCopiedKey(null), 2500);
    };

    return (
        <ModalWrapper
            exitable={true}
            onClose={() => navigate(-1)}
            title={`Payment for ${countryDetails.name}`}
            subtitle="Pay Manually"
            icon={AlertTriangle}
            iconColor="text-amber-500"
            iconBg="bg-amber-500/15"
            headerGradient="from-amber-500/10 to-transparent"
            maxWidth="max-w-lg"
            footer={
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="py-2.5 px-6 rounded-xl font-bold text-xs sm:text-sm text-white
                               bg-gradient-to-r from-orange-600 to-orange-500
                               hover:from-orange-500 hover:to-orange-400
                               active:scale-[0.98] transition-all shadow-sm hover:shadow"
                >
                    Done
                </button>
            }
        >
            <div className="p-6 space-y-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-h-[65vh] overflow-y-auto">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs">
                    Direct automated checkout is currently undergoing maintenance for <strong>{countryDetails.name}</strong>. Please use the verified manual payment details below.
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                        {/* {type === "matches" ? "Matches Selected:" : `Subscription (${duration || id}):`} */}
                        Amount:
                    </span>
                    <span className="sans font-extrabold text-base text-orange-600 dark:text-orange-400">
                        {country} {total}
                    </span>
                </div>

                {type === "matches" && cart?.length > 0 && (
                    <div className="space-y-1.5 p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 text-xs">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">Selected Fixtures ({cart.length}):</span>
                        <ul className="list-disc pl-4 space-y-1 text-gray-600 dark:text-gray-400">
                            {cart.map(item => (
                                <li key={item.id}>{item.home} vs {item.away}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {type === "subscription" && (
                    <div className="space-y-1.5 p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 text-xs">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">Selected Plan: <span className='uppercase'>{duration}</span></span>
                    </div>
                )}

                {/* Payment methods */}
                <div className="space-y-3 pt-2">
                    {countryDetails.manualPaymentDetails.map((method, idx) => (
                        <div key={method.type + idx} className="space-y-2">
                            {idx > 0 && (
                                <div className="flex items-center gap-3 my-2">
                                    <div className="h-px bg-black/10 dark:bg-white/10 flex-1" />
                                    <span className="text-xs uppercase font-bold text-gray-400">OR</span>
                                    <div className="h-px bg-black/10 dark:bg-white/10 flex-1" />
                                </div>
                            )}

                            {method.type === 'bank' ? (
                                <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] space-y-2.5">
                                    <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-xs sm:text-sm">
                                        <Building2 className="w-4 h-4 text-orange-500" />
                                        <span>{method.bankName ? "Bank" : "Mobile Money"}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="p-2 rounded-lg bg-black/[0.03] dark:bg-white/[0.03]">
                                            <span className="text-gray-600 dark:text-gray-400 block text-[10px] uppercase">Account Name</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{method.accountName}</span>
                                        </div>

                                        <div className="p-2 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] flex items-center justify-between">
                                            <div>
                                                <span className="text-gray-600 dark:text-gray-400 block text-[10px] uppercase">
                                                    {method.bankName ? 'Account Number' : 'Number'}
                                                </span>
                                                <span className="font-semibold text-gray-900 dark:text-white font-mono">{method.accountNumber}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => copyToClipboard(method.accountNumber, `acc-${idx}`)}
                                                className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-orange-500"
                                                title="Copy Account Number"
                                            >
                                                {copiedKey === `acc-${idx}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>

                                        <div className="p-2 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] col-span-2">
                                            <span className="text-gray-600 dark:text-gray-400   block text-[10px] uppercase">
                                                {method.bankName ? 'Bank' : 'Network'}
                                            </span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {method.bankName || method.network}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] space-y-2.5">
                                    <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-xs sm:text-sm">
                                        <Ticket className="w-4 h-4 text-orange-500" />
                                        <span>Voucher Payment</span>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] text-xs space-y-1">
                                        <div><strong>Accepted Vouchers:</strong> {method.voucherTypes?.join(', ')}</div>
                                        <div><strong>Amount:</strong> {country} {total}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Verification Step */}
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                        <Mail className="w-4 h-4" />
                        <span>Step 2: Confirm Payment</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        After completing payment, send your proof/screenshot to:
                    </p>
                    <a
                        href="mailto:contact.globalsportstrade@gmail.com"
                        className="inline-block font-mono font-semibold text-orange-600 dark:text-orange-400 hover:underline text-xs"
                    >
                        contact.globalsportstrade@gmail.com
                    </a>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {type === "matches" ?
                            "The match selections will be shown on your dashboard within 15 minutes."
                            :
                            "Your subscription will be activated within 15 minutes."
                        }

                    </p>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default ManualPayment;
