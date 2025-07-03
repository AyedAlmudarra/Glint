import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { supabase } from '../supabaseClient';
import { useState } from 'react';
import Spinner from '../components/Spinner';

export default function CheckEmailPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Fallback if email is not passed in state
    const email = location.state?.email || 'your email';

    if (!location.state?.email) {
        // Optional: Redirect if the page is accessed directly without context
        // useEffect(() => { navigate('/signup'); }, [navigate]);
        // For now, we'll just show a generic message.
    }

    const handleResendEmail = async () => {
        setLoading(true);
        setMessage('');
        setError('');

        const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: email,
        });

        setLoading(false);
        if (resendError) {
            setError(`حدث خطأ: ${resendError.message}`);
        } else {
            setMessage('تم إرسال رابط جديد إلى بريدك الإلكتروني.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 text-center z-10"
            >
                <div className="flex justify-center mb-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: 360 }}
                        transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
                        className="bg-blue-600 p-4 rounded-full"
                    >
                        <FiMail className="w-10 h-10 text-white" />
                    </motion.div>
                </div>

                <h1 className="text-3xl font-bold mb-4 text-blue-300">لقد أوشكت على الانتهاء!</h1>
                <p className="text-gray-300 mb-2">
                    لقد أرسلنا رابط تفعيل إلى بريدك الإلكتروني:
                </p>
                <p className="text-lg font-semibold text-yellow-400 mb-8 break-all">{email}</p>
                <p className="text-gray-400 mb-8">
                    الرجاء الضغط على الرابط الموجود في البريد الإلكتروني لتفعيل حسابك والبدء في رحلتك المهنية معنا.
                </p>

                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        لم تستلم البريد؟ تحقق من مجلد الرسائل غير المرغوب فيها (Spam) أو حاول إعادة إرسال الرابط.
                    </p>
                    <button
                        onClick={handleResendEmail}
                        disabled={loading}
                        className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {loading ? <Spinner /> : 'إعادة إرسال رابط التفعيل'}
                    </button>
                    {message && <p className="text-green-400">{message}</p>}
                    {error && <p className="text-red-400">{error}</p>}
                </div>
            </motion.div>
            
            <Link to="/signup" className="absolute top-8 left-8 text-gray-400 hover:text-white transition-colors flex items-center gap-2 z-10">
                <FiArrowLeft />
                <span>العودة إلى التسجيل</span>
            </Link>

             {/* Animated background elements */}
            <motion.div 
                className="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full filter blur-3xl opacity-50"
                animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
                transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            />
            <motion.div 
                className="absolute bottom-0 right-0 w-72 h-72 bg-green-500/20 rounded-full filter blur-3xl opacity-50"
                animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
                transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse' }}
            />
        </div>
    );
} 