import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast } from '../slices/toastsReducer';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const toastConfig = {
    success: {
        icon: CheckCircle2,
        border: 'border-emerald-500',
        bgLight: 'bg-emerald-500/10',
        bgDark: 'dark:bg-emerald-500/15',
        iconColor: 'text-emerald-500 dark:text-emerald-400',
        glow: 'shadow-emerald-500/10',
    },
    error: {
        icon: AlertCircle,
        border: 'border-rose-500',
        bgLight: 'bg-rose-500/10',
        bgDark: 'dark:bg-rose-500/15',
        iconColor: 'text-rose-500 dark:text-rose-400',
        glow: 'shadow-rose-500/10',
    },
    warning: {
        icon: AlertTriangle,
        border: 'border-amber-500',
        bgLight: 'bg-amber-500/10',
        bgDark: 'dark:bg-amber-500/15',
        iconColor: 'text-amber-500 dark:text-amber-400',
        glow: 'shadow-amber-500/10',
    },
    info: {
        icon: Info,
        border: 'border-blue-500',
        bgLight: 'bg-blue-500/10',
        bgDark: 'dark:bg-blue-500/15',
        iconColor: 'text-blue-500 dark:text-blue-400',
        glow: 'shadow-blue-500/10',
    },
};

const Toasts = () => {
    const { toasts } = useSelector(state => state.toasts);

    return (
        <div className="fixed top-16 right-3 sm:right-6 z-50 flex flex-col items-end gap-2.5 max-w-[92vw] sm:max-w-sm pointer-events-none">
            <AnimatePresence mode="sync">
                {toasts.slice(0,3).map(toast => (
                    <ToastItem key={toast.id.toString()} toast={toast} />
                ))}
            </AnimatePresence>
        </div>
    );
};

const ToastItem = ({ toast }) => {
    const dispatch = useDispatch();
    const timerRef = useRef(null);

    const type = toast.type || 'info';
    const config = toastConfig[type] || toastConfig.info;
    const IconComponent = config.icon;

    const handleDismiss = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        dispatch(removeToast(toast.id));
    };

    useEffect(() => {
        timerRef.current = setTimeout(handleDismiss, toast.duration || 3500);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [toast.id, toast.duration]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.92, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.88, height: 0, x: 100, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className={`relative pointer-events-auto flex items-center gap-3 w-full p-3.5 sm:p-4 rounded-xl
                        bg-white/95 dark:bg-[#12131f]/95 backdrop-blur-md
                        border border-black/10 dark:border-white/10
                        border-l-4 ${config.border}
                        shadow-lg ${config.glow}
                        text-light-primary dark:text-dark-primary`}
            role="alert"
        >
            <div className={`p-1 rounded-lg ${config.bgLight} ${config.bgDark} shrink-0 mt-0.5`}>
                <IconComponent className={`w-4 h-4 ${config.iconColor}`} />
            </div>

            <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed break-words pr-1">
                {toast.message}
            </div>

            <button
                onClick={handleDismiss}
                className="shrink-0 p-1 -mr-1 -mt-1 rounded-lg text-black/40 hover:text-black/80 dark:text-white/40 dark:hover:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label="Close notification"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </motion.div>
    );
};

export default Toasts;
