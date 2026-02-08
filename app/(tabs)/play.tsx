import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '@/store/userStore';

const { width } = Dimensions.get('window');

const QUESTION_DATA: Record<string, string[]> = {
    'Couple Questions': [
        "What's the first thing you noticed about me?",
        "What's your favorite memory of us together?",
        "If we could travel anywhere tomorrow, where would we go?",
        "What's one thing I do that always makes you smile?",
        "What does a perfect day look like for us?",
        "What's a goal you'd like us to achieve together this year?"
    ],
    'What Guys Really Want': [
        "How can I show you more appreciation for the things you do?",
        "What's something you wish I understood better about your work or hobbies?",
        "When do you feel most respected and supported by me?",
        "What's your favorite way to decompress after a long day?",
        "How can I better support your personal goals right now?"
    ],
    'What Girls Really Want': [
        "What's a small gesture that makes you feel deeply loved?",
        "How can I be a better listener when you're sharing your feelings?",
        "What's something we used to do that you miss?",
        "When do you feel most emotionally connected to me?",
        "What can I do to help lighten your mental load this week?"
    ],
    'Drift Prevention': [
        "On a scale of 1-10, how connected have you felt to me lately?",
        "Is there any unresolved tension we should talk about?",
        "What's one thing we can start doing weekly to stay close?",
        "When did you last feel like we were a 'team'?",
        "What's something you've been wanting to share but haven't found the right time for?"
    ],
    'Communication Styles': [
        "How do you prefer to handle disagreements (space vs. talking immediately)?",
        "What's one thing I say that makes you feel defensive?",
        "How can I communicate my needs without making you feel pressured?",
        "What's your 'love language' for receiving feedback?",
        "How do you know when I'm really listening to you?"
    ]
};

export default function PlayScreen() {
    const user = useUserStore((state) => state.user);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    const categories = [
        { title: 'Couple Questions', emoji: '🥰', locked: false },
        { title: 'What Guys Really Want', emoji: '🤴', locked: false },
        { title: 'What Girls Really Want', emoji: '👸', locked: false },
        { title: 'Drift Prevention', emoji: '🛡️', locked: false },
        { title: 'Communication Styles', emoji: '💬', locked: false },
        { title: 'For Soulmates', emoji: '💌', locked: true },
        { title: 'Couple Therapy', emoji: '💖', locked: true },
        { title: 'Naughty Questions', emoji: '🔞', locked: true }
    ];

    const openDeck = (title: string) => {
        if (QUESTION_DATA[title]) {
            setActiveCategory(title);
            setCurrentCardIndex(0);
        }
    };

    const nextCard = () => {
        const questions = QUESTION_DATA[activeCategory!];
        if (currentCardIndex < questions.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
        } else {
            setCurrentCardIndex(0); // Loop back
        }
    };

    if (activeCategory) {
        const questions = QUESTION_DATA[activeCategory];
        return (
            <SafeAreaView className="flex-1 bg-surface">
                {/* Deck View */}
                <View className="flex-1 px-6 py-8">
                    <View className="flex-row items-center justify-between mb-8">
                        <TouchableOpacity onPress={() => setActiveCategory(null)} className="flex-row items-center">
                            <Ionicons name="arrow-back" size={24} color="#0F172A" />
                            <Text className="ml-2 font-bold text-navy">Back</Text>
                        </TouchableOpacity>
                        <Text className="text-navy-400 font-bold">{currentCardIndex + 1} / {questions.length}</Text>
                    </View>

                    <View className="flex-1 justify-center items-center">
                        <View 
                            className="bg-teal rounded-[40px] p-10 shadow-2xl items-center justify-center border-4 border-white"
                            style={{ width: width - 48, height: width * 1.2 }}
                        >
                            <View className="absolute top-10 left-10 opacity-20">
                                <Ionicons name="sparkles" size={60} color="white" />
                            </View>
                            
                            <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-10">
                                <Ionicons name="help-circle" size={32} color="white" />
                            </View>

                            <Text className="text-white text-3xl font-bold text-center leading-tight">
                                {questions[currentCardIndex]}
                            </Text>

                            <View className="absolute bottom-10 right-10 opacity-20 transform rotate-12">
                                <Ionicons name="heart" size={60} color="white" />
                            </View>
                        </View>
                    </View>

                    <View className="mt-12">
                        <TouchableOpacity 
                            onPress={nextCard}
                            activeOpacity={0.9}
                            className="bg-teal py-5 rounded-3xl items-center shadow-lg active:bg-teal-600"
                        >
                            <Text className="text-white font-bold text-lg">Next Question</Text>
                        </TouchableOpacity>
                        <Text className="text-center text-navy-400 mt-4 font-medium uppercase tracking-widest text-[10px]">Tap to reveal next</Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-surface">
            {/* Main List */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="bg-teal pt-12 pb-16 px-6 rounded-b-[48px] shadow-lg">
                    <View className="flex-row justify-between items-center mb-4">
                        <View>
                            <Text className="text-white/80 text-lg font-medium">Hi, {user?.displayName || 'Anna'}👋</Text>
                            <Text className="text-white text-3xl font-bold">Deep Connections</Text>
                        </View>
                        <View className="flex-row gap-3">
                            <TouchableOpacity className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                                <Ionicons name="information" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Categories Grid */}
                <View className="px-6 -mt-8">
                    <View className="flex-row flex-wrap justify-between">
                        {categories.map((card, index) => (
                            <TouchableOpacity 
                                key={index}
                                activeOpacity={0.8}
                    onPress={() => !card.locked && openDeck(card.title)}
                    className={`bg-white rounded-3xl p-6 mb-5 shadow-md border border-surface-200 items-center justify-center ${card.locked ? 'opacity-70' : ''}`}
                    style={{ width: (width - 60) / 2 }}
                            >
                                <View className="w-16 h-16 bg-teal-50 rounded-3xl items-center justify-center mb-4">
                                    <Text className="text-4xl">{card.emoji}</Text>
                                </View>
                                <Text className="text-sm font-bold text-navy text-center mb-1">{card.title}</Text>
                                {card.locked && (
                                    <View className="absolute top-4 right-4">
                                        <Ionicons name="lock-closed" size={16} color="#94A3B8" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View className="pb-12" />
            </ScrollView>
        </SafeAreaView>
    );
}
