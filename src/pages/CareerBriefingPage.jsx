import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import DashboardLayout from '../components/DashboardLayout';
import * as FaIcons from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';

// Dynamic Icon Component
const DynamicFaIcon = ({ name, className = '' }) => {
    const IconComponent = FaIcons[name];
    if (!IconComponent) { 
        return <FaIcons.FaQuestionCircle className={className} />;
    }
    return <IconComponent className={className} />;
};

// Tab Button
const TabButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`
            flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all whitespace-nowrap
            ${active 
                ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30' 
                : 'bg-[var(--color-surface-1)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] border border-[var(--color-border-default)]'
            }
        `}
    >
        {icon}
        <span className="hidden sm:inline">{label}</span>
    </button>
);

// Overview Tab Content
const OverviewTab = ({ brief, description }) => {
    const persona = brief.persona || {};
    const [name, role] = (persona.name || '').split(',').map(s => s.trim());

    return (
        <div className="space-y-6">
            {/* Quick Summary */}
            <Card className="bg-gradient-to-l from-[var(--color-primary)]/10 to-transparent border-[var(--color-primary)]/20">
                <p className="text-lg text-[var(--color-text-primary)] text-right leading-relaxed">
                    {description}
                </p>
            </Card>
            
            {/* Persona Quote */}
            {persona.quote && (
                <Card>
                    <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-right">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-[var(--color-primary)]/30 shrink-0">
                            {name?.[0] || '?'}
            </div>
            <div className="flex-1">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-3">
                                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">{name}</h3>
                                {role && <Badge variant="primary">{role}</Badge>}
                            </div>
                            <blockquote className="relative">
                                <FaIcons.FaQuoteRight className="absolute -top-2 right-0 text-3xl text-[var(--color-primary)]/10" />
                                <p className="text-[var(--color-text-secondary)] italic leading-relaxed pr-8">
                                    {persona.quote}
                                </p>
                </blockquote>
            </div>
                    </div>
                </Card>
            )}
            
            {/* What You Create */}
            {brief.what_you_create && (
                <Card>
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 text-right flex items-center justify-end gap-3">
                        <span>ما الذي يمكنك بناؤه؟</span>
                        <FaIcons.FaRocket className="text-[var(--color-primary)]" />
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {brief.what_you_create.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3 p-4 rounded-xl bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-3)] transition-colors"
                            >
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                                    <DynamicFaIcon name={item.icon} className="text-emerald-400 text-sm" />
                                </div>
                                <p className="text-[var(--color-text-secondary)] flex-1 text-right">{item.title}</p>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};

// Day in Life Tab Content
const DayInLifeTab = ({ timeline }) => {
    if (!timeline || timeline.length === 0) return null;
    
    return (
        <Card>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 text-right flex items-center justify-end gap-3">
                <span>يوم نموذجي في هذه المهنة</span>
                <FaIcons.FaRegClock className="text-blue-400" />
            </h3>
            <div className="space-y-1">
                {timeline.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4"
                    >
        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                                <DynamicFaIcon name={item.icon} className="text-lg sm:text-xl" />
            </div>
                            {index !== timeline.length - 1 && (
                                <div className="w-0.5 h-12 sm:h-16 bg-gradient-to-b from-[var(--color-primary)]/50 to-transparent mt-2" />
                            )}
        </div>
                        <div className="flex-1 pb-6">
                            <Badge variant="primary" size="sm" className="mb-2">{item.time}</Badge>
                            <h4 className="font-bold text-[var(--color-text-primary)] mb-1 text-right">{item.activity}</h4>
                            <p className="text-[var(--color-text-secondary)] text-sm text-right">{item.description}</p>
        </div>
                    </motion.div>
                ))}
    </div>
        </Card>
    );
};

// Skills Tab Content
const SkillsTab = ({ bridgeSkills }) => {
    if (!bridgeSkills || bridgeSkills.length === 0) return null;
    
    return (
        <Card>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 text-right flex items-center justify-end gap-3">
                <span>جسور المهارات</span>
                <FaIcons.FaLink className="text-purple-400" />
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-6 text-right text-sm">
                المهارات التي تمتلكها بالفعل قد تكون أساساً قوياً لهذه المهنة
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bridgeSkills.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center bg-gradient-to-b from-[var(--color-surface-2)] to-[var(--color-bg-primary)] p-6 rounded-xl border border-[var(--color-border-default)] hover:border-purple-500/50 transition-all"
                    >
                        <p className="text-xs text-[var(--color-text-muted)]">إذا كنت جيدًا في</p>
                        <p className="font-bold text-[var(--color-primary)] text-lg my-2">{item.from}</p>
                        <div className="w-8 h-8 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center mx-auto my-2">
                            <FaIcons.FaArrowDown className="text-[var(--color-text-muted)] text-sm" />
        </div>
                        <p className="text-xs text-[var(--color-text-muted)]">إذًا لديك أساس</p>
                        <p className="font-bold text-emerald-400 text-lg mt-2">{item.to}</p>
                    </motion.div>
                ))}
            </div>
        </Card>
    );
};

// Career Path Tab Content
const CareerPathTab = ({ highsLows, careerPath, salaryRange }) => (
    <div className="space-y-6">
        {/* Highs & Lows */}
        {highsLows && (
            <Card>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 text-right flex items-center justify-end gap-3">
                    <span>الإيجابيات والتحديات</span>
                    <FaIcons.FaBalanceScale className="text-amber-400" />
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 sm:p-6 rounded-xl">
                        <h4 className="font-bold text-emerald-400 mb-4 flex items-center justify-end gap-2">
                            الإيجابيات
                            <FaIcons.FaThumbsUp />
                        </h4>
                        <ul className="space-y-2">
                            {highsLows.highs?.map((high, i) => (
                                <li key={i} className="flex items-start gap-2 text-[var(--color-text-secondary)] text-sm text-right">
                                    <span className="flex-1">{high}</span>
                                    <FaIcons.FaCheckCircle className="text-emerald-400 mt-0.5 shrink-0" />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 p-4 sm:p-6 rounded-xl">
                        <h4 className="font-bold text-red-400 mb-4 flex items-center justify-end gap-2">
                            التحديات
                            <FaIcons.FaExclamationCircle />
                        </h4>
                        <ul className="space-y-2">
                            {highsLows.lows?.map((low, i) => (
                                <li key={i} className="flex items-start gap-2 text-[var(--color-text-secondary)] text-sm text-right">
                                    <span className="flex-1">{low}</span>
                                    <FaIcons.FaTimesCircle className="text-red-400 mt-0.5 shrink-0" />
                                </li>
                            ))}
                </ul>
            </div>
        </div>
            </Card>
        )}
        
        {/* Career Path Steps */}
        {careerPath && careerPath.length > 0 && (
            <Card>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 text-right flex items-center justify-end gap-3">
                    <span>مسارك المهني المحتمل</span>
                    <FaIcons.FaRoute className="text-cyan-400" />
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                    {careerPath.map((step, index) => (
                <React.Fragment key={index}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex flex-col items-center text-center w-24 sm:w-32"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center text-white font-bold mb-2 shadow-lg shadow-[var(--color-primary)]/30 text-sm sm:text-base">
                                    {index + 1}
                    </div>
                                <span className="text-xs sm:text-sm text-[var(--color-text-secondary)]">{step}</span>
                            </motion.div>
                            {index < careerPath.length - 1 && (
                                <div className="hidden sm:block w-8 h-0.5 bg-gradient-to-l from-[var(--color-primary)] to-transparent rounded-full" />
                            )}
                </React.Fragment>
            ))}
        </div>
            </Card>
        )}
        
        {/* Salary */}
        {salaryRange && (
            <Card className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <FaIcons.FaMoneyBillWave className="text-emerald-400 text-xl" />
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)]">توقعات الراتب</h3>
                </div>
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-l from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-3">
                    {salaryRange}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                    سنوياً - بناءً على بيانات السوق السعودي
                </p>
            </Card>
        )}
    </div>
);

// Sticky CTA Bar
const StickyCTA = ({ title, onStart, isVisible }) => (
    <AnimatePresence>
        {isVisible && (
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-0 left-0 right-0 bg-[var(--color-surface-1)]/95 backdrop-blur-xl border-t border-[var(--color-border-default)] z-50 p-4"
            >
                <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                    <div className="hidden sm:block text-right min-w-0">
                        <p className="text-sm text-[var(--color-text-muted)]">هل أنت جاهز؟</p>
                        <p className="font-bold text-[var(--color-text-primary)] truncate">{title}</p>
                    </div>
                    <Button 
                        onClick={onStart}
                        variant="primary" 
                        size="lg"
                        icon={<FaIcons.FaPlay />}
                        className="w-full sm:w-auto shadow-xl shadow-[var(--color-primary)]/30"
                    >
                        ابدأ التجربة
                    </Button>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

// Is This For Me Card
const IsThisForMeCard = ({ onResponse }) => {
    const [selected, setSelected] = useState(null);
    
    const options = [
        { id: 'interested', label: 'مهتم جداً', icon: '🤩', color: 'emerald' },
        { id: 'maybe', label: 'ربما', icon: '🤔', color: 'amber' },
        { id: 'not-for-me', label: 'ليس لي', icon: '😕', color: 'red' },
    ];
    
    return (
        <Card className="text-center bg-gradient-to-b from-[var(--color-surface-1)] to-[var(--color-bg-primary)]">
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                بناءً على ما قرأت، كيف تشعر؟
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                هذا يساعدنا في تخصيص توصياتنا لك
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
                {options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => {
                            setSelected(option.id);
                            onResponse?.(option.id);
                        }}
                        className={`
                            px-4 py-3 rounded-xl flex items-center gap-2 transition-all text-sm font-medium
                            ${selected === option.id
                                ? `bg-${option.color}-500/20 border-2 border-${option.color}-500/50 text-${option.color}-400`
                                : 'bg-[var(--color-surface-2)] border-2 border-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-3)]'
                            }
                        `}
                    >
                        <span className="text-xl">{option.icon}</span>
                        <span>{option.label}</span>
                    </button>
                ))}
            </div>
        </Card>
    );
};

// Main Component
export default function CareerBriefingPage() {
    const { simulationId } = useParams();
    const navigate = useNavigate();
    const [simulation, setSimulation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [showStickyCTA, setShowStickyCTA] = useState(false);

    useEffect(() => {
        const fetchBriefing = async () => {
            setLoading(true);
            const { data, error: fetchError } = await supabase
                .from('simulations')
                .select('title, description, enhanced_briefing, icon_name')
                .eq('id', simulationId)
                .single();

            if (fetchError) {
                setError("لم يتم العثور على المحاكاة المطلوبة.");
            } else {
                setSimulation(data);
            }
            setLoading(false);
        };

        if (simulationId) fetchBriefing();
    }, [simulationId]);

    useEffect(() => {
        const handleScroll = () => {
            setShowStickyCTA(window.scrollY > 200);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleStartSimulation = () => navigate(`/simulations/task/${simulationId}`);

    const tabs = [
        { id: 'overview', label: 'نظرة عامة', icon: <FaIcons.FaEye className="w-4 h-4" /> },
        { id: 'day-in-life', label: 'يوم في الحياة', icon: <FaIcons.FaRegClock className="w-4 h-4" /> },
        { id: 'skills', label: 'المهارات', icon: <FaIcons.FaLink className="w-4 h-4" /> },
        { id: 'career', label: 'المسار', icon: <FaIcons.FaRoute className="w-4 h-4" /> },
    ];

    // Loading State
    if (loading) {
        return (
            <DashboardLayout>
                <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
                    <div className="animate-pulse">
                        <div className="h-8 w-48 bg-[var(--color-surface-2)] rounded-lg mb-2 mx-auto" />
                        <div className="h-6 w-64 bg-[var(--color-surface-2)] rounded-lg mx-auto" />
                    </div>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-10 w-24 bg-[var(--color-surface-2)] rounded-xl" />
                        ))}
                    </div>
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </DashboardLayout>
        );
    }

    // Error State
    if (error) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh] p-4">
                    <Card className="text-center max-w-md w-full">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                            <FaIcons.FaExclamationTriangle className="w-8 h-8 text-red-400" />
                    </div>
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">خطأ</h2>
                        <p className="text-[var(--color-text-secondary)] mb-4">{error}</p>
                        <Button variant="primary" onClick={() => navigate('/simulations')}>
                            العودة للمحاكاة
                        </Button>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    // No Data State
    if (!simulation || !simulation.enhanced_briefing) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh] p-4">
                    <Card className="text-center max-w-md w-full">
                        <div className="w-16 h-16 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center mx-auto mb-4">
                            <FaIcons.FaInfoCircle className="w-8 h-8 text-[var(--color-text-muted)]" />
                        </div>
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">لا توجد بيانات</h2>
                        <p className="text-[var(--color-text-secondary)] mb-4">لا توجد بيانات تعريفية لهذه المحاكاة.</p>
                        <Button variant="primary" onClick={() => navigate('/simulations')}>
                            استكشف محاكاة أخرى
                        </Button>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    const { description, enhanced_briefing: brief } = simulation;

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-4"
                >
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        icon={<FaIcons.FaArrowRight />}
                        size="sm"
                    >
                        رجوع
                    </Button>
                </motion.div>

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <Badge variant="primary" className="mb-3">استكشاف المسار المهني</Badge>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)] mb-3">
                        {brief.identity_headline}
                    </h1>
                    
                    {/* Primary CTA */}
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleStartSimulation}
                        icon={<FaIcons.FaPlay />}
                        className="mt-4 shadow-xl shadow-[var(--color-primary)]/30"
                    >
                        ابدأ التجربة الآن
                    </Button>
                </motion.header>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-center gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar"
                >
                    {tabs.map((tab) => (
                        <TabButton
                            key={tab.id}
                            active={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            icon={tab.icon}
                            label={tab.label}
                        />
                    ))}
                </motion.div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'overview' && (
                            <OverviewTab brief={brief} description={description} />
                        )}
                        {activeTab === 'day-in-life' && (
                            <DayInLifeTab timeline={brief.day_in_the_life_timeline} />
                        )}
                        {activeTab === 'skills' && (
                            <SkillsTab bridgeSkills={brief.bridge_skills} />
                        )}
                        {activeTab === 'career' && (
                            <CareerPathTab 
                                highsLows={brief.highs_lows}
                                careerPath={brief.career_path_steps}
                                salaryRange={brief.salary_range}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Is This For Me */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8"
                >
                    <IsThisForMeCard onResponse={(response) => console.log('Career fit response:', response)} />
                </motion.div>

                {/* Ask Sanad */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6"
                >
                    <Link to="/sanad" className="block group">
                        <Card className="flex items-center gap-4 bg-gradient-to-l from-[var(--color-primary)]/10 to-transparent border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/40 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/30 shrink-0">
                                <FaIcons.FaRobot className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 text-right min-w-0">
                                <p className="font-bold text-[var(--color-text-primary)]">لديك أسئلة؟</p>
                                <p className="text-sm text-[var(--color-text-secondary)]">تحدث مع سَند للمزيد من المعلومات</p>
                            </div>
                            <FaIcons.FaArrowLeft className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:-translate-x-1 transition-all shrink-0" />
                        </Card>
                    </Link>
                </motion.div>
            </div>

            {/* Sticky CTA */}
            <StickyCTA 
                title={brief.identity_headline}
                onStart={handleStartSimulation}
                isVisible={showStickyCTA}
            />
        </DashboardLayout>
    );
} 