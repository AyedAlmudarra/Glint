import { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaSyncAlt } from 'react-icons/fa';

export default function CustomerPersonaCreatorTask({ definition, onComplete, feedback, setFeedback, isSubmitting }) {
    const { ui_schema } = definition;

    const [selections, setSelections] = useState({
        age_range: '',
        income_level: '',
        education: '',
        lifestyle: '',
        tech_usage: '',
        fitness_level: '',
        shopping_preference: '',
        social_media: '',
    });

    useEffect(() => {
        setFeedback(null);
    }, [selections, setFeedback]);

    const handleSelectionChange = (field, value) => {
        setSelections(prev => ({ ...prev, [field]: value }));
    };

    const handleReset = () => {
        setSelections({
            age_range: '',
            income_level: '',
            education: '',
            lifestyle: '',
            tech_usage: '',
            fitness_level: '',
            shopping_preference: '',
            social_media: '',
        });
        setFeedback(null);
    };

    const handleCheckAnswers = () => {
        // Check if all fields are filled
        const allFieldsFilled = Object.values(selections).every(value => value !== '');
        if (!allFieldsFilled) {
            setFeedback({
                is_correct: false,
                message: 'يجب ملء جميع خصائص شخصية العميل.'
            });
            return;
        }
        
        onComplete(selections);
    };

    const isCorrect = feedback && feedback.is_correct;

    const SelectionRow = ({ label, field, options }) => (
        <div className="flex justify-between items-center py-3 px-4 h-16">
            <span className="font-semibold text-[var(--color-text-primary)]">{label}</span>
            <select
                value={selections[field]}
                onChange={(e) => handleSelectionChange(field, e.target.value)}
                className="w-32 bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] rounded-md p-2 text-[var(--color-text-primary)] text-sm focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-[var(--color-accent-primary)] transition"
                disabled={isSubmitting || isCorrect}
            >
                <option value="">اختر...</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );

    const Header = ({ title }) => (
        <div className="p-3 bg-[var(--color-bg-primary)] text-center">
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
                    <div className="bg-[var(--color-bg-secondary)]"><Header title="الخصائص الديموغرافية" /></div>
                    <div className="bg-[var(--color-bg-secondary)]"><Header title="السلوكيات والتفضيلات" /></div>
                    
                    {/* Row 1 */}
                    <div className="bg-[var(--color-bg-secondary)]">
                        <SelectionRow 
                            label="الفئة العمرية" 
                            field="age_range" 
                            options={ui_schema.persona_fields.demographics.age_range}
                        />
                    </div>
                    <div className="bg-[var(--color-bg-secondary)]">
                        <SelectionRow 
                            label="استخدام التقنية" 
                            field="tech_usage" 
                            options={ui_schema.persona_fields.behaviors.tech_usage}
                        />
                    </div>

                    {/* Row 2 */}
                    <div className="bg-[var(--color-bg-secondary)]">
                        <SelectionRow 
                            label="مستوى الدخل" 
                            field="income_level" 
                            options={ui_schema.persona_fields.demographics.income_level}
                        />
                    </div>
                    <div className="bg-[var(--color-bg-secondary)]">
                        <SelectionRow 
                            label="مستوى اللياقة" 
                            field="fitness_level" 
                            options={ui_schema.persona_fields.behaviors.fitness_level}
                        />
                    </div>

                    {/* Row 3 */}
                    <div className="bg-[var(--color-bg-secondary)]">
                        <SelectionRow 
                            label="المستوى التعليمي" 
                            field="education" 
                            options={ui_schema.persona_fields.demographics.education}
                        />
                    </div>
                    <div className="bg-[var(--color-bg-secondary)]">
                        <SelectionRow 
                            label="تفضيل التسوق" 
                            field="shopping_preference" 
                            options={ui_schema.persona_fields.behaviors.shopping_preference}
                        />
                    </div>

                    {/* Row 4 */}
                    <div className="bg-[var(--color-bg-secondary)]">
                        <SelectionRow 
                            label="نمط الحياة" 
                            field="lifestyle" 
                            options={ui_schema.persona_fields.demographics.lifestyle}
                        />
                    </div>
                    <div className="bg-[var(--color-bg-secondary)]">
                        <SelectionRow 
                            label="وسائل التواصل المفضلة" 
                            field="social_media" 
                            options={ui_schema.persona_fields.behaviors.social_media}
                        />
                    </div>
                </div>

                {/* Show completion status */}
                {Object.values(selections).every(value => value !== '') && !isCorrect && (
                     <div className="p-4 m-4 rounded-lg bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)] text-center font-bold">
                        ✨ تم إكمال ملف شخصية العميل! ✨
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