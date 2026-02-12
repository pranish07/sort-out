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
  const partner = useUserStore((state) => state.partner);
  const userAssessment = useUserStore((state) => state.userAssessment);
  const partnerAssessment = useUserStore((state) => state.partnerAssessment);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const loveScore = useMemo(() => {
    const assessment = userAssessment || user?.userAssessment;
    if (!assessment) return 0;
    const values = Object.values(assessment);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }, [userAssessment, user?.userAssessment]);

  const isCompleted = !!userAssessment || !!user?.userAssessment;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="bg-teal pt-12 pb-16 px-6 rounded-b-[48px] shadow-lg">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white/80 text-lg font-medium">Welcome back,</Text>
              <Text className="text-3xl font-bold text-white">{user?.displayName || 'Partner'}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)/me')}
              className="w-12 h-12 bg-white/20 rounded-full items-center justify-center border border-white/30"
            >
              <Ionicons name="settings-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-6 pb-12 -mt-8">
          {/* Partner Status Section */}
          <View className="mb-6">
            <PartnerStatus partner={partner} />
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
              className="bg-teal p-6 rounded-3xl flex-row items-center justify-between mb-6 shadow-lg"
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
