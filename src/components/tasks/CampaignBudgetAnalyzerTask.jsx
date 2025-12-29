import { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaSyncAlt } from 'react-icons/fa';

export default function CampaignBudgetAnalyzerTask({ definition, onComplete, feedback, setFeedback, isSubmitting }) {
    const { ui_schema } = definition;

    const [inputs, setInputs] = useState({
        cost_per_click: '',
        conversion_rate: '',
        roi_percentage: '',
    });

    useEffect(() => {
        setFeedback(null);
    }, [inputs, setFeedback]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        setInputs({
            cost_per_click: '',
            conversion_rate: '',
            roi_percentage: '',
        });
        setFeedback(null);
    };

    const handleCheckAnswers = () => {
        onComplete(inputs);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const isCorrect = feedback && feedback.is_correct;

    const CampaignRow = ({ label, value, isInput = false, name = '', unit = '' }) => (
        <div className={`flex justify-between items-center py-3 px-4 h-16 ${!isInput && 'bg-[var(--color-bg-primary)]'}`}>
            <span className="font-semibold text-[var(--color-text-primary)]">{label}</span>
            {isInput ? (
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        step="0.01"
                        name={name}
                        value={inputs[name]}
                        onChange={handleInputChange}
                        className="w-20 bg-transparent border-b-2 border-[var(--color-border-primary)] rounded-none p-2 text-center text-[var(--color-text-primary)] font-mono focus:border-[var(--color-accent-primary)] focus:ring-0 focus:outline-none transition"
                        placeholder="0"
                        disabled={isSubmitting || isCorrect}
                    />
                    <span className="text-[var(--color-text-muted)] text-sm min-w-[30px]">{unit}</span>
                </div>
            ) : (
                <span className="font-mono text-[var(--color-text-secondary)]">
                    {formatNumber(value)} {unit}
                </span>
            )}
        </div>
    );
    
    return (
        <div className="flex flex-col gap-6" dir="rtl">
            <div className="bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-primary)] overflow-hidden shadow-2xl">
                <div className="p-4 bg-[var(--color-bg-primary)] text-center border-b border-[var(--color-border-primary)]">
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">{ui_schema.campaign_title}</h2>
                    <p className="text-sm text-[var(--color-text-muted)]">{ui_schema.campaign_subtitle}</p>
                </div>
                <div className="space-y-1 p-4">
                    <CampaignRow label="إجمالي الإنفاق" value={ui_schema.total_spend} unit="ريال" />
                    <CampaignRow label="عدد النقرات" value={ui_schema.total_clicks} unit="نقرة" />
                    <CampaignRow label="تكلفة النقرة (CPC)" isInput={true} name="cost_per_click" unit="ريال" />
                    <CampaignRow label="عدد التحويلات" value={ui_schema.total_conversions} unit="عملية شراء" />
                    <CampaignRow label="معدل التحويل" isInput={true} name="conversion_rate" unit="%" />
                    <CampaignRow label="إجمالي الإيرادات" value={ui_schema.total_revenue} unit="ريال" />
                    <CampaignRow label="العائد على الاستثمار (ROI)" isInput={true} name="roi_percentage" unit="%" />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {isCorrect ? (
                     <button
                        onClick={() => onComplete()}
                        className="flex-1 bg-[var(--color-accent-primary)] hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200"
                    >
                        المهمة التالية
                    </button>
                ) : (
                    <button
                        onClick={handleCheckAnswers}
                        disabled={isSubmitting}
                        className="flex-1 bg-[var(--color-success)] hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 disabled:bg-[var(--color-text-muted)]"
                    >
                        <FaCheckCircle />
                        <span>تحقق من الإجابات</span>
                    </button>
                )}
                 <button 
                    onClick={handleReset}
                    className="bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] font-bold p-3 rounded-lg transition-all duration-200 border border-[var(--color-border-primary)]"
                    disabled={isSubmitting || isCorrect}
                >
                    <FaSyncAlt size={20} />
                </button>
            </div>

            {feedback && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${
                    isCorrect ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'
                }`}>
                    {isCorrect ? <FaCheckCircle className="text-green-400" /> : <FaTimesCircle className="text-red-400" />}
                    <span>{feedback.message}</span>
                </div>
            )}
        </div>
    );
} 