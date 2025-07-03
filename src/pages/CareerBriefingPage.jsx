import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import DashboardLayout from '../components/DashboardLayout';
import * as FaIcons from 'react-icons/fa';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';
import BriefingTOC from '../components/BriefingTOC';

const sections = [
    { id: 'what-you-create', title: 'ما الذي يمكنك بناؤه؟' },
    { id: 'bridge-skills', title: 'جسور المهارات' },
    { id: 'day-in-life', title: 'يوم في حياة...' },
    { id: 'highs-lows', title: 'الإيجابيات والتحديات' },
    { id: 'career-path', title: 'مسارك المهني' },
    { id: 'salary', title: 'توقعات الراتب' },
];

const DynamicFaIcon = ({ name }) => {
    const IconComponent = FaIcons[name];
    if (!IconComponent) { 
        // In development, warn about missing icons
        if (import.meta.env.DEV) {
            console.warn(`[DynamicFaIcon] Icon not found: "${name}". Rendering a fallback icon.`);
        }
        return <FaIcons.FaQuestionCircle />;
    }
    return <IconComponent />;
};

const InfoBlock = ({ iconName, title, items }) => (
    <div className="bg-gray-800/50 p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
            <div className="text-blue-400 text-2xl"><DynamicFaIcon name={iconName} /></div>
            <h3 className="text-2xl font-bold text-blue-300">{title}</h3>
        </div>
        <div className="space-y-3">
            {items.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200">
                    <div className="text-green-400 mt-1"><DynamicFaIcon name={item.icon} /></div>
                    <p className="text-gray-300">{item.title}</p>
                </div>
            ))}
        </div>
    </div>
);

const BridgeSkillsBlock = ({ iconName, title, items }) => (
    <div className="bg-gray-800/50 p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
            <div className="text-blue-400 text-2xl"><DynamicFaIcon name={iconName} /></div>
            <h3 className="text-2xl font-bold text-blue-300">{title}</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
            {items.map((item, index) => (
                <div key={index} className="text-center bg-gray-900/70 p-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-blue-500/20 shadow-md">
                    <p className="text-gray-300 text-base">"إذا كنت جيدًا في"</p>
                    <p className="font-semibold text-blue-300 text-xl my-3">{item.from}</p>
                    <div className="text-3xl my-3 text-gray-500">
                        <DynamicFaIcon name="FaArrowDown" />
                    </div>
                    <p className="text-gray-300 text-base">"إذًا لديك أساس"</p>
                    <p className="font-semibold text-green-300 text-xl mt-3">{item.to}</p>
                </div>
            ))}
        </div>
    </div>
);


const PersonaCard = ({ persona }) => {
    const [imgError, setImgError] = useState(false);

    const getInitials = (name) => {
        if (!name) return '?';
        const words = name.split(' ');
        return words[0] ? words[0][0].toUpperCase() : '?';
    };

    const [name, role] = (persona.name || '').split(',').map(s => s.trim());

    return (
        <div className="bg-gradient-to-tr from-gray-900 to-gray-800 border border-gray-700 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 text-center md:text-right shadow-lg hover:shadow-blue-500/20 transition-shadow duration-300">
            <div className="relative w-28 h-28 flex-shrink-0">
                <div className="w-full h-full rounded-full border-4 border-blue-500 flex items-center justify-center bg-gray-700 text-white text-4xl font-bold shadow-lg shadow-blue-500/30">
                    {persona.image_url && !imgError ? (
                        <img 
                            src={persona.image_url} 
                            alt={name} 
                            className="w-full h-full rounded-full object-cover" 
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <span>{getInitials(name)}</span>
                    )}
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-blue-400 text-lg ring-4 ring-gray-800">
                    <DynamicFaIcon name="FaUserTie" />
                </div>
            </div>
            <div className="flex-1">
                <h3 className="text-3xl font-bold text-white">{name}</h3>
                {role && <p className="text-xl text-blue-300 font-medium mt-1">{role}</p>}
                <blockquote className="relative mt-4 pr-4">
                    <div className="absolute -top-2 -right-2 text-6xl text-blue-500/20 font-serif" aria-hidden="true">“</div>
                    <p className="relative text-lg text-gray-300 italic">{persona.quote}</p>
                </blockquote>
            </div>
        </div>
    );
};

const TimelineItem = ({ item, isLast }) => (
    <div className="flex items-start gap-4">
        <div className="flex flex-col items-center">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-blue-300 text-2xl">
                <DynamicFaIcon name={item.icon} />
            </div>
            {!isLast && <div className="w-px h-16 bg-gray-600"></div>}
        </div>
        <div className="pb-16">
            <p className="text-blue-400 font-bold">{item.time} - {item.activity}</p>
            <p className="text-gray-300">{item.description}</p>
        </div>
    </div>
);

const HighsLowsBlock = ({ iconName, title, data }) => (
     <div className="bg-gray-800/50 p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
            <div className="text-blue-400 text-2xl"><DynamicFaIcon name={iconName} /></div>
            <h3 className="text-2xl font-bold text-blue-300">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-900/30 p-4 rounded-lg">
                <h4 className="font-bold text-green-300 mb-2">الإيجابيات</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                    {data.highs.map((high, i) => <li key={i}>{high}</li>)}
                </ul>
            </div>
            <div className="bg-red-900/30 p-4 rounded-lg">
                 <h4 className="font-bold text-red-300 mb-2">التحديات</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                    {data.lows.map((low, i) => <li key={i}>{low}</li>)}
                </ul>
            </div>
        </div>
    </div>
);

const CareerPathBlock = ({ iconName, title, steps }) => (
    <div className="bg-gray-800/50 p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
            <div className="text-blue-400 text-2xl"><DynamicFaIcon name={iconName} /></div>
            <h3 className="text-2xl font-bold text-blue-300">{title}</h3>
        </div>
        <div className="flex items-start justify-between text-center text-sm md:text-base text-gray-300 mt-8">
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div className="flex flex-col items-center w-1/5">
                         <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mb-2 ring-4 ring-gray-900/50">{index + 1}</div>
                        <span className="px-1">{step}</span>
                    </div>
                    {index < steps.length - 1 && <div className="flex-1 h-1 bg-gray-600 mt-5 mx-2 md:mx-4 rounded-full"></div>}
                </React.Fragment>
            ))}
        </div>
    </div>
);

const StickyHeader = ({ title, onStart, isVisible }) => (
    <AnimatePresence>
        {isVisible && (
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                exit={{ y: -100 }}
                transition={{ duration: 0.3 }}
                className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-lg shadow-lg z-50"
            >
                <div className="max-w-5xl mx-auto p-4 flex justify-between items-center text-white">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button 
                        onClick={onStart}
                        className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-500 transition-colors"
                    >
                        ابدأ الآن
                    </button>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default function CareerBriefingPage() {
    const { simulationId } = useParams();
    const navigate = useNavigate();
    const [simulation, setSimulation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isHeaderVisible, setIsHeaderVisible] = useState(false);
    const [activeId, setActiveId] = useState('');
    const observer = useRef();

    useEffect(() => {
        const fetchBriefing = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('simulations')
                .select('title, description, enhanced_briefing')
                .eq('id', simulationId)
                .single();

            if (error) {
                console.error('Error fetching briefing:', error);
                setError("لم يتم العثور على المحاكاة المطلوبة.");
            } else {
                setSimulation(data);
            }
            setLoading(false);
        };

        if (simulationId) {
            fetchBriefing();
        }
    }, [simulationId]);

    useEffect(() => {
        if (!simulation) return; // Don't run effect if simulation data isn't loaded

        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsHeaderVisible(true);
            } else {
                setIsHeaderVisible(false);
            }
        };

        const sectionElements = sections.map(s => document.getElementById(s.id));

        observer.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            });
        }, { rootMargin: '-30% 0px -70% 0px' });

        sectionElements.forEach(el => {
            if (el) observer.current.observe(el);
        });
        
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if(observer.current) {
                observer.current.disconnect();
            }
        };
    }, [simulation]);

    const handleStartSimulation = () => {
        navigate(`/simulations/task/${simulationId}`);
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="h-full flex justify-center items-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </DashboardLayout>
        );
    }
    if (error) {
        return (
            <DashboardLayout>
                <div className="h-full flex justify-center items-center text-center">
                    <div className="bg-red-900/50 text-red-300 p-8 rounded-lg">
                        <h3 className="text-2xl font-bold mb-4">حدث خطأ</h3>
                        <p>{error}</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }
    if (!simulation || !simulation.enhanced_briefing) {
        return <DashboardLayout><div className="text-white p-8 text-center">لا توجد بيانات تعريفية لهذه المحاكاة.</div></DashboardLayout>;
    }

    const { description, enhanced_briefing } = simulation;
    const brief = enhanced_briefing;

    return (
        <DashboardLayout>
            <StickyHeader 
                title={brief.identity_headline} 
                onStart={handleStartSimulation} 
                isVisible={isHeaderVisible} 
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="py-6 text-right">
                    <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-blue-300 hover:text-white transition-all duration-300 bg-gray-800/50 hover:bg-gray-700/70 px-4 py-2 rounded-full text-sm">
                        <DynamicFaIcon name="FaArrowLeft" />
                        <span>العودة</span>
                    </button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <BriefingTOC sections={sections} activeId={activeId} />
                    </div>

                    <main className="lg:col-span-3 text-right">
                        <header className="mb-12 text-center">
                            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-3">{brief.identity_headline}</h1>
                            <p className="text-xl text-gray-400 max-w-prose mx-auto">{description}</p>
                        </header>

                        <div className="space-y-8">
                            <AnimatedSection><PersonaCard persona={brief.persona} /></AnimatedSection>
                            
                            <div id="what-you-create"><AnimatedSection delay={0.1}><InfoBlock iconName="FaRocket" title="ما الذي يمكنك بناؤه؟" items={brief.what_you_create} /></AnimatedSection></div>
                            
                            <div id="bridge-skills"><AnimatedSection delay={0.2}><BridgeSkillsBlock iconName="FaLink" title="جسور المهارات" items={brief.bridge_skills} /></AnimatedSection></div>

                            <div id="day-in-life">
                                <AnimatedSection delay={0.3}>
                                    <div className="bg-gray-800/50 p-6 rounded-2xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="text-blue-400 text-2xl"><DynamicFaIcon name="FaRegClock" /></div>
                                            <h3 className="text-2xl font-bold text-blue-300">يوم في حياة...</h3>
                                        </div>
                                        <div>
                                            {brief.day_in_the_life_timeline.map((item, index) => (
                                                <TimelineItem key={index} item={item} isLast={index === brief.day_in_the_life_timeline.length - 1} />
                                            ))}
                                        </div>
                                    </div>
                                </AnimatedSection>
                            </div>
                            
                            <div id="highs-lows"><AnimatedSection delay={0.4}><HighsLowsBlock iconName="FaBalanceScale" title="الإيجابيات والتحديات" data={brief.highs_lows} /></AnimatedSection></div>

                            <div id="career-path"><AnimatedSection delay={0.5}><CareerPathBlock iconName="FaRoute" title="مسارك المهني المحتمل" steps={brief.career_path_steps} /></AnimatedSection></div>

                            <div id="salary">
                                <AnimatedSection delay={0.6}>
                                    <div className="bg-gray-800/50 p-6 rounded-2xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="text-teal-400 text-3xl"><DynamicFaIcon name="FaMoneyBillWave" /></div>
                                            <h3 className="text-2xl font-bold text-blue-300">توقعات الراتب (سنوياً)</h3>
                                        </div>
                                        <div className="text-center mt-4">
                                            <p className="text-4xl font-bold text-white">
                                                {brief.salary_range}
                                            </p>
                                            <div className="w-full bg-gray-700 rounded-full h-2.5 my-4 max-w-sm mx-auto">
                                                <div className="bg-gradient-to-r from-teal-400 to-blue-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                                            </div>
                                            <p className="text-sm text-gray-400 mt-2">بناءً على بيانات السوق للمبتدئين وأصحاب الخبرة المتوسطة.</p>
                                        </div>
                                    </div>
                                </AnimatedSection>
                            </div>
                        </div>
                        
                        <div className="mt-12 text-center">
                            <button 
                                onClick={handleStartSimulation}
                                className="bg-blue-600 text-white font-bold py-4 px-12 rounded-lg text-xl hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-600/30"
                            >
                                ابدأ المحاكاة الآن!
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        </DashboardLayout>
    );
} 