import { useState, useEffect, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { FaPlay, FaSpinner, FaCheck, FaTimes, FaLightbulb, FaTimesCircle, FaChevronDown, FaChevronUp, FaQuestionCircle, FaEye, FaSync } from 'react-icons/fa';
import Confetti from 'react-confetti';
import ConfirmModal from '../modals/ConfirmModal';
import FeedbackModal from '../modals/FeedbackModal';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';

const ResultsPanel = ({ stdout, stderr, testResults }) => {
    if (!stderr && !stdout && (!testResults || testResults.length === 0)) {
        return null;
    }
    return (
        <div dir="rtl" className="bg-gray-900 p-4 rounded-lg mt-4 text-right text-sm">
            <h3 className="font-bold text-lg mb-2 text-white">النتائج</h3>
            {stderr && (
                <div className="mb-4">
                    <h4 className="font-semibold text-red-400">أخطاء (Stderr):</h4>
                    <pre className="bg-black text-red-300 p-2 rounded-md whitespace-pre-wrap font-mono">{stderr}</pre>
                </div>
            )}
            {stdout && (
                <div className="mb-4">
                    <h4 className="font-semibold text-blue-400">المخرجات (Stdout):</h4>
                    <pre className="bg-black text-gray-300 p-2 rounded-md whitespace-pre-wrap font-mono">{stdout}</pre>
                </div>
            )}
            {testResults && testResults.length > 0 && (
                 <div>
                    <h4 className="font-semibold text-white">حالات الاختبار:</h4>
                    <ul className="space-y-2 mt-2">
                        {testResults.map((result, index) => (
                            <li key={index} className={`p-3 rounded-md ${result.passed ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                                <div className="flex justify-between items-center font-bold">
                                    <span>حالة الاختبار #{index + 1}</span>
                                    {result.passed ? <FaCheck className="text-green-400" /> : <FaTimes className="text-red-400" />}
                                </div>
                                <div className="font-mono text-xs mt-2 space-y-1">
                                    <p><span className="font-semibold text-gray-400">المدخل:</span> {JSON.stringify(result.input)}</p>
                                    <p><span className="font-semibold text-gray-400">المتوقع:</span> {JSON.stringify(result.expected_output)}</p>
                                    <p><span className="font-semibold text-gray-400">الفعلي:</span> {JSON.stringify(result.actual_output)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const CodeChallengeTask = ({ definition, onComplete, taskId, feedback, setFeedback, isSubmitting }) => {
    const { ui_schema } = definition;
    const { existing_code, solution_display, language } = ui_schema;
    const { user } = useAuth();

    const [code, setCode] = useState(existing_code || '');
    const [showConfetti, setShowConfetti] = useState(false);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [results, setResults] = useState(null);

    const resetTaskState = useCallback(() => {
        setCode(existing_code || '');
        setFeedback(null);
        setResults(null);
    }, [existing_code, setFeedback]);
    
    useEffect(() => {
        resetTaskState();
    }, [taskId, resetTaskState]);

    useEffect(() => {
        const saveProgress = async () => {
            if (feedback && feedback.is_correct && taskId && user) {
                const { error } = await supabase
                    .from('user_task_progress')
                    .insert({ user_id: user.id, task_id: taskId }, { onConflict: 'user_id, task_id' });

                if (error) {
                    console.error("Failed to save task progress:", error);
                }
            }
        };

        if (feedback) {
            setResults({
                stdout: feedback.stdout,
                stderr: feedback.stderr,
                testResults: feedback.testResults
            });
            if (feedback.is_correct) {
                setShowFeedbackModal(true);
                saveProgress();
            }
        } else {
            setResults(null);
        }
    }, [feedback, taskId, user]);

    useEffect(() => {
        if (feedback && feedback.is_correct) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [feedback]);

    const handleSubmit = () => {
        onComplete(code);
    };

    const handleShowSolution = () => {
        setConfirmModalOpen(true);
    };

    const confirmShowSolution = () => {
        setCode(solution_display);
        setConfirmModalOpen(false);
    };
    
    const langExtension = language === 'python' ? [python()] : [javascript({ jsx: true })];

    return (
        <>
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={confirmShowSolution}
                title="إظهار الحل"
            >
                <div>
                    <p>هل أنت متأكد؟ سيؤدي هذا إلى استبدال الكود الحالي بالحل النموذجي.</p>
                    <p className="font-semibold mt-2">محاولة حل المشكلة بنفسك هي أفضل طريقة للتعلم!</p>
                </div>
            </ConfirmModal>

            <FeedbackModal 
                isOpen={showFeedbackModal}
                onClose={() => setShowFeedbackModal(false)}
                taskId={taskId}
            />

            <div className="bg-gray-800 rounded-2xl p-6 h-full flex flex-col text-left gap-4 relative" dir="ltr">
                {showConfetti && <Confetti recycle={false} />}
                
                <div className="flex-grow flex flex-col" style={{ minHeight: '300px' }}>
                    <CodeMirror
                        value={code}
                        height="100%"
                        theme={okaidia}
                        extensions={langExtension}
                        onChange={(value) => setCode(value)}
                        className="flex-grow rounded-lg overflow-hidden border border-gray-700 force-ltr"
                        readOnly={isSubmitting || (feedback && feedback.is_correct)}
                    />
                </div>
                
                <ResultsPanel {...(results || {})} />

                {feedback && !feedback.is_correct && (
                     <div dir="rtl" className={`p-3 rounded-lg text-right flex justify-between items-center bg-red-900/50 text-red-300`}>
                        <p>{feedback.message}</p>
                        <FaTimes />
                     </div>
                )}

                <div className="mt-4 flex flex-row-reverse justify-between items-center" dir="rtl">
                    {feedback?.is_correct ? (
                        <button
                            onClick={onComplete}
                            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-500 transition-colors"
                        >
                            المهمة التالية
                        </button>
                    ) : (
                        <div className="flex gap-2 flex-row-reverse">
                             <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-500 transition-colors duration-300 flex items-center gap-2 disabled:bg-gray-500"
                            >
                                {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaPlay />}
                                <span>{isSubmitting ? 'جاري التحقق...' : 'تشغيل والتحقق'}</span>
                            </button>
                            {solution_display && (
                                <button 
                                    onClick={handleShowSolution} 
                                    className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-500 transition-colors text-sm flex items-center gap-2"
                                >
                                    <FaEye />
                                    <span>إظهار الحل</span>
                                </button>
                            )}
                             <button 
                                onClick={resetTaskState} 
                                className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors text-sm flex items-center gap-2"
                            >
                                <FaSync />
                                <span>إعادة تعيين</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CodeChallengeTask; 