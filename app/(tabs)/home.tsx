import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useMemo } from 'react';
import { useUserStore } from '@/store/userStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import LoveScoreCircle from '@/components/LoveScoreCircle';
import RequirementsMatcher from '@/components/RequirementsMatcher';
import DriftDetector from '@/components/DriftDetector';
import DailyTipCard from '@/components/DailyTipCard';
import PartnerStatus from '@/components/PartnerStatus';

export default function HomeScreen() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const userAssessment = useUserStore((state) => state.userAssessment);
  const partnerAssessment = useUserStore((state) => state.partnerAssessment);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const loveScore = useMemo(() => {
    if (!userAssessment) return 0;
    const values = Object.values(userAssessment);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }, [userAssessment]);

  const isCompleted = !!userAssessment;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-navy-400 font-bold text-xs uppercase tracking-widest">Welcome back</Text>
              <Text className="text-3xl font-bold text-navy">{user?.displayName || 'Partner'}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)/me')}
              className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-soft"
            >
              <Ionicons name="settings-outline" size={24} color="#0F172A" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-6 pb-12">
          {/* Partner Status Section */}
          <View className="mb-6">
            <PartnerStatus />
          </View>

          {/* Love Score Section */}
          <View className="mb-6">
            <LoveScoreCircle score={loveScore} isCompleted={isCompleted} />
          </View>

          {/* Assessment Prompt */}
          {!isCompleted && (
            <TouchableOpacity 
              onPress={() => router.push('/assessment')}
              activeOpacity={0.9}
              className="bg-teal p-6 rounded-3xl flex-row items-center justify-between mb-6 shadow-teal/30 shadow-lg"
            >
              <View className="flex-1">
                <Text className="text-white text-lg font-bold">Relationship Test</Text>
                <Text className="text-white/80 text-sm font-medium mt-1">Unlock your Love Score now.</Text>
              </View>
              <View className="bg-white/20 px-4 py-2 rounded-full border border-white/30">
                <Text className="text-white font-bold">Take Test</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Requirements Matcher */}
          <View className="mb-6">
            <RequirementsMatcher />
          </View>

          {/* Assessment Retake Option */}
          {isCompleted && (
              <TouchableOpacity 
                onPress={() => router.push('/assessment')}
                className="mb-8 flex-row items-center justify-center py-4 bg-white rounded-2xl border border-surface-200 shadow-sm"
              >
                  <Ionicons name="refresh" size={18} color="#14B8A6" />
                  <Text className="ml-2 text-navy font-bold">Retake Relationship Assessment</Text>
              </TouchableOpacity>
          )}

          {/* Other Dashboards */}
          <DriftDetector />
          
          <View className="mt-6">
            <DailyTipCard />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
