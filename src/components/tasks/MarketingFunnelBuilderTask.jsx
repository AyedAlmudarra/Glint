import { useState, useEffect, useMemo } from 'react';
import { FaCheckCircle, FaTimesCircle, FaSyncAlt } from 'react-icons/fa';

const SliderRow = ({ name, value, onChange, max, disabled }) => (
    <div className="space-y-3">
        <div className="flex justify-between items-center h-6">
            <label className="font-semibold text-[var(--color-text-primary)] text-sm">{name}</label>
            <span className="font-mono text-lg text-[var(--color-text-primary)] min-w-[50px] text-right">{value}%</span>
        </div>
        <input
            type="range"
            min="0"
            max={max}
            value={value}
            onChange={e => onChange(Number.parseInt(e.target.value, 10))}
            className="w-full h-2 bg-[var(--color-bg-tertiary)] rounded-lg appearance-none cursor-pointer slider accent-[var(--color-accent-primary)]"
            disabled={disabled}
        />
    </div>
);

const ConversionMeter = ({ score }) => {
    const meterColor = useMemo(() => {
        if (score < 35) return 'bg-[var(--color-error)]'; // Low conversion
        if (score < 55) return 'bg-[var(--color-success)]'; // Optimal conversion
        return 'bg-[var(--color-warning)]'; // Too focused on conversion
    }, [score]);

    const meterWidth = useMemo(() => {
        return Math.min(score, 100) + '%';
    }, [score]);

    return (
        <div className="space-y-3">
            <span className="font-semibold text-[var(--color-text-primary)] text-sm">مقياس فعالية التحويل</span>
            <div className="w-full bg-[var(--color-bg-tertiary)] rounded-full h-4">
                <div
                    className={`h-4 rounded-full transition-all duration-300 ${meterColor}`}
                    style={{ width: meterWidth }}
                ></div>
            </div>
            <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
                <span>ضعيف</span>
                <span>مثالي</span>
                <span>مركز جداً</span>
            </div>
        </div>
    );
};

export default function MarketingFunnelBuilderTask({ definition, onComplete, feedback, setFeedback, isSubmitting }) {
    const { ui_schema } = definition;

    const initialAllocations = ui_schema.funnel_stages.reduce((acc, stage) => {
        acc[stage.id] = stage.initial_value;
        return acc;
    }, {});

    const [allocations, setAllocations] = useState(initialAllocations);
    
    useEffect(() => {
        setFeedback(null);
    }, [allocations, setFeedback]);

    const totalAllocation = useMemo(() => {
        return Object.values(allocations).reduce((sum, val) => sum + val, 0);
    }, [allocations]);

    const conversionScore = useMemo(() => {
        return ui_schema.funnel_stages.reduce((score, stage) => {
            return score + (allocations[stage.id] / 100) * stage.conversion_weight;
        }, 0);
    }, [allocations, ui_schema.funnel_stages]);

    const handleSliderChange = (stageId, value) => {
        setAllocations(prev => ({
            ...prev,
            [stageId]: value
        }));
    };
    
    const handleReset = () => {
        setAllocations(initialAllocations);
        setFeedback(null);
    };

    const handleCheckAnswer = () => {
        if (totalAllocation !== 100) {
            setFeedback({
                is_correct: false,
                message: 'يجب أن يكون إجمالي توزيع الميزانية 100% بالضبط.'
            });
            return;
        }
        
        onComplete({ allocations, conversionScore });
    };

    const isCorrect = feedback && feedback.is_correct;

    return (
        <div className="flex flex-col gap-6" dir="rtl">
            <div className="bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-primary)] overflow-hidden shadow-2xl p-6 space-y-6">
                <h2 className="text-xl font-bold text-center text-[var(--color-text-primary)]">أداة بناء قمع التسويق</h2>
                
                {ui_schema.funnel_stages.map(stage => (
                    <SliderRow 
                        key={stage.id}
                        name={stage.name}
                        value={allocations[stage.id]}
                        onChange={(value) => handleSliderChange(stage.id, value)}
                        max={100}
                        disabled={isSubmitting || isCorrect}
                    />
                ))}

                <div className="border-t-2 border-[var(--color-border-primary)] pt-4 space-y-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                        <span className="text-[var(--color-text-primary)]">إجمالي توزيع الميزانية:</span>
                        <span className={`font-mono ${totalAllocation > 100 ? 'text-[var(--color-error)]' : 'text-[var(--color-text-primary)]'}`}>
                            {totalAllocation}%
                        </span>
                    </div>
                    <ConversionMeter score={conversionScore} />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {isCorrect ? (
                     <button
                        onClick={() => onComplete()}
                        className="flex-1 bg-[var(--color-accent-primary)] hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all"
                    >
                        المهمة التالية
                    </button>
                ) : (
                    <button
                        onClick={handleCheckAnswer}
                        disabled={isSubmitting}
                        className="flex-1 bg-[var(--color-success)] hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all disabled:bg-[var(--color-text-muted)]"
                    >
                        <FaCheckCircle />
                        <span>تحقق من الإجابات</span>
                    </button>
                )}
                 <button 
                    onClick={handleReset}
                    className="bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] font-bold p-3 rounded-lg transition-all border border-[var(--color-border-primary)]"
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