import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { signUpWithEmail } from '@/services/auth';
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !displayName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      router.push({
        pathname: '/(auth)/onboarding',
        params: { email, password, displayName },
      });
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message);
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

        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-teal rounded-full items-center justify-center mb-4">
            <Ionicons name="heart" size={40} color="white" />
          </View>
          <Text className="text-3xl font-bold text-navy mb-2">Create Account</Text>
          <Text className="text-base text-navy-600 text-center">
            Start your journey together
          </Text>
        </View>

        <View className="bg-white rounded-3xl p-6 shadow-soft-lg">
          <View className="mb-4">
            <Text className="text-sm font-medium text-navy-700 mb-2">Name</Text>
            <TextInput
              className="bg-beige-100 rounded-2xl px-4 py-4 text-base text-navy"
              placeholder="Your name"
              placeholderTextColor="#94A3B8"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-navy-700 mb-2">Email</Text>
            <TextInput
              className="bg-beige-100 rounded-2xl px-4 py-4 text-base text-navy"
              placeholder="your@email.com"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-navy-700 mb-2">Password</Text>
            <View className="relative">
              <TextInput
                className="bg-beige-100 rounded-2xl px-4 py-4 pr-12 text-base text-navy"
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                activeOpacity={0.7}
                className="absolute right-4 top-4"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-navy-700 mb-2">
              Confirm Password
            </Text>
            <TextInput
              className="bg-beige-100 rounded-2xl px-4 py-4 text-base text-navy"
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            className={`bg-teal rounded-2xl py-4 items-center active:bg-teal-600 ${
              loading ? 'opacity-50' : ''
            }`}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text className="text-white text-base font-semibold">
              {loading ? 'Creating Account...' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6 flex-row justify-center items-center">
          <Text className="text-navy-600">Already have an account? </Text>
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => router.back()}
          >
            <Text className="text-teal font-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
