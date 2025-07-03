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
        <div className="bg-gray-800 rounded-2xl p-8 h-full flex flex-col text-right gap-6">
            <div>
                <h3 className="text-xl font-bold text-blue-300 mb-2">السيناريو</h3>
                <p className="text-gray-300">{scenario}</p>
            </div>
            <div>
                <h3 className="text-xl font-bold text-blue-300 mb-2">المطلوب</h3>
                <p className="text-gray-300">{question}</p>
            </div>
            
            <div className="flex-grow space-y-4">
                {options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedOption(option)}
                        disabled={isSubmitting || (feedback && feedback.is_correct)}
                        className={`w-full text-right p-4 rounded-lg transition-all duration-200 border-2 ${
                            selectedOption === option
                                ? 'bg-blue-600 border-blue-400 text-white'
                                : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700 hover:border-gray-500'
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
                    className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-500 transition-colors duration-300 flex items-center gap-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
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