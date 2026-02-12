import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import { useUserStore } from '@/store/userStore';
import { getIssues } from '@/services/sortout';

export default function SortOutScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useScrollToTop(scrollRef);

  const fetchIssues = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getIssues(user.id);
      setIssues(data);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchIssues();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-teal-100 text-teal-600';
      case 'analyzing': return 'bg-play-100 text-play-600';
      case 'in-progress': return 'bg-sage-100 text-sage-600';
      default: return 'bg-navy-100 text-navy-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'resolved': return 'Resolved';
      case 'analyzing': return 'AI Analyzing';
      case 'in-progress': return 'In Progress';
      default: return 'Pending Partner';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-teal pt-12 pb-16 px-6 rounded-b-[48px] shadow-lg">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white/80 text-lg font-medium">Resolution Tools</Text>
              <Text className="text-3xl font-bold text-white">Sort Out</Text>
            </View>
            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center border border-white/30">
              <Ionicons name="heart-circle" size={32} color="white" />
            </View>
          </View>
        </View>

        <View className="flex-1 -mt-8">
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
          <ScrollView 
            ref={scrollRef}
            className="flex-1 px-6"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#14B8A6" />
            }
          >
            <Text className="text-lg font-bold text-navy mb-4">Recent Issues</Text>

            {loading ? (
              <View className="py-20">
                <ActivityIndicator size="large" color="#14B8A6" />
              </View>
            ) : issues.length === 0 ? (
              /* Empty State */
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
            ) : (
              issues.map((issue) => (
                <TouchableOpacity 
                  key={issue.id}
                  className="bg-white rounded-2xl p-5 shadow-soft border border-navy-50 mb-4"
                  onPress={() => router.push(`/sortout/${issue.id}`)}
                >
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-navy mb-1">
                        {issue.title}
                      </Text>
                      <Text className="text-xs text-navy-400">
                        {new Date(issue.created_at).toLocaleDateString(undefined, { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </Text>
                    </View>
                    <View className={`px-3 py-1 rounded-full ${getStatusColor(issue.status).split(' ')[0]}`}>
                      <Text className={`text-[10px] font-bold uppercase tracking-wider ${getStatusColor(issue.status).split(' ')[1]}`}>
                        {getStatusLabel(issue.status)}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="flex-row items-center mt-2">
                    <View className="flex-1 bg-navy-50 rounded-full h-2 overflow-hidden">
                      <View 
                        className="bg-teal h-2" 
                        style={{ width: `${issue.resolution_progress || 0}%` }} 
                      />
                    </View>
                    <Text className="ml-3 text-xs font-bold text-navy-500">
                      {issue.resolution_progress || 0}%
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
            <View className="h-10" />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
