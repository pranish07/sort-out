export interface User {
    id: string;
    email: string;
    displayName: string;
    fullName?: string;
    photoURL?: string;
    avatarUrl?: string; // Standardize on avatarUrl for Supabase
    age?: number;
    dob?: string; // ISO date string
    gender?: 'male' | 'female' | 'other';
    relationshipStatus?: 'single' | 'dating' | 'relationship' | 'engaged' | 'married';
    hasCompletedOnboarding: boolean;
    primaryGoal?: string;
    checkInFrequency?: string;
    loveLanguage?: string;
    relationshipDuration?: string;
    userAssessment?: Record<string, number> | null;
    partnerId?: string;
    partnerInviteCode?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Couple {
    id: string;
    user1Id: string;
    user2Id: string;
    inviteCode: string;
    loveScore: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface LoveScoreFactors {
    emotionalNeeds: number;
    physicalAffection: number;
    communication: number;
    adventure: number;
    trust: number;
    qualityTime: number;
}

export interface RequirementsMatcher {
    userId: string;
    emotionalNeeds: number;
    physicalAffection: number;
    communication: number;
    adventure: number;
    trust: number;
    qualityTime: number;
    updatedAt: Date;
}

export interface DriftAlert {
    id: string;
    coupleId: string;
    severity: 'low' | 'medium' | 'high';
    reasons: string[];
    detectedAt: Date;
    resolved: boolean;
}

export interface JournalEntry {
    id: string;
    coupleId: string;
    authorId: string;
    type: 'shared' | 'private';
    content: string;
    photoURLs?: string[];
    voiceNoteURL?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Reminder {
    id: string;
    coupleId: string;
    title: string;
    description?: string;
    date: Date;
    type: 'birthday' | 'anniversary' | 'date-night' | 'custom';
    notificationEnabled: boolean;
    createdAt: Date;
}

export interface SortOutIssue {
    id: string;
    coupleId: string;
    title: string;
    user1Submission?: {
        text: string;
        voiceNoteURL?: string;
        submittedAt: Date;
    };
    user2Submission?: {
        text: string;
        voiceNoteURL?: string;
        submittedAt: Date;
    };
    aiAnalysis?: {
        balancedView: string;
        user1Perspective: string;
        user2Perspective: string;
        suggestions: string[];
        analyzedAt: Date;
    };
    status: 'pending' | 'analyzing' | 'resolved' | 'in-progress';
    resolutionProgress: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Guide {
    id: string;
    title: string;
    description: string;
    category: 'male-needs' | 'female-needs' | 'communication' | 'drift-prevention' | 'intimacy' | 'conflict-resolution';
    type: 'article' | 'video' | 'quiz';
    content?: string;
    videoURL?: string;
    quizQuestions?: QuizQuestion[];
    authorId?: string; // For user-generated guides
    isOfficial: boolean;
    upvotes: number;
    downvotes: number;
    reportCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

export interface UserPreferences {
    userId: string;
    notificationsEnabled: boolean;
    driftAlertsEnabled: boolean;
    dailyTipsEnabled: boolean;
    theme: 'light' | 'dark' | 'auto';
    isPremium: boolean;
}

export interface DailyTip {
    id: string;
    content: string;
    category: string;
    date: Date;
}
