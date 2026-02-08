// Offline-only auth service - uses AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

const USER_KEY = '@sort_out_user';

export async function signInWithEmail(email: string, password: string): Promise<User> {
    // For offline mode, just create/retrieve a local user
    // In a real app, you'd fetch this from a database
    const userJson = await AsyncStorage.getItem(USER_KEY);
    if (userJson) {
        return JSON.parse(userJson);
    }

    const user: User = {
        id: 'local-user-' + Date.now(),
        email,
        displayName: email.split('@')[0],
        hasCompletedOnboarding: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
}

export async function signUpWithEmail(
    email: string,
    password: string,
    additionalData?: Partial<User>
): Promise<User> {
    const user: User = {
        id: 'local-user-' + Date.now(),
        email,
        displayName: additionalData?.displayName || email.split('@')[0],
        hasCompletedOnboarding: additionalData?.hasCompletedOnboarding || false,
        ...additionalData,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
}

export async function signOut(): Promise<void> {
    await AsyncStorage.removeItem(USER_KEY);
}

export async function getCurrentUser(): Promise<User | null> {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    if (userJson) {
        return JSON.parse(userJson);
    }
    return null;
}
