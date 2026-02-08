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
import { signInWithEmail } from '@/services/auth';
import { useUserStore } from '@/store/userStore';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const user = await signInWithEmail(email, password);
      setUser(user);
      
      if (user.hasCompletedOnboarding) {
        router.replace('/(tabs)/home');
      } else {
        router.replace({
          pathname: '/(auth)/onboarding',
          params: { email, displayName: user.displayName }
        });
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
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
        contentContainerClassName="flex-grow justify-center px-6 py-8"
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center mb-12">
          <View className="w-20 h-20 bg-teal rounded-full items-center justify-center mb-4">
            <Ionicons name="heart" size={40} color="white" />
          </View>
          <Text className="text-4xl font-bold text-navy mb-2">SortOut</Text>
          <Text className="text-base text-navy-600 text-center">
            Grow together, stay connected
          </Text>
        </View>

        <View className="bg-white rounded-3xl p-6 shadow-lg">
          <Text className="text-2xl font-bold text-navy mb-6">Welcome Back</Text>

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

          <View className="mb-6">
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

          <TouchableOpacity
            activeOpacity={0.8}
            className={`bg-teal rounded-2xl py-4 items-center mb-4 active:bg-teal-600 ${
              loading ? 'opacity-50' : ''
            }`}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-white text-base font-semibold">
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="py-2">
            <Text className="text-teal text-center text-sm font-medium">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6 flex-row justify-center items-center">
          <Text className="text-navy-600">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text className="text-teal font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-8">
          <View className="flex-row items-center mb-4">
            <View className="flex-1 h-px bg-navy-200" />
            <Text className="mx-4 text-navy-500 text-sm">Or continue with</Text>
            <View className="flex-1 h-px bg-navy-200" />
          </View>

          <View className="flex-row justify-center gap-4">
            <TouchableOpacity className="bg-white rounded-2xl p-4 shadow-md flex-1 items-center">
              <Ionicons name="logo-google" size={24} color="#EA4335" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-white rounded-2xl p-4 shadow-md flex-1 items-center">
              <Ionicons name="logo-apple" size={24} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
