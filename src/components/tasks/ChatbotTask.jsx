import React, { useState } from 'react';
import { FaPaperPlane, FaPlay, FaSpinner, FaPlus, FaTrash } from 'react-icons/fa';

const RuleBuilder = ({ rules, setRules, defaultReply, setDefaultReply }) => {
    const addRule = () => {
        setRules([...rules, { input: '', output: '' }]);
    };

    const updateRule = (index, field, value) => {
        const newRules = [...rules];
        newRules[index][field] = value;
        setRules(newRules);
    };

    const removeRule = (index) => {
        const newRules = rules.filter((_, i) => i !== index);
        setRules(newRules);
    };

    return (
        <div className="bg-gray-900/50 rounded-2xl p-6 h-full flex flex-col gap-4 text-right">
            <h3 className="text-white font-bold text-xl mb-2">منشئ القواعد</h3>
            <div className="space-y-4 flex-grow overflow-y-auto pr-2">
                {rules.map((rule, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg flex flex-col gap-3 relative">
                         <button onClick={() => removeRule(index)} className="absolute top-2 left-2 text-gray-500 hover:text-red-400">
                            <FaTrash />
                        </button>
                        <div>
                            <label className="block text-sm font-medium text-blue-300 mb-1">إذا قال المستخدم:</label>
                            <input
                                type="text"
                                value={rule.input}
                                onChange={(e) => updateRule(index, 'input', e.target.value)}
                                placeholder="مثلاً: مرحباً"
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-green-300 mb-1">عندئذ يرد البوت:</label>
                            <input
                                type="text"
                                value={rule.output}
                                onChange={(e) => updateRule(index, 'output', e.target.value)}
                                placeholder="مثلاً: أهلاً بك!"
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>
                ))}
            </div>
             <button
                onClick={addRule}
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
                <FaPlus />
                <span>إضافة قاعدة جديدة</span>
            </button>
            <div className="border-t border-gray-700 pt-4 mt-4">
                <label className="block text-sm font-medium text-yellow-300 mb-1">إذا لم يتطابق أي شرط، رد بـ:</label>
                <input
                    type="text"
                    value={defaultReply}
                    onChange={(e) => setDefaultReply(e.target.value)}
                    placeholder="مثلاً: عذراً، لم أفهم ذلك."
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
            </div>
        </div>
    );
};

const ChatWindow = ({ messages, onSendMessage, rules, defaultReply }) => {
    const [input, setInput] = useState('');

    const getBotResponse = (userInput) => {
        const lowerCaseInput = userInput.toLowerCase().trim();
        for (const rule of rules) {
            if (rule.input && lowerCaseInput === rule.input.toLowerCase().trim()) {
                return rule.output;
            }
        }
        return defaultReply || "عذراً، لم أفهم ذلك.";
    };
    
    const handleSend = () => {
        if (!input.trim()) return;
        const botResponse = getBotResponse(input);
        onSendMessage(input, botResponse);
        setInput('');
    };

    return (
        <div className="bg-gray-900/50 rounded-2xl flex flex-col h-full text-right" style={{minHeight: '400px'}}>
            <div className="bg-gray-800 p-3 rounded-t-2xl">
                <h3 className="text-white font-bold">نافذة المحادثة (للتجربة)</h3>
            </div>
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md p-3 rounded-xl ${msg.isUser ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-gray-700 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="اكتب رسالة..."
                    className="flex-grow bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={handleSend} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    );
};

const ChatbotTask = ({ definition, onComplete, feedback, isSubmitting }) => {
    const [rules, setRules] = useState([{ input: '', output: '' }]);
    const [defaultReply, setDefaultReply] = useState('');
    const [messages, setMessages] = useState([{ text: 'أهلاً بك! استخدم منشئ القواعد لتعليمي كيفية الرد.', isUser: false }]);
    
    const handleSendMessage = (userInput, botResponse) => {
        setMessages(prev => [...prev, { text: userInput, isUser: true }, { text: botResponse, isUser: false }]);
    };
    
    const handleSubmit = () => {
        const payload = {
            rules: rules.filter(r => r.input && r.output), // Filter out empty rules
            defaultReply: defaultReply
        };
        onComplete(payload);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div className="lg:col-span-1">
                 <ChatWindow messages={messages} onSendMessage={handleSendMessage} rules={rules} defaultReply={defaultReply} />
            </div>

            <div className="lg:col-span-1 flex flex-col gap-4">
                <RuleBuilder rules={rules} setRules={setRules} defaultReply={defaultReply} setDefaultReply={setDefaultReply} />
                {feedback && (
                     <div dir="rtl" className={`p-3 rounded-lg text-right ${feedback.is_correct ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                        <p>{feedback.message}</p>
                     </div>
                )}
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || (feedback && feedback.is_correct)}
                    className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-500 transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaPlay />}
                    <span>
                        {isSubmitting ? 'جاري التحقق...' : (feedback && feedback.is_correct) ? 'تم الحل بنجاح' : 'تشغيل والتحقق'}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default ChatbotTask; 