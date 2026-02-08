import { create } from 'zustand';
import { User, Couple, UserPreferences } from '@/types';

interface UserStore {
    user: User | null;
    partner: User | null;
    couple: Couple | null;
    preferences: UserPreferences | null;
    setUser: (user: User | null) => void;
    setPartner: (partner: User | null) => void;
    setCouple: (couple: Couple | null) => void;
    setPreferences: (preferences: UserPreferences | null) => void;
    clearAll: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    partner: null,
    couple: null,
    preferences: null,
    setUser: (user) => set({ user }),
    setPartner: (partner) => set({ partner }),
    setCouple: (couple) => set({ couple }),
    setPreferences: (preferences) => set({ preferences }),
    clearAll: () => set({ user: null, partner: null, couple: null, preferences: null }),
}));
