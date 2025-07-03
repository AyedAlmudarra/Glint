import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTrophy, FaLightbulb, FaBookOpen, FaQuestionCircle, FaStepForward, FaChevronDown } from 'react-icons/fa';

import DashboardLayout from './DashboardLayout';
import { supabase } from '../supabaseClient';
import CodeChallengeTask from './tasks/CodeChallengeTask';
import MultipleChoiceTask from './tasks/MultipleChoiceTask';
import DiagramInterpretationTask from './tasks/DiagramInterpretationTask';
import ChatbotTask from './tasks/ChatbotTask';
import ProblemAnalysisTask from './tasks/ProblemAnalysisTask';

const AccordionSection = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-gray-900/50 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 text-right flex justify-between items-center bg-gray-800 hover:bg-gray-700 transition-colors"
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <span className="font-semibold text-white">{title}</span>
                </div>
                <motion.div animate={{ rotate: isOpen ? -180 : 0 }}>
                    <FaChevronDown />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 text-gray-300 leading-relaxed border-t border-gray-700">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Hints = ({ hints }) => {
    const [revealed, setRevealed] = useState([]);
    if (!hints || hints.length === 0) return null;

    const revealHint = () => {
        if (revealed.length < hints.length) {
            setRevealed(prev => [...prev, hints[revealed.length]]);
        }
    };

    return (
        <div className="space-y-3">
            {revealed.map((hint, index) => (
                <div key={index} className="bg-gray-700/70 p-3 rounded-lg text-gray-300 flex items-start gap-2">
                    <FaLightbulb className="text-yellow-400 mt-1 flex-shrink-0" />
                    <span>{hint}</span>
                </div>
            ))}
            {revealed.length < hints.length && (
                <button
                    onClick={revealHint}
                    className="w-full bg-blue-800/70 hover:bg-blue-700 text-blue-200 font-semibold p-3 rounded-lg transition-colors"
                >
                    اطلب تلميحاً ({revealed.length + 1}/{hints.length})
                </button>
            )}
        </div>
    );
};

const MissionBriefing = ({ task }) => {
    const { ui_schema } = task.definition;
    
    return (
        <div className="bg-gray-800/50 rounded-2xl p-6 h-full space-y-4 text-right border border-gray-700">
            <div className="pb-4 border-b border-gray-700">
                <h2 className="text-3xl font-bold text-white mb-2">{task.title}</h2>
                <p className="text-gray-400">{task.description}</p>
            </div>
            
            <AccordionSection 
                title="المطلوب"
                icon={<FaQuestionCircle className="text-blue-400" />}
                defaultOpen={true}
            >
                <p className="text-gray-300">{ui_schema.problem_statement || ui_schema.scenario}</p>
            </AccordionSection>
            
            {ui_schema.learning_module && (
                <AccordionSection 
                    title={ui_schema.learning_module.title}
                    icon={<FaBookOpen className="text-yellow-400" />}
                >
                    <p>{ui_schema.learning_module.content}</p>
                </AccordionSection>
            )}

            {ui_schema.steps && (
                <AccordionSection 
                    title="الخطوات الإرشادية"
                    icon={<FaStepForward className="text-green-400" />}
                >
                    <ul className="space-y-3">
                        {ui_schema.steps?.map((step, index) => (
                            <li key={index} className="p-3 bg-gray-700/50 rounded-lg flex items-start gap-3">
                                <div className="bg-green-500 text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-1">{index + 1}</div>
                                {typeof step === 'string' ? (
                                    <p className="text-gray-300">{step}</p>
                                ) : (
                                    <div>
                                        <strong className="text-white">{step.title}</strong>
                                        <p className="text-gray-400">{step.guidance}</p>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </AccordionSection>
            )}
            
            {ui_schema.hints && (
                 <AccordionSection 
                    title="تلميحات"
                    icon={<FaLightbulb className="text-purple-400" />}
                >
                    <Hints hints={ui_schema.hints} />
                </AccordionSection>
            )}
        </div>
    );
};

const TaskContent = ({ task, feedback, setFeedback, onComplete, isSubmitting, userProgress }) => {
    if (!task || !task.definition) {
        return <div className="text-center p-8 bg-gray-800 rounded-lg">لم يتم العثور على تعريف لهذه المهمة.</div>;
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
        default:
            return <div className="text-center p-8 bg-gray-800 rounded-lg">نوع المهمة غير مدعوم: {task_type}</div>;
    }
};

const CompletionScreen = ({ simulation }) => (
    <div className="max-w-md w-full text-center bg-gray-800 rounded-2xl p-10 shadow-lg border border-gray-700">
        <FaTrophy className="text-7xl text-yellow-400 mx-auto mb-6" />
        <h2 className="text-4xl font-bold text-white mb-3">لقد أكملت المحاكاة!</h2>
        <p className="text-gray-300 text-lg mb-8">
            تهانينا! لقد أتقنت أساسيات {simulation?.title || 'هذا المسار'}.
        </p>
        <Link to="/dashboard" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300">
            العودة إلى لوحة التحكم
        </Link>
    </div>
);

export default function GenericSimulationPage() {
    const { simulationId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [simulation, setSimulation] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState(null);
    const [userProgress, setUserProgress] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    const findNextTask = (currentId) => {
        const currentIndex = tasks.findIndex(t => t.id === currentId);
        if (currentIndex !== -1 && currentIndex < tasks.length - 1) {
            return tasks[currentIndex + 1];
        }
        return null;
    };
    
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
                const user = session.user;
                setUserId(user.id);
            } catch (error) {
                console.error('Error fetching user data:', error);
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

                // Fetch simulation details
                const { data: simData, error: simError } = await supabase
                    .from('simulations')
                    .select('id, title, description')
                    .eq('id', simulationId)
                    .single();

                if (simError) throw simError;
                setSimulation(simData);

                // Fetch tasks for the simulation
                const { data: tasksData, error: tasksError } = await supabase
                    .from('tasks')
                    .select('id, title, description, task_order, definition')
                    .eq('simulation_id', simulationId)
                    .order('task_order', { ascending: true });

                if (tasksError) throw tasksError;
                setTasks(tasksData);

                // Fetch user progress
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
            } catch (error) {
                console.error('Error fetching simulation data:', error);
                setError('حدث خطأ أثناء تحميل بيانات المحاكاة. يرجى المحاولة مرة أخرى.');
            } finally {
                setLoading(false);
            }
        };

        fetchSimulationData();
    }, [simulationId, userId]);

    useEffect(() => {
        if (tasks.length > 0) {
            const params = new URLSearchParams(location.search);
            const taskIdFromUrl = parseInt(params.get('task'), 10);
            
            if (taskIdFromUrl && tasks.some(t => t.id === taskIdFromUrl)) {
                setCurrentTask(tasks.find(t => t.id === taskIdFromUrl));
            } else if (userProgress && userProgress.length > 0) {
                const lastCompletedTask = tasks.find(t => userProgress.includes(t.id));
                const nextTask = findNextTask(lastCompletedTask?.id);
                setCurrentTask(nextTask || tasks[0]);
            } else {
                setCurrentTask(tasks[0]);
            }
        }
    }, [tasks, location.search, userProgress]);
    
    const handleTaskComplete = async (answer) => {
        if (!currentTask || !userId) return;

        // If the current task is already completed and `handleTaskComplete` is called,
        // it means the user clicked "Next Task".
        if (feedback?.is_correct) {
            const nextTask = findNextTask(currentTask.id);
            if (nextTask) {
                const newSearch = new URLSearchParams(location.search);
                newSearch.set('task', nextTask.id);
                navigate(`${location.pathname}?${newSearch.toString()}`);
                setCurrentTask(nextTask);
                setFeedback(null); // Reset feedback for the new task
            } else {
                // No next task, show completion screen
                setCurrentTask(null);
            }
            return;
        }

        setIsSubmitting(true);
        setFeedback(null);

        const { data, error } = await supabase.functions.invoke('validate-task', {
            body: { taskId: currentTask.id, answer },
        });
        
        if (error) {
            console.error("Error validating task:", error);
            let message = "حدث خطأ غير متوقع أثناء التحقق من إجابتك.";
            if (error.context && error.context.status === 303) {
                 message = "انتهت صلاحية الجلسة. يرجى تحديث الصفحة والمحاولة مرة أخرى.";
            } else if (error.message) {
                message = error.message;
            }
            setFeedback({ is_correct: false, message });
        } else {
            setFeedback(data);
            if (data.is_correct) {
                // Add to progress without needing a full refetch
                setUserProgress(prev => [...new Set([...prev, currentTask.id])]);
            }
        }
        
        setIsSubmitting(false);
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-full">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-full text-center">
                    <div className="bg-red-900/50 p-6 rounded-lg">
                        <p className="text-red-300">{error}</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }
    
    return (
        <DashboardLayout
            simulationTitle={simulation?.title}
            tasks={tasks}
            currentTaskId={currentTask?.id}
            userProgress={userProgress}
        >
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                 {currentTask ? (
                    <>
                        <header className="mb-8 text-right">
                            <h1 className="text-4xl font-bold text-white">{simulation.title}</h1>
                            <p className="text-lg text-gray-400 mt-2">{simulation.description}</p>
                        </header>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            <div className="lg:col-span-1">
                                <MissionBriefing task={currentTask} />
                            </div>
                            <div className="lg:col-span-1">
                                <div className="flex-1 min-w-0">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentTask?.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
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
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex justify-center items-start pt-16">
                        <CompletionScreen simulation={simulation} />
                   </div>
                )}
            </div>
        </DashboardLayout>
    );
} 