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
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { generateAIReply } from '@/services/ai';
import { useUserStore } from '@/store/userStore';

export default function AIReplierScreen() {
  const router = useRouter();
  const { partner } = useUserStore();
  const [context, setContext] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const generateReply = async () => {
    if (!context.trim() && !imageUri) {
      Alert.alert('Error', 'Please provide context or upload an image');
      return;
    }

    setLoading(true);
    setReply('');
    try {
      const generatedReply = await generateAIReply(
        context,
        partner?.gender === 'female' ? 'female' : partner?.gender === 'male' ? 'male' : 'other',
        imageUri ? 'An image was attached' : undefined
      );
      setReply(generatedReply);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to generate AI reply');
      console.error(error);
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
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center bg-white rounded-full shadow-sm border border-navy-100"
          >
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-navy">AI Replier</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          className="flex-1 px-6"
          contentContainerClassName="pb-32 pt-2"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Info Card - more elegant */}
          <View className="bg-teal-50/50 rounded-3xl p-5 mb-8 flex-row items-start border border-teal-100">
            <View className="w-10 h-10 bg-teal-100 rounded-2xl items-center justify-center">
              <Ionicons name="sparkles" size={22} color="#14B8A6" />
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-navy font-bold text-sm mb-1">Instant Partner Response</Text>
              <Text className="text-navy-600 text-xs leading-5">
                Get a fun, cute AI-generated response as if from your partner. Perfect for outfit checks or gift ideas!
              </Text>
            </View>
          </View>

          {/* Context Input */}
          <View className="mb-6">
            <Text className="text-sm font-bold text-navy mb-3 ml-1">What's on your mind?</Text>
            <View className="bg-white rounded-[24px] shadow-soft border border-navy-50 overflow-hidden">
              <TextInput
                className="px-5 py-5 text-base text-navy"
                placeholder="e.g., How do I look in this dress?"
                placeholderTextColor="#94A3B8"
                value={context}
                onChangeText={setContext}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                style={{ minHeight: 100 }}
              />
            </View>
          </View>

          {/* Image Upload */}
          <View className="mb-8">
            <Text className="text-sm font-bold text-navy mb-3 ml-1">Add a photo (Optional)</Text>
            {imageUri ? (
              <View className="relative shadow-lg rounded-3xl overflow-hidden bg-white border border-navy-50">
                <Image
                  source={{ uri: imageUri }}
                  className="w-full h-72"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-md"
                  onPress={() => setImageUri(null)}
                >
                  <Ionicons name="close" size={24} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                className="bg-white rounded-[32px] p-10 shadow-soft items-center border-2 border-dashed border-teal-100"
                onPress={pickImage}
                activeOpacity={0.7}
              >
                <View className="w-16 h-16 bg-teal-50 rounded-full items-center justify-center mb-4">
                  <Ionicons name="camera" size={32} color="#14B8A6" />
                </View>
                <Text className="text-navy font-semibold text-base">Tap to add photo</Text>
                <Text className="text-navy-400 text-xs mt-1">PNG, JPG up to 10MB</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Generate Button - Enhanced */}
          <View className="mb-8">
            <TouchableOpacity
              className={`bg-teal rounded-2xl py-5 items-center shadow-lg transform active:scale-95 transition-all ${
                loading || (!context.trim() && !imageUri) ? 'opacity-50' : ''
              }`}
              onPress={generateReply}
              disabled={loading || (!context.trim() && !imageUri)}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                {loading ? (
                  <ActivityIndicator color="white" className="mr-3" />
                ) : (
                  <Ionicons name="sparkles-outline" size={20} color="white" className="mr-3" />
                )}
                <Text className="text-white text-lg font-bold ml-2">
                  {loading ? 'AI is thinking...' : 'Generate AI Reply'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Reply Section - Much more premium */}
          {reply && (
            <View className="bg-white rounded-[32px] p-6 shadow-soft-lg border border-teal-50 overflow-hidden">
              <View className="absolute -top-10 -right-10 w-32 h-32 bg-teal-50/30 rounded-full" />
              
              <View className="flex-row items-center mb-5">
                <View className="w-12 h-12 bg-teal rounded-2xl items-center justify-center shadow-soft">
                  <Ionicons name="chatbubble-ellipses" size={24} color="white" />
                </View>
                <View className="ml-4">
                  <Text className="text-navy font-bold text-lg">Magic Reply</Text>
                  <Text className="text-teal-600 text-xs font-semibold uppercase tracking-wider">AI Generated</Text>
                </View>
              </View>

              <View className="bg-teal-50/30 p-5 rounded-2xl border border-teal-50 mb-6">
                <Text className="text-navy-800 text-lg leading-relaxed font-medium italic">
                  "{reply}"
                </Text>
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity 
                  className="flex-1 bg-navy rounded-2xl py-4 items-center shadow-sm"
                  onPress={() => Alert.alert('Copied!', 'Reply copied to clipboard')}
                >
                  <View className="flex-row items-center">
                    <Ionicons name="copy-outline" size={18} color="white" />
                    <Text className="text-white font-bold ml-2">Copy Reply</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="w-14 h-14 bg-white border border-navy-100 rounded-2xl items-center justify-center shadow-sm"
                  onPress={generateReply}
                >
                  <Ionicons name="refresh" size={22} color="#0F172A" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Padding for Scroll */}
          <View className="h-10" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
