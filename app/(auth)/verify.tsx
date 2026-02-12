import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { verifyOTP, syncUser } from '@/services/auth';
import { useUserStore } from '@/store/userStore';
import { Ionicons } from '@expo/vector-icons';

export default function VerifyScreen() {
  const router = useRouter();
  const { email, displayName } = useLocalSearchParams<{ email: string; displayName: string }>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const token = otp.join('');
    if (token.length < 6) {
      Alert.alert('Error', 'Please enter the full 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const user = await verifyOTP(email, token);
      setUser(user);
      
      Alert.alert('Success', 'Email verified successfully!', [
        {
          text: 'Continue',
          onPress: () => router.replace({
            pathname: '/(auth)/onboarding',
            params: { displayName }
          })
        }
      ]);
    } catch (error: any) {
      Alert.alert('Verification Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-surface"
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          activeOpacity={0.7}
          className="mb-6"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color="#1E293B" />
        </TouchableOpacity>

        <View className="items-center mb-10">
          <View className="w-20 h-20 bg-teal/10 rounded-full items-center justify-center mb-6">
            <Ionicons name="mail-open" size={40} color="#14B8A6" />
          </View>
          <Text className="text-3xl font-bold text-navy mb-2">Verify Email</Text>
          <Text className="text-base text-navy-600 text-center px-4">
            We've sent a 6-digit code to{"\n"}
            <Text className="font-bold text-navy">{email}</Text>
          </Text>
        </View>

        <View className="bg-white rounded-3xl p-8 shadow-lg">
          <View className="flex-row justify-between mb-8">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                className="w-12 h-14 bg-beige-100 rounded-xl text-center text-2xl font-bold text-navy border-2 border-transparent focus:border-teal"
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                selectTextOnFocus
              />
            ))}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            className={`bg-teal rounded-2xl py-4 items-center shadow-md active:bg-teal-600 ${
              loading ? 'opacity-50' : ''
            }`}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-base font-semibold">Verify & Continue</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            className="mt-6 items-center"
            onPress={() => Alert.alert('Check Logs', 'If you didn\'t receive a code, check your Resend/Supabase logs or try with your registered email.')}
          >
            <Text className="text-navy-500 font-medium">
              Didn't receive a code? <Text className="text-teal font-bold">Resend</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
