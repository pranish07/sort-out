import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '@/store/userStore';
import { getIssueById, submitPartnerPerspective, saveAIAnalysis } from '@/services/sortout';
import { analyzeRelationshipIssue } from '@/services/ai';

export default function IssueDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useUserStore();

  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(false);
  const [perspective, setPerspective] = useState('');

  const fetchIssue = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getIssueById(id);
      setIssue(data);
      
      // If both submitted but not analyzed, trigger AI
      if (
        data.user1_submission?.text && 
        data.user2_submission?.text && 
        data.status !== 'resolved' && 
        !data.ai_analysis?.balancedView &&
        !analyzing &&
        !analysisError
      ) {
        handleAIAnalysis(data);
      }
    } catch (error) {
      console.error('Error fetching issue:', error);
      Alert.alert('Error', 'Failed to load issue details');
    } finally {
      setLoading(false);
    }
  }, [id, analyzing]);

  useEffect(() => {
    fetchIssue();
  }, [fetchIssue]);

  const handlePartnerSubmit = async () => {
    if (!perspective.trim()) {
      Alert.alert('Error', 'Please provide your perspective');
      return;
    }

    setSubmitting(true);
    try {
      const updatedIssue = await submitPartnerPerspective(id, perspective);
      setIssue(updatedIssue);
      setPerspective('');
      // AI will be triggered via the useEffect/fetchIssue logic or directly
      handleAIAnalysis(updatedIssue);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit perspective');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAIAnalysis = async (currentIssue: any) => {
    if (analyzing) return;
    setAnalyzing(true);
    try {
      const analysisData = await analyzeRelationshipIssue({
        issue: currentIssue.title,
        user1Perspective: currentIssue.user1_submission.text,
        user2Perspective: currentIssue.user2_submission.text,
        user1Gender: 'other', // Ideally fetch from profiles
        user2Gender: 'other',
      });
      const finalIssue = await saveAIAnalysis(currentIssue.id, analysisData);
      setIssue(finalIssue);
    } catch (error) {
      console.error('AI Analysis failed:', error);
      setAnalysisError(true);
      // Don't alert here to avoid spamming since this can be triggered on mount
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#14B8A6" />
      </SafeAreaView>
    );
  }

  const isPartner = user?.id === issue.partner_id || (user?.id !== issue.user_id && !!issue.partner_id);
  const hasUser2Submitted = !!issue.user2_submission?.text;
  const isPendingPartner = !hasUser2Submitted && (user?.id === issue.partner_id || isPartner);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 40}
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-4 flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center bg-white rounded-full shadow-soft border border-navy-100"
          >
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-navy flex-1 text-center mx-4" numberOfLines={1}>
            {issue.title}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          className="flex-1 px-6"
          contentContainerClassName="pb-32 pt-2"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Status Badge */}
          <View className="flex-row justify-center mb-6">
            {analyzing ? (
              <View className="bg-play-50 px-4 py-2 rounded-full border border-play-100 flex-row items-center">
                <ActivityIndicator size="small" color="#A855F7" className="mr-2" />
                <Text className="text-play-700 font-bold uppercase tracking-wider text-[10px]">AI is Analyzing...</Text>
              </View>
            ) : (
              <View className={`${issue.status === 'resolved' ? 'bg-teal-50 border-teal-100' : 'bg-orange-50 border-orange-100'} px-4 py-2 rounded-full border flex-row items-center`}>
                <View className={`w-2 h-2 rounded-full mr-2 ${issue.status === 'resolved' ? 'bg-teal' : 'bg-orange-400'}`} />
                <Text className={`${issue.status === 'resolved' ? 'text-teal-700' : 'text-orange-700'} font-bold uppercase tracking-wider text-[10px]`}>
                  {issue.status === 'resolved' ? 'Resolution Ready' : 'In Progress'}
                </Text>
              </View>
            )}
          </View>

          {/* Submissions Section */}
          <View className="gap-6 mb-8">
            {/* User 1 Perspective */}
            <View className="bg-white rounded-[32px] p-6 shadow-soft border border-navy-50">
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 bg-navy-50 rounded-2xl items-center justify-center">
                  <Ionicons name="person" size={20} color="#0F172A" />
                </View>
                <Text className="ml-3 font-bold text-navy">Initial Perspective</Text>
              </View>
              <Text className="text-navy-700 leading-relaxed text-base italic">
                "{issue.user1_submission?.text}"
              </Text>
            </View>

            {/* User 2 Perspective / Submission Form */}
            {hasUser2Submitted ? (
              <View className="bg-white rounded-[32px] p-6 shadow-soft border border-navy-50">
                <View className="flex-row items-center mb-4">
                  <View className="w-10 h-10 bg-teal-50 rounded-2xl items-center justify-center">
                    <Ionicons name="heart" size={20} color="#14B8A6" />
                  </View>
                  <Text className="ml-3 font-bold text-navy">Partner's Perspective</Text>
                </View>
                <Text className="text-navy-700 leading-relaxed text-base italic">
                  "{issue.user2_submission?.text}"
                </Text>
              </View>
            ) : isPendingPartner ? (
              <View className="bg-white rounded-[32px] p-6 shadow-soft border border-teal-100">
                <View className="flex-row items-center mb-4">
                  <View className="w-10 h-10 bg-teal-50 rounded-2xl items-center justify-center">
                    <Ionicons name="create-outline" size={20} color="#14B8A6" />
                  </View>
                  <Text className="ml-3 font-bold text-navy">Add Your Perspective</Text>
                </View>
                <Text className="text-navy-600 text-sm mb-4">
                  Help the AI understand your side of the situation. Be honest and empathetic.
                </Text>
                <View className="bg-beige-50 rounded-2xl p-4 mb-4">
                  <TextInput
                    className="text-navy text-base min-h-[120]"
                    placeholder="How do you feel about this situation?"
                    placeholderTextColor="#94A3B8"
                    value={perspective}
                    onChangeText={setPerspective}
                    multiline
                    textAlignVertical="top"
                  />
                </View>
                <TouchableOpacity
                  className={`bg-teal rounded-2xl py-4 items-center shadow-md ${submitting ? 'opacity-50' : ''}`}
                  onPress={handlePartnerSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-bold">Submit Perspective</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View className="bg-navy-50/50 rounded-[32px] p-8 items-center border border-dashed border-navy-200">
                <Ionicons name="time-outline" size={32} color="#94A3B8" />
                <Text className="text-navy-500 font-bold mt-3">Waiting for Partner</Text>
                <Text className="text-navy-400 text-xs text-center mt-1 px-4">
                  AI analysis will begin as soon as your partner adds their perspective.
                </Text>
              </View>
            )}
          </View>

          {/* AI Analysis Result */}
          {issue.ai_analysis?.balancedView && (
            <View className="gap-6">
              <View className="bg-teal-50/30 rounded-[32px] p-6 shadow-soft border border-teal-100 overflow-hidden">
                <View className="absolute -top-10 -right-10 w-32 h-32 bg-teal-50/30 rounded-full" />
                
                <View className="flex-row items-center mb-5">
                  <View className="w-12 h-12 bg-teal rounded-2xl items-center justify-center shadow-soft">
                    <Ionicons name="sparkles" size={24} color="white" />
                  </View>
                  <View className="ml-4">
                    <Text className="text-navy font-bold text-lg">AI Resolution Guide</Text>
                    <Text className="text-teal-600 text-xs font-semibold uppercase tracking-wider">Balanced Guidance</Text>
                  </View>
                </View>

                <Text className="text-navy-800 text-base leading-relaxed mb-6">
                  {issue.ai_analysis.balancedView}
                </Text>

                <View className="bg-white/80 p-5 rounded-2xl border border-teal-50 mb-6">
                  <Text className="text-navy font-bold mb-2">Resolution Ideas</Text>
                  {issue.ai_analysis.suggestions?.map((suggestion: string, index: number) => (
                    <View key={index} className="flex-row items-start mb-3">
                      <View className="w-5 h-5 bg-teal-100 rounded-full items-center justify-center mr-3 mt-1">
                        <Text className="text-teal-700 text-[10px] font-bold">{index + 1}</Text>
                      </View>
                      <Text className="flex-1 text-navy-700 text-sm leading-5">{suggestion}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity 
                  className="bg-navy rounded-2xl py-5 items-center shadow-soft"
                  onPress={() => Alert.alert('Premium Chat', 'Detailed chat for each suggestion is coming soon to Premium!')}
                >
                  <View className="flex-row items-center">
                    <Ionicons name="chatbubbles" size={20} color="white" />
                    <Text className="text-white font-bold ml-2">Discuss these Ideas</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Spacer */}
          <View className="h-10" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
