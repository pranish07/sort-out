import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { supabase } from '@/config/supabase';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ProfileEditScreen() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const [fullName, setFullName] = useState(user?.fullName || user?.displayName || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [gender, setGender] = useState(user?.gender || 'other');
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          display_name: fullName,
          dob: dob || null,
          gender: gender,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id)
        .select()
        .single();

      if (error) throw error;

      // Update store
      if (user) {
        setUser({
          ...user,
          fullName: data.full_name,
          displayName: data.display_name,
          dob: data.dob,
          gender: data.gender,
        });
      }

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      // Format as YYYY-MM-DD
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      setDob(`${year}-${month}-${day}`);
    }
  };

  const getInitialDate = () => {
    if (dob) {
      const parsed = new Date(dob);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return new Date(2000, 0, 1); // Default to Jan 1, 2000
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-teal pt-12 pb-8 px-6 rounded-b-[48px] shadow-lg">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => router.back()} className="mr-4">
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-white">Edit Profile</Text>
            </View>
            <TouchableOpacity 
              onPress={handleSave}
              disabled={loading}
              className="bg-white/20 px-4 py-2 rounded-full"
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-bold">Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 pt-6">
          <View className="bg-white rounded-3xl p-6 shadow-md mb-8">
            <View className="mb-6">
              <Text className="text-sm font-bold text-navy-400 mb-2 uppercase tracking-wider">Full Name</Text>
              <TextInput
                className="bg-surface p-4 rounded-xl text-navy font-medium text-base border border-beige-100"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your name"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-bold text-navy-400 mb-2 uppercase tracking-wider">Date of Birth</Text>
              <TouchableOpacity 
                onPress={() => setShowDatePicker(true)}
                className="bg-surface p-4 rounded-xl border border-beige-100 flex-row justify-between items-center"
              >
                <Text className={`text-base font-medium ${dob ? 'text-navy' : 'text-navy-400'}`}>
                  {dob || 'Select your birthday'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={getInitialDate()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            <View className="mb-4">
              <Text className="text-sm font-bold text-navy-400 mb-3 uppercase tracking-wider">Gender</Text>
              <View className="flex-row">
                {['male', 'female', 'other'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setGender(option as any)}
                    className={`flex-1 py-3 items-center rounded-xl mr-2 ${
                      gender === option ? 'bg-teal' : 'bg-surface border border-beige-100'
                    }`}
                  >
                    <Text className={`font-bold capitalize ${
                      gender === option ? 'text-white' : 'text-navy-600'
                    }`}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
