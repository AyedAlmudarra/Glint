import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaLaptopCode, FaBullhorn, FaUsers, FaChartLine } from 'react-icons/fa';
import { supabase } from '../supabaseClient';
import DashboardLayout from '../components/DashboardLayout';

const iconMap = {
    'FaLaptopCode': <FaLaptopCode />,
    'FaBullhorn': <FaBullhorn />,
    'FaUsers': <FaUsers />,
    'FaChartLine': <FaChartLine />,
};

const mapIcon = (iconName) => iconMap[iconName] || <FaLaptopCode />;

const SimulationCard = ({ simulation }) => (
    <Link to={`/simulations/briefing/${simulation.id}`} className="block h-full">
        <div 
            className="bg-gray-800 rounded-2xl p-6 flex flex-col justify-between hover:bg-gray-700/80 transition-all duration-300 h-full"
        >
            <div>
                <div className="flex justify-between items-start">
                    <div className="text-3xl text-blue-400">{mapIcon(simulation.icon_name)}</div>
                    <span className="bg-blue-900/50 text-blue-300 text-xs font-bold px-3 py-1 rounded-full">{simulation.tag || "متاح"}</span>
                </div>
                <h3 className="text-xl font-bold text-white mt-4 text-right">{simulation.title}</h3>
                <p className="text-gray-400 mt-2 text-right text-sm leading-relaxed">{simulation.description}</p>
            </div>
        </div>
    </Link>
);

const EmptyState = ({ filter }) => {
    const messages = {
        All: {
            title: "لا توجد محاكاة متاحة حاليًا",
            subtitle: "يعمل فريقنا بجد لإضافة المزيد من المسارات المهنية. يرجى التحقق مرة أخرى قريبًا!"
        },
        InProgress: {
            title: "ليس لديك محاكاة قيد التنفيذ",
            subtitle: "انتقل إلى قسم 'الكل' لبدء محاكاة جديدة واستكشاف مسار مهني."
        },
        Completed: {
            title: "لم تكمل أي محاكاة بعد",
            subtitle: "عندما تنهي محاكاة، ستظهر هنا. استمر في التعلم!"
        }
    };
    const { title, subtitle } = messages[filter] || messages.All;
    return (
        <div className="text-center text-gray-400 bg-gray-800 p-10 rounded-xl">
            <p className="text-lg font-semibold text-white mb-2">{title}</p>
            <p>{subtitle}</p>
        </div>
    );
};

const LoadingState = () => (
    <div className="flex flex-col items-center justify-center p-10 bg-gray-800 rounded-xl">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-semibold text-white">جاري تحميل المحاكاة...</p>
        <p className="text-gray-400">لحظات قليلة ونكون معك.</p>
    </div>
);

export default function SimulationsPage() {
    const [simulations, setSimulations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');
    
    const filteredSimulations = useMemo(() => {
        if (filter === 'All') return simulations;
        if (filter === 'InProgress') return simulations.filter(s => s.status === 'In Progress');
        if (filter === 'Completed') return simulations.filter(s => s.status === 'Completed');
        return simulations;
    }, [simulations, filter]);

    useEffect(() => {
        const fetchSimulations = async () => {
            try {
                const { data, error } = await supabase.rpc('get_user_dashboard_data');
                if (error) throw error;

                const combinedData = (data.all_simulations || []).map(sim => {
                    const progress = (data.simulation_progress || []).find(p => p.simulation_id === sim.id);
                    const completed_tasks = progress ? progress.completed_tasks : 0;
                    const total_tasks = progress ? progress.total_tasks : 0;
                    
                    let status = 'Not Started';
                    if (progress) {
                        if (completed_tasks >= total_tasks) {
                            status = 'Completed';
                        } else if (completed_tasks > 0) {
                            status = 'In Progress';
                        }
                    }

                    return {
                        ...sim,
                        completed_tasks,
                        total_tasks,
                        status
                    };
                });
                
                setSimulations(combinedData);
            } catch (error) {
                setError(error.message);
                console.error("Error fetching simulations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSimulations();
    }, []);

    const FilterButton = ({ value, label }) => (
        <button
            onClick={() => setFilter(value)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                filter === value 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
        >
            {label}
        </button>
    );

    if (loading) return <DashboardLayout><div className="p-8 flex justify-center items-center h-full"><LoadingState /></div></DashboardLayout>;
    if (error) return <DashboardLayout><p className="text-red-400 p-8 text-center">خطأ في تحميل المحاكاة: {error}</p></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="p-4 sm:p-8 text-right">
                <header className="mb-10 text-center">
                    <h1 className="text-5xl font-extrabold text-white mb-2">استكشف مساراتك المهنية</h1>
                    <p className="text-xl text-gray-400">تفاعل مع محاكاة واقعية واكتشف شغفك.</p>
                </header>

                <div className="mb-8 flex justify-center gap-2">
                    <FilterButton value="All" label="الكل" />
                    <FilterButton value="InProgress" label="قيد التنفيذ" />
                    <FilterButton value="Completed" label="مكتمل" />
                </div>
                
                {filteredSimulations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSimulations.map(sim => (
                            <SimulationCard key={sim.id} simulation={sim} />
                        ))}
                    </div>
                ) : (
                    <EmptyState filter={filter} />
                )}
            </div>
        </DashboardLayout>
    );
} 