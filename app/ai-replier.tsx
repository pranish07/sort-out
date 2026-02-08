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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function AIReplierScreen() {
  const router = useRouter();
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
    // Simulate AI generation
    setTimeout(() => {
      setReply("That looks amazing on you! 😍 You should definitely get it!");
      setLoading(false);
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-blush-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-4 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#1E293B" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-navy">AI Replier</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView className="flex-1 px-6">
          {/* Info */}
          <View className="bg-teal-50 rounded-2xl p-4 mb-6 flex-row">
            <Ionicons name="sparkles" size={24} color="#14B8A6" />
            <Text className="flex-1 ml-3 text-sm text-navy-700">
              Get a fun, cute AI-generated response as if from your partner. Perfect for outfit checks, gift ideas, or quick opinions!
            </Text>
          </View>

          {/* Context Input */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-navy mb-2">Context</Text>
            <TextInput
              className="bg-white rounded-2xl px-4 py-4 text-base text-navy shadow-md"
              placeholder="e.g., Should I buy this dress?"
              placeholderTextColor="#94A3B8"
              value={context}
              onChangeText={setContext}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Image Upload */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-navy mb-2">Upload Image (Optional)</Text>
            {imageUri ? (
              <View className="relative">
                <Image
                  source={{ uri: imageUri }}
                  className="w-full h-64 rounded-2xl"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  className="absolute top-3 right-3 w-10 h-10 bg-red-500 rounded-full items-center justify-center"
                  onPress={() => setImageUri(null)}
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                className="bg-white rounded-2xl p-8 shadow-md items-center border-2 border-dashed border-beige-200"
                onPress={pickImage}
              >
                <Ionicons name="image-outline" size={48} color="#CDB48C" />
                <Text className="text-navy-600 mt-2">Tap to upload image</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            className={`bg-teal rounded-2xl py-4 items-center shadow-md mb-6 ${
              loading || (!context.trim() && !imageUri) ? 'opacity-50' : ''
            }`}
            onPress={generateReply}
            disabled={loading || (!context.trim() && !imageUri)}
          >
            <Text className="text-white text-base font-bold">
              {loading ? 'Generating...' : 'Generate Reply'}
            </Text>
          </TouchableOpacity>

          {/* Reply */}
          {reply && (
            <View className="bg-white rounded-2xl p-5 shadow-lg">
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 bg-teal-100 rounded-full items-center justify-center">
                  <Ionicons name="chatbubble-ellipses" size={20} color="#14B8A6" />
                </View>
                <Text className="ml-3 text-base font-bold text-navy">AI Reply</Text>
              </View>
              <Text className="text-base text-navy-700 leading-6 mb-4">{reply}</Text>
              <TouchableOpacity className="bg-beige-100 rounded-2xl py-3 items-center">
                <Text className="text-navy font-semibold">Copy Reply</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
