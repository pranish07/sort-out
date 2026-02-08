// Offline-only auth service - uses AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

const USER_KEY = '@sortout_user';

export async function signInWithEmail(email: string, password: string): Promise<User> {
    // For offline mode, just create/retrieve a local user
    const user: User = {
        id: 'local-user-' + Date.now(),
        email,
        displayName: email.split('@')[0],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
}

export async function signUpWithEmail(
    email: string,
    password: string,
    additionalData?: {
        displayName?: string;
        age?: number;
        gender?: string;
        relationshipStatus?: string;
    }
): Promise<User> {
    const user: User = {
        id: 'local-user-' + Date.now(),
        email,
        displayName: additionalData?.displayName || email.split('@')[0],
        age: additionalData?.age,
        gender: additionalData?.gender as any,
        relationshipStatus: additionalData?.relationshipStatus as any,
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
