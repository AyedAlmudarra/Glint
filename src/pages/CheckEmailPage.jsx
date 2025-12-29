import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { supabase } from '../supabaseClient';
import { useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';

export default function CheckEmailPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const email = location.state?.email || 'بريدك الإلكتروني';

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
        <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 mesh-gradient" />
            <div className="absolute top-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl" />
            
            {/* Back link */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-6 right-6 z-10"
            >
                <Link 
                    to="/signup" 
                    className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors text-sm"
                >
                    <span>العودة للتسجيل</span>
                    <FiArrowRight className="w-4 h-4" />
                </Link>
            </motion.div>

            <div className="w-full max-w-md relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card variant="glass" className="p-6 sm:p-8 text-center">
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="flex justify-center mb-6"
                        >
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center shadow-xl shadow-[var(--color-primary)]/30">
                                <FiMail className="w-10 h-10 text-white" />
                            </div>
                        </motion.div>

                        <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-[var(--color-text-primary)]">
                            تحقق من بريدك الإلكتروني
                        </h1>
                        <p className="text-[var(--color-text-secondary)] mb-2 text-sm sm:text-base">
                            لقد أرسلنا رابط تفعيل إلى:
                        </p>
                        <p className="text-lg font-semibold text-[var(--color-primary)] mb-6 break-all">
                            {email}
                        </p>
                        
                        {/* Steps */}
                        <div className="bg-[var(--color-surface-2)] rounded-xl p-4 mb-6 text-right">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <p className="text-sm text-[var(--color-text-secondary)] flex-1">افتح بريدك الإلكتروني</p>
                                    <div className="w-6 h-6 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-bold text-[var(--color-primary)]">1</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <p className="text-sm text-[var(--color-text-secondary)] flex-1">ابحث عن رسالة من جلينت</p>
                                    <div className="w-6 h-6 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-bold text-[var(--color-primary)]">2</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <p className="text-sm text-[var(--color-text-secondary)] flex-1">اضغط على رابط التفعيل</p>
                                    <div className="w-6 h-6 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-bold text-[var(--color-primary)]">3</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Alerts */}
                        {message && (
                            <Alert variant="success" className="mb-4" dismissible onDismiss={() => setMessage('')}>
                                <FiCheckCircle className="w-4 h-4" />
                                {message}
                            </Alert>
                        )}
                        {error && (
                            <Alert variant="error" className="mb-4" dismissible onDismiss={() => setError('')}>
                                {error}
                            </Alert>
                        )}

                        {/* Actions */}
                        <div className="space-y-3">
                            <p className="text-xs text-[var(--color-text-muted)]">
                                لم تستلم البريد؟ تحقق من مجلد الرسائل غير المرغوب فيها (Spam)
                            </p>
                            <Button
                                variant="secondary"
                                onClick={handleResendEmail}
                                isLoading={loading}
                                isFullWidth
                            >
                                إعادة إرسال رابط التفعيل
                            </Button>
                            
                            <Button
                                as={Link}
                                to="/login"
                                variant="ghost"
                                isFullWidth
                            >
                                لدي حساب بالفعل - تسجيل الدخول
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}