import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';
import { allAchievements } from '../data/achievements.jsx';
import { FaTrophy } from 'react-icons/fa';

const AchievementBadge = ({ achievement, isUnlocked }) => (
    <div className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${isUnlocked ? 'bg-green-900/50 border-green-700' : 'bg-gray-800/50 border-gray-700'}`}>
        <div className={`text-4xl ${isUnlocked ? 'text-yellow-400' : 'text-gray-600'}`}>{achievement.icon}</div>
        <div className="text-right">
            <h4 className={`font-bold ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>{achievement.title}</h4>
            <p className="text-sm text-gray-400">{achievement.description}</p>
        </div>
    </div>
);

export default function AchievementsDisplay({ userId }) {
    const [unlockedIds, setUnlockedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAchievements = async () => {
            if (!userId) return;
            setLoading(true);
            try {
                const { data, error } = await supabase.rpc('get_user_achievements', { p_user_id: userId });
                if (error) throw error;
                setUnlockedIds(data.map(a => a.achievement_id) || []);
            } catch (err) {
                console.error("Error fetching achievements:", err);
                setError("لا يمكن تحميل الإنجازات.");
            }
            setLoading(false);
        };
        fetchAchievements();
    }, [userId]);
    
    if (loading) return <div className="text-center text-gray-400">جاري تحميل الإنجازات...</div>;
    if (error) return <div className="text-center text-red-400">{error}</div>;

    const sortedAchievements = [...allAchievements].sort((a, b) => {
        const aUnlocked = unlockedIds.includes(a.id);
        const bUnlocked = unlockedIds.includes(b.id);
        return bUnlocked - aUnlocked; // Sort unlocked achievements to the top
    });

    return (
        <div className="space-y-4">
            {sortedAchievements.length > 0 ? (
                sortedAchievements.map(ach => (
                    <AchievementBadge key={ach.id} achievement={ach} isUnlocked={unlockedIds.includes(ach.id)} />
                ))
            ) : (
                <div className="text-center py-10 px-6 bg-gray-800/40 rounded-lg">
                    <FaTrophy className="mx-auto text-4xl text-gray-500 mb-4" />
                    <h3 className="font-bold text-xl text-white">لا توجد إنجازات لعرضها</h3>
                    <p className="text-gray-400 mt-2">أكمل المهام والتحديات لفتح الإنجازات.</p>
                </div>
            )}
        </div>
    );
} 