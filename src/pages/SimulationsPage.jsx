import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLaptopCode, FaBullhorn, FaUsers, FaChartLine, FaArrowLeft, FaCheckCircle, FaClock, FaPlay } from 'react-icons/fa';
import { supabase } from '../supabaseClient';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import { SkeletonSimulationCard } from '../components/ui/Skeleton';
import { ErrorEmpty } from '../components/ui/EmptyState';

// Career configuration
const careerConfig = {
  'FaLaptopCode': {
    icon: FaLaptopCode,
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    iconColor: 'text-blue-400',
    name: 'هندسة البرمجيات',
  },
  'FaBullhorn': {
    icon: FaBullhorn,
    gradient: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    iconColor: 'text-amber-400',
    name: 'التسويق الرقمي',
  },
  'FaUsers': {
    icon: FaUsers,
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    iconColor: 'text-purple-400',
    name: 'الموارد البشرية',
  },
  'FaChartLine': {
    icon: FaChartLine,
    gradient: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
    name: 'التحليل المالي',
  },
};

const getConfig = (iconName) => careerConfig[iconName] || careerConfig['FaLaptopCode'];

const SimulationCard = ({ simulation, delay = 0 }) => {
  const config = getConfig(simulation.icon_name);
  const IconComponent = config.icon;
  const percentage = simulation.total_tasks > 0 
    ? Math.round((simulation.completed_tasks / simulation.total_tasks) * 100) 
    : 0;
  const isCompleted = percentage === 100;
  const isInProgress = percentage > 0 && percentage < 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay }}
    >
      <Link to={`/simulations/briefing/${simulation.id}`} className="block group h-full">
        <Card
          isHoverable
          className={`relative overflow-hidden h-full ${config.bg} ${config.border}`}
        >
          {/* Top gradient bar */}
          <div className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-l ${config.gradient}`} />
          
          {/* Decorative background */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
          
          <div className="relative">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl ${config.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className={`w-7 h-7 ${config.iconColor}`} />
              </div>
              
              {isCompleted ? (
                <Badge variant="success">
                  <FaCheckCircle className="w-3 h-3" />
                  مكتمل
                </Badge>
              ) : isInProgress ? (
                <Badge variant="warning">
                  <FaClock className="w-3 h-3" />
                  قيد التنفيذ
                </Badge>
              ) : (
                <Badge variant="primary">
                  <FaPlay className="w-3 h-3" />
                  متاح
                </Badge>
              )}
            </div>
            
            {/* Content */}
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 text-right">
              {simulation.title}
            </h3>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed text-right mb-4 line-clamp-2">
              {simulation.description}
            </p>
            
            {/* Progress */}
            {simulation.total_tasks > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[var(--color-text-muted)]">
                    {simulation.completed_tasks} / {simulation.total_tasks} مهام
                  </span>
                  <span className={`font-medium ${isCompleted ? 'text-emerald-400' : 'text-[var(--color-primary)]'}`}>
                    {percentage}%
                  </span>
                </div>
                <ProgressBar 
                  value={percentage} 
                  variant={isCompleted ? 'success' : 'primary'}
                  size="sm"
                />
              </div>
            )}
            
            {/* Footer */}
            <div className="flex items-center justify-end gap-2 text-[var(--color-primary)] font-medium group-hover:gap-3 transition-all duration-300">
              <span className="text-sm">{isCompleted ? 'مراجعة' : isInProgress ? 'متابعة' : 'ابدأ الآن'}</span>
              <FaArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

const FilterButton = ({ active, onClick, children, count }) => (
  <button
    onClick={onClick}
    className={`
      px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
      flex items-center gap-2
      ${active 
        ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30' 
        : 'bg-[var(--color-surface-1)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] border border-[var(--color-border-default)]'
      }
    `}
  >
    {children}
    {count !== undefined && (
      <span className={`
        text-xs px-2 py-0.5 rounded-full
        ${active ? 'bg-white/20' : 'bg-[var(--color-surface-2)]'}
      `}>
        {count}
      </span>
    )}
  </button>
);

const EmptyState = ({ filter }) => {
  const messages = {
    All: {
      title: "لا توجد محاكاة متاحة حاليًا",
      description: "يعمل فريقنا بجد لإضافة المزيد من المسارات المهنية. يرجى التحقق مرة أخرى قريبًا!"
    },
    InProgress: {
      title: "ليس لديك محاكاة قيد التنفيذ",
      description: "انتقل إلى قسم 'الكل' لبدء محاكاة جديدة واستكشاف مسار مهني."
    },
    Completed: {
      title: "لم تكمل أي محاكاة بعد",
      description: "عندما تنهي محاكاة، ستظهر هنا. استمر في التعلم!"
    }
  };
  const { title, description } = messages[filter] || messages.All;
  
  return (
    <Card className="text-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-20 h-20 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center mx-auto mb-4">
          <FaLaptopCode className="w-10 h-10 text-[var(--color-text-muted)]" />
        </div>
        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">{title}</h3>
        <p className="text-[var(--color-text-secondary)] max-w-md mx-auto">{description}</p>
      </motion.div>
    </Card>
  );
};

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

  const counts = useMemo(() => ({
    all: simulations.length,
    inProgress: simulations.filter(s => s.status === 'In Progress').length,
    completed: simulations.filter(s => s.status === 'Completed').length,
  }), [simulations]);

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-4 sm:p-8">
          {/* Header skeleton */}
          <div className="text-center mb-10">
            <div className="h-12 w-80 bg-[var(--color-surface-2)] rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="h-6 w-64 bg-[var(--color-surface-2)] rounded-lg mx-auto animate-pulse" />
          </div>
          
          {/* Filter skeleton */}
          <div className="flex justify-center gap-3 mb-8">
            <div className="h-10 w-24 bg-[var(--color-surface-2)] rounded-xl animate-pulse" />
            <div className="h-10 w-32 bg-[var(--color-surface-2)] rounded-xl animate-pulse" />
            <div className="h-10 w-28 bg-[var(--color-surface-2)] rounded-xl animate-pulse" />
          </div>
          
          {/* Cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <SkeletonSimulationCard key={`skeleton-${n}`} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <ErrorEmpty onRetry={() => window.location.reload()} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Badge variant="primary" className="mb-4">
            <FaLaptopCode className="w-3 h-3" />
            المحاكاة التفاعلية
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] mb-3">
            استكشف مساراتك المهنية
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            تفاعل مع محاكاة واقعية واكتشف شغفك الحقيقي
          </p>
        </motion.header>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-3 mb-8 flex-wrap"
        >
          <FilterButton 
            active={filter === 'All'} 
            onClick={() => setFilter('All')}
            count={counts.all}
          >
            الكل
          </FilterButton>
          <FilterButton 
            active={filter === 'InProgress'} 
            onClick={() => setFilter('InProgress')}
            count={counts.inProgress}
          >
            قيد التنفيذ
          </FilterButton>
          <FilterButton 
            active={filter === 'Completed'} 
            onClick={() => setFilter('Completed')}
            count={counts.completed}
          >
            مكتمل
          </FilterButton>
        </motion.div>
        
        {/* Simulations Grid */}
        <AnimatePresence mode="wait">
          {filteredSimulations.length > 0 ? (
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredSimulations.map((sim, index) => (
                <SimulationCard key={sim.id} simulation={sim} delay={index * 0.05} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState filter={filter} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
