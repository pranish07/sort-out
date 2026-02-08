import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { signUpWithEmail } from '@/services/auth';
import { useUserStore } from '@/store/userStore';
import { Ionicons } from '@expo/vector-icons';
import { User } from '@/types';

type RelationshipStatus = 'single' | 'dating' | 'relationship' | 'engaged' | 'married';

export default function OnboardingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email: string; password: string; displayName: string }>();
  const setUser = useUserStore((state) => state.setUser);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [relationshipStatus, setRelationshipStatus] = useState<RelationshipStatus | null>(null);
  const [primaryGoal, setPrimaryGoal] = useState<string | null>(null);
  const [checkInFrequency, setCheckInFrequency] = useState<string | null>(null);
  const [loveLanguage, setLoveLanguage] = useState<string | null>(null);
  const [relationshipDuration, setRelationshipDuration] = useState<string | null>(null);

  const totalSteps = relationshipStatus === 'single' ? 4 : 5;

  const handleNext = () => {
    if (step === 1 && relationshipStatus === 'single') {
        // Skip duration logic usually happens at the end or we just adjust step sequence
        setStep(step + 1);
    } else if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    if (!relationshipStatus || !primaryGoal || !checkInFrequency || !loveLanguage) {
      Alert.alert('Error', 'Please complete all required steps');
      return;
    }

    if (relationshipStatus !== 'single' && !relationshipDuration) {
        Alert.alert('Error', 'Please provide relationship duration');
        return;
    }

    setLoading(true);
    try {
      const user = await signUpWithEmail(params.email, params.password, {
        displayName: params.displayName,
        relationshipStatus: relationshipStatus || undefined,
        primaryGoal: primaryGoal || undefined,
        checkInFrequency: checkInFrequency || undefined,
        loveLanguage: loveLanguage || undefined,
        relationshipDuration: relationshipStatus === 'single' ? undefined : (relationshipDuration || undefined),
        hasCompletedOnboarding: true,
      });
      setUser(user);
      router.replace('/(tabs)/home');
    } catch (error: any) {
      Alert.alert('Setup Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderProgress = () => (
    <View className="flex-row items-center justify-between mb-8">
      <View className="flex-row gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={i}
            className={`h-2 rounded-full ${
              i + 1 === step ? 'w-8 bg-teal' : 'w-2 bg-navy-200'
            }`}
          />
        ))}
      </View>
      <Text className="text-navy-500 text-sm">Step {step} of {totalSteps}</Text>
    </View>
  );

  const renderStep1 = () => (
    <View className="flex-1">
      <Text className="text-2xl font-bold text-navy mb-2">Relationship Status</Text>
      <Text className="text-base text-navy-600 mb-6">Where are you currently?</Text>
      <View className="gap-4">
        {[
          { value: 'single', label: 'Single', icon: 'person-outline' },
          { value: 'dating', label: 'Dating', icon: 'heart-outline' },
          { value: 'relationship', label: 'In a Relationship', icon: 'heart' },
          { value: 'engaged', label: 'Engaged', icon: 'diamond-outline' },
          { value: 'married', label: 'Married', icon: 'infinite-outline' },
        ].map((option) => (
          <TouchableOpacity
            key={option.value}
            className={`flex-row items-center p-4 rounded-2xl ${
              relationshipStatus === option.value ? 'bg-teal' : 'bg-beige-100'
            }`}
            onPress={() => setRelationshipStatus(option.value as RelationshipStatus)}
          >
            <Ionicons
              name={option.icon as any}
              size={24}
              color={relationshipStatus === option.value ? 'white' : '#1E293B'}
            />
            <Text className={`ml-3 text-base font-medium ${relationshipStatus === option.value ? 'text-white' : 'text-navy'}`}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View className="flex-1">
      <Text className="text-2xl font-bold text-navy mb-2">Primary Goal</Text>
      <Text className="text-base text-navy-600 mb-6">What do you want to achieve with SortOut?</Text>
      <View className="gap-4">
        {[
          { value: 'Stay connected', icon: 'wifi-outline' },
          { value: 'Improve communication', icon: 'chatbubbles-outline' },
          { value: 'Track habits', icon: 'checkbox-outline' },
          { value: 'Prevent drifting', icon: 'shield-outline' },
        ].map((option) => (
          <TouchableOpacity
            key={option.value}
            className={`flex-row items-center p-4 rounded-2xl ${
              primaryGoal === option.value ? 'bg-teal' : 'bg-beige-100'
            }`}
            onPress={() => setPrimaryGoal(option.value)}
          >
            <Ionicons
              name={option.icon as any}
              size={24}
              color={primaryGoal === option.value ? 'white' : '#1E293B'}
            />
            <Text className={`ml-3 text-base font-medium ${primaryGoal === option.value ? 'text-white' : 'text-navy'}`}>
              {option.value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View className="flex-1">
      <Text className="text-2xl font-bold text-navy mb-2">Check-in Frequency</Text>
      <Text className="text-base text-navy-600 mb-6">How often would you like to reflect?</Text>
      <View className="gap-4">
        {[
          { value: 'Daily', icon: 'sunny-outline' },
          { value: 'Every few days', icon: 'calendar-outline' },
          { value: 'Weekly', icon: 'notifications-outline' },
        ].map((option) => (
          <TouchableOpacity
            key={option.value}
            className={`flex-row items-center p-4 rounded-2xl ${
              checkInFrequency === option.value ? 'bg-teal' : 'bg-beige-100'
            }`}
            onPress={() => setCheckInFrequency(option.value)}
          >
            <Ionicons
              name={option.icon as any}
              size={24}
              color={checkInFrequency === option.value ? 'white' : '#1E293B'}
            />
            <Text className={`ml-3 text-base font-medium ${checkInFrequency === option.value ? 'text-white' : 'text-navy'}`}>
              {option.value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View className="flex-1">
      <Text className="text-2xl font-bold text-navy mb-2">Love Language</Text>
      <Text className="text-base text-navy-600 mb-6">Which resonates most with you?</Text>
      <View className="gap-4">
        {[
          { value: 'Words of Affirmation', icon: 'megaphone-outline' },
          { value: 'Acts of Service', icon: 'construct-outline' },
          { value: 'Receiving Gifts', icon: 'gift-outline' },
          { value: 'Quality Time', icon: 'time-outline' },
          { value: 'Physical Touch', icon: 'hand-left-outline' },
        ].map((option) => (
          <TouchableOpacity
            key={option.value}
            className={`flex-row items-center p-4 rounded-2xl ${
              loveLanguage === option.value ? 'bg-teal' : 'bg-beige-100'
            }`}
            onPress={() => setLoveLanguage(option.value)}
          >
            <Ionicons
              name={option.icon as any}
              size={24}
              color={loveLanguage === option.value ? 'white' : '#1E293B'}
            />
            <Text className={`ml-3 text-base font-medium ${loveLanguage === option.value ? 'text-white' : 'text-navy'}`}>
              {option.value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View className="flex-1">
      <Text className="text-2xl font-bold text-navy mb-2">Relationship Duration</Text>
      <Text className="text-base text-navy-600 mb-6">How long have you been together?</Text>
      <View className="gap-4">
        {[
          { value: '< 1 year', icon: 'hourglass-outline' },
          { value: '1-3 years', icon: 'trail-sign-outline' },
          { value: '3-5 years', icon: 'rocket-outline' },
          { value: '5+ years', icon: 'star-outline' },
        ].map((option) => (
          <TouchableOpacity
            key={option.value}
            className={`flex-row items-center p-4 rounded-2xl ${
              relationshipDuration === option.value ? 'bg-teal' : 'bg-beige-100'
            }`}
            onPress={() => setRelationshipDuration(option.value)}
          >
            <Ionicons
              name={option.icon as any}
              size={24}
              color={relationshipDuration === option.value ? 'white' : '#1E293B'}
            />
            <Text className={`ml-3 text-base font-medium ${relationshipDuration === option.value ? 'text-white' : 'text-navy'}`}>
              {option.value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const isNextDisabled = () => {
    if (step === 1) return !relationshipStatus;
    if (step === 2) return !primaryGoal;
    if (step === 3) return !checkInFrequency;
    if (step === 4) return !loveLanguage;
    if (step === 5) return !relationshipDuration;
    return false;
  };

  return (
    <View className="flex-1 bg-blush-100 px-6 pt-12 pb-8">
      {renderProgress()}

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
      </ScrollView>

      <View className="flex-row gap-3 mt-6">
        {step > 1 && (
          <TouchableOpacity
            className="flex-1 bg-beige-200 rounded-2xl py-4 items-center"
            onPress={handleBack}
          >
            <Text className="text-navy text-base font-semibold">Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className={`flex-1 bg-teal rounded-2xl py-4 items-center ${
            isNextDisabled() || loading ? 'opacity-50' : ''
          }`}
          onPress={handleNext}
          disabled={isNextDisabled() || loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-base font-semibold">
              {step === totalSteps ? 'Complete' : 'Continue'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
