import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      {/* Back to home link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-6 right-6"
      >
        <Link 
          to="/" 
          className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <span>الرئيسية</span>
          <FaArrowLeft className="w-4 h-4" />
        </Link>
      </motion.div>
      
      <div className="w-full max-w-md mx-auto relative z-10">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-block">
            <img 
              src="/GlintFullLogoWhite.png" 
              alt="Glint" 
              className="h-12 w-auto mx-auto"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </Link>
        </motion.div>
        
        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card variant="glass" className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                تسجيل الدخول
              </h2>
              <p className="text-[var(--color-text-secondary)]">
                أهلاً بعودتك! لنكمل رحلتك.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="email"
                label="البريد الإلكتروني"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<FaEnvelope className="w-5 h-5" />}
                required
                autoComplete="email"
              />
              
              <Input
                type="password"
                label="كلمة المرور"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<FaLock className="w-5 h-5" />}
                required
                autoComplete="current-password"
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert variant="error" dismissible onDismiss={() => setError('')}>
                    {error}
                  </Alert>
                </motion.div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isFullWidth
                isLoading={loading}
              >
                تسجيل الدخول
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-[var(--color-text-secondary)]">
                ليس لديك حساب؟{' '}
                <Link 
                  to="/signup" 
                  className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors"
                >
                  إنشاء حساب
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
        
        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-[var(--color-text-muted)] text-sm mt-8"
        >
          بتسجيل الدخول، أنت توافق على{' '}
          <Link to="/terms" className="text-[var(--color-primary)] hover:underline">
            شروط الاستخدام
          </Link>
          {' '}و{' '}
          <Link to="/privacy" className="text-[var(--color-primary)] hover:underline">
            سياسة الخصوصية
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
