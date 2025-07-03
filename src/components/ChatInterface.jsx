import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaCopy, FaThumbsUp, FaThumbsDown, FaTrash } from 'react-icons/fa';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from './modals/ConfirmModal';
import { useUserProfile } from '../hooks/useUserProfile';

const ChatMessage = ({ msg, onFeedback, onCopy, isCopied, feedbackStatus }) => {
    const isUser = msg.sender === 'user';

    const handleFeedbackClick = (rating) => {
        if (feedbackStatus) return; // Don't allow re-submitting
        onFeedback(msg.id, rating);
    };

    return (
        <div className={`flex items-start gap-4 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                <div className="bg-blue-600 rounded-full p-3">
                    <FaRobot className="text-white" />
                </div>
            )}
            <div className={`group relative max-w-xl p-4 rounded-xl whitespace-pre-wrap ${isUser ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300'}`}>
                {msg.content === 'loading' ? (
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                ) : (
                    <p>{msg.content}</p>
                )}
                {!isUser && msg.content !== 'loading' && (
                    <div className="mt-2 pt-2 border-t border-gray-700 flex items-center gap-4">
                        <button 
                            onClick={() => onCopy(msg.content)} 
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                        >
                            <FaCopy /> {isCopied ? 'تم النسخ!' : 'نسخ'}
                        </button>
                        <button 
                            onClick={() => handleFeedbackClick('positive')} 
                            className={`flex items-center gap-1 text-xs transition-colors ${
                                feedbackStatus === 'positive' 
                                ? 'text-green-400' 
                                : 'text-gray-400 hover:text-white'
                            }`}
                            disabled={!!feedbackStatus}
                        >
                            <FaThumbsUp /> مفيد
                        </button>
                        <button 
                            onClick={() => handleFeedbackClick('negative')} 
                             className={`flex items-center gap-1 text-xs transition-colors ${
                                feedbackStatus === 'negative' 
                                ? 'text-red-400' 
                                : 'text-gray-400 hover:text-white'
                            }`}
                            disabled={!!feedbackStatus}
                        >
                            <FaThumbsDown /> غير مفيد
                        </button>
                    </div>
                )}
            </div>
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

            if (error) {
                // console.error('Error fetching messages:', error);
            } else {
                setMessages(data);
            }
        };
        fetchMessages();
    }, [user]);

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
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

        // Save user message to DB
        const { error: userError } = await supabase.from('chat_messages').insert(userMessage);
        if (userError) {
            // console.error("Error saving user message:", userError)
        };


        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("User not authenticated");

            // Use fetch to handle the stream from the Edge Function
            const response = await fetch(`${supabase.functionsUrl}/chat-with-ayed`, {
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
                buffer = lines.pop() || ''; // Keep the last, possibly incomplete line in buffer

                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const data = line.substring(5).trim();
                        // console.log('Stream data received:', data); // Log the raw data from the stream

                        if (data === '[DONE]') {
                            break;
                        }

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
                            // console.warn("Failed to parse a chunk of the stream:", data, e);
                        }
                    }
                }
                 if (lines.some(line => line.includes('[DONE]'))) {
                    break;
                }
            }
            
            // Once streaming is complete, save the final message to the database
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

            if (aiError) {
                // console.error("Error saving AI message:", aiError);
            } else {
                 setMessages(prev => prev.map(msg => msg.id === tempAiMessageId ? savedAiMessage : msg));
            }


        } catch {
             const errorMessage = { 
                 id: tempAiMessageId,
                 content: 'عذرًا، حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.', 
                 sender: 'assistant', 
                 user_id: user.id 
            };
             setMessages(prev => prev.map(msg => msg.id === tempAiMessageId ? errorMessage : msg));
            // console.error('Error invoking Supabase function:', error);
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

        if (error) {
            // console.error('Error clearing chat:', error);
        } else {
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
            // console.error('Error submitting feedback:', error);
            // Optional: Revert feedback state on error
            setFeedbackSent(prev => {
                const newState = {...prev};
                delete newState[messageId];
                return newState;
            });
        }
    };


    return (
        <div className="bg-gray-900/50 rounded-2xl h-full flex flex-col p-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Ayed Chat</h2>
                 <button 
                    onClick={() => setConfirmOpen(true)}
                    className="p-2 hover:bg-gray-700 rounded-full"
                    title="Clear Conversation"
                >
                    <FaTrash />
                </button>
            </div>
            <div className="flex-grow overflow-y-auto pr-2">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 mt-8">
                        أهلاً بك! أنا عايد، مساعدك الشخصي. ابدأ محادثتك.
                    </div>
                )}
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
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 flex items-center gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="اكتب رسالتك هنا..."
                    className="flex-grow bg-gray-800 border-2 border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white rounded-lg p-3 hover:bg-blue-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    disabled={!input.trim() || isLoading}
                >
                    <FaPaperPlane className="text-xl" />
                </button>
            </form>
            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleClearChat}
                title="Clear Conversation"
                message="Are you sure you want to delete this entire conversation? This action cannot be undone."
            />
        </div>
    );
} 