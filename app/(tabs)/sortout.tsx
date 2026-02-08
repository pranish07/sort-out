import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SortOutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-6 pt-4 pb-6">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-3xl font-bold text-navy">Sort Out</Text>
            <Text className="text-base text-navy-600 mt-1">
              Work through challenges together
            </Text>
          </View>
          <View className="w-12 h-12 bg-teal-100 rounded-full items-center justify-center">
            <Ionicons name="heart-circle" size={32} color="#14B8A6" />
          </View>
        </View>
      </View>

      {/* New Sort Out Button */}
      <View className="px-6 mb-6">
        <TouchableOpacity
          className="bg-teal rounded-2xl p-5 shadow-lg flex-row items-center justify-center"
          onPress={() => router.push('/sortout/new')}
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text className="text-white text-lg font-bold ml-2">New Sort Out</Text>
        </TouchableOpacity>
      </View>

      {/* Issues List */}
      <ScrollView className="flex-1 px-6">
        <Text className="text-lg font-bold text-navy mb-4">Recent Issues</Text>

        {/* Empty State */}
        <View className="items-center justify-center py-12">
          <View className="w-24 h-24 bg-teal-50 rounded-full items-center justify-center mb-4">
            <Ionicons name="chatbubbles-outline" size={48} color="#14B8A6" />
          </View>
          <Text className="text-xl font-bold text-navy mb-2">No Issues Yet</Text>
          <Text className="text-base text-navy-600 text-center px-8 mb-6">
            When you face a challenge, use Sort Out to get AI-powered guidance and work through it together.
          </Text>
          <TouchableOpacity
            className="bg-teal rounded-2xl px-6 py-3"
            onPress={() => router.push('/sortout/new')}
          >
            <Text className="text-white font-semibold">Create Your First Sort Out</Text>
          </TouchableOpacity>
        </View>

        {/* Example Issue Card (commented out for now) */}
        {/* <TouchableOpacity className="bg-white rounded-2xl p-4 shadow-md mb-3">
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1">
              <Text className="text-base font-bold text-navy mb-1">
                Communication about work stress
              </Text>
              <Text className="text-sm text-navy-600">
                Started 2 days ago
              </Text>
            </View>
            <View className="bg-sage-100 px-3 py-1 rounded-full">
              <Text className="text-xs font-semibold text-sage-500">In Progress</Text>
            </View>
          </View>
          <View className="flex-row items-center mt-3">
            <View className="flex-1 bg-beige-100 rounded-full h-2">
              <View className="bg-teal rounded-full h-2" style={{ width: '60%' }} />
            </View>
            <Text className="ml-3 text-sm font-medium text-navy-600">60%</Text>
          </View>
        </TouchableOpacity> */}
      </ScrollView>
    </SafeAreaView>
  );
}
