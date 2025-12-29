import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { FaLaptopCode, FaBullhorn, FaUsers, FaChartLine, FaCheckCircle, FaLock, FaClock, FaArrowLeft, FaCompass, FaRobot, FaPlay } from 'react-icons/fa';
import { supabase } from '../supabaseClient';
import OnboardingSurvey from '../components/OnboardingSurvey';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import { SkeletonCard } from '../components/ui/Skeleton';

// Career configuration
const careerConfig = {
  'FaLaptopCode': { 
    icon: FaLaptopCode, 
    bg: 'bg-blue-500/10', 
    border: 'border-blue-500/30', 
    iconColor: 'text-blue-400', 
    gradient: 'from-blue-500 to-blue-600',
    glow: 'shadow-blue-500/20'
  },
  'FaBullhorn': { 
    icon: FaBullhorn, 
    bg: 'bg-amber-500/10', 
    border: 'border-amber-500/30', 
    iconColor: 'text-amber-400', 
    gradient: 'from-amber-500 to-amber-600',
    glow: 'shadow-amber-500/20'
  },
  'FaUsers': { 
    icon: FaUsers, 
    bg: 'bg-purple-500/10', 
    border: 'border-purple-500/30', 
    iconColor: 'text-purple-400', 
    gradient: 'from-purple-500 to-purple-600',
    glow: 'shadow-purple-500/20'
  },
  'FaChartLine': { 
    icon: FaChartLine, 
    bg: 'bg-emerald-500/10', 
    border: 'border-emerald-500/30', 
    iconColor: 'text-emerald-400', 
    gradient: 'from-emerald-500 to-emerald-600',
    glow: 'shadow-emerald-500/20'
  },
};

const getConfig = (iconName) => careerConfig[iconName] || careerConfig['FaLaptopCode'];

// Time-based greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'صباح الخير';
  return 'مساء الخير';
};

// Welcome Section
const WelcomeSection = ({ name, isNewUser, hasProgress }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-right mb-8"
  >
    <div className="flex items-center justify-end gap-3 mb-2">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]">
        {getGreeting()}، {name || 'مستكشف'}! 👋
      </h1>
    </div>
    <p className="text-[var(--color-text-secondary)] text-sm sm:text-base">
      {isNewUser 
        ? 'مرحباً بك في جلينت! ابدأ باستكشاف المسارات المهنية المختلفة.'
        : hasProgress 
          ? 'واصل رحلتك في استكشاف المسارات المهنية.'
          : 'اختر مساراً مهنياً لتبدأ تجربتك الأولى.'
      }
    </p>
  </motion.div>
);

// Exploration Journey Tracker - visual representation of careers explored
const ExplorationTracker = ({ simulations }) => {
  const exploredCount = simulations.filter(s => s.completed_tasks > 0).length;
  const completedCount = simulations.filter(s => s.completed_tasks === s.total_tasks && s.total_tasks > 0).length;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Card className="bg-gradient-to-l from-[var(--color-primary)]/5 to-transparent border-[var(--color-primary)]/20">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Visual Journey */}
          <div className="flex items-center gap-2 justify-center flex-wrap">
            {simulations.map((sim, index) => {
              const config = getConfig(sim.icon_name);
              const Icon = config.icon;
              const isExplored = sim.completed_tasks > 0;
              const isCompleted = sim.completed_tasks === sim.total_tasks && sim.total_tasks > 0;
              
              return (
                <motion.div
                  key={sim.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className={`
                    w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all
                    ${isCompleted 
                      ? `bg-gradient-to-br ${config.gradient} shadow-lg ${config.glow}` 
                      : isExplored 
                        ? `${config.bg} ${config.border} border-2`
                        : 'bg-[var(--color-surface-2)] border border-[var(--color-border-default)]'
                    }
                  `}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isCompleted ? 'text-white' : isExplored ? config.iconColor : 'text-[var(--color-text-muted)]'}`} />
                  </div>
                  {isCompleted && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-[var(--color-bg-primary)]">
                      <FaCheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
          
          {/* Text */}
          <div className="flex-1 text-center sm:text-right">
            <p className="text-lg font-bold text-[var(--color-text-primary)]">
              {exploredCount === 0 
                ? 'ابدأ رحلة الاستكشاف'
                : `استكشفت ${exploredCount} من ${simulations.length} مسارات`
              }
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {completedCount > 0 
                ? `أكملت ${completedCount} محاكاة بالكامل`
                : 'جرب المسارات المختلفة لاكتشاف ما يناسبك'
              }
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Continue Exploration Card - prominent CTA for current/next simulation
const ContinueExplorationCard = ({ simulation }) => {
  if (!simulation) return null;
  
  const config = getConfig(simulation.icon_name);
  const Icon = config.icon;
  const isInProgress = simulation.completed_tasks > 0 && simulation.completed_tasks < simulation.total_tasks;
  const percentage = simulation.total_tasks > 0 
    ? Math.round((simulation.completed_tasks / simulation.total_tasks) * 100) 
    : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Link to={`/simulations/task/${simulation.id}`} className="block group">
        <div className={`
          relative rounded-2xl p-6 sm:p-8 overflow-hidden
          bg-gradient-to-l ${config.gradient}
          shadow-xl hover:shadow-2xl ${config.glow}
          transition-all duration-300 hover:-translate-y-1
        `}>
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
          
          <div className="relative">
            <div className="flex items-start gap-4 sm:gap-6 mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              
              <div className="flex-1 text-right min-w-0">
                <Badge variant="neutral" className="mb-2 bg-white/20 border-white/30 text-white text-xs">
                  {isInProgress ? 'واصل من حيث توقفت' : 'ابدأ الآن'}
                </Badge>
                <h3 className="font-bold text-xl sm:text-2xl text-white truncate">{simulation.title}</h3>
                <p className="text-white/80 text-sm mt-1 line-clamp-2">{simulation.description}</p>
              </div>
            </div>
            
            {/* Progress */}
            {isInProgress && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-white/80 mb-2">
                  <span>{simulation.completed_tasks} / {simulation.total_tasks} مهام</span>
                  <span>{percentage}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-end gap-2 text-white font-medium group-hover:gap-3 transition-all">
              <span className="text-sm sm:text-base">{isInProgress ? 'متابعة' : 'ابدأ التجربة'}</span>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                <FaArrowLeft className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Career Card - simplified exploration card
const CareerCard = ({ simulation, delay = 0 }) => {
  const config = getConfig(simulation.icon_name);
  const Icon = config.icon;
  const isExplored = simulation.completed_tasks > 0;
  const isCompleted = simulation.completed_tasks === simulation.total_tasks && simulation.total_tasks > 0;
  const percentage = simulation.total_tasks > 0 
    ? Math.round((simulation.completed_tasks / simulation.total_tasks) * 100) 
    : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link to={`/simulations/briefing/${simulation.id}`} className="block group h-full">
        <Card isHoverable className={`h-full ${config.bg} ${config.border} relative overflow-hidden`}>
          {/* Top accent */}
          <div className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-l ${config.gradient}`} />
          
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${config.iconColor}`} />
              </div>
              
              <div className="flex-1 text-right min-w-0">
                <h3 className="font-bold text-lg text-[var(--color-text-primary)] truncate">{simulation.title}</h3>
                {isCompleted ? (
                  <Badge variant="success" size="sm">
                    <FaCheckCircle className="w-3 h-3" />
                    مكتمل
                  </Badge>
                ) : isExplored ? (
                  <Badge variant="warning" size="sm">قيد الاستكشاف</Badge>
                ) : (
                  <Badge variant="primary" size="sm">
                    <FaPlay className="w-2 h-2" />
                    جديد
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Description */}
            <p className="text-sm text-[var(--color-text-secondary)] text-right mb-4 line-clamp-2 flex-1">
              {simulation.description}
            </p>
            
            {/* Progress or CTA */}
            {isExplored ? (
              <div>
                <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mb-1">
                  <span>{simulation.completed_tasks}/{simulation.total_tasks}</span>
                  <span>{percentage}%</span>
                </div>
                <ProgressBar value={percentage} size="sm" variant={isCompleted ? 'success' : 'primary'} />
              </div>
            ) : (
              <div className="flex items-center justify-end gap-2 text-[var(--color-primary)] text-sm font-medium group-hover:gap-3 transition-all">
                <span>اكتشف المزيد</span>
                <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </div>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

// Sanad Quick Access - AI assistant promotion
const SanadQuickAccess = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    <Link to="/sanad" className="block group">
      <Card className="bg-gradient-to-l from-[var(--color-primary)]/10 to-transparent border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/40 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/30 shrink-0">
            <FaRobot className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 text-right min-w-0">
            <h3 className="font-bold text-[var(--color-text-primary)]">تحدث مع سَند</h3>
            <p className="text-sm text-[var(--color-text-secondary)] truncate">
              مساعدك الذكي للإرشاد المهني
            </p>
          </div>
          
          <FaArrowLeft className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:-translate-x-1 transition-all shrink-0" />
        </div>
      </Card>
    </Link>
  </motion.div>
);

// First Time User View - simplified onboarding
const FirstTimeUserView = ({ simulations, name }) => (
  <div className="space-y-8">
    <WelcomeSection name={name} isNewUser={true} hasProgress={false} />
    
    {/* Main CTA */}
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <div className="w-20 h-20 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-6">
        <FaCompass className="w-10 h-10 text-[var(--color-primary)]" />
      </div>
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
        ابدأ رحلة الاستكشاف
      </h2>
      <p className="text-[var(--color-text-secondary)] max-w-md mx-auto mb-6">
        اختر أحد المسارات المهنية أدناه لتجربة مهام حقيقية واكتشاف ما يناسبك
      </p>
    </motion.div>
    
    {/* Career Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {simulations.map((sim, index) => (
        <CareerCard key={sim.id} simulation={sim} delay={index * 0.1} />
      ))}
    </div>
    
    {/* Sanad */}
    <div className="mt-8">
      <p className="text-center text-[var(--color-text-muted)] text-sm mb-4">
        لست متأكداً من أين تبدأ؟
      </p>
      <SanadQuickAccess />
    </div>
  </div>
);

// Returning User View - focused on continuation
const ReturningUserView = ({ simulations, name, nextSimulation }) => {
  const exploredSimulations = simulations.filter(s => s.completed_tasks > 0);
  const unexploredSimulations = simulations.filter(s => s.completed_tasks === 0);
  
  return (
    <div className="space-y-8">
      <WelcomeSection name={name} isNewUser={false} hasProgress={exploredSimulations.length > 0} />
      
      {/* Journey Tracker */}
      <ExplorationTracker simulations={simulations} />
      
      {/* Continue Exploration */}
      {nextSimulation && (
        <section>
          <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-4 text-right">
            التالي لك
          </h2>
          <ContinueExplorationCard simulation={nextSimulation} />
        </section>
      )}
      
      {/* Other Careers to Explore */}
      {unexploredSimulations.length > 0 && (
        <section>
          <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-4 text-right">
            استكشف المزيد
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {unexploredSimulations.slice(0, 3).map((sim, index) => (
              <CareerCard key={sim.id} simulation={sim} delay={index * 0.1} />
            ))}
          </div>
          {unexploredSimulations.length > 3 && (
            <div className="text-center mt-4">
              <Link to="/simulations">
                <Button variant="secondary" icon={<FaCompass />}>
                  عرض جميع المسارات
                </Button>
              </Link>
            </div>
          )}
        </section>
      )}
      
      {/* Explored Careers */}
      {exploredSimulations.length > 0 && (
        <section>
          <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-4 text-right">
            مسارات استكشفتها
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exploredSimulations.map((sim, index) => (
              <CareerCard key={sim.id} simulation={sim} delay={index * 0.05} />
            ))}
          </div>
        </section>
      )}
      
      {/* Sanad Quick Access */}
      <SanadQuickAccess />
    </div>
  );
};

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    simulations: [],
    unlockedSkills: [],
    unlockedAchievements: []
  });
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }
      setUser(session.user);

      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        setProfile('not_found');
        setLoading(false);
        return;
      }
      setProfile(userProfile);

      if (userProfile && !userProfile.has_completed_onboarding) {
        setShowOnboarding(true);
      }

      const { data, error } = await supabase.rpc('get_user_dashboard_data');

      if (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData({ simulations: [], unlockedSkills: [], unlockedAchievements: [] });
      } else if (data) {
        const processedSimulations = (data.all_simulations || []).map(sim => {
          const progress = (data.simulation_progress || []).find(p => p.simulation_id === sim.id);
          return {
            ...sim,
            completed_tasks: progress ? Number.parseInt(progress.completed_tasks, 10) : 0,
            total_tasks: progress ? Number.parseInt(progress.total_tasks, 10) : 0,
          };
        });

        setDashboardData({
          simulations: processedSimulations,
          unlockedSkills: data.unlocked_skills || [],
          unlockedAchievements: data.unlocked_achievements || [],
        });
      }
      
      setLoading(false);
    };

    fetchAllData();
  }, []);

  const handleOnboardingComplete = async (updatedProfile) => {
    setProfile(updatedProfile);
    setShowOnboarding(false);
  };

  const getNextSimulation = (simulations) => {
    // Priority: In-progress simulations first, then unexplored
    const inProgress = simulations.find(s => s.completed_tasks > 0 && s.completed_tasks < s.total_tasks);
    if (inProgress) return inProgress;
    
    const unexplored = simulations.find(s => s.completed_tasks === 0);
    return unexplored || null;
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          <div className="animate-pulse mb-8">
            <div className="h-8 w-48 sm:w-64 bg-[var(--color-surface-2)] rounded-lg mb-2 mr-auto" />
            <div className="h-4 w-64 sm:w-96 bg-[var(--color-surface-2)] rounded-lg mr-auto" />
          </div>
          
          <SkeletonCard className="mb-6" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Profile not found state
  if (profile === 'not_found') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <Card className="text-center max-w-md w-full">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4">
              <FaClock className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] mb-2">
              جاري إعداد ملفك الشخصي
            </h2>
            <p className="text-[var(--color-text-secondary)] text-sm sm:text-base mb-6">
              قد يستغرق الأمر لحظات قليلة. يرجى تحديث الصفحة بعد قليل.
            </p>
            <Button onClick={() => globalThis.location.reload()} variant="primary">
              تحديث الصفحة
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Not logged in state
  if (!user || !profile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <Card className="text-center max-w-md w-full">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4">
              <FaLock className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] mb-2">
              تسجيل الدخول مطلوب
            </h2>
            <p className="text-[var(--color-text-secondary)] text-sm sm:text-base mb-6">
              يجب عليك تسجيل الدخول لعرض لوحة التحكم الخاصة بك.
            </p>
            <Button as={Link} to="/login" variant="primary">
              تسجيل الدخول
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const { simulations } = dashboardData;
  const hasAnyProgress = simulations.some(s => s.completed_tasks > 0);
  const nextSimulation = getNextSimulation(simulations);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {showOnboarding && user && (
          <OnboardingSurvey user={user} profile={profile} onComplete={handleOnboardingComplete} />
        )}
        
        {hasAnyProgress ? (
          <ReturningUserView 
            simulations={simulations} 
            name={profile.first_name}
            nextSimulation={nextSimulation}
          />
        ) : (
          <FirstTimeUserView 
            simulations={simulations} 
            name={profile.first_name}
          />
        )}
      </div>
    </DashboardLayout>
  );
}