import { useState } from 'react';
import { FaStar, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import Confetti from 'react-confetti';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

const FeedbackModal = ({ isOpen, onClose, taskId }) => {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleRating = (rate) => {
        setRating(rate);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        if (!user || !taskId) return;

        const { error } = await supabase
            .from('user_task_feedback')
            .insert({
                user_id: user.id,
                task_id: taskId,
                rating,
                comment,
            });

        setIsSubmitting(false);
        if (error && error.code !== '23505') { 
            alert("حدث خطأ أثناء إرسال تقييمك.");
        } else {
            setIsSubmitted(true);
        }
    };
    
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/75 backdrop-blur-sm flex justify-center items-center z-50"
                    dir="rtl"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-2xl p-8 max-w-lg w-full relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={onClose} className="absolute top-4 left-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] text-2xl">
                            <FaTimesCircle />
                        </button>
                        <Confetti recycle={false} numberOfPieces={isSubmitted ? 500 : 0} />
                        {!isSubmitted ? (
                            <>
                                <h2 className="text-2xl font-bold text-center text-[var(--color-text-primary)] mb-2">أحسنت! تم حل التحدي بنجاح</h2>
                                <p className="text-center text-[var(--color-text-secondary)] mb-6">نود معرفة رأيك في هذا التحدي لمساعدتنا في التحسين.</p>
                                <div className="flex justify-center my-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            className={`cursor-pointer text-4xl ${rating >= star ? 'text-[var(--color-warning)]' : 'text-[var(--color-text-muted)]'}`}
                                            onClick={() => handleRating(star)}
                                        />
                                    ))}
                                </div>
                                <textarea
                                    className="w-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)] rounded-lg p-3 h-24 focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:outline-none"
                                    placeholder="هل لديك أي ملاحظات أخرى؟"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <div className="mt-6 flex justify-between">
                                     <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || rating === 0}
                                        className="bg-[var(--color-success)] text-white font-bold py-2 px-6 rounded-lg hover:opacity-90 disabled:bg-[var(--color-text-muted)] disabled:cursor-not-allowed transition-all"
                                    >
                                        {isSubmitting ? <FaSpinner className="animate-spin" /> : "إرسال التقييم"}
                                    </button>
                                     <button
                                        onClick={() => setIsSubmitted(true)}
                                        className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                                    >
                                        تخطي
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-[var(--color-success)] mb-4">اكتمل التحدي!</h2>
                                <p className="text-[var(--color-text-secondary)] mb-8">لقد اكتسبت مهارة جديدة. استمر في التقدم!</p>
                                 <button
                                    onClick={onClose}
                                    className="bg-[var(--color-accent-primary)] text-white font-bold py-3 px-8 text-lg rounded-lg hover:opacity-90 transition-all"
                                >
                                    إغلاق
                                </button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FeedbackModal; 