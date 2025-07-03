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
                        className="bg-gray-800 rounded-2xl p-8 max-w-lg w-full relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={onClose} className="absolute top-4 left-4 text-gray-500 hover:text-white text-2xl">
                            <FaTimesCircle />
                        </button>
                        <Confetti recycle={false} numberOfPieces={isSubmitted ? 500 : 0} />
                        {!isSubmitted ? (
                            <>
                                <h2 className="text-2xl font-bold text-center text-white mb-2">أحسنت! تم حل التحدي بنجاح</h2>
                                <p className="text-center text-gray-400 mb-6">نود معرفة رأيك في هذا التحدي لمساعدتنا في التحسين.</p>
                                <div className="flex justify-center my-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            className={`cursor-pointer text-4xl ${rating >= star ? 'text-yellow-400' : 'text-gray-600'}`}
                                            onClick={() => handleRating(star)}
                                        />
                                    ))}
                                </div>
                                <textarea
                                    className="w-full bg-gray-700 text-white rounded-lg p-3 h-24"
                                    placeholder="هل لديك أي ملاحظات أخرى؟"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <div className="mt-6 flex justify-between">
                                     <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || rating === 0}
                                        className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? <FaSpinner className="animate-spin" /> : "إرسال التقييم"}
                                    </button>
                                     <button
                                        onClick={() => setIsSubmitted(true)}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        تخطي
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-green-400 mb-4">اكتمل التحدي!</h2>
                                <p className="text-gray-300 mb-8">لقد اكتسبت مهارة جديدة. استمر في التقدم!</p>
                                 <button
                                    onClick={onClose}
                                    className="bg-blue-600 text-white font-bold py-3 px-8 text-lg rounded-lg hover:bg-blue-500 transition-colors"
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