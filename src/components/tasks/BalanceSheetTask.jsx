import { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaSyncAlt } from 'react-icons/fa';

export default function BalanceSheetTask({ definition, onComplete, feedback, setFeedback, isSubmitting }) {
    const { ui_schema } = definition;

    const [inputs, setInputs] = useState({
        total_assets: '',
        total_liabilities_and_equity: '',
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
            total_assets: '',
            total_liabilities_and_equity: '',
        });
        setFeedback(null);
    };

    const handleCheckAnswers = () => {
        onComplete(inputs);
    };
    
    const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);
    const isCorrect = feedback && feedback.is_correct;

    const Row = ({ children, isTotal = false }) => (
        <div className={`p-4 ${isTotal ? 'border-t-2 border-[var(--color-border-secondary)]' : ''}`}>
            <div className="flex justify-between items-center h-full">
                {children}
            </div>
        </div>
    );

    const Header = ({ title }) => (
        <div className="p-3 bg-[var(--color-bg-primary)] text-right">
            <h3 className="text-lg font-bold text-[var(--color-accent-primary)]">{title}</h3>
        </div>
    );

    return (
        <div className="flex flex-col gap-6" dir="rtl">
            <div className="bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-primary)] overflow-hidden shadow-2xl">
                <div className="p-4 bg-[var(--color-bg-primary)] text-center border-b border-[var(--color-border-primary)]">
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">{ui_schema.title}</h2>
                    <p className="text-sm text-[var(--color-text-muted)]">{ui_schema.subtitle}</p>
                </div>
                
                <div className="grid grid-cols-2 bg-[var(--color-border-primary)] gap-px">
                    {/* Headers */}
                    <div className="bg-[var(--color-bg-secondary)]"><Header title="الأصول" /></div>
                    <div className="bg-[var(--color-bg-secondary)]"><Header title="الخصوم وحقوق الملكية" /></div>
                    
                    {/* -- Row 1 -- */}
                    <div className="bg-[var(--color-bg-secondary)]"><Row><span className="font-semibold text-[var(--color-text-primary)]">النقد</span><span className="font-mono text-[var(--color-text-secondary)]">{formatNumber(ui_schema.assets.cash)}</span></Row></div>
                    <div className="bg-[var(--color-bg-secondary)]"><Row><span className="font-semibold text-[var(--color-text-primary)]">القروض</span><span className="font-mono text-[var(--color-text-secondary)]">{formatNumber(ui_schema.liabilities_equity.loans)}</span></Row></div>

                    {/* -- Row 2 -- */}
                    <div className="bg-[var(--color-bg-secondary)]"><Row><span className="font-semibold text-[var(--color-text-primary)]">المخزون</span><span className="font-mono text-[var(--color-text-secondary)]">{formatNumber(ui_schema.assets.inventory)}</span></Row></div>
                    <div className="bg-[var(--color-bg-secondary)]"><Row><span className="font-semibold text-[var(--color-text-primary)]">رأس المال</span><span className="font-mono text-[var(--color-text-secondary)]">{formatNumber(ui_schema.liabilities_equity.capital)}</span></Row></div>

                    {/* -- Row 3 -- */}
                    <div className="bg-[var(--color-bg-secondary)]"><Row><span className="font-semibold text-[var(--color-text-primary)]">الممتلكات والمعدات</span><span className="font-mono text-[var(--color-text-secondary)]">{formatNumber(ui_schema.assets.property_equipment)}</span></Row></div>
                    <div className="bg-[var(--color-bg-secondary)]"><Row><span className="font-semibold text-[var(--color-text-primary)]">الأرباح المحتجزة</span><span className="font-mono text-[var(--color-text-secondary)]">{formatNumber(ui_schema.liabilities_equity.retained_earnings)}</span></Row></div>

                    {/* -- Row 4 (Totals) -- */}
                    <div className="bg-[var(--color-bg-secondary)]">
                        <Row isTotal={true}>
                            <span className="font-bold text-base text-[var(--color-text-primary)]">إجمالي الأصول</span>
                            <input
                                type="number"
                                name="total_assets"
                                value={inputs.total_assets}
                                onChange={handleInputChange}
                                className="w-24 bg-transparent border-b-2 border-[var(--color-border-primary)] rounded-none p-2 text-[var(--color-text-primary)] font-mono focus:border-[var(--color-accent-primary)] focus:ring-0 focus:outline-none transition text-center text-base"
                                placeholder="0"
                                disabled={isSubmitting || isCorrect}
                            />
                        </Row>
                    </div>
                    <div className="bg-[var(--color-bg-secondary)]">
                        <Row isTotal={true}>
                             <span className="font-bold text-base text-[var(--color-text-primary)]">إجمالي الخصوم وحقوق الملكية</span>
                             <input
                                type="number"
                                name="total_liabilities_and_equity"
                                value={inputs.total_liabilities_and_equity}
                                onChange={handleInputChange}
                                className="w-24 bg-transparent border-b-2 border-[var(--color-border-primary)] rounded-none p-2 text-[var(--color-text-primary)] font-mono focus:border-[var(--color-accent-primary)] focus:ring-0 focus:outline-none transition text-center text-base"
                                placeholder="0"
                                disabled={isSubmitting || isCorrect}
                            />
                        </Row>
                    </div>
                </div>

                {inputs.total_assets && inputs.total_liabilities_and_equity && Number.parseInt(inputs.total_assets, 10) === Number.parseInt(inputs.total_liabilities_and_equity, 10) && !isCorrect && (
                     <div className="p-4 m-4 rounded-lg bg-green-500/20 text-green-300 text-center font-bold">
                        🎉 المعادلة متوازنة! 🎉
                    </div>
                )}

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
                        onClick={handleCheckAnswers}
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