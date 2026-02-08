import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';

const { width } = Dimensions.get('window');

const ASSESSMENT_QUESTIONS = [
  { category: 'Emotional Needs', question: 'How often do you feel emotionally supported by me?' },
  { category: 'Emotional Needs', question: 'Do you feel comfortable sharing your deepest fears with me?' },
  { category: 'Physical Affection', question: 'Are you satisfied with the amount of physical touch in our daily lives?' },
  { category: 'Physical Affection', question: 'Do you feel that I am responsive to your physical needs?' },
  { category: 'Communication', question: 'How well do we resolve conflicts together?' },
  { category: 'Communication', question: 'Do you feel heard and understood during our conversations?' },
  { category: 'Adventure', question: 'How excited are you by our plans for the future together?' },
  { category: 'Adventure', question: 'Do we spend enough time trying new things as a couple?' },
  { category: 'Quality Time', question: 'Are you satisfied with the amount of undivided attention we give each other?' },
  { category: 'Quality Time', question: 'Do you feel that our scheduled dates are meaningful?' },
];

export default function AssessmentScreen() {
  const router = useRouter();
  const setUserAssessment = useUserStore((state) => state.setUserAssessment);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentStep < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate final scores
      const result: Record<string, number> = {};
      const categories = ['Emotional Needs', 'Physical Affection', 'Communication', 'Adventure', 'Quality Time'];
      
      categories.forEach(cat => {
        const catAnswers = newAnswers.filter((_, i) => ASSESSMENT_QUESTIONS[i].category === cat);
        const avg = catAnswers.reduce((a, b) => a + b, 0) / catAnswers.length;
        result[cat] = Math.round(avg * 20); // Scale 0-5 to 0-100
      });

      setUserAssessment(result);
      router.back();
    }
  };

  const progress = ((currentStep + 1) / ASSESSMENT_QUESTIONS.length) * 100;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="mb-8">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Ionicons name="close" size={28} color="#0F172A" />
          </TouchableOpacity>
          <View className="h-2 bg-beige-100 rounded-full">
            <View 
                className="h-full bg-teal rounded-full" 
                style={{ width: `${progress}%` }} 
            />
          </View>
          <Text className="text-navy-400 font-bold mt-2 text-right">{currentStep + 1} / {ASSESSMENT_QUESTIONS.length}</Text>
        </View>

        {/* Question Card */}
        <View className="flex-1 justify-center items-center">
          <View 
            className="bg-white rounded-[40px] p-8 shadow-2xl border border-surface-200 items-center justify-center"
            style={{ width: width - 48, height: width * 1.2 }}
          >
            <Text className="text-teal font-extrabold uppercase tracking-widest text-xs mb-4">
                {ASSESSMENT_QUESTIONS[currentStep].category}
            </Text>
            <Text className="text-navy text-3xl font-bold text-center leading-tight">
              {ASSESSMENT_QUESTIONS[currentStep].question}
            </Text>
          </View>
        </View>

        {/* Simple Scale Selector */}
        <View className="mt-12">
          <Text className="text-center text-navy-400 font-bold mb-4 uppercase tracking-tighter">Rate from 0 to 5</Text>
          <View className="flex-row justify-between mb-8">
            {[0, 1, 2, 3, 4, 5].map((score) => (
              <TouchableOpacity
                key={score}
                onPress={() => handleAnswer(score)}
                className="w-12 h-12 bg-teal/10 rounded-2xl items-center justify-center border border-teal/20 active:bg-teal"
              >
                <Text className="text-teal font-bold text-lg active:text-white">{score}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
