import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { FaBullseye, FaQuestionCircle, FaLightbulb, FaPaperPlane } from 'react-icons/fa';

const goalOptions = [
    { id: 'explore', text: 'مجرد استكشاف مسارات مهنية مختلفة' },
    { id: 'build_skills', text: 'أحتاج إلى بناء مهارات عملية' },
    { id: 'confirm_career', text: 'أريد التأكد مما إذا كان مسار معين مناسبًا لي' },
    { id: 'choose_major', text: 'أحتاج إلى مساعدة في اختيار تخصصي الجامعي' },
];

const challengeOptions = [
    { id: 'too_many_interests', text: 'لدي اهتمامات كثيرة ولا أستطيع اتخاذ قرار' },
    { id: 'unsure_of_strengths', text: 'لا أعرف ما هي نقاط قوتي' },
    { id: 'fear_of_wrong_choice', text: 'أنا قلق من اتخاذ القرار الخاطئ' },
    { id: 'dont_know_where_to_start', text: 'لا أعرف من أين أبدأ' },
];

const learningStyleOptions = [
    { id: 'doing', text: 'عن طريق التطبيق والتجربة' },
    { id: 'reading', text: 'عن طريق القراءة والحصول على التفاصيل أولاً' },
];

const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);
  

export default function OnboardingSurvey({ user, onComplete }) {
    const [formData, setFormData] = useState({
        primary_goal: '',
        biggest_challenge: '',
        learning_style: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.primary_goal || !formData.biggest_challenge || !formData.learning_style) {
            setError('يرجى الإجابة على جميع الأسئلة.');
            return;
        }
        
        setLoading(true);
        setError('');

        const { error: updateError } = await supabase
            .from('users')
            .update({ 
                ...formData,
                has_completed_onboarding: true 
            })
            .eq('id', user.id);
        
        setLoading(false);

        if (updateError) {
            setError(`حدث خطأ: ${updateError.message}`);
        } else {
            onComplete();
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 50 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl p-8 text-white text-right"
                >
                    <h2 className="text-3xl font-bold text-blue-400 mb-2">مرحباً بك في جلينت، {user.user_metadata.first_name || 'يا صديقنا'}!</h2>
                    <p className="text-gray-300 mb-8">لنخصص خريطة طريقك المهنية. إجاباتك ستساعدنا في إرشادك بشكل أفضل.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <QuestionBlock icon={<FaBullseye />} title="ما هو هدفك الأساسي من استخدام جلينت؟">
                            {goalOptions.map(option => (
                                <RadioCard key={option.id} name="primary_goal" value={option.id} label={option.text} checked={formData.primary_goal === option.id} onChange={handleChange} />
                            ))}
                        </QuestionBlock>

                        <QuestionBlock icon={<FaQuestionCircle />} title="ما هو التحدي الأكبر الذي تواجهه في التخطيط لمسارك المهني حاليًا؟">
                             {challengeOptions.map(option => (
                                <RadioCard key={option.id} name="biggest_challenge" value={option.id} label={option.text} checked={formData.biggest_challenge === option.id} onChange={handleChange} />
                            ))}
                        </QuestionBlock>

                        <QuestionBlock icon={<FaLightbulb />} title="كيف تفضل أن تتعلم؟">
                            {learningStyleOptions.map(option => (
                                <RadioCard key={option.id} name="learning_style" value={option.id} label={option.text} checked={formData.learning_style === option.id} onChange={handleChange} />
                            ))}
                        </QuestionBlock>

                        {error && <p className="text-red-400 text-center">{error}</p>}

                        <div className="flex justify-center pt-4">
                            <motion.button 
                                type="submit" 
                                disabled={loading}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-green-600 text-white font-bold py-3 px-10 rounded-full hover:bg-green-700 transition duration-300 flex items-center justify-center gap-3 disabled:bg-gray-500 disabled:cursor-not-allowed"
                            >
                                {loading ? <Spinner /> : <><span>لنبدأ الرحلة</span> <FaPaperPlane /></>}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

const QuestionBlock = ({ icon, title, children }) => (
    <fieldset>
        <legend className="flex items-center gap-3 mb-4">
            <div className="text-blue-400 text-2xl">{icon}</div>
            <h3 className="text-xl font-bold">{title}</h3>
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {children}
        </div>
    </fieldset>
);

const RadioCard = ({ name, value, label, checked, onChange }) => (
    <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${checked ? 'bg-blue-900/50 border-blue-500 shadow-lg' : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'}`}>
        <input 
            type="radio" 
            name={name} 
            value={value} 
            checked={checked} 
            onChange={onChange}
            className="hidden"
        />
        <span className="text-base">{label}</span>
    </label>
); 