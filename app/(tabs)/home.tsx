import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { Ionicons } from '@expo/vector-icons';
import LoveScoreCircle from '@/components/LoveScoreCircle';
import RequirementsMatcher from '@/components/RequirementsMatcher';
import DriftDetector from '@/components/DriftDetector';
import DailyTipCard from '@/components/DailyTipCard';
import PartnerStatus from '@/components/PartnerStatus';

export default function HomeScreen() {
  const user = useUserStore((state) => state.user);
  const partner = useUserStore((state) => state.partner);
  const couple = useUserStore((state) => state.couple);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh data here
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-blush-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#14B8A6" />
        }
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-3xl font-bold text-navy">
                Hi, {user?.displayName || 'there'}! 👋
              </Text>
              <Text className="text-base text-navy-600 mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
            <TouchableOpacity className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-soft">
              <Ionicons name="settings-outline" size={24} color="#1E293B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Love Score */}
        <View className="px-6 mb-6">
          <LoveScoreCircle score={couple?.loveScore || 72} />
        </View>

        {/* Partner Status */}
        <View className="px-6 mb-6">
          <PartnerStatus partner={partner} />
        </View>

        {/* Drift Detector */}
        <View className="px-6 mb-6">
          <DriftDetector />
        </View>

        {/* Daily Tip */}
        <View className="px-6 mb-6">
          <DailyTipCard />
        </View>

        {/* Requirements Matcher */}
        <View className="px-6 mb-6">
          <RequirementsMatcher />
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-bold text-navy mb-4">Quick Actions</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 bg-white rounded-2xl p-4 shadow-soft items-center">
              <View className="w-12 h-12 bg-teal-100 rounded-full items-center justify-center mb-2">
                <Ionicons name="add" size={24} color="#14B8A6" />
              </View>
              <Text className="text-sm font-semibold text-navy">New Entry</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-white rounded-2xl p-4 shadow-soft items-center">
              <View className="w-12 h-12 bg-blush-200 rounded-full items-center justify-center mb-2">
                <Ionicons name="chatbubbles" size={24} color="#FF998F" />
              </View>
              <Text className="text-sm font-semibold text-navy">Sort Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
