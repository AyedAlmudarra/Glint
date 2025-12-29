import { AnimatePresence, motion } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-2xl shadow-lg p-8 w-full max-w-md text-right"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 flex-shrink-0 bg-[var(--color-warning)]/20 text-[var(--color-warning)] rounded-full flex items-center justify-center">
                            <FaExclamationTriangle size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">{title}</h2>
                            <p className="text-[var(--color-text-secondary)] leading-relaxed">{children}</p>
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-start gap-4">
                        <button
                            onClick={onConfirm}
                            className="bg-[var(--color-error)] hover:opacity-90 text-white font-bold py-2 px-6 rounded-lg transition-all"
                        >
                            تأكيد
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] font-bold py-2 px-6 rounded-lg transition-all border border-[var(--color-border-primary)]"
                        >
                            إلغاء
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ConfirmModal; 