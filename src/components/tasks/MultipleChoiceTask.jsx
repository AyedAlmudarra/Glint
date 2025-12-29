import { useState } from 'react';
import { FaPaperPlane, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';

const MultipleChoiceTask = ({ definition, onComplete, feedback, isSubmitting }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const { scenario, question, options } = definition.ui_schema;

    const handleSubmit = () => {
        if (selectedOption === null) return;
        onComplete(selectedOption);
    };

    const getFeedbackIcon = () => {
        if (!feedback) return null;
        return feedback.is_correct ? <FaCheck /> : <FaTimes />;
    }

    const isCorrectSelection = feedback?.is_correct && selectedOption === definition.solution.expected_value;

    return (
        <div className="bg-[var(--color-bg-secondary)] rounded-2xl p-8 h-full flex flex-col text-right gap-6 border border-[var(--color-border-primary)]">
            <div>
                <h3 className="text-xl font-bold text-[var(--color-accent-primary)] mb-2">السيناريو</h3>
                <p className="text-[var(--color-text-secondary)]">{scenario}</p>
            </div>
            <div>
                <h3 className="text-xl font-bold text-[var(--color-accent-primary)] mb-2">المطلوب</h3>
                <p className="text-[var(--color-text-secondary)]">{question}</p>
            </div>
            
            <div className="flex-grow space-y-4">
                {options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedOption(option)}
                        disabled={isSubmitting || (feedback && feedback.is_correct)}
                        className={`w-full text-right p-4 rounded-lg transition-all duration-200 border-2 ${
                            selectedOption === option
                                ? 'bg-[var(--color-accent-primary)] border-[var(--color-accent-primary)] text-white'
                                : 'bg-[var(--color-bg-tertiary)] border-[var(--color-border-primary)] hover:bg-[var(--color-bg-secondary)] hover:border-[var(--color-border-secondary)]'
                        } disabled:cursor-not-allowed disabled:opacity-70`}
                    >
                        {option}
                    </button>
                ))}
            </div>
            
            {feedback && (
                 <div className={`p-3 rounded-lg text-right flex justify-between items-center ${feedback.is_correct ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                    <p>{feedback.message}</p>
                    {getFeedbackIcon()}
                 </div>
            )}

            <div className="mt-4 flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={selectedOption === null || isSubmitting || (feedback && feedback.is_correct)}
                    className="bg-[var(--color-success)] text-white font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-all duration-300 flex items-center gap-2 disabled:bg-[var(--color-text-muted)] disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                    <span>
                        {isSubmitting ? 'جاري التحقق...' : (feedback && feedback.is_correct) ? 'تم الحل بنجاح' : 'تأكيد الإجابة'}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default MultipleChoiceTask; 