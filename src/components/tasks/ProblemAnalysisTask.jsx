import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ProblemAnalysisTask = ({ task, onSubmit, onFeedback, isCompleted }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [summary, setSummary] = useState('');

    const { ui_schema } = task.definition;
    const { problem_statement, report_text, checklist_options, summary_prompt } = ui_schema;

    const handleCheckboxChange = (option) => {
        setSelectedOptions(prev =>
            prev.includes(option)
                ? prev.filter(item => item !== option)
                : [...prev, option]
        );
    };

    const handleSubmit = () => {
        onSubmit({
            checklist: selectedOptions,
            summary: summary,
        });
    };

    return (
        <div className="p-6 bg-gray-900 text-white rounded-lg font-sans text-right">
            <h3 className="text-xl font-bold mb-4">{task.title}</h3>

            <div className="bg-gray-800 p-4 rounded-md mb-6">
                <p className="font-semibold text-lg mb-2">السيناريو</p>
                <p className="text-gray-300">{problem_statement}</p>
                <div className="mt-4 p-4 border border-dashed border-gray-600 rounded-md">
                    <p className="font-mono text-sm text-yellow-300">
                        <strong>من:</strong> مدير دعم العملاء <br />
                        <strong>الموضوع:</strong> مشكلة في صفحة التواصل <br /><br />
                        {report_text}
                    </p>
                </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-md mb-6">
                <p className="font-semibold text-lg mb-3">
                    ما هي الأسئلة التي يجب أن تطرحها للحصول على مزيد من الوضوح؟
                </p>
                <p className="text-gray-400 text-sm mb-4">حدد جميع الأسئلة ذات الصلة لطرحها على فريق الدعم.</p>
                <div className="space-y-3">
                    {checklist_options.map((option, index) => (
                        <label key={index} className="flex flex-row-reverse items-center justify-between p-3 bg-gray-700 rounded-md hover:bg-gray-600 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5 bg-gray-800 border-gray-600 text-indigo-500 focus:ring-indigo-500 rounded"
                                checked={selectedOptions.includes(option)}
                                onChange={() => handleCheckboxChange(option)}
                                disabled={isCompleted}
                            />
                            <span className="mr-4 text-gray-200">{option}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-md">
                 <p className="font-semibold text-lg mb-3">{summary_prompt}</p>
                <textarea
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow text-right"
                    rows="4"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="اكتب ملخصك هنا..."
                    disabled={isCompleted}
                />
            </div>

            {!isCompleted && (
                 <div className="mt-6 text-left">
                    <button
                        onClick={handleSubmit}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-500"
                        disabled={selectedOptions.length === 0 || summary.trim() === ''}
                    >
                        إرسال الإجابة
                    </button>
                </div>
            )}
             {onFeedback && (
                <div className={`mt-4 p-4 rounded-md ${onFeedback.isCorrect ? 'bg-green-800 border-green-600' : 'bg-red-800 border-red-600'} border`}>
                    <p className="font-bold">{onFeedback.isCorrect ? 'صحيح!' : 'غير صحيح'}</p>
                    <p>{onFeedback.message}</p>
                </div>
            )}
        </div>
    );
};

ProblemAnalysisTask.propTypes = {
    task: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        definition: PropTypes.shape({
            task_type: PropTypes.string.isRequired,
            ui_schema: PropTypes.shape({
                problem_statement: PropTypes.string.isRequired,
                report_text: PropTypes.string.isRequired,
                checklist_options: PropTypes.arrayOf(PropTypes.string).isRequired,
                summary_prompt: PropTypes.string.isRequired,
            }).isRequired,
        }).isRequired,
    }).isRequired,
    onSubmit: PropTypes.func.isRequired,
    onFeedback: PropTypes.shape({
        isCorrect: PropTypes.bool,
        message: PropTypes.string,
    }),
    isCompleted: PropTypes.bool,
};

ProblemAnalysisTask.defaultProps = {
    onFeedback: null,
    isCompleted: false,
};

export default ProblemAnalysisTask; 