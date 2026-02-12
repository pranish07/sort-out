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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '@/store/userStore';
import { createIssue } from '@/services/sortout';
import { ActivityIndicator } from 'react-native';

export default function NewSortOutScreen() {
  const router = useRouter();
  const { user, partner } = useUserStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please provide a title for this issue');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please describe your perspective');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create an issue');
      return;
    }

    setLoading(true);
    try {
      await createIssue(user.id, partner?.id, title, description);
      Alert.alert(
        'Sort Out Created',
        'Your perspective has been saved. Your partner can now add theirs.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 40}
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-4 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="#1E293B" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-navy">New Sort Out</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView 
          className="flex-1 px-6"
          contentContainerClassName="pb-32"
          showsVerticalScrollIndicator={false}
        >
          {/* Info Card */}
          <View className="bg-teal-50 rounded-2xl p-4 mb-6 flex-row">
            <Ionicons name="information-circle" size={24} color="#14B8A6" />
            <Text className="flex-1 ml-3 text-sm text-navy-700">
              Share your perspective on the issue. Your partner will add theirs, then AI will provide balanced guidance.
            </Text>
          </View>

          {/* Title */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-navy mb-2">Issue Title</Text>
            <TextInput
              className="bg-white rounded-2xl px-4 py-4 text-base text-navy shadow-md"
              placeholder="e.g., Communication about work stress"
              placeholderTextColor="#94A3B8"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-navy mb-2">Your Perspective</Text>
            <TextInput
              className="bg-white rounded-2xl px-4 py-4 text-base text-navy shadow-md"
              placeholder="Describe how you see the situation and how it makes you feel..."
              placeholderTextColor="#94A3B8"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              style={{ minHeight: 160 }}
            />
          </View>

          {/* Voice Note */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-navy mb-2">Voice Note (Optional)</Text>
            <TouchableOpacity
              className={`rounded-2xl p-6 shadow-md items-center ${
                isRecording ? 'bg-red-50' : 'bg-white'
              }`}
              onPress={() => setIsRecording(!isRecording)}
            >
              <View
                className={`w-16 h-16 rounded-full items-center justify-center mb-3 ${
                  isRecording ? 'bg-red-500' : 'bg-teal-100'
                }`}
              >
                <Ionicons
                  name={isRecording ? 'stop' : 'mic'}
                  size={32}
                  color={isRecording ? 'white' : '#14B8A6'}
                />
              </View>
              <Text className={`font-semibold ${isRecording ? 'text-red-500' : 'text-navy'}`}>
                {isRecording ? 'Stop Recording' : 'Record Voice Note'}
              </Text>
              {isRecording && (
                <Text className="text-sm text-navy-600 mt-1">00:15</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View className="px-6 pb-6 pt-4 bg-surface">
          <TouchableOpacity
            className={`bg-teal rounded-2xl py-4 items-center shadow-md ${
              !title.trim() || !description.trim() || loading ? 'opacity-50' : ''
            }`}
            onPress={handleSubmit}
            disabled={!title.trim() || !description.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-base font-bold">Submit My Perspective</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
