import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import DashboardLayout from '../components/DashboardLayout';
import { FaUser, FaEnvelope, FaShieldAlt, FaLightbulb, FaEdit } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from '../components/modals/EditProfileModal';

const SkillCard = ({ skill }) => (
    <div className="bg-gray-800/50 p-5 rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-gray-800 transition-all duration-200">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-900/50 rounded-full">
                <FaLightbulb className="text-blue-300 text-xl" />
            </div>
            <div>
                <h3 className="font-bold text-white text-lg">{skill.name}</h3>
                <p className="text-gray-400 text-sm">{skill.description}</p>
            </div>
        </div>
    </div>
);

const SkillsDisplay = ({ userId }) => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSkills = async () => {
            if (!userId) return;
            setLoading(true);
            const { data, error } = await supabase.rpc('get_user_skills', {
                p_user_id: userId
            });

            if (error) {
                console.error("Error fetching user skills:", error);
                setError("لا يمكن تحميل المهارات المكتسبة.");
            } else {
                setSkills(data);
            }
            setLoading(false);
        };
        fetchSkills();
    }, [userId]);

    if (loading) return <div className="text-center text-gray-400">جاري تحميل المهارات...</div>;
    if (error) return <div className="text-center text-red-400">{error}</div>;
    if (skills.length === 0) {
        return (
            <div className="text-center py-10 px-6 bg-gray-800/40 rounded-lg">
                <FaShieldAlt className="mx-auto text-4xl text-gray-500 mb-4" />
                <h3 className="font-bold text-xl text-white">لم تكتسب أي مهارات بعد</h3>
                <p className="text-gray-400 mt-2">أكمل مهام المحاكاة لبدء بناء مجموعة مهاراتك.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map(skill => (
                <SkillCard key={skill.id} skill={skill} />
            ))}
        </div>
    );
};

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('full_name, first_name, last_name')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;
                
                setProfile(data);
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
    
    if (authLoading || loading) return <DashboardLayout><div className="text-center text-gray-400">جاري تحميل الملف الشخصي...</div></DashboardLayout>;
    if (!user) return <DashboardLayout><div className="text-center text-gray-400">لا يوجد ملف شخصي للعرض.</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="p-4 sm:p-8">
                <div className="max-w-4xl mx-auto text-right">
                    <header className="bg-gray-800/50 rounded-2xl p-8 mb-8">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-blue-600 rounded-full">
                                <FaUser className="text-white text-4xl" />
                            </div>
                            <div className="flex-grow">
                                <h1 className="text-3xl font-bold text-white">{profile?.full_name || 'مستخدم جديد'}</h1>
                                <p className="flex items-center gap-2 text-gray-400 mt-1">
                                    <FaEnvelope />
                                    <span>{user.email}</span>
                                </p>
                            </div>
                            <div>
                                <button onClick={() => setIsModalOpen(true)} className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors">
                                    <FaEdit />
                                </button>
                            </div>
                        </div>
                    </header>

                    <div className="bg-gray-800/30 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">المهارات المكتسبة</h2>
                        <SkillsDisplay userId={user.id} />
                    </div>
                </div>
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