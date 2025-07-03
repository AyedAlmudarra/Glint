import { Link } from 'react-router-dom';
import { FaBroadcastTower, FaCoins, FaLightbulb } from 'react-icons/fa';

const roadmapData = {
    // Finance -> FinTech
    4: {
        icon: <FaCoins className="text-yellow-400" />,
        nextPath: '/simulations/software-engineer',
        nextTitle: 'مهندس برمجيات',
        trackTitle: 'مسار التكنولوجيا المالية (FinTech)',
        description: 'بصفتك محللًا ماليًا، فإن تعلم البرمجة سيفتح لك أبوابًا في قطاع التكنولوجيا المالية سريع النمو. ستتمكن من بناء نماذج مالية آلية وتطوير أدوات تداول والمزيد.'
    },
    // Software Eng -> FinTech
    1: {
        icon: <FaCoins className="text-yellow-400" />,
        nextPath: '/simulations/finance-analyst',
        nextTitle: 'محلل مالي',
        trackTitle: 'مسار التكنولوجيا المالية (FinTech)',
        description: 'بصفتك مهندس برمجيات، فإن فهمك للمبادئ المالية سيسمح لك ببناء حلول تقنية مبتكرة للأسواق المالية. تعلم كيفية تحليل البيانات المالية لإنشاء تطبيقات مؤثرة.'
    },
    // Digital Marketer -> Marketing Analytics
    2: {
        icon: <FaBroadcastTower className="text-teal-400" />,
        nextPath: '/simulations/finance-analyst',
        nextTitle: 'محلل مالي',
        trackTitle: 'مسار تحليل التسويق',
        description: 'بصفتك مسوقًا رقميًا، فإن تعميق مهاراتك في التحليل المالي سيمنحك ميزة تنافسية. تعلم كيفية ربط الحملات التسويقية مباشرة بالعائد المالي للشركة.'
    },
     // HR -> People Analytics
    3: {
        icon: <FaBroadcastTower className="text-teal-400" />,
        nextPath: '/simulations/digital-marketer',
        nextTitle: 'مسوق رقمي',
        trackTitle: 'مسار تحليلات الأفراد والعلامة التجارية للموظفين',
        description: 'بصفتك متخصصًا في الموارد البشرية، فإن تعلم التسويق الرقمي يمكّنك من بناء علامة تجارية قوية للشركة لجذب أفضل المواهب وتحليل بيانات الموظفين بفعالية.'
    }
};

const DefaultRoadmap = () => (
    <div className="bg-gray-800 rounded-2xl p-6 text-right">
        <div className="flex items-center gap-4 mb-4">
            <FaLightbulb className="text-2xl text-yellow-300" />
            <h2 className="text-2xl font-bold text-white">ابدأ مسارك المهني</h2>
        </div>
        <p className="text-gray-400 mb-4">
            أكمل محاكاة واحدة على الأقل وسنكشف لك عن مسارات مهنية مخصصة تجمع بين مهارات مختلفة. ابدأ الآن واطلق العنان لإمكانياتك!
        </p>
        <Link to="/simulations" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
            استكشف المحاكاة ←
        </Link>
    </div>
);

const CareerRoadmap = ({ completedSimulations }) => {
    if (completedSimulations.length === 0) {
        return <DefaultRoadmap />;
    }

    // For simplicity, we base the recommendation on the *first* completed simulation.
    // A more complex system could look at all completed sims.
    const lastCompletedId = completedSimulations[0].id;
    const recommendation = roadmapData[lastCompletedId];

    if (!recommendation) {
         return <DefaultRoadmap />;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-4 text-right">مسارك المهني المقترح</h2>
            <div className="bg-gray-800 rounded-2xl p-6 text-right border-2 border-dashed border-gray-700">
                <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl">{recommendation.icon}</div>
                    <div>
                        <h3 className="text-xl font-bold text-white">{recommendation.trackTitle}</h3>
                        <p className="text-gray-400">الخطوة التالية المقترحة: {recommendation.nextTitle}</p>
                    </div>
                </div>
                <p className="text-gray-400 mb-5">
                    {recommendation.description}
                </p>
                <Link to={recommendation.nextPath} className="w-full block text-center font-bold bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-500 transition-colors">
                    ابدأ محاكاة {recommendation.nextTitle}
                </Link>
            </div>
        </div>
    );
};

export default CareerRoadmap; 