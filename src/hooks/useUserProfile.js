import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient.js';
import { useAuth } from '../context/AuthContext.jsx';

export function useUserProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            setProfile(data);
        } catch (error) {
            console.error("Error fetching profile:", error);
            setError("لا يمكن تحميل الملف الشخصي.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Update function will be added later

    return { profile, loading, error, refreshProfile: fetchProfile };
} 