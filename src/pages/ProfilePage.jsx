import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import DashboardLayout from '../components/DashboardLayout';
import { FaEnvelope, FaLightbulb, FaEdit, FaGraduationCap, FaTrophy, FaCheckCircle, FaLaptopCode, FaBullhorn, FaUsers, FaChartLine, FaCompass, FaArrowLeft, FaRegSmile, FaRegMeh, FaRegFrown } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from '../components/modals/EditProfileModal';
import Card, { CardTitle } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import { SkeletonCard, SkeletonAvatar } from '../components/ui/Skeleton';
import Avatar from '../components/ui/Avatar';

// Icon mapping for careers
const careerIcons = {
  'FaLaptopCode': FaLaptopCode,
  'FaBullhorn': FaBullhorn,
  'FaUsers': FaUsers,
  'FaChartLine': FaChartLine,
};

const getIcon = (iconName) => careerIcons[iconName] || FaCompass;

// Career colors
const careerColors = {
  'FaLaptopCode': { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: 'text-blue-400' },
  'FaBullhorn': { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: 'text-amber-400' },
  'FaUsers': { bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: 'text-purple-400' },
  'FaChartLine': { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: 'text-emerald-400' },
};

const getColors = (iconName) => careerColors[iconName] || careerColors['FaLaptopCode'];

// Exploration Status Card
const ExplorationCard = ({ simulation, delay = 0 }) => {
  const Icon = getIcon(simulation.icon_name);
  const colors = getColors(simulation.icon_name);
  const percentage = simulation.total_tasks > 0 
    ? Math.round((simulation.completed_tasks / simulation.total_tasks) * 100) 
    : 0;
  const isCompleted = percentage === 100;
  const isExplored = simulation.completed_tasks > 0;
  
  // Determine status
  const getStatus = () => {
    if (isCompleted) return { label: 'مكتمل', variant: 'success' };
    if (isExplored) return { label: 'جاري الاستكشاف', variant: 'warning' };
    return { label: 'لم يبدأ', variant: 'neutral' };
  };
  
  const status = getStatus();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link to={`/simulations/briefing/${simulation.id}`} className="block group">
        <Card isHoverable className={`${colors.bg} ${colors.border}`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              <Icon className={`w-6 h-6 ${colors.icon}`} />
            </div>
            
            <div className="flex-1 text-right min-w-0">
              <div className="flex items-center justify-end gap-2 mb-1">
                <h3 className="font-bold text-[var(--color-text-primary)] truncate">{simulation.title}</h3>
                <Badge variant={status.variant} size="sm">{status.label}</Badge>
              </div>
              
              {isExplored ? (
                <div>
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mb-1">
                    <span>{simulation.completed_tasks}/{simulation.total_tasks} مهام</span>
                    <span>{percentage}%</span>
                  </div>
                  <ProgressBar value={percentage} size="sm" variant={isCompleted ? 'success' : 'primary'} />
                </div>
              ) : (
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {simulation.total_tasks} مهام متاحة للاستكشاف
                </p>
              )}
            </div>
            
            <FaArrowLeft className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:-translate-x-1 transition-all shrink-0 self-center" />
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

// Skill Badge
const SkillBadge = ({ skill, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
  >
    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30">
      <span className="text-sm text-[var(--color-text-primary)]">{skill}</span>
      <FaCheckCircle className="w-3 h-3 text-emerald-400" />
    </div>
  </motion.div>
);

// Stats Grid
const StatsGrid = ({ stats }) => (
  <div className="grid grid-cols-3 gap-3 sm:gap-4">
    <div className="text-center p-3 sm:p-4 rounded-xl bg-[var(--color-surface-2)]">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
        <FaCompass className="w-5 h-5 text-blue-400" />
      </div>
      <p className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">{stats.explored}</p>
      <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">مسار مستكشف</p>
    </div>
    <div className="text-center p-3 sm:p-4 rounded-xl bg-[var(--color-surface-2)]">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
        <FaCheckCircle className="w-5 h-5 text-emerald-400" />
      </div>
      <p className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">{stats.completed}</p>
      <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">محاكاة مكتملة</p>
    </div>
    <div className="text-center p-3 sm:p-4 rounded-xl bg-[var(--color-surface-2)]">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-2">
        <FaLightbulb className="w-5 h-5 text-purple-400" />
      </div>
      <p className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">{stats.skills}</p>
      <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">مهارة مكتسبة</p>
    </div>
  </div>
);

// Career Fit Indicator (placeholder for future feature)
const CareerFitSection = ({ simulations }) => {
  const interestedCareers = simulations.filter(s => s.completed_tasks > 0);
  
  if (interestedCareers.length === 0) return null;
  
  return (
    <Card>
      <CardTitle className="flex items-center justify-end gap-2 mb-4">
        <span>انطباعاتك عن المسارات</span>
        <FaRegSmile className="text-amber-400" />
      </CardTitle>
      
      <p className="text-sm text-[var(--color-text-secondary)] text-right mb-4">
        بناءً على استكشافك، ما رأيك في هذه المسارات؟
      </p>
      
      <div className="space-y-3">
        {interestedCareers.map((sim) => {
          const Icon = getIcon(sim.icon_name);
          const colors = getColors(sim.icon_name);
          
          return (
            <div key={sim.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface-2)]">
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-emerald-500/10 text-[var(--color-text-muted)] hover:text-emerald-400 transition-colors">
                  <FaRegSmile className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-amber-500/10 text-[var(--color-text-muted)] hover:text-amber-400 transition-colors">
                  <FaRegMeh className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-400 transition-colors">
                  <FaRegFrown className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 text-right">
                <span className="font-medium text-[var(--color-text-primary)]">{sim.title}</span>
              </div>
              
              <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${colors.icon}`} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [simulations, setSimulations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('full_name, first_name, last_name, education_level')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch dashboard data for simulations and skills
        const { data: dashboardData } = await supabase.rpc('get_user_dashboard_data');
        if (dashboardData) {
          // Process simulations
          const processedSimulations = (dashboardData.all_simulations || []).map(sim => {
            const progress = (dashboardData.simulation_progress || []).find(p => p.simulation_id === sim.id);
            return {
              ...sim,
              completed_tasks: progress ? Number.parseInt(progress.completed_tasks, 10) : 0,
              total_tasks: progress ? Number.parseInt(progress.total_tasks, 10) : 0,
            };
          });
          setSimulations(processedSimulations);
          setSkills(dashboardData.unlocked_skills || []);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchProfile();
    }
  }, [user, authLoading]);

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(currentProfile => ({
      ...currentProfile,
      ...updatedProfile
    }));
  };
  
  // Calculate stats
  const stats = {
    explored: simulations.filter(s => s.completed_tasks > 0).length,
    completed: simulations.filter(s => s.completed_tasks === s.total_tasks && s.total_tasks > 0).length,
    skills: skills.length,
  };
  
  // Loading state
  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
          <Card className="mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <SkeletonAvatar size="xl" />
              <div className="flex-1 space-y-3 text-center sm:text-right">
                <div className="h-8 w-48 bg-[var(--color-surface-2)] rounded-lg animate-pulse mx-auto sm:mr-0 sm:ml-auto" />
                <div className="h-4 w-32 bg-[var(--color-surface-2)] rounded animate-pulse mx-auto sm:mr-0 sm:ml-auto" />
              </div>
            </div>
          </Card>
          <SkeletonCard />
        </div>
      </DashboardLayout>
    );
  }
  
  // Not authenticated
  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <Card className="text-center max-w-md w-full">
            <p className="text-[var(--color-text-secondary)]">لا يوجد ملف شخصي للعرض.</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="relative overflow-hidden mb-6">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-[var(--color-primary)]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            
            <div className="relative">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar
                    name={profile?.full_name}
                    size="xl"
                    className="ring-4 ring-[var(--color-primary)]/20"
                  />
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-[var(--color-surface-1)]">
                    <FaCheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                </div>
                
                {/* Info */}
                <div className="flex-1 text-center sm:text-right min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-1 truncate">
                    {profile?.full_name || 'مستخدم جديد'}
                  </h1>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 text-[var(--color-text-secondary)] text-sm">
                    <span className="flex items-center gap-1">
                      <FaEnvelope className="w-3 h-3" />
                      <span className="truncate">{user.email}</span>
                    </span>
                  </div>
                  
                  {profile?.education_level && (
                    <Badge variant="primary" className="mt-2">
                      <FaGraduationCap className="w-3 h-3" />
                      {profile.education_level === 'high_school' ? 'طالب ثانوي' :
                       profile.education_level === 'middle_school' ? 'طالب متوسط' :
                       profile.education_level === 'undergraduate' ? 'طالب جامعي' :
                       profile.education_level === 'postgraduate' ? 'دراسات عليا' :
                       profile.education_level === 'graduate' ? 'خريج' : profile.education_level}
                    </Badge>
                  )}
                </div>
                
                {/* Edit Button */}
                <Button
                  variant="secondary"
                  onClick={() => setIsModalOpen(true)}
                  icon={<FaEdit className="w-4 h-4" />}
                  size="sm"
                  className="absolute top-0 left-0 sm:relative"
                >
                  <span className="hidden sm:inline">تعديل</span>
                </Button>
              </div>
              
              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-[var(--color-border-default)]">
                <StatsGrid stats={stats} />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Exploration Journey */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <CardTitle className="flex items-center justify-end gap-2 mb-4">
              <span>رحلة الاستكشاف</span>
              <FaCompass className="text-[var(--color-primary)]" />
            </CardTitle>
            
            <div className="space-y-3">
              {simulations.map((sim, index) => (
                <ExplorationCard key={sim.id} simulation={sim} delay={index * 0.05} />
              ))}
            </div>
            
            {simulations.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center mx-auto mb-4">
                  <FaCompass className="w-8 h-8 text-[var(--color-text-muted)]" />
                </div>
                <p className="text-[var(--color-text-secondary)] mb-4">لم تبدأ رحلة الاستكشاف بعد</p>
                <Link to="/simulations">
                  <Button variant="primary" icon={<FaArrowLeft />} iconPosition="end">
                    ابدأ الاستكشاف
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Skills Section */}
        {skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Card>
              <CardTitle className="flex items-center justify-end gap-2 mb-4">
                <span>المهارات المكتسبة</span>
                <FaLightbulb className="text-[var(--color-primary)]" />
              </CardTitle>
              
              <div className="flex flex-wrap gap-2 justify-end">
                {skills.map((skill, index) => (
                  <SkillBadge key={skill} skill={skill} delay={index * 0.03} />
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Career Fit Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CareerFitSection simulations={simulations} />
        </motion.div>
      </div>
      
      <EditProfileModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onProfileUpdate={handleProfileUpdate}
      />
    </DashboardLayout>
  );
}