import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaCompass, FaRobot } from 'react-icons/fa';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute w-96 h-96 bg-[var(--color-accent-primary)]/10 rounded-full blur-3xl"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    style={{ top: '10%', right: '10%' }}
                />
                <motion.div
                    className="absolute w-80 h-80 bg-[var(--color-accent-secondary)]/10 rounded-full blur-3xl"
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 80, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    style={{ bottom: '10%', left: '10%' }}
                />
            </div>

            <div className="relative z-10 text-center max-w-2xl mx-auto">
                {/* 404 Number with glitch effect */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="relative mb-8"
                >
                    <span className="text-[150px] sm:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] leading-none select-none">
                        404
                    </span>
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ opacity: [0, 0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <span className="text-[150px] sm:text-[200px] font-black text-[var(--color-accent-primary)]/20 blur-sm leading-none">
                            404
                        </span>
                    </motion.div>
                </motion.div>

                {/* Arabic Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                        الصفحة غير موجودة
                    </h1>
                    <p className="text-lg text-[var(--color-text-secondary)] max-w-md mx-auto">
                        يبدو أنك ضللت الطريق! لا تقلق، يمكنك العودة للاستكشاف من هنا.
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Link
                        to="/"
                        className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-l from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[var(--color-accent-primary)]/25 transition-all duration-300 hover:-translate-y-1"
                    >
                        <FaHome className="text-xl group-hover:scale-110 transition-transform" />
                        <span>الصفحة الرئيسية</span>
                    </Link>
                    
                    <Link
                        to="/simulations"
                        className="group flex items-center gap-3 px-8 py-4 bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] font-bold rounded-xl border border-[var(--color-border-primary)] hover:border-[var(--color-accent-primary)] transition-all duration-300 hover:-translate-y-1"
                    >
                        <FaCompass className="text-xl group-hover:rotate-45 transition-transform" />
                        <span>استكشف المحاكيات</span>
                    </Link>
                    
                    <Link
                        to="/sanad"
                        className="group flex items-center gap-3 px-8 py-4 bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] font-bold rounded-xl border border-[var(--color-border-primary)] hover:border-[var(--color-accent-secondary)] transition-all duration-300 hover:-translate-y-1"
                    >
                        <FaRobot className="text-xl group-hover:animate-bounce" />
                        <span>تحدث مع سند</span>
                    </Link>
                </motion.div>

                {/* Fun illustration */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 text-[var(--color-text-muted)]"
                >
                    <div className="flex justify-center gap-2 text-4xl mb-4">
                        <motion.span
                            animate={{ rotate: [-10, 10, -10] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            🔍
                        </motion.span>
                        <motion.span
                            animate={{ y: [-5, 5, -5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            🤔
                        </motion.span>
                        <motion.span
                            animate={{ rotate: [10, -10, 10] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        >
                            🗺️
                        </motion.span>
                    </div>
                    <p className="text-sm">
                        رمز الخطأ: PAGE_NOT_FOUND
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

