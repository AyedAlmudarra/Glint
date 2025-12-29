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
        <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-2xl p-6 h-full flex flex-col gap-4 text-right">
            <h3 className="text-[var(--color-text-primary)] font-bold text-xl mb-2">منشئ القواعد</h3>
            <div className="space-y-4 flex-grow overflow-y-auto pr-2">
                {rules.map((rule, index) => (
                    <div key={index} className="bg-[var(--color-bg-secondary)] p-4 rounded-lg flex flex-col gap-3 relative border border-[var(--color-border-primary)]">
                         <button onClick={() => removeRule(index)} className="absolute top-2 left-2 text-[var(--color-text-muted)] hover:text-[var(--color-error)]">
                            <FaTrash />
                        </button>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-accent-primary)] mb-1">إذا قال المستخدم:</label>
                            <input
                                type="text"
                                value={rule.input}
                                onChange={(e) => updateRule(index, 'input', e.target.value)}
                                placeholder="مثلاً: مرحباً"
                                className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] rounded-lg p-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-success)] mb-1">عندئذ يرد البوت:</label>
                            <input
                                type="text"
                                value={rule.output}
                                onChange={(e) => updateRule(index, 'output', e.target.value)}
                                placeholder="مثلاً: أهلاً بك!"
                                className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] rounded-lg p-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-success)]"
                            />
                        </div>
                    </div>
                ))}
            </div>
             <button
                onClick={addRule}
                className="w-full bg-[var(--color-accent-primary)] text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
                <FaPlus />
                <span>إضافة قاعدة جديدة</span>
            </button>
            <div className="border-t border-[var(--color-border-primary)] pt-4 mt-4">
                <label className="block text-sm font-medium text-[var(--color-warning)] mb-1">إذا لم يتطابق أي شرط، رد بـ:</label>
                <input
                    type="text"
                    value={defaultReply}
                    onChange={(e) => setDefaultReply(e.target.value)}
                    placeholder="مثلاً: عذراً، لم أفهم ذلك."
                    className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] rounded-lg p-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-warning)]"
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
        <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-2xl flex flex-col h-full text-right" style={{minHeight: '400px'}}>
            <div className="bg-[var(--color-bg-secondary)] p-3 rounded-t-2xl border-b border-[var(--color-border-primary)]">
                <h3 className="text-[var(--color-text-primary)] font-bold">نافذة المحادثة (للتجربة)</h3>
            </div>
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md p-3 rounded-xl ${msg.isUser ? 'bg-[var(--color-accent-primary)] text-white' : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-[var(--color-border-primary)] flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="اكتب رسالة..."
                    className="flex-grow bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] rounded-lg p-2 text-right text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                />
                <button onClick={handleSend} className="bg-[var(--color-accent-primary)] text-white p-2 rounded-lg hover:opacity-90 transition-all">
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
                    className="w-full bg-[var(--color-success)] text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-[var(--color-text-muted)] disabled:cursor-not-allowed"
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