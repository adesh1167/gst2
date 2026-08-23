import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const ModalWrapper = ({
    children,
    onClose,
    exitable = true,
    title,
    subtitle,
    icon: Icon,
    iconColor = 'text-orange-500',
    iconBg = 'bg-orange-500/10',
    maxWidth = 'max-w-md',
    headerGradient = 'from-orange-500/5 to-transparent',
    className = '',
    headerRight,
    footer,
}) => {
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && exitable && onClose) {
            onClose();
        }
    };

    const renderIcon = () => {
        if (!Icon) return null;
        if (React.isValidElement(Icon)) return Icon;
        const IconComponent = Icon;
        return <IconComponent className="w-5 h-5" />;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-[calc(1rem+60px)] lg:pt-[calc(1rem+80px)] bg-black/75 backdrop-blur-md overflow-y-auto"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className={`flex flex-col max-h-full relative w-full ${maxWidth} my-auto rounded-2xl
                           bg-white dark:bg-[#121320]
                           border border-black/10 dark:border-white/10
                           shadow-2xl shadow-black/50 overflow-hidden ${className}`}
            >
                {/* Header */}
                {(title || Icon) && (
                    <div className={`flex items-center justify-between px-6 py-5 border-b border-black/5 dark:border-white/10 bg-gradient-to-r ${headerGradient}`}>
                        <div className="flex items-center gap-3">
                            {Icon && (
                                <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor} shrink-0`}>
                                    {renderIcon()}
                                </div>
                            )}
                            <div>
                                {React.isValidElement(title) ? (
                                    title
                                ) : (
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                                        {title}
                                    </h2>
                                )}
                                {subtitle && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {headerRight}
                            {exitable && onClose && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Body */}
                {children}

                {/* Optional Footer */}
                {footer && (
                    <div className="flex items-center justify-end px-6 py-4 border-t border-black/5 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01]">
                        {footer}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default ModalWrapper;
