import { create } from 'zustand';
import { User, Couple, UserPreferences } from '@/types';

interface UserStore {
    user: User | null;
    partner: User | null;
    couple: Couple | null;
    preferences: UserPreferences | null;
    userAssessment: Record<string, number> | null;
    partnerAssessment: Record<string, number> | null;
    setUser: (user: User | null) => void;
    setPartner: (partner: User | null) => void;
    setCouple: (couple: Couple | null) => void;
    setPreferences: (preferences: UserPreferences | null) => void;
    setUserAssessment: (assessment: Record<string, number> | null) => void;
    setPartnerAssessment: (assessment: Record<string, number> | null) => void;
    setAuthResult: (result: { user: User | null; partner: User | null } | null) => void;
    clearAll: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    partner: null,
    couple: null,
    preferences: null,
    userAssessment: null,
    partnerAssessment: null,
    setUser: (user) => set({ user }),
    setPartner: (partner) => set({ partner }),
    setCouple: (couple) => set({ couple }),
    setPreferences: (preferences) => set({ preferences }),
    setUserAssessment: (userAssessment) => set((state) => ({
        userAssessment,
        user: state.user ? { ...state.user, userAssessment } : null
    })),
    setPartnerAssessment: (partnerAssessment) => set({ partnerAssessment }),
    setAuthResult: (result) => {
        if (!result) {
            set({ user: null, partner: null });
            return;
        }
        set({ user: result.user, partner: result.partner });
    },
    clearAll: () => set({ user: null, partner: null, couple: null, preferences: null, userAssessment: null, partnerAssessment: null }),
}));
