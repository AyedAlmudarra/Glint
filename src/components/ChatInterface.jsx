import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaRobot, FaCopy, FaThumbsUp, FaThumbsDown, FaTrash, FaUser, FaCheckCircle } from 'react-icons/fa';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from './modals/ConfirmModal';
import { useUserProfile } from '../hooks/useUserProfile';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import Avatar from './ui/Avatar';
import { NoChatEmpty } from './ui/EmptyState';

const TypingIndicator = () => (
    <div className="flex items-center gap-1.5 px-4 py-2">
        <motion.div
            className="w-2 h-2 rounded-full bg-[var(--color-primary)]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        />
        <motion.div
            className="w-2 h-2 rounded-full bg-[var(--color-primary)]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
            className="w-2 h-2 rounded-full bg-[var(--color-primary)]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
        />
    </div>
);

const ChatMessage = ({ msg, onFeedback, onCopy, isCopied, feedbackStatus }) => {
    const isUser = msg.sender === 'user';
    const isLoading = msg.content === 'loading';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex items-start gap-3 my-4 ${isUser ? 'flex-row-reverse' : ''}`}
        >
            {/* Avatar */}
            <div className={`shrink-0 ${isUser ? '' : ''}`}>
                {isUser ? (
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-2)] flex items-center justify-center">
                        <FaUser className="text-[var(--color-text-muted)]" />
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/30">
                        <FaRobot className="text-white" />
                    </div>
                )}
            </div>
            
            {/* Message Bubble */}
            <div className={`
                group relative max-w-[80%] rounded-2xl
                ${isUser 
                    ? 'bg-[var(--color-primary)] text-white rounded-tr-none' 
                    : 'bg-[var(--color-surface-1)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] rounded-tl-none'
                }
            `}>
                <div className="p-4">
                    {isLoading ? (
                        <TypingIndicator />
                    ) : (
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    )}
                </div>
                
                {/* Actions for AI messages */}
                {!isUser && !isLoading && (
                    <div className="px-4 pb-3 pt-2 border-t border-[var(--color-border-default)] flex items-center gap-3">
                        <button 
                            onClick={() => onCopy(msg.content)} 
                            className={`
                                flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg transition-all
                                ${isCopied 
                                    ? 'bg-emerald-500/20 text-emerald-400' 
                                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]'
                                }
                            `}
                        >
                            {isCopied ? <FaCheckCircle className="w-3 h-3" /> : <FaCopy className="w-3 h-3" />}
                            {isCopied ? 'تم' : 'نسخ'}
                        </button>
                        
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => !feedbackStatus && onFeedback(msg.id, 'positive')} 
                                disabled={!!feedbackStatus}
                                className={`
                                    p-1.5 rounded-lg transition-all
                                    ${feedbackStatus === 'positive' 
                                        ? 'bg-emerald-500/20 text-emerald-400' 
                                        : feedbackStatus 
                                            ? 'opacity-50 cursor-not-allowed text-[var(--color-text-muted)]'
                                            : 'text-[var(--color-text-muted)] hover:bg-emerald-500/10 hover:text-emerald-400'
                                    }
                                `}
                            >
                                <FaThumbsUp className="w-3 h-3" />
                            </button>
                            <button 
                                onClick={() => !feedbackStatus && onFeedback(msg.id, 'negative')} 
                                disabled={!!feedbackStatus}
                                className={`
                                    p-1.5 rounded-lg transition-all
                                    ${feedbackStatus === 'negative' 
                                        ? 'bg-red-500/20 text-red-400' 
                                        : feedbackStatus 
                                            ? 'opacity-50 cursor-not-allowed text-[var(--color-text-muted)]'
                                            : 'text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-400'
                                    }
                                `}
                            >
                                <FaThumbsDown className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const SuggestedQuestions = ({ onSelect }) => {
    const suggestions = [
        "ما هي أفضل المسارات المهنية للمبتدئين؟",
        "كيف أعرف أي مجال يناسبني؟",
        "ما المهارات المطلوبة للبرمجة؟",
        "أخبرني عن مهنة التسويق الرقمي"
    ];
    
    return (
        <div className="grid grid-cols-2 gap-2 mt-4">
            {suggestions.map((q, i) => (
                <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => onSelect(q)}
                    className="p-3 text-right text-sm rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:border-[var(--color-primary)]/50 hover:text-[var(--color-text-primary)] transition-all"
                >
                    {q}
                </motion.button>
            ))}
        </div>
    );
};

export default function ChatInterface() {
    const { user } = useAuth();
    const { profile } = useUserProfile();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [copiedMessageId, setCopiedMessageId] = useState(null);
    const [feedbackSent, setFeedbackSent] = useState({});
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchMessages = async () => {
            if (!user) return;
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (!error) {
                setMessages(data);
            }
        };
        fetchMessages();
    }, [user]);

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        if (input.trim() === '' || isLoading) return;

        const userMessageContent = input;
        const tempUserMessageId = crypto.randomUUID();
        const tempAiMessageId = crypto.randomUUID();

        const userMessage = { 
            id: tempUserMessageId, 
            sender: 'user', 
            content: userMessageContent, 
            user_id: user.id 
        };
        const loadingMessage = { 
            id: tempAiMessageId, 
            sender: 'assistant', 
            content: 'loading',
            user_id: user.id
        };

        setMessages(prev => [...prev, userMessage, loadingMessage]);
        setIsLoading(true);
        setInput('');

        await supabase.from('chat_messages').insert(userMessage);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("User not authenticated");

            const response = await fetch(`${supabase.functionsUrl}/chat-with-sanad`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    message: userMessageContent,
                    context: messages
                        .slice(-5)
                        .filter(m => m.content && m.content.trim() !== '')
                        .map(m => ({ sender: m.sender, text: m.content })),
                    userProfile: profile,
                    tasks: [],
                    progress: {}
                })
            });

            if (!response.body) return;

            const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
            let accumulatedResponse = "";
            let buffer = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += value;
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const data = line.substring(5).trim();
                        if (data === '[DONE]') break;

                        try {
                            const json = JSON.parse(data);
                            if (json.type === 'content-delta' && json.delta?.message?.content?.text) {
                                accumulatedResponse += json.delta.message.content.text;
                                setMessages(prev => prev.map(msg =>
                                    msg.id === tempAiMessageId
                                        ? { ...msg, content: accumulatedResponse }
                                        : msg
                                ));
                            }
                        } catch {
                            // Ignore parse errors
                        }
                    }
                }
                if (lines.some(line => line.includes('[DONE]'))) break;
            }
            
            const aiMessageToSave = {
                content: accumulatedResponse,
                sender: 'assistant',
                user_id: user.id
            };

            const { data: savedAiMessage, error: aiError } = await supabase
                .from('chat_messages')
                .insert(aiMessageToSave)
                .select()
                .single();

            if (!aiError) {
                setMessages(prev => prev.map(msg => msg.id === tempAiMessageId ? savedAiMessage : msg));
            }

        } catch {
            const errorMessage = { 
                id: tempAiMessageId,
                content: 'عذرًا، حدث خطأ أثناء الاتصال. يرجى المحاولة مرة أخرى.', 
                sender: 'assistant', 
                user_id: user.id 
            };
            setMessages(prev => prev.map(msg => msg.id === tempAiMessageId ? errorMessage : msg));
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleClearChat = async () => {
        setConfirmOpen(false);
        if(!user) return;
        
        const { error } = await supabase
            .from('chat_messages')
            .delete()
            .eq('user_id', user.id);

        if (!error) {
            setMessages([]);
        }
    };

    const handleCopy = (text) => {
        const messageId = messages.find(m => m.content === text)?.id;
        navigator.clipboard.writeText(text);
        setCopiedMessageId(messageId);
        setTimeout(() => setCopiedMessageId(null), 2000);
    };

    const handleFeedback = async (messageId, rating) => {
        if (!user || feedbackSent[messageId]) return;

        setFeedbackSent(prev => ({ ...prev, [messageId]: rating }));
        
        const { error } = await supabase
            .from('message_feedback')
            .insert({ message_id: messageId, user_id: user.id, rating });
        
        if (error) {
            setFeedbackSent(prev => {
                const newState = {...prev};
                delete newState[messageId];
                return newState;
            });
        }
    };

    const handleSuggestionSelect = (question) => {
        setInput(question);
    };

    return (
        <div className="h-full flex flex-col bg-[var(--color-bg-primary)]">
            {/* Header */}
            <div className="shrink-0 p-4 border-b border-[var(--color-border-default)] bg-[var(--color-surface-1)]">
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmOpen(true)}
                        icon={<FaTrash className="w-4 h-4" />}
                        className="text-[var(--color-text-muted)] hover:text-red-400"
                    >
                        مسح المحادثة
                    </Button>
                    
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">سَند</h2>
                            <p className="text-xs text-[var(--color-text-muted)]">مساعدك الذكي</p>
                        </div>
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/30">
                                <FaRobot className="text-white text-xl" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[var(--color-surface-1)]" />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
                <AnimatePresence>
                    {messages.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex flex-col items-center justify-center text-center"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center mb-6 shadow-xl shadow-[var(--color-primary)]/30">
                                <FaRobot className="text-white text-3xl" />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">مرحباً! أنا سَند 👋</h3>
                            <p className="text-[var(--color-text-secondary)] max-w-md mb-6">
                                مساعدك الذكي في منصة جلينت. اسألني أي سؤال عن المهن والمسارات وأنا هنا لدعمك!
                            </p>
                            <SuggestedQuestions onSelect={handleSuggestionSelect} />
                        </motion.div>
                    ) : (
                        <div className="space-y-2">
                            {messages.map((msg) => (
                                <ChatMessage 
                                    key={msg.id} 
                                    msg={msg} 
                                    onFeedback={handleFeedback}
                                    onCopy={handleCopy}
                                    isCopied={copiedMessageId === msg.id}
                                    feedbackStatus={feedbackSent[msg.id]}
                                />
                            ))}
                        </div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="shrink-0 p-4 border-t border-[var(--color-border-default)] bg-[var(--color-surface-1)]">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="اكتب رسالتك هنا..."
                        className="
                            flex-grow bg-[var(--color-bg-primary)]
                            border-2 border-[var(--color-border-default)]
                            rounded-xl py-3 px-4
                            text-[var(--color-text-primary)]
                            placeholder:text-[var(--color-text-muted)]
                            focus:outline-none focus:border-[var(--color-primary)]
                            transition-colors
                        "
                        dir="rtl"
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        isDisabled={!input.trim() || isLoading}
                        isLoading={isLoading}
                        icon={<FaPaperPlane />}
                        isIconOnly
                        className="shrink-0"
                    />
                </form>
            </div>
            
            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleClearChat}
                title="مسح المحادثة"
                message="هل أنت متأكد من حذف المحادثة بالكامل؟ هذا الإجراء لا يمكن التراجع عنه."
            />
        </div>
    );
}
