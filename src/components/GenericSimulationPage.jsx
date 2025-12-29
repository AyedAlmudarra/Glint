import { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTrophy, FaLightbulb, FaQuestionCircle, FaChevronDown, FaArrowLeft, FaArrowRight, FaRobot, FaTimes, FaRegSmile, FaRegMeh, FaRegFrown, FaBookOpen, FaPlay, FaCompass } from 'react-icons/fa';

import DashboardLayout from './DashboardLayout';
import { supabase } from '../supabaseClient';
import CodeChallengeTask from './tasks/CodeChallengeTask';
import MultipleChoiceTask from './tasks/MultipleChoiceTask';
import DiagramInterpretationTask from './tasks/DiagramInterpretationTask';
import ChatbotTask from './tasks/ChatbotTask';
import ProblemAnalysisTask from './tasks/ProblemAnalysisTask';
import IncomeStatementTask from './tasks/IncomeStatementTask';
import BalanceSheetTask from './tasks/BalanceSheetTask';
import PortfolioBuilderTask from './tasks/PortfolioBuilderTask';
import WriteAndReactTask from './tasks/WriteAndReactTask';
import CampaignBudgetAnalyzerTask from './tasks/CampaignBudgetAnalyzerTask';
import MarketingFunnelBuilderTask from './tasks/MarketingFunnelBuilderTask';
import CustomerPersonaCreatorTask from './tasks/CustomerPersonaCreatorTask';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import ProgressBar from './ui/ProgressBar';

// Smart Help Panel - appears when user needs it
const SmartHelpPanel = ({ task, isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('hints');
    const [revealedHints, setRevealedHints] = useState([]);
    
    if (!task?.definition?.ui_schema) return null;
    
    const { ui_schema } = task.definition;
    const hints = ui_schema.hints || [];
    const learningModule = ui_schema.learning_module;
    const steps = ui_schema.steps;
    
    const revealNextHint = () => {
        if (revealedHints.length < hints.length) {
            setRevealedHints(prev => [...prev, hints[prev.length]]);
        }
    };
    
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 300 }}
                    className="fixed top-0 left-0 h-full w-full sm:w-96 bg-[var(--color-surface-1)] border-r border-[var(--color-border-default)] shadow-2xl z-50 flex flex-col"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-[var(--color-border-default)] flex items-center justify-between">
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-[var(--color-surface-2)] text-[var(--color-text-muted)] transition-colors"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-bold text-[var(--color-text-primary)]">مساعدة</h3>
                    </div>
                    
                    {/* Tabs */}
                    <div className="flex border-b border-[var(--color-border-default)]">
                        {hints.length > 0 && (
                            <button
                                onClick={() => setActiveTab('hints')}
                                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                                    activeTab === 'hints'
                                        ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                                }`}
                            >
                                تلميحات
                            </button>
                        )}
                        {steps && (
                            <button
                                onClick={() => setActiveTab('steps')}
                                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                                    activeTab === 'steps'
                                        ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                                }`}
                            >
                                خطوات
                            </button>
                        )}
                        {learningModule && (
                            <button
                                onClick={() => setActiveTab('learn')}
                                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                                    activeTab === 'learn'
                                        ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                                }`}
                            >
                                تعلم
                            </button>
                        )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {activeTab === 'hints' && hints.length > 0 && (
                            <div className="space-y-3">
                                {revealedHints.map((hint, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-right"
                                    >
                                        <div className="flex items-start gap-3">
                                            <p className="text-[var(--color-text-secondary)] flex-1">{hint}</p>
                                            <FaLightbulb className="text-amber-400 shrink-0 mt-1" />
                                        </div>
                                    </motion.div>
                                ))}
                                
                                {revealedHints.length < hints.length && (
                                    <Button
                                        variant="secondary"
                                        onClick={revealNextHint}
                                        className="w-full"
                                        icon={<FaLightbulb />}
                                    >
                                        اكشف تلميح ({revealedHints.length + 1}/{hints.length})
                                    </Button>
                                )}
                                
                                {revealedHints.length === 0 && (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                                            <FaLightbulb className="w-8 h-8 text-amber-400" />
                                        </div>
                                        <p className="text-[var(--color-text-secondary)] mb-4">
                                            هل تحتاج مساعدة؟ اكشف التلميحات واحدة تلو الأخرى.
                                        </p>
                                        <Button
                                            variant="primary"
                                            onClick={revealNextHint}
                                            icon={<FaLightbulb />}
                                        >
                                            اكشف أول تلميح
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {activeTab === 'steps' && steps && (
                            <div className="space-y-4">
                                {steps.map((step, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shrink-0 text-sm font-bold">
                                            {index + 1}
                                        </div>
                                        <p 
                                            className="text-[var(--color-text-secondary)] pt-1 text-right flex-1"
                                            dangerouslySetInnerHTML={{ __html: step }}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                        
                        {activeTab === 'learn' && learningModule && (
                            <div className="text-right">
                                <h4 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">
                                    {learningModule.title}
                                </h4>
                                <div 
                                    className="prose prose-invert text-[var(--color-text-secondary)] leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: learningModule.content }}
                                />
                            </div>
                        )}
                    </div>
                    
                    {/* Ask Sanad */}
                    <div className="p-4 border-t border-[var(--color-border-default)]">
                        <Link to="/sanad" className="block">
                            <div className="p-4 rounded-xl bg-gradient-to-l from-[var(--color-primary)]/20 to-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 flex items-center gap-3">
                                <FaArrowLeft className="text-[var(--color-primary)]" />
                                <div className="flex-1 text-right">
                                    <p className="font-medium text-[var(--color-text-primary)]">اسأل سَند</p>
                                    <p className="text-xs text-[var(--color-text-muted)]">المساعد الذكي جاهز لمساعدتك</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center">
                                    <FaRobot className="text-white" />
                                </div>
                            </div>
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Post-task Reflection Modal
const ReflectionModal = ({ isOpen, onClose, onSubmit, taskTitle }) => {
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    
    const emotions = [
        { id: 'enjoyed', icon: FaRegSmile, label: 'استمتعت', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/50' },
        { id: 'neutral', icon: FaRegMeh, label: 'عادية', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/50' },
        { id: 'struggled', icon: FaRegFrown, label: 'لم أستمتع', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50' },
    ];
    
    const handleSubmit = () => {
        onSubmit(selectedEmoji);
        setSelectedEmoji(null);
    };
    
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md"
                    >
                        <Card className="text-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                                <FaCheckCircle className="w-8 h-8 text-emerald-400" />
                            </div>
                            
                            <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                                أحسنت! 🎉
                            </h3>
                            <p className="text-[var(--color-text-secondary)] mb-6">
                                أكملت المهمة بنجاح
                            </p>
                            
                            <div className="bg-[var(--color-surface-2)] rounded-xl p-4 mb-6">
                                <p className="text-sm text-[var(--color-text-muted)] mb-4">
                                    سؤال سريع قبل أن نكمل:
                                </p>
                                <p className="text-lg font-medium text-[var(--color-text-primary)] mb-4">
                                    كيف كانت هذه التجربة؟
                                </p>
                                
                                <div className="flex justify-center gap-4">
                                    {emotions.map((emotion) => {
                                        const Icon = emotion.icon;
                                        const isSelected = selectedEmoji === emotion.id;
                                        return (
                                            <button
                                                key={emotion.id}
                                                onClick={() => setSelectedEmoji(emotion.id)}
                                                className={`
                                                    flex flex-col items-center gap-2 p-4 rounded-xl transition-all
                                                    ${isSelected 
                                                        ? `${emotion.bg} border-2 ${emotion.border} scale-110` 
                                                        : 'bg-[var(--color-surface-1)] border-2 border-transparent hover:bg-[var(--color-surface-3)]'
                                                    }
                                                `}
                                            >
                                                <Icon className={`w-8 h-8 ${isSelected ? emotion.color : 'text-[var(--color-text-muted)]'}`} />
                                                <span className={`text-xs font-medium ${isSelected ? emotion.color : 'text-[var(--color-text-muted)]'}`}>
                                                    {emotion.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full"
                                onClick={handleSubmit}
                                icon={<FaArrowLeft />}
                                iconPosition="end"
                            >
                                المهمة التالية
                            </Button>
                        </Card>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Task Progress Header
const TaskProgressHeader = ({ simulation, tasks, currentTaskIndex, userProgress, onBack }) => {
    const completedCount = userProgress.length;
    const totalCount = tasks.length;
    const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    
    return (
        <div className="sticky top-0 z-40 bg-[var(--color-bg-primary)]/95 backdrop-blur-sm border-b border-[var(--color-border-default)]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
                <div className="flex items-center justify-between gap-4">
                    {/* Back button & Title */}
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={onBack}
                            className="p-2 rounded-lg hover:bg-[var(--color-surface-1)] text-[var(--color-text-muted)] transition-colors shrink-0"
                        >
                            <FaArrowRight className="w-5 h-5" />
                        </button>
                        <div className="min-w-0">
                            <h1 className="text-sm sm:text-base font-bold text-[var(--color-text-primary)] truncate">
                                {simulation?.title}
                            </h1>
                            <p className="text-xs text-[var(--color-text-muted)]">
                                المهمة {currentTaskIndex + 1} من {totalCount}
                            </p>
                        </div>
                    </div>
                    
                    {/* Progress */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden sm:block w-32">
                            <ProgressBar value={progressPercent} size="sm" />
                        </div>
                        <Badge variant={completedCount === totalCount ? 'success' : 'primary'}>
                            {completedCount}/{totalCount}
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Floating Help Button
const FloatingHelpButton = ({ onClick, hasHelp }) => {
    if (!hasHelp) return null;
    
    return (
        <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-amber-500 text-white shadow-lg shadow-amber-500/30 flex items-center justify-center z-40 hover:bg-amber-600 transition-colors"
        >
            <FaLightbulb className="w-6 h-6" />
        </motion.button>
    );
};

// Task Content Renderer
const TaskContent = ({ task, feedback, setFeedback, onComplete, isSubmitting, userProgress }) => {
    if (!task || !task.definition) {
        return (
            <Card className="text-center py-12">
                <p className="text-[var(--color-text-secondary)]">لم يتم العثور على تعريف لهذه المهمة.</p>
            </Card>
        );
    }

    const { task_type } = task.definition;
    const taskId = task.id;

    switch (task_type) {
        case 'code_challenge':
            return <CodeChallengeTask definition={task.definition} onComplete={onComplete} taskId={taskId} feedback={feedback} setFeedback={setFeedback} isSubmitting={isSubmitting} />;
        case 'multiple_choice':
            return <MultipleChoiceTask definition={task.definition} onComplete={onComplete} feedback={feedback} isSubmitting={isSubmitting} />;
        case 'diagram_interpretation':
            return <DiagramInterpretationTask definition={task.definition} onComplete={onComplete} feedback={feedback} setFeedback={setFeedback} isSubmitting={isSubmitting} />;
        case 'chatbot_creation':
            return <ChatbotTask definition={task.definition} onComplete={onComplete} feedback={feedback} isSubmitting={isSubmitting} />;
        case 'problem_analysis':
            return <ProblemAnalysisTask task={task} onSubmit={onComplete} onFeedback={feedback} isCompleted={userProgress.includes(task.id)} isSubmitting={isSubmitting} />;
        case 'income_statement':
            return <IncomeStatementTask definition={task.definition} onComplete={onComplete} feedback={feedback} setFeedback={setFeedback} isSubmitting={isSubmitting} />;
        case 'balance_sheet':
            return <BalanceSheetTask definition={task.definition} onComplete={onComplete} feedback={feedback} setFeedback={setFeedback} isSubmitting={isSubmitting} />;
        case 'portfolio_builder':
            return <PortfolioBuilderTask definition={task.definition} onComplete={onComplete} feedback={feedback} setFeedback={setFeedback} isSubmitting={isSubmitting} />;
        case 'write_and_react':
            return <WriteAndReactTask definition={task.definition} onComplete={onComplete} isSubmitting={isSubmitting} />;
        case 'campaign_budget_analyzer':
            return <CampaignBudgetAnalyzerTask definition={task.definition} onComplete={onComplete} feedback={feedback} setFeedback={setFeedback} isSubmitting={isSubmitting} />;
        case 'marketing_funnel_builder':
            return <MarketingFunnelBuilderTask definition={task.definition} onComplete={onComplete} feedback={feedback} setFeedback={setFeedback} isSubmitting={isSubmitting} />;
        case 'customer_persona_creator':
            return <CustomerPersonaCreatorTask definition={task.definition} onComplete={onComplete} feedback={feedback} setFeedback={setFeedback} isSubmitting={isSubmitting} />;
        default:
            return (
                <Card className="text-center py-12">
                    <p className="text-[var(--color-text-secondary)]">نوع المهمة غير مدعوم: {task_type}</p>
                </Card>
            );
    }
};

// Simulation Completion Screen
const CompletionScreen = ({ simulation, userProgress, onRetake, onExploreMore }) => {
    const [selectedFit, setSelectedFit] = useState(null);
    
    const fitOptions = [
        { id: 'yes', label: 'نعم، يثير اهتمامي', color: 'emerald' },
        { id: 'maybe', label: 'ربما', color: 'amber' },
        { id: 'no', label: 'لا أعتقد', color: 'red' },
    ];
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
        >
            <Card className="text-center">
                {/* Trophy */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/30">
                    <FaTrophy className="w-12 h-12 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                    🎉 أكملت المحاكاة!
                </h2>
                <p className="text-lg text-[var(--color-text-secondary)] mb-8">
                    تهانينا! لقد جربت أساسيات {simulation?.title || 'هذا المسار'}
                </p>
                
                {/* Career Fit Question */}
                <div className="bg-[var(--color-surface-2)] rounded-2xl p-6 mb-8 text-right">
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">
                        سؤال مهم 🤔
                    </h3>
                    <p className="text-[var(--color-text-secondary)] mb-4">
                        هل يمكنك تخيل نفسك تعمل في هذا المجال؟
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-3">
                        {fitOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setSelectedFit(option.id)}
                                className={`
                                    px-6 py-3 rounded-xl font-medium transition-all
                                    ${selectedFit === option.id
                                        ? `bg-${option.color}-500/20 border-2 border-${option.color}-500/50 text-${option.color}-400`
                                        : 'bg-[var(--color-surface-1)] border-2 border-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-3)]'
                                    }
                                `}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Actions */}
                <div className="space-y-3">
                    <Link to="/simulations" className="block">
                        <Button variant="primary" size="lg" className="w-full" icon={<FaCompass />}>
                            جرب مسار آخر للمقارنة
                        </Button>
                    </Link>
                    
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={onRetake}
                            icon={<FaPlay />}
                        >
                            إعادة المحاكاة
                        </Button>
                        
                        <Link to="/dashboard" className="flex-1">
                            <Button variant="ghost" className="w-full">
                                العودة للوحة التحكم
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

// Main Component
export default function GenericSimulationPage() {
    const { simulationId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [simulation, setSimulation] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState(null);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [userProgress, setUserProgress] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [showReflection, setShowReflection] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const hasHelp = currentTask?.definition?.ui_schema && (
        currentTask.definition.ui_schema.hints?.length > 0 ||
        currentTask.definition.ui_schema.steps ||
        currentTask.definition.ui_schema.learning_module
    );

    const findNextTask = useCallback((currentId) => {
        const currentIndex = tasks.findIndex(t => t.id === currentId);
        if (currentIndex !== -1 && currentIndex < tasks.length - 1) {
            return tasks[currentIndex + 1];
        }
        return null;
    }, [tasks]);
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                setError(null);

                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    navigate('/login');
                    return;
                }
                setUserId(session.user.id);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('حدث خطأ أثناء تحميل بيانات المستخدم. يرجى المحاولة مرة أخرى.');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        const fetchSimulationData = async () => {
            if (!simulationId || !userId) return;

            try {
                setLoading(true);
                setError(null);

                const { data: simData, error: simError } = await supabase
                    .from('simulations')
                    .select('id, title, description')
                    .eq('id', simulationId)
                    .single();

                if (simError) throw simError;
                setSimulation(simData);

                const { data: tasksData, error: tasksError } = await supabase
                    .from('tasks')
                    .select('id, title, description, task_order, definition')
                    .eq('simulation_id', simulationId)
                    .order('task_order', { ascending: true });

                if (tasksError) throw tasksError;
                setTasks(tasksData);

                const taskIds = tasksData.map(t => t.id);
                if (taskIds.length > 0) {
                    const { data: progressData, error: progressError } = await supabase
                        .from('user_task_progress')
                        .select('task_id')
                        .in('task_id', taskIds)
                        .eq('user_id', userId);
                    
                    if (progressError) throw progressError;
                    setUserProgress(progressData.map(p => p.task_id));
                }
            } catch (err) {
                console.error('Error fetching simulation data:', err);
                setError('حدث خطأ أثناء تحميل بيانات المحاكاة. يرجى المحاولة مرة أخرى.');
            } finally {
                setLoading(false);
            }
        };

        fetchSimulationData();
    }, [simulationId, userId]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('completed') === 'true') {
            setIsCompleted(true);
            setCurrentTask(null);
            return;
        }
        
        if (tasks.length > 0) {
            const taskIdFromUrl = parseInt(params.get('task'), 10);
            const taskFromUrl = tasks.find(t => t.id === taskIdFromUrl);

            if (taskFromUrl) {
                setCurrentTask(taskFromUrl);
                setCurrentTaskIndex(tasks.findIndex(t => t.id === taskIdFromUrl));
            } else {
                const firstUncompletedTask = tasks.find(t => !userProgress.includes(t.id));
                if (firstUncompletedTask) {
                    setCurrentTask(firstUncompletedTask);
                    setCurrentTaskIndex(tasks.findIndex(t => t.id === firstUncompletedTask.id));
                } else {
                    setIsCompleted(true);
                    setCurrentTask(null);
                }
            }
        }
    }, [tasks, location.search, userProgress]);
    
    const handleTaskComplete = async (answer) => {
        if (!answer || (feedback && feedback.is_correct)) {
            // Show reflection modal on success, then navigate
            if (feedback?.is_correct) {
                setShowReflection(true);
            } else {
                const nextTask = findNextTask(currentTask?.id);
                if (nextTask) {
                    navigate(`/simulations/task/${simulationId}?task=${nextTask.id}`);
                } else {
                    navigate(`/simulations/task/${simulationId}?completed=true`);
                }
            }
            return;
        }

        if (!currentTask) return;

        setIsSubmitting(true);
        setFeedback(null);

        try {
            const { task_type, solution } = currentTask.definition;
            let isCorrect = false;
            let feedbackMessage = '';

            switch (task_type) {
                case 'code_challenge':
                case 'campaign_budget_analyzer':
                case 'marketing_funnel_builder':
                case 'customer_persona_creator':
                case 'write_and_react': {
                    const { data, error: funcError } = await supabase.functions.invoke('validate-task', {
                        body: { taskId: currentTask.id, answer },
                    });

                    if (funcError) throw funcError;
                    
                    setFeedback(data);
                    
                    if (data && data.is_correct) {
                        setUserProgress(prev => [...new Set([...prev, currentTask.id])]);
                    }
                    return;
                }
                case 'multiple_choice':
                case 'diagram_interpretation':
                    isCorrect = answer === solution.expected_value;
                    feedbackMessage = isCorrect ? 'إجابة صحيحة!' : (solution.explanation || 'إجابة غير صحيحة. حاول مرة أخرى.');
                    break;
                case 'income_statement':
                    isCorrect = 
                        parseInt(answer.gross_profit, 10) === solution.gross_profit &&
                        parseInt(answer.operating_income, 10) === solution.operating_income &&
                        parseInt(answer.net_income, 10) === solution.net_income;
                    feedbackMessage = isCorrect ? 'إجابات صحيحة! لقد قمت بعمل رائع في تحليل قائمة الدخل.' : 'إحدى الإجابات على الأقل غير صحيحة. راجع خطوات الحل وحاول مرة أخرى.';
                    break;
                case 'balance_sheet':
                    isCorrect = 
                        parseInt(answer.total_assets, 10) === solution.total_assets &&
                        parseInt(answer.total_liabilities_and_equity, 10) === solution.total_liabilities_and_equity;
                    feedbackMessage = isCorrect ? 'عمل رائع! لقد نجحت في موازنة الميزانية العمومية.' : 'الأرقام غير متوازنة. تحقق من حساباتك وحاول مرة أخرى.';
                    break;
                case 'portfolio_builder': {
                    const { allocations, riskScore } = answer;
                    const { target_risk_score_min, target_risk_score_max } = solution;
                    const totalAllocation = Object.values(allocations).reduce((sum, val) => sum + val, 0);

                    if (totalAllocation !== 100) {
                        feedbackMessage = 'يجب أن يكون إجمالي التخصيص 100% بالضبط.';
                        isCorrect = false;
                    } else {
                        isCorrect = riskScore >= target_risk_score_min && riskScore <= target_risk_score_max;
                        if (isCorrect) {
                            feedbackMessage = 'تخصيص ممتاز! لقد نجحت في بناء محفظة متوازنة.';
                        } else {
                            feedbackMessage = riskScore > target_risk_score_max 
                                ? 'المحفظة عالية المخاطر للغاية. حاول تقليل الأسهم وزيادة السندات.'
                                : 'المحفظة منخفضة المخاطر للغاية. قد تحتاج إلى زيادة الأسهم لتحقيق النمو المطلوب.';
                        }
                    }
                    break;
                }
                default:
                    feedbackMessage = 'لا يمكن التحقق من هذا النوع من المهام تلقائيًا.';
            }

            setFeedback({ is_correct: isCorrect, message: feedbackMessage });

            if (isCorrect) {
                await supabase
                    .from('user_task_progress')
                    .insert({ user_id: userId, task_id: currentTask.id }, { onConflict: 'user_id, task_id' });
                setUserProgress(prev => [...new Set([...prev, currentTask.id])]);
            }

        } catch (err) {
            console.error("Error validating task:", err);
            setFeedback({ is_correct: false, message: 'حدث خطأ أثناء التحقق من إجابتك.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReflectionSubmit = (emotion) => {
        setShowReflection(false);
        setFeedback(null);
        
        // TODO: Save emotion to database for analytics
        
        const nextTask = findNextTask(currentTask?.id);
        if (nextTask) {
            navigate(`/simulations/task/${simulationId}?task=${nextTask.id}`);
        } else {
            navigate(`/simulations/task/${simulationId}?completed=true`);
        }
    };

    const handleBack = () => {
        navigate(`/simulations/briefing/${simulationId}`);
    };

    const handleRetake = () => {
        setIsCompleted(false);
        setUserProgress([]);
        if (tasks[0]) {
            navigate(`/simulations/task/${simulationId}?task=${tasks[0].id}`);
        }
    };

    // Loading state
    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-[var(--color-text-secondary)]">جاري تحميل المحاكاة...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Error state
    if (error) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center min-h-[60vh] p-4">
                    <Card className="text-center max-w-md">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                            <FaTimes className="w-8 h-8 text-red-400" />
                        </div>
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">حدث خطأ</h2>
                        <p className="text-[var(--color-text-secondary)] mb-4">{error}</p>
                        <Button variant="primary" onClick={() => globalThis.location.reload()}>
                            إعادة المحاولة
                        </Button>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    // Completion state
    if (isCompleted || (!currentTask && tasks.length > 0 && userProgress.length === tasks.length)) {
        return (
            <DashboardLayout>
                <div className="min-h-screen p-4 sm:p-8 flex items-center justify-center">
                    <CompletionScreen
                        simulation={simulation}
                        userProgress={userProgress}
                        onRetake={handleRetake}
                    />
                </div>
            </DashboardLayout>
        );
    }
    
    // No tasks state
    if (tasks.length === 0) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center min-h-[60vh] p-4">
                    <Card className="text-center max-w-md">
                        <div className="w-16 h-16 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center mx-auto mb-4">
                            <FaBookOpen className="w-8 h-8 text-[var(--color-text-muted)]" />
                        </div>
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">لا توجد مهام</h2>
                        <p className="text-[var(--color-text-secondary)] mb-4">
                            لا توجد حاليًا مهام لهذه المحاكاة. يرجى التحقق مرة أخرى لاحقًا.
                        </p>
                        <Link to="/simulations">
                            <Button variant="primary">استكشف محاكاة أخرى</Button>
                        </Link>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    // Main task view
    return (
        <DashboardLayout hideSidebar>
            {/* Progress Header */}
            <TaskProgressHeader
                simulation={simulation}
                tasks={tasks}
                currentTaskIndex={currentTaskIndex}
                userProgress={userProgress}
                onBack={handleBack}
            />
            
            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {currentTask && (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentTask.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Scenario/Context */}
                            {currentTask.definition?.ui_schema?.scenario && (
                                <Card className="mb-6 bg-gradient-to-l from-[var(--color-primary)]/10 to-transparent border-[var(--color-primary)]/20">
                                    <div className="text-right">
                                        <h3 className="text-sm font-medium text-[var(--color-primary)] mb-2">السيناريو</h3>
                                        <p className="text-[var(--color-text-primary)] whitespace-pre-line leading-relaxed">
                                            {currentTask.definition.ui_schema.scenario}
                                        </p>
                                    </div>
                                    
                                    {currentTask.definition?.ui_schema?.problem_statement && (
                                        <div className="mt-4 pt-4 border-t border-[var(--color-border-default)] text-right">
                                            <h3 className="text-sm font-medium text-emerald-400 mb-2">المطلوب</h3>
                                            <p className="text-[var(--color-text-primary)] whitespace-pre-line">
                                                {currentTask.definition.ui_schema.problem_statement}
                                            </p>
                                        </div>
                                    )}
                                </Card>
                            )}
                            
                            {/* Task Content - Full Width */}
                            <TaskContent
                                task={currentTask}
                                feedback={feedback}
                                setFeedback={setFeedback}
                                onComplete={handleTaskComplete}
                                isSubmitting={isSubmitting}
                                userProgress={userProgress}
                            />
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
            
            {/* Floating Help Button */}
            <FloatingHelpButton onClick={() => setIsHelpOpen(true)} hasHelp={hasHelp} />
            
            {/* Smart Help Panel */}
            <SmartHelpPanel
                task={currentTask}
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
            />
            
            {/* Reflection Modal */}
            <ReflectionModal
                isOpen={showReflection}
                onClose={() => setShowReflection(false)}
                onSubmit={handleReflectionSubmit}
                taskTitle={currentTask?.title}
            />
        </DashboardLayout>
    );
}