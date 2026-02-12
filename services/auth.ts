import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { supabase } from '@/config/supabase';

const USER_KEY = '@sort_out_user';

export async function signInWithEmail(email: string, password: string): Promise<{ user: User | null; partner: User | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user returned');

    // Sync with local user type and profile table
    const result = await syncUser();
    if (!result || !result.user) throw new Error('Failed to synchronize user data');

    return result;
}

export async function signUpWithEmail(
    email: string,
    password: string,
    additionalData?: Partial<User>
): Promise<{ user: User | null; partner: User | null }> {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                display_name: additionalData?.displayName || email.split('@')[0],
                ...additionalData,
            },
        },
    });

    if (error) throw error;
    if (!data.user) throw new Error('Signup failed');

    // Create profile row
    const { error: profileError } = await supabase.from('profiles').insert({
        user_id: data.user.id,
        username: additionalData?.displayName || email.split('@')[0],
    });

    if (profileError && !profileError.message.includes('unique')) {
        console.error('Error creating profile:', profileError);
    }

    const result = await syncUser();
    if (!result || !result.user) throw new Error('Signup succeeded but failed area synchronization');
    return result;
}

export async function verifyOTP(email: string, token: string): Promise<{ user: User | null; partner: User | null }> {
    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup',
    });

    if (error) throw error;
    if (!data.user) throw new Error('Verification failed');

    // Sync profile and local storage
    const result = await syncUser();
    if (!result || !result.user) throw new Error('Failed to synchronize user data after verification');

    return result;
}

export async function completeOnboarding(
    userId: string,
    onboardingData: Partial<User>
): Promise<{ user: User | null; partner: User | null }> {
    // 1. Update Auth metadata
    const { data: authData, error: authError } = await supabase.auth.updateUser({
        data: {
            ...onboardingData,
            hasCompletedOnboarding: true,
        }
    });

    if (authError) throw authError;

    // 2. Update Profiles table
    const { error: profileError } = await supabase.from('profiles').update({
        has_completed_onboarding: true,
        full_name: onboardingData.fullName,
        dob: onboardingData.dob,
        relationship_status: onboardingData.relationshipStatus,
        primary_goal: onboardingData.primaryGoal,
        check_in_frequency: onboardingData.checkInFrequency,
        love_language: onboardingData.loveLanguage,
        relationship_duration: onboardingData.relationshipDuration,
    }).eq('user_id', userId);

    if (profileError) throw profileError;

    const result = await syncUser();
    if (!result || !result.user) throw new Error('Onboarding succeeded but failed synchronization');
    return result;
}

export async function saveAssessment(
    userId: string,
    assessment: Record<string, number>
): Promise<void> {
    const { error } = await supabase.from('profiles').update({
        user_assessment: assessment,
    }).eq('user_id', userId);

    if (error) throw error;
}

export async function syncUser(): Promise<{ user: User | null; partner: User | null } | null> {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return null;

    // Fetch profile data
    let { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

    // If profile is missing (e.g. user created manually in Supabase), create it
    if (!profileData) {
        const { data: newProfile, error: profileError } = await supabase
            .from('profiles')
            .insert({
                user_id: authUser.id,
                username: authUser.user_metadata?.display_name || authUser.email?.split('@')[0] || 'User',
            })
            .select()
            .single();

        if (!profileError) {
            profileData = newProfile;
        } else {
            return { user: mapSupabaseToLocalUser(authUser), partner: null };
        }
    }

    // Fetch partner data if exists
    let partnerData = null;
    if (profileData?.partner_id) {
        const { data: partnerProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', profileData.partner_id)
            .single();

        if (partnerProfile) {
            partnerData = {
                id: partnerProfile.user_id,
                email: '', // Email might not be accessible depending on privacy
                displayName: partnerProfile.username || 'Partner',
                fullName: partnerProfile.full_name,
                avatarUrl: partnerProfile.avatar_url,
                dob: partnerProfile.dob,
                hasCompletedOnboarding: partnerProfile.has_completed_onboarding,
                createdAt: new Date(partnerProfile.created_at),
                updatedAt: new Date(partnerProfile.updated_at || partnerProfile.created_at),
                userAssessment: partnerProfile.user_assessment,
            };
        }
    }

    const user = {
        ...mapSupabaseToLocalUser(authUser),
        fullName: profileData?.full_name,
        avatarUrl: profileData?.avatar_url,
        dob: profileData?.dob,
        relationshipStatus: profileData?.relationship_status,
        partnerId: profileData?.partner_id,
        primaryGoal: profileData?.primary_goal,
        checkInFrequency: profileData?.check_in_frequency,
        loveLanguage: profileData?.love_language,
        relationshipDuration: profileData?.relationship_duration,
        hasCompletedOnboarding: profileData?.has_completed_onboarding || authUser.user_metadata?.hasCompletedOnboarding || false,
        userAssessment: profileData?.user_assessment || null,
    };

    const partner = partnerData;

    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    return { user, partner };
}

export async function signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    await AsyncStorage.removeItem(USER_KEY);
}

export async function getCurrentUser(): Promise<{ user: User | null; partner: User | null }> {
    const result = await syncUser();
    if (!result) return { user: null, partner: null };
    return result;
}

// Helper to map Supabase User to our local User interface
function mapSupabaseToLocalUser(supabaseUser: any): User {
    return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        displayName: supabaseUser.user_metadata?.display_name || supabaseUser.email?.split('@')[0] || 'User',
        fullName: supabaseUser.user_metadata?.full_name,
        avatarUrl: supabaseUser.user_metadata?.avatar_url,
        dob: supabaseUser.user_metadata?.dob,
        hasCompletedOnboarding: supabaseUser.user_metadata?.hasCompletedOnboarding || false,
        createdAt: new Date(supabaseUser.created_at),
        updatedAt: new Date(supabaseUser.updated_at || supabaseUser.created_at),
    };
}

/**
 * Diagnostic tool to check if Supabase is connected.
 * Returns true if connection is successful.
 */
export async function checkSupabaseConnection(): Promise<{ success: boolean; message: string }> {
    try {
        const { data, error } = await supabase.from('_dummy_check').select('*').limit(0);
        // We don't care if the table doesn't exist (it won't), 
        // we just want to see if we get a response from the API.
        // If it's a 401/403 or network error, it's a connection issue.
        if (error && error.message.includes('fetch')) {
            return { success: false, message: 'Network error: Cannot reach Supabase' };
        }
        return { success: true, message: 'Connected to Supabase' };
    } catch (err: any) {
        return { success: false, message: err.message };
    }
}
