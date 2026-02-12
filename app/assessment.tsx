import { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { saveAssessment } from '@/services/auth';

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
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(ASSESSMENT_QUESTIONS.length).fill(null));

  const handleSelectAnswer = (score: number) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = score;
    setAnswers(newAnswers);
    
    if (currentStep < ASSESSMENT_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 200);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async () => {
    const result: Record<string, number> = {};
    const categories = ['Emotional Needs', 'Physical Affection', 'Communication', 'Adventure', 'Quality Time'];
    
    categories.forEach(cat => {
      const catIndices = ASSESSMENT_QUESTIONS.map((q, i) => q.category === cat ? i : -1).filter(i => i !== -1);
      const catAnswers = catIndices.map(i => answers[i]).filter((a): a is number => a !== null);
      
      if (catAnswers.length > 0) {
        const avg = catAnswers.reduce((a, b) => a + b, 0) / catAnswers.length;
        result[cat] = Math.round(avg * 20);
      } else {
        result[cat] = 0;
      }
    });

    const user = useUserStore.getState().user;
    if (user) {
      try {
        await saveAssessment(user.id, result);
        setUserAssessment(result);
        router.back();
      } catch (error: any) {
        console.error('Error saving assessment:', error);
        Alert.alert('Save Failed', 'Could not save your assessment results. Please try again.');
      }
    } else {
      setUserAssessment(result);
      router.back();
    }
  };

  const isLastStep = currentStep === ASSESSMENT_QUESTIONS.length - 1;
  const allAnswered = answers.every(a => a !== null);
  const progress = ((currentStep + 1) / ASSESSMENT_QUESTIONS.length) * 100;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 px-6 py-6">
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={28} color="#0F172A" />
            </TouchableOpacity>
            <View className="flex-row gap-4">
                <TouchableOpacity 
                    onPress={handleBack} 
                    disabled={currentStep === 0}
                    className="w-10 h-10 rounded-full items-center justify-center bg-white shadow-md"
                >
                    <Ionicons name="chevron-back" size={20} color={currentStep === 0 ? '#CBD5E1' : '#0F172A'} />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={handleNext} 
                    disabled={currentStep === ASSESSMENT_QUESTIONS.length - 1}
                    className="w-10 h-10 rounded-full items-center justify-center bg-white shadow-md"
                >
                    <Ionicons name="chevron-forward" size={20} color={isLastStep ? '#CBD5E1' : '#0F172A'} />
                </TouchableOpacity>
            </View>
          </View>
          
          <View className="h-2 bg-slate-100 rounded-full">
            <View 
                className="h-full bg-teal rounded-full" 
                style={{ width: `${progress}%` }} 
            />
          </View>
          <Text className="text-slate-400 font-bold mt-2 text-right">{currentStep + 1} / {ASSESSMENT_QUESTIONS.length}</Text>
        </View>

        {/* Question Card */}
        <View className="flex-1 justify-center items-center">
          <View 
            className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 items-center justify-center"
            style={{ width: width - 48, height: width * 1.0 }}
          >
            <View className="bg-teal/10 px-4 py-1.5 rounded-full mb-6">
              <Text className="text-teal font-bold uppercase tracking-widest text-[10px]">
                  {ASSESSMENT_QUESTIONS[currentStep].category}
              </Text>
            </View>
            <Text className="text-navy text-2xl font-bold text-center leading-tight">
              {ASSESSMENT_QUESTIONS[currentStep].question}
            </Text>
          </View>
        </View>

        {/* Scale Selector */}
        <View className="mt-6">
          <Text className="text-center text-slate-400 font-bold mb-6 uppercase tracking-widest text-[10px]">Rate from 0 to 5</Text>
          <View className="flex-row justify-between mb-8">
            {[0, 1, 2, 3, 4, 5].map((score) => (
              <TouchableOpacity
                key={score}
                onPress={() => handleSelectAnswer(score)}
                className={`w-12 h-12 rounded-2xl items-center justify-center border ${
                  answers[currentStep] === score 
                    ? 'bg-teal border-teal shadow-lg' 
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <Text className={`font-bold text-lg ${answers[currentStep] === score ? 'text-white' : 'text-teal'}`}>
                  {score}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {isLastStep && (
            <TouchableOpacity 
              onPress={handleSubmit}
              disabled={!allAnswered}
              className={`py-5 rounded-2xl items-center shadow-lg ${allAnswered ? 'bg-teal' : 'bg-slate-300'}`}
            >
              <Text className="text-white font-bold text-lg">Submit Assessment</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
