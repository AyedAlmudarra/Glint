import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaUser, FaSave, FaTimes } from 'react-icons/fa';
import { supabase } from '../../supabaseClient';
import Spinner from '../Spinner';

const EditProfileModal = ({ isOpen, onClose, user, onProfileUpdate }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('first_name, last_name')
                    .eq('id', user.id)
                    .single();
                if (error) throw error;
                if (data) {
                    setFirstName(data.first_name || '');
                    setLastName(data.last_name || '');
                }
            } catch (err) {
                console.error("Error fetching profile for modal:", err);
                setError('فشل في تحميل بيانات الملف الشخصي.');
            }
        };
        if (isOpen) {
            fetchProfile();
        }
    }, [isOpen, user]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!firstName.trim() || !lastName.trim()) {
            setError('الرجاء إدخال الاسم الأول والأخير.');
            return;
        }
        setIsUpdating(true);
        setError('');
        try {
            const { data, error } = await supabase
                .from('users')
                .update({ 
                    first_name: firstName, 
                    last_name: lastName,
                    full_name: `${firstName} ${lastName}`
                })
                .eq('id', user.id)
                .select('first_name, last_name, full_name')
                .single();

            if (error) throw error;
            
            onProfileUpdate(data);
            onClose();

        } catch (err) {
            console.error("Error updating profile:", err);
            setError('فشل في تحديث الملف الشخصي. الرجاء المحاولة مرة أخرى.');
        } finally {
            setIsUpdating(false);
        }
    };

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
                    className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-2xl shadow-lg p-8 w-full max-w-lg text-right"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 flex-shrink-0 bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)] rounded-full flex items-center justify-center">
                            <FaUser size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">تعديل الملف الشخصي</h2>
                            <p className="text-[var(--color-text-secondary)]">قم بتحديث اسمك الأول والأخير.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSave}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">الاسم الأول</label>
                                <input
                                    id="firstName"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] rounded-lg p-3 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-[var(--color-accent-primary)] focus:outline-none"
                                    disabled={isUpdating}
                                />
                            </div>
                             <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">الاسم الأخير</label>
                                <input
                                    id="lastName"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] rounded-lg p-3 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-[var(--color-accent-primary)] focus:outline-none"
                                    disabled={isUpdating}
                                />
                            </div>
                        </div>

                        {error && <p className="text-[var(--color-error)] text-sm mt-4 text-center">{error}</p>}

                        <div className="mt-8 flex justify-start gap-4">
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="bg-[var(--color-accent-primary)] hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isUpdating ? <Spinner /> : <FaSave />}
                                <span>{isUpdating ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isUpdating}
                                className="bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] font-bold py-3 px-6 rounded-lg transition-all border border-[var(--color-border-primary)]"
                            >
                                إلغاء
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EditProfileModal; 