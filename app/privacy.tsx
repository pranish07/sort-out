import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-teal pt-12 pb-8 px-6 rounded-b-[48px] shadow-lg">
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="mr-4"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-white">Privacy Policy</Text>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 pt-6">
          <View className="bg-white rounded-3xl p-6 shadow-md mb-8">
            <Text className="text-xl font-bold text-navy mb-4">Your Privacy Matters</Text>
            <Text className="text-navy-600 mb-4 leading-6">
                At Sort Out, we believe that your personal and relationship data should remain private and secure. This policy outlines how we handle your information.
            </Text>

            <Text className="text-lg font-bold text-navy mt-4 mb-2">1. Data Collection</Text>
            <Text className="text-navy-600 mb-4 leading-6">
                We only collect data that is essential for the app's functionality, such as your email (for authentication), profile information (to personalize your experience), and relationship data (to help you track and improve your bond).
            </Text>

            <Text className="text-lg font-bold text-navy mt-4 mb-2">2. Data Sharing</Text>
            <Text className="text-navy-600 mb-4 leading-6">
                We NEVER sell your personal data to third parties. Your data is only shared with your paired partner within the app's features.
            </Text>

            <Text className="text-lg font-bold text-navy mt-4 mb-2">3. Security</Text>
            <Text className="text-navy-600 mb-4 leading-6">
                We use industry-standard encryption and security measures (via Supabase) to protect your data from unauthorized access.
            </Text>

            <Text className="text-lg font-bold text-navy mt-4 mb-2">4. Your Rights</Text>
            <Text className="text-navy-600 mb-4 leading-6">
                You can request to delete your account and all associated data at any time through our settings or by contacting our support team.
            </Text>

            <Text className="text-navy-400 mt-8 italic text-center">
                Last updated: February 2026
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
