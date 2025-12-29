import { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaSyncAlt } from 'react-icons/fa';

export default function IncomeStatementTask({ definition, onComplete, feedback, setFeedback, isSubmitting }) {
    const { ui_schema } = definition;

    const [inputs, setInputs] = useState({
        gross_profit: '',
        operating_income: '',
        net_income: '',
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
            gross_profit: '',
            operating_income: '',
            net_income: '',
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

    const StatementRow = ({ label, value, isInput = false, name = '' }) => (
        <div className={`flex justify-between items-center py-3 px-4 ${!isInput && 'bg-[var(--color-bg-primary)]'}`}>
            <span className="font-semibold text-[var(--color-text-primary)]">{label}</span>
            {isInput ? (
                <input
                    type="number"
                    name={name}
                    value={inputs[name]}
                    onChange={handleInputChange}
                    className="w-32 bg-transparent border-b-2 border-[var(--color-border-primary)] rounded-none p-2 text-left text-[var(--color-text-primary)] font-mono focus:border-[var(--color-accent-primary)] focus:ring-0 focus:outline-none transition text-center"
                    placeholder="0"
                    disabled={isSubmitting || isCorrect}
                />
            ) : (
                <span className={`font-mono ${value < 0 ? 'text-[var(--color-error)]' : 'text-[var(--color-text-secondary)]'}`}>
                    {value < 0 ? `(${formatNumber(Math.abs(value))})` : formatNumber(value)}
                </span>
            )}
        </div>
    );
    
    return (
        <div className="flex flex-col gap-6" dir="rtl">
            <div className="bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-primary)] overflow-hidden shadow-2xl">
                <div className="p-4 bg-[var(--color-bg-primary)] text-center border-b border-[var(--color-border-primary)]">
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">{ui_schema.statement_title}</h2>
                    <p className="text-sm text-[var(--color-text-muted)]">{ui_schema.statement_subtitle}</p>
                </div>
                <div className="space-y-1 p-4">
                    <StatementRow label="إجمالي الإيرادات" value={ui_schema.total_revenue} />
                    <StatementRow label="تكلفة الإيرادات" value={ui_schema.cost_of_revenue} />
                    <StatementRow label="الربح الإجمالي" isInput={true} name="gross_profit" />
                    <StatementRow label="المصاريف التشغيلية" value={ui_schema.operating_expenses} />
                    <StatementRow label="الدخل التشغيلي" isInput={true} name="operating_income" />
                    <StatementRow label="الضرائب" value={ui_schema.taxes} />
                    <StatementRow label="صافي الدخل" isInput={true} name="net_income" />
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