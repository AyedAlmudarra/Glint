import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import InputField from '../components/forms/InputField';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 animated-gradient">
      <div className="w-full max-w-md mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
        >
           <h1 className="text-4xl font-bold text-white">Glint</h1>
        </motion.div>
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full"
        >
          <h2 className="text-3xl font-bold text-center mb-2 text-blue-400">تسجيل الدخول</h2>
           <p className="text-center text-gray-300 mb-6">أهلاً بعودتك! لنكمل رحلتك.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<FaEnvelope />}
            />
            <InputField
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<FaLock />}
              isPassword={true}
              showPassword={showPassword}
              onToggleShowPassword={() => setShowPassword(!showPassword)}
            />

            {error && (
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-center"
                >
                    {error}
                </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? <Spinner /> : 'تسجيل الدخول'}
            </motion.button>
          </form>
          <p className="text-center text-gray-400 mt-6">
            ليس لديك حساب؟{' '}
            <Link to="/signup" className="font-bold text-blue-400 hover:underline">
              إنشاء حساب
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}