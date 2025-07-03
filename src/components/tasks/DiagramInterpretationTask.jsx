import React, { useState, useEffect } from 'react';
import { FaPaperPlane, FaCheck, FaTimes, FaSync, FaSpinner } from 'react-icons/fa';
import Confetti from 'react-confetti';

const Flowchart = ({ diagram }) => {
    if (!diagram || !diagram.nodes) return null;

    const { title, nodes, edges } = diagram;
    const nodeMap = new Map(nodes.map(node => [node.id, node]));

    const boxWidth = 160;
    const boxHeight = 50;

    return (
        <svg width="100%" viewBox="0 0 640 180" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="boxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#4A5568', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#2D3748', stopOpacity: 1}} />
                </linearGradient>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#3B82F6" />
                </marker>
            </defs>
            <style>
                {`
                    .title-text { font-family: 'Tajawal', sans-serif; font-size: 22px; font-weight: bold; fill: #E5E7EB; text-anchor: middle; direction: rtl; }
                    .box { fill: url(#boxGradient); stroke: #60A5FA; stroke-width: 1.5; }
                    .label-text { font-family: 'Tajawal', sans-serif; font-size: 16px; font-weight: 500; fill: #D1D5DB; text-anchor: middle; direction: rtl; }
                    .subtitle-text { font-family: 'Tajawal', sans-serif; font-size: 12px; fill: #9CA3AF; text-anchor: middle; direction: rtl; }
                    .line { stroke: #3B82F6; stroke-width: 2.5; marker-end: url(#arrow); }
                `}
            </style>
            
            {title && <text x="50%" y="30" className="title-text">{title}</text>}

            {edges?.map((edge, index) => {
                const fromNode = nodeMap.get(edge.from);
                const toNode = nodeMap.get(edge.to);
                if (!fromNode || !toNode) return null;

                const x1 = fromNode.x + boxWidth;
                const y1 = fromNode.y + boxHeight / 2;
                const x2 = toNode.x;
                const y2 = toNode.y + boxHeight / 2;

                return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} className="line" />;
            })}

            {nodes.map(node => (
                <g key={node.id}>
                    <rect x={node.x} y={node.y} width={boxWidth} height={boxHeight} rx="12" className="box" />
                    <text x={node.x + boxWidth / 2} y={node.y + boxHeight / 2 + (node.subtitle ? -2 : 5)} className="label-text">{node.label}</text>
                    {node.subtitle && <text x={node.x + boxWidth / 2} y={node.y + boxHeight / 2 + 16} className="subtitle-text">{node.subtitle}</text>}
                </g>
            ))}
        </svg>
    );
};

const DiagramInterpretationTask = ({ definition, onComplete, feedback, setFeedback, isSubmitting }) => {
    const [answer, setAnswer] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);

    const { scenario, diagram, steps, question } = definition.ui_schema;

    useEffect(() => {
        if (feedback && feedback.is_correct) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [feedback]);

    const handleSubmit = () => {
        onComplete(answer);
    };

    const resetTask = () => {
        setAnswer('');
        if (setFeedback) {
            setFeedback(null);
        }
    };

    const getFeedbackIcon = () => {
        if (!feedback) return null;
        return feedback.is_correct ? <FaCheck className="text-green-300" /> : <FaTimes className="text-red-300" />;
    };

    return (
        <div className="bg-gray-800 rounded-2xl p-6 h-full flex flex-col text-right gap-4 relative">
            {showConfetti && <Confetti recycle={false} />}
            
            <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-white mb-2">السيناريو</h3>
                <p className="text-gray-300">{scenario}</p>
            </div>

            {diagram && (
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 mb-4">
                    <Flowchart diagram={diagram} />
                </div>
            )}
            
            <div className="bg-gray-900/50 p-4 rounded-lg">
                <h3 className="font-bold text-blue-300 mb-3">خطوات الحل</h3>
                <ul className="space-y-2 text-gray-400">
                    {steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex-shrink-0 flex items-center justify-center text-xs mt-1">{index + 1}</span>
                            <span>{step}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-4 flex-grow flex flex-col justify-end">
                <label htmlFor="answer-input" className="block mb-2 font-bold text-lg text-white">{question}</label>
                <input
                    id="answer-input"
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="اكتب إجابتك هنا..."
                    disabled={isSubmitting || (feedback && feedback.is_correct)}
                />
            </div>
            
            {feedback && (
                 <div className={`p-3 rounded-lg text-right flex justify-between items-center mt-2 ${feedback.is_correct ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                    <p>{feedback.message}</p>
                    {getFeedbackIcon()}
                 </div>
            )}

            <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={resetTask}
                    className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors text-sm flex items-center gap-2"
                >
                    <FaSync />
                    <span>إعادة المحاولة</span>
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !answer || (feedback && feedback.is_correct)}
                    className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-500 transition-colors duration-300 flex items-center gap-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                    <span>
                        {isSubmitting ? 'جاري الإرسال...' : (feedback && feedback.is_correct) ? 'أحسنت!' : 'إرسال الإجابة'}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default DiagramInterpretationTask; 