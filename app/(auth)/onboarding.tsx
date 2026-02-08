import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { signUpWithEmail } from '@/services/auth';
import { useUserStore } from '@/store/userStore';
import { Ionicons } from '@expo/vector-icons';

type Gender = 'male' | 'female' | 'other';
type RelationshipStatus = 'dating' | 'engaged' | 'married';

export default function OnboardingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email: string; password: string; displayName: string }>();
  const setUser = useUserStore((state) => state.setUser);

  const [step, setStep] = useState(1);
  const [age, setAge] = useState<number | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [relationshipStatus, setRelationshipStatus] = useState<RelationshipStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const ageOptions = Array.from({ length: 63 }, (_, i) => i + 18);

  const handleComplete = async () => {
    if (!age || !gender || !relationshipStatus) {
      Alert.alert('Error', 'Please complete all steps');
      return;
    }

    setLoading(true);
    try {
      const user = await signUpWithEmail(params.email, params.password, {
        displayName: params.displayName,
        age,
        gender,
        relationshipStatus,
      });
      setUser(user);
      router.replace('/(tabs)/home');
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <View className="flex-1">
      <Text className="text-2xl font-bold text-navy mb-2">How old are you?</Text>
      <Text className="text-base text-navy-600 mb-6">
        This helps us personalize your experience
      </Text>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap gap-3">
          {ageOptions.map((ageOption) => (
            <TouchableOpacity
              key={ageOption}
              className={`px-6 py-3 rounded-2xl ${
                age === ageOption ? 'bg-teal' : 'bg-beige-100'
              }`}
              onPress={() => setAge(ageOption)}
            >
              <Text
                className={`text-base font-medium ${
                  age === ageOption ? 'text-white' : 'text-navy'
                }`}
              >
                {ageOption}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        className={`bg-teal rounded-2xl py-4 items-center mt-6 ${
          !age ? 'opacity-50' : ''
        }`}
        onPress={() => setStep(2)}
        disabled={!age}
      >
        <Text className="text-white text-base font-semibold">Continue</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View className="flex-1">
      <Text className="text-2xl font-bold text-navy mb-2">What's your gender?</Text>
      <Text className="text-base text-navy-600 mb-6">
        This helps us understand relationship dynamics
      </Text>

      <View className="gap-4">
        {[
          { value: 'male' as Gender, label: 'Male', icon: 'male' },
          { value: 'female' as Gender, label: 'Female', icon: 'female' },
          { value: 'other' as Gender, label: 'Other', icon: 'transgender' },
        ].map((option) => (
          <TouchableOpacity
            key={option.value}
            className={`flex-row items-center p-4 rounded-2xl ${
              gender === option.value ? 'bg-teal' : 'bg-beige-100'
            }`}
            onPress={() => setGender(option.value)}
          >
            <Ionicons
              name={option.icon as any}
              size={24}
              color={gender === option.value ? 'white' : '#1E293B'}
            />
            <Text
              className={`ml-3 text-base font-medium ${
                gender === option.value ? 'text-white' : 'text-navy'
              }`}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-row gap-3 mt-auto">
        <TouchableOpacity
          className="flex-1 bg-beige-200 rounded-2xl py-4 items-center"
          onPress={() => setStep(1)}
        >
          <Text className="text-navy text-base font-semibold">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 bg-teal rounded-2xl py-4 items-center ${
            !gender ? 'opacity-50' : ''
          }`}
          onPress={() => setStep(3)}
          disabled={!gender}
        >
          <Text className="text-white text-base font-semibold">Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View className="flex-1">
      <Text className="text-2xl font-bold text-navy mb-2">Relationship Status</Text>
      <Text className="text-base text-navy-600 mb-6">
        Where are you in your journey together?
      </Text>

      <View className="gap-4">
        {[
          { value: 'dating' as RelationshipStatus, label: 'Dating', icon: 'heart-outline' },
          { value: 'engaged' as RelationshipStatus, label: 'Engaged', icon: 'diamond-outline' },
          { value: 'married' as RelationshipStatus, label: 'Married', icon: 'heart' },
        ].map((option) => (
          <TouchableOpacity
            key={option.value}
            className={`flex-row items-center p-4 rounded-2xl ${
              relationshipStatus === option.value ? 'bg-teal' : 'bg-beige-100'
            }`}
            onPress={() => setRelationshipStatus(option.value)}
          >
            <Ionicons
              name={option.icon as any}
              size={24}
              color={relationshipStatus === option.value ? 'white' : '#1E293B'}
            />
            <Text
              className={`ml-3 text-base font-medium ${
                relationshipStatus === option.value ? 'text-white' : 'text-navy'
              }`}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-row gap-3 mt-auto">
        <TouchableOpacity
          className="flex-1 bg-beige-200 rounded-2xl py-4 items-center"
          onPress={() => setStep(2)}
        >
          <Text className="text-navy text-base font-semibold">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 bg-teal rounded-2xl py-4 items-center ${
            !relationshipStatus || loading ? 'opacity-50' : ''
          }`}
          onPress={handleComplete}
          disabled={!relationshipStatus || loading}
        >
          <Text className="text-white text-base font-semibold">
            {loading ? 'Creating...' : 'Complete'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-blush-100 px-6 pt-12 pb-8">
      <View className="flex-row items-center justify-between mb-8">
        <View className="flex-row gap-2">
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              className={`h-2 rounded-full ${
                s === step ? 'w-8 bg-teal' : 'w-2 bg-navy-200'
              }`}
            />
          ))}
        </View>
        <Text className="text-navy-500 text-sm">Step {step} of 3</Text>
      </View>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </View>
  );
}
