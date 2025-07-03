import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import CareerRoadmap from '../components/CareerRoadmap';
import { FaLaptopCode, FaBullhorn, FaUsers, FaChartLine, FaArrowLeft, FaStar, FaTrophy, FaGraduationCap } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { supabase } from '../supabaseClient';
import OnboardingSurvey from '../components/OnboardingSurvey';
import { allAchievements } from '../data/achievements.jsx';

const iconMap = {
    'FaLaptopCode': <FaLaptopCode className="text-blue-400" />,
    'FaBullhorn': <FaBullhorn className="text-yellow-400" />,
    'FaUsers': <FaUsers className="text-teal-400" />,
    'FaChartLine': <FaChartLine className="text-green-400" />,
};

const mapIcon = (iconName) => iconMap[iconName] || <FaLaptopCode className="text-gray-400" />;

const ProgressCard = ({ sim }) => {
    const percentage = sim.total_tasks > 0 ? Math.round((sim.completed_tasks / sim.total_tasks) * 100) : 0;
    return (
        <Link to={sim.path} className="block bg-gray-800 p-4 rounded-2xl hover:bg-gray-700/80 transition-all duration-300">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 flex-shrink-0">
                    <CircularProgressbar
                        value={percentage}
                        text={`${percentage}%`}
                        styles={buildStyles({
                            textColor: 'white',
                            pathColor: percentage === 100 ? '#34D399' : '#3B82F6',
                            trailColor: '#4B5563',
                        })}
                    />
                </div>
                <div className="text-right flex-grow">
                    <div className="flex items-center justify-end gap-3">
                        <h3 className="font-bold text-lg text-white">{sim.title}</h3>
                        <div className="text-2xl">{mapIcon(sim.icon_name)}</div>
                    </div>
                    <p className="text-gray-400 text-sm">أكملت {sim.completed_tasks} من {sim.total_tasks} مهمات</p>
                </div>
            </div>
        </Link>
    );
};

const OverallProgress = ({ value }) => (
    <div className="text-center bg-gray-800 rounded-2xl p-6">
      <div className="w-40 h-40 mx-auto">
        <CircularProgressbar
          value={value} text={`${value}%`} strokeWidth={5}
          styles={buildStyles({ textColor: 'white', pathColor: '#3B82F6', trailColor: '#4B5563', textSize: '20px' })}
        />
      </div>
      <p className="mt-4 text-gray-400">لقد أكملت {value}% من جميع المهام المتاحة.</p>
    </div>
);

const SkillBadge = ({ skill }) => (
    <div className="bg-blue-900/50 text-blue-300 text-sm font-medium px-4 py-1 rounded-full border border-blue-800">
        {skill}
    </div>
);

const SkillsCard = ({ skills }) => (
     <div className="bg-gray-800 rounded-2xl p-6">
        <div className="flex flex-wrap gap-3 justify-end">
            {skills.length > 0 ? skills.map(skill => <SkillBadge key={skill} skill={skill} />) : <p className="text-gray-400">لم تكتسب أي مهارات بعد. ابدأ محاكاة!</p>}
        </div>
    </div>
);

const AchievementBadge = ({ achievement, isUnlocked }) => (
    <div className={`flex items-center gap-4 p-4 rounded-xl ${isUnlocked ? 'bg-green-900/50' : 'bg-gray-800/50'}`}>
        <div className={`text-3xl ${isUnlocked ? 'text-yellow-400' : 'text-gray-600'}`}>{achievement.icon}</div>
        <div className="text-right">
            <h4 className={`font-bold ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>{achievement.title}</h4>
            <p className="text-sm text-gray-400">{achievement.description}</p>
        </div>
    </div>
);

const AchievementsCard = ({ achievements, unlockedCodes }) => (
    <div className="bg-gray-800 rounded-2xl p-6 space-y-4">
        {achievements.map(ach => <AchievementBadge key={ach.id} achievement={ach} isUnlocked={unlockedCodes.includes(ach.code)} />)}
    </div>
);

const ContinueLearningCard = ({ task }) => {
    if (!task) return null;
    return (
        <Link to={task.path} data-tour-id="continue-learning" className="block bg-blue-900/50 rounded-2xl p-6 hover:bg-blue-800/60 transition-all duration-300 border border-blue-500 shadow-lg">
            <div className="flex items-center gap-6">
                <div className="text-5xl text-blue-300">{mapIcon(task.icon_name)}</div>
                <div className="text-right">
                    <h3 className="font-bold text-xl text-white">{task.title}</h3>
                    <p className="text-gray-300 mt-2">واصل من حيث توقفت في محاكاة {task.title}.</p>
                </div>
                <FaArrowLeft className="text-white text-2xl mr-auto"/>
            </div>
        </Link>
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

      // Retry logic for fetching the user profile
      let userProfile = null;
      let profileError = null;
      for (let i = 0; i < 5; i++) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (data) {
          userProfile = data;
          profileError = null;
          break;
        }
        
        profileError = error;
        await new Promise(res => setTimeout(res, 1000)); // Wait 1 second before retrying
      }

      if (profileError) {
        console.error("Error fetching profile after retries:", profileError);
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
                completed_tasks: progress ? parseInt(progress.completed_tasks, 10) : 0,
                total_tasks: progress ? parseInt(progress.total_tasks, 10) : 0,
                // Construct the path for navigation
                path: `/simulations/briefing/${sim.id}`
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
    // Optionally re-fetch data if onboarding affects dashboard
  };

  const calculateOverallCompletion = (simulations) => {
      if (!simulations || simulations.length === 0) return 0;
      const totalTasks = simulations.reduce((acc, sim) => acc + (sim.total_tasks || 0), 0);
      const completedTasks = simulations.reduce((acc, sim) => acc + (sim.completed_tasks || 0), 0);
      return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const getNextTask = (simulations) => {
      if (!simulations) return null;
      const inProgressSim = simulations.find(s => s.completed_tasks > 0 && s.completed_tasks < s.total_tasks);
      const nextUpSim = inProgressSim || simulations.find(s => s.completed_tasks === 0);
      
      if (nextUpSim) {
          // The generic simulation page will handle finding the exact next task
          return { ...nextUpSim, path: `/simulations/task/${nextUpSim.id}` };
      }
      return null;
  };

  if (loading) {
    return (
        <DashboardLayout>
            <div className="flex justify-center items-center h-full">
                <p className="text-white text-xl">جاري تحميل لوحة التحكم...</p>
            </div>
        </DashboardLayout>
    );
  }

  if (profile === 'not_found') {
    return (
        <DashboardLayout>
            <div className="text-center p-8">
                <p className="text-white text-2xl mb-4">جاري إعداد ملفك الشخصي...</p>
                <p className="text-gray-400 mb-6">قد يستغرق الأمر لحظات قليلة. يرجى تحديث الصفحة بعد قليل.</p>
                <button onClick={() => window.location.reload()} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700">
                    تحديث الصفحة
                </button>
            </div>
        </DashboardLayout>
    );
  }

  if (!user || !profile) {
     return (
        <DashboardLayout>
            <div className="text-center p-8">
                <p className="text-white text-2xl mb-4">يجب عليك تسجيل الدخول لعرض هذه الصفحة.</p>
                <Link to="/login" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700">
                    الذهاب إلى صفحة الدخول
                </Link>
            </div>
        </DashboardLayout>
    );
  }

  const { simulations, unlockedSkills, unlockedAchievements } = dashboardData || { simulations: [], unlockedSkills: [], unlockedAchievements: [] };
  const overallCompletion = calculateOverallCompletion(simulations);
  const nextTask = getNextTask(simulations);
  const completedSimulations = simulations ? simulations.filter(s => s.completed_tasks === s.total_tasks && s.total_tasks > 0) : [];

  return (
    <DashboardLayout>
        <div className="p-4 sm:p-8">
            {showOnboarding && user && <OnboardingSurvey user={user} profile={profile} onComplete={handleOnboardingComplete} />}
            <div className="text-right mb-10">
                <h1 className="text-4xl font-bold">أهلاً بك مجدداً، {profile.first_name || 'يا صديقنا'}!</h1>
                <p className="mt-2 text-gray-400">واصل من حيث توقفت واستمر في بناء مهاراتك.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                {nextTask && (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4 text-right">التالي لك</h2>
                        <ContinueLearningCard task={nextTask} />
                    </div>
                )}
                
                <CareerRoadmap completedSimulations={completedSimulations} />
                
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4 text-right">تقدمي</h2>
                    <div className="space-y-4">
                    {simulations.map(sim => <ProgressCard key={sim.id} sim={sim} />)}
                    </div>
                </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4 text-right">نظرة عامة</h2>
                        <OverallProgress value={overallCompletion} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4 text-right">المهارات المكتسبة</h2>
                        <SkillsCard skills={unlockedSkills} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4 text-right">الإنجازات</h2>
                        <AchievementsCard achievements={allAchievements} unlockedCodes={unlockedAchievements} />
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
  );
} 
