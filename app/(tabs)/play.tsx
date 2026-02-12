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
        "What's a goal you'd like us to achieve together this year?",
        "What's the best piece of advice anyone has ever given you about relationships?",
        "If you could change one thing about our home, what would it be?",
        "What's your favorite way to spend a rainy afternoon together?",
        "What's the most romantic thing I've ever done for you?"
    ],
    'What Guys Really Want': [
        "How can I show you more appreciation for the things you do?",
        "What's something you wish I understood better about your work or hobbies?",
        "When do you feel most respected and supported by me?",
        "What's your favorite way to decompress after a long day?",
        "How can I better support your personal goals right now?",
        "What's a physical trait of mine that you find most attractive?",
        "How do you feel when I take the lead in planning something for us?",
        "What's your favorite meal that I make for you?",
        "When did you first realize you were in love with me?",
        "What's one 'guy thing' you wish I enjoyed doing with you more?"
    ],
    'What Girls Really Want': [
        "What's a small gesture that makes you feel deeply loved?",
        "How can I be a better listener when you're sharing your feelings?",
        "What's something we used to do that you miss?",
        "When do you feel most emotionally connected to me?",
        "What can I do to help lighten your mental load this week?",
        "How often do you like to receive flowers or small surprises?",
        "What's your favorite way for us to spend quality time without screens?",
        "What's one thing I do that makes you feel incredibly safe?",
        "If you could have a whole day of me just pampering you, what would we do?",
        "What's a compliment from me that meant the most to you?"
    ],
    'Drift Prevention': [
        "On a scale of 1-10, how connected have you felt to me lately?",
        "Is there any unresolved tension we should talk about?",
        "What's one thing we can start doing weekly to stay close?",
        "When did you last feel like we were a 'team'?",
        "What's something you've been wanting to share but haven't found the right time for?",
        "How can we prioritize 'us' more amidst our busy schedules?",
        "What's a small habit of mine that has been bothering you lately?",
        "When was the last time you felt truly heard by me?",
        "What's one area of our relationship we should focus on improving this month?",
        "How can I make you feel more like a priority in my life?"
    ],
    'Communication Styles': [
        "How do you prefer to handle disagreements (space vs. talking immediately)?",
        "What's one thing I say that makes you feel defensive?",
        "How can I communicate my needs without making you feel pressured?",
        "What's your 'love language' for receiving feedback?",
        "How do you know when I'm really listening to you?",
        "What's the best way for me to apologize to you when I've messed up?",
        "How can we improve our 'repair' process after an argument?",
        "What's a topic that you feel we avoid talking about?",
        "When we disagree, what's one thing I do that helps de-escalate the situation?",
        "How can I better support you when you're feeling stressed or overwhelmed?"
    ],
    'For Soulmates': [
        "What do you think our life will look like 20 years from now?",
        "What's the biggest lesson our relationship has taught you so far?",
        "In what ways do you think we've grown most as a couple?",
        "What's a dream of yours that you haven't told anyone else?",
        "How has my love changed the way you see yourself?",
        "What's the most 'meant to be' moment we've had?",
        "What's a quality of mine you hope our children (or future kids) inherit?",
        "If we could start a tradition together, what would it be?",
        "What's the most beautiful thing you've ever seen me do?",
        "How do you want to be remembered by me at the end of our lives?"
    ],
    'Couple Therapy': [
        "What's a need of yours that I sometimes struggle to meet?",
        "How can we better support each other's individual growth?",
        "What's a repetitive argument we have, and how can we break the cycle?",
        "How do our past experiences influence how we react to each other?",
        "What's one thing you're currently feeling fearful or anxious about?",
        "How can I show you more empathy when you're struggling?",
        "What's a boundary you'd like us to establish or refine?",
        "How do you feel about our balance of independence and togetherness?",
        "What's the most important thing for us to work on right now?",
        "If we were in therapy today, what would be the first thing you'd want to discuss?"
    ],
    'Naughty Questions': [
        "What's your favorite way for me to initiate intimacy?",
        "What's a fantasy of yours that you've been hesitant to share?",
        "What's the most adventurous thing you'd like to try with me?",
        "How can I make you feel more desirable and attractive?",
        "What's your favorite place for us to be intimate, other than the bedroom?",
        "What's something I do that instantly turns you on?",
        "How often do you think about me in a romantic or sexual way during the day?",
        "What's a piece of clothing you love seeing me in?",
        "What's your favorite part of my body?",
        "How can we keep our physical spark alive even when we're busy?"
    ],
    'Future Dreams': [
        "If money were no object, where would we live and what would we do?",
        "What's one thing you want to achieve before you're 50?",
        "What kind of home do you dream of us building together?",
        "What's a skill or hobby you'd like us to learn together in the future?",
        "Where do you see us traveling for our 10th anniversary?",
        "What's a big risk you've always wanted to take with me?",
        "How do you envision our retirement years together?",
        "What's a legacy you want us to leave behind for others?",
        "If we could change our career paths tomorrow, what would we choose?",
        "What's the most exciting thing about our future together?"
    ],
    'Financial Future': [
        "How do you feel about our current saving and spending habits?",
        "What's a financial goal we should achieve in the next 3 years?",
        "How can we better communicate about our finances together?",
        "What's your philosophy on debt and long-term investments?",
        "If we won the lottery tomorrow, what's the first thing we'd buy?",
        "How can we align our individual career goals with our financial future?",
        "What's a purchase we made recently that you felt was totally worth it?",
        "How should we handle unexpected financial stresses as a team?",
        "What's one thing we should stop spending money on this month?",
        "How do you want us to approach giving and charity as a couple?"
    ],
    'Fun & Adventure': [
        "What's the most spontaneous thing we've ever done?",
        "If we had an entire weekend with no responsibilities, what would we do?",
        "What's an outdoor activity you've always wanted to try with me?",
        "What's the funniest thing that has ever happened to us together?",
        "If we were on a reality competition show, which one would we win?",
        "What's a 'bucket list' trip you want us to take next year?",
        "What's your favorite quirky tradition that we've started?",
        "If we could be any fictional couple for a day, who would we be?",
        "What's a game or sport we should start playing together regularly?",
        "Where is the one place you feel most 'free' with me?"
    ],
    'Conflict Harmony': [
        "How do you know when it's the right time for us to 'pause' a difficult conversation?",
        "What's one thing I do that helps you stay calm during a disagreement?",
        "How can we improve our 'repair' attempts after we've both cooled down?",
        "What's a way I can tell you I'm upset without making you feel attacked?",
        "How do you feel about our ability to forgive and move forward?",
        "What's a lesson you've learned from our past conflicts?",
        "How can we better understand each other's perspectives when we're at odds?",
        "What's one thing we should *never* do when we're arguing?",
        "How can I show you more love even when I'm frustrated with you?",
        "What's a strategy we can use to ensure both of our needs are met during a compromise?"
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
        { title: 'For Soulmates', emoji: '💌', locked: false },
        { title: 'Couple Therapy', emoji: '💖', locked: false },
        { title: 'Fun & Adventure', emoji: '⛺', locked: false },
        { title: 'Future Dreams', emoji: '🚀', locked: false },
        { title: 'Financial Future', emoji: '💰', locked: false },
        { title: 'Conflict Harmony', emoji: '⚖️', locked: false },
        { title: 'Naughty Questions', emoji: '🔞', locked: false }
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
