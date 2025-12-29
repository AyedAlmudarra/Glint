import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLightbulb, FaCheckCircle } from 'react-icons/fa';

const StepCard = ({ children, title }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="bg-[var(--color-bg-secondary)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border-primary)] w-full"
    >
        <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 text-right">{title}</h3>
        {children}
    </motion.div>
);

StepCard.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
};

const WriteAndReactTask = ({ definition, onComplete, isSubmitting }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [userResponses, setUserResponses] = useState({});
    
    const { ui_schema } = definition;
    const { title, scenario, steps } = ui_schema;
    const currentStepData = steps.find(s => s.step === currentStep);

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete(userResponses);
        }
    };
    
    const handleResponseChange = (step, value) => {
        setUserResponses(prev => ({ ...prev, [step]: value }));
    };

    const renderStepContent = () => {
        if (!currentStepData) return null;

        switch (currentStepData.type) {
            case 'discover':
                return (
                    <StepCard title={currentStepData.title}>
                        <div className="text-right">
                            <img src={currentStepData.product_image_url} alt="Snack" className="w-full max-w-sm mx-auto rounded-lg mb-6 shadow-lg" />
                            <p className="text-lg text-[var(--color-text-secondary)] mb-4">{currentStepData.description}</p>
                            <p className="font-semibold text-[var(--color-text-primary)] mb-2">{currentStepData.prompt}</p>
                            <textarea
                                className="w-full p-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:outline-none"
                                rows="3"
                                placeholder="اكتب أفكارك الأولية هنا..."
                                onChange={(e) => handleResponseChange('discover_thought', e.target.value)}
                            />
                        </div>
                    </StepCard>
                );
            
            case 'write':
                return (
                    <StepCard title={currentStepData.title}>
                        <div className="text-right">
                            <p className="font-semibold text-[var(--color-text-primary)] mb-2">{currentStepData.prompt}</p>
                            <textarea
                                className="w-full p-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:outline-none mb-4"
                                rows="4"
                                placeholder="اكتب تعليقك الجذاب هنا..."
                                onChange={(e) => handleResponseChange('caption', e.target.value)}
                            />
                            <div className="bg-[var(--color-bg-primary)] p-4 rounded-lg border border-[var(--color-border-primary)]">
                                <p className="flex items-center justify-end gap-2 text-[var(--color-warning)] font-semibold mb-2">
                                    <FaLightbulb />
                                    <span>نصائح للإلهام</span>
                                </p>
                                <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-1">
                                    {currentStepData.tips.map((tip, index) => <li key={index}>{tip}</li>)}
                                </ul>
                            </div>
                        </div>
                    </StepCard>
                );

            case 'react':
                return (
                    <StepCard title={currentStepData.title}>
                        <div className="text-right space-y-6">
                            {currentStepData.sample_captions.map(caption => (
                                <div key={caption.id} className="bg-[var(--color-bg-primary)] p-4 rounded-lg border border-[var(--color-border-primary)]">
                                    <p className="text-lg text-[var(--color-text-primary)] font-mono mb-3 p-3 bg-black/30 rounded-md">"{caption.text}"</p>
                                    <div className="flex justify-end items-center gap-4">
                                        <p className="text-[var(--color-text-secondary)]">تفاعلك:</p>
                                        <div className="flex gap-2 text-2xl">
                                            <button className="transform hover:scale-125 transition-transform">👍</button>
                                            <button className="transform hover:scale-125 transition-transform">😂</button>
                                            <button className="transform hover:scale-125 transition-transform">😮</button>
                                            <button className="transform hover:scale-125 transition-transform">👏</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </StepCard>
                );
            
            case 'feedback':
                 return (
                    <StepCard title={currentStepData.title}>
                        <div className="text-center bg-[var(--color-bg-primary)] p-6 rounded-lg border border-[var(--color-border-primary)]">
                            <FaCheckCircle className="text-5xl text-[var(--color-success)] mx-auto mb-4" />
                            <p className="text-lg text-[var(--color-text-secondary)] mb-4">
                                {currentStepData.final_message}
                            </p>
                            <div className="text-right my-4">
                                <h4 className="font-bold text-[var(--color-text-primary)] mb-2">أبرز النقاط لجعل التعليق مميزًا:</h4>
                                <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-1">
                                    {currentStepData.feedback_points.map((point, i) => <li key={i}>{point}</li>)}
                                </ul>
                            </div>
                        </div>
                    </StepCard>
                );

            case 'reflection':
                return (
                    <StepCard title={currentStepData.title}>
                        <div className="text-right">
                             <p className="font-semibold text-[var(--color-text-primary)] mb-4">{currentStepData.prompt}</p>
                             <div className="space-y-3">
                                {currentStepData.options.map((option, index) => (
                                    <button 
                                        key={index}
                                        className="w-full text-right p-3 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-accent-primary)] rounded-lg transition-all text-[var(--color-text-primary)] border border-[var(--color-border-primary)] hover:border-[var(--color-accent-primary)]"
                                        onClick={() => {
                                            handleResponseChange('reflection', option);
                                            handleNext();
                                        }}
                                    >
                                        {option}
                                    </button>
                                ))}
                             </div>
                        </div>
                    </StepCard>
                );

            default:
                return null;
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto p-4">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-[var(--color-text-primary)]">{title}</h1>
                <p className="text-lg text-[var(--color-text-secondary)] mt-2 max-w-2xl mx-auto">{scenario}</p>
            </header>
            
            <AnimatePresence mode="wait">
                {renderStepContent()}
            </AnimatePresence>

            {currentStepData && currentStepData.type !== 'reflection' && (
                 <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className="bg-[var(--color-accent-primary)] text-white font-bold py-3 px-12 rounded-lg hover:opacity-90 transition-all transform hover:scale-105 disabled:bg-[var(--color-text-muted)]"
                    >
                        {isSubmitting ? 'جاري الإرسال...' : (currentStep === steps.length ? 'إنهاء المهمة' : 'التالي')}
                    </button>
                </div>
            )}
        </div>
    );
};

WriteAndReactTask.propTypes = {
    definition: PropTypes.shape({
        ui_schema: PropTypes.shape({
            title: PropTypes.string.isRequired,
            scenario: PropTypes.string.isRequired,
            steps: PropTypes.arrayOf(PropTypes.object).isRequired,
        }).isRequired,
    }).isRequired,
    onComplete: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
};

export default WriteAndReactTask; 