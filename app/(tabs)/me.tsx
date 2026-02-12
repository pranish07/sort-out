import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { signOut } from '@/services/auth';
import { breakup } from '@/services/pairing';
import { Ionicons } from '@expo/vector-icons';

export default function MeScreen() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const partner = useUserStore((state) => state.partner);
  const clearAll = useUserStore((state) => state.clearAll);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [driftAlertsEnabled, setDriftAlertsEnabled] = useState(true);
  const scrollRef = useRef<ScrollView>(null);

  useScrollToTop(scrollRef);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)/login');
              setTimeout(() => {
                clearAll();
              }, 100);
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const handleBreakup = async () => {
    Alert.alert(
      'End Relationship',
      'Are you absolutely sure you want to end your relationship connection? This will remove your partner from your profile and delete your shared history.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Relationship',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await breakup();
              if (result.success) {
                // Update local state - clear partner and couple
                useUserStore.setState({ partner: null, couple: null });
                Alert.alert('Success', 'Relationship ended successfully.');
              } else {
                Alert.alert('Error', result.message);
              }
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-teal pt-12 pb-16 px-6 rounded-b-[48px] shadow-lg">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white/80 text-lg font-medium">Your Profile</Text>
              <Text className="text-3xl font-bold text-white">Settings</Text>
            </View>
            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center border border-white/30">
              <Ionicons name="person-circle" size={32} color="white" />
            </View>
          </View>
        </View>

        <ScrollView ref={scrollRef} className="flex-1 -mt-8">

        {/* Profile Section */}
        <View className="px-6 mb-6">
          <View className="bg-white rounded-3xl p-6 shadow-md">
            <View className="items-center mb-4">
              <View className="w-24 h-24 bg-teal-100 rounded-full items-center justify-center mb-3">
                <Text className="text-4xl font-bold text-teal">
                  {user?.fullName?.charAt(0).toUpperCase() || user?.displayName?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <Text className="text-2xl font-bold text-navy">{user?.fullName || user?.displayName}</Text>
              <Text className="text-base text-navy-600">{user?.email}</Text>
              {user?.dob && (
                <Text className="text-sm text-navy-400 mt-1">Born: {user.dob}</Text>
              )}
            </View>

            {partner ? (
              <View className="bg-sage-50 rounded-2xl p-4 flex-row items-center">
                <View className="w-12 h-12 bg-sage-200 rounded-full items-center justify-center">
                  <Text className="text-xl font-bold text-sage-500">
                    {partner.fullName?.charAt(0).toUpperCase() || partner.displayName?.charAt(0).toUpperCase() || 'P'}
                  </Text>
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-sm font-semibold text-navy">Paired with</Text>
                  <Text className="text-base font-bold text-navy">{partner.fullName || partner.displayName}</Text>
                </View>
                <Ionicons name="heart" size={24} color="#95BD95" />
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                className="bg-teal rounded-2xl py-4 items-center active:bg-teal-600"
                onPress={() => router.push('/pairing')}
              >
                <Text className="text-white font-bold">Pair with Partner</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* AI Replier */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-navy mb-3">Tools</Text>
          <TouchableOpacity
            className="bg-white rounded-2xl p-4 shadow-md flex-row items-center"
            onPress={() => router.push('/ai-replier')}
          >
            <View className="w-12 h-12 bg-teal-100 rounded-full items-center justify-center">
              <Ionicons name="sparkles" size={24} color="#14B8A6" />
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-base font-bold text-navy">AI Replier</Text>
              <Text className="text-sm text-navy-600">Get AI-generated responses</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-navy mb-3">Notifications</Text>
          <View className="bg-white rounded-2xl p-4 shadow-md">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-base font-semibold text-navy">Push Notifications</Text>
                <Text className="text-sm text-navy-600">Receive app notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E2E8F0', true: '#14B8A6' }}
                thumbColor="white"
              />
            </View>
            <View className="h-px bg-beige-100 mb-4" />
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-semibold text-navy">Drift Alerts</Text>
                <Text className="text-sm text-navy-600">Get notified about potential drift</Text>
              </View>
              <Switch
                value={driftAlertsEnabled}
                onValueChange={setDriftAlertsEnabled}
                trackColor={{ false: '#E2E8F0', true: '#14B8A6' }}
                thumbColor="white"
              />
            </View>
          </View>
        </View>

        {/* Account */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-navy mb-3">Account</Text>
          <View className="bg-white rounded-2xl shadow-md overflow-hidden">
            <TouchableOpacity 
                className="p-4 flex-row items-center justify-between"
                onPress={() => router.push('/profile-edit')}
            >
              <View className="flex-row items-center">
                <Ionicons name="person-outline" size={20} color="#1E293B" />
                <Text className="ml-3 text-base font-medium text-navy">Edit Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>
            <View className="h-px bg-beige-100 mx-4" />
            <TouchableOpacity 
                className="p-4 flex-row items-center justify-between"
                onPress={() => router.push('/privacy')}
            >
              <View className="flex-row items-center">
                <Ionicons name="lock-closed-outline" size={20} color="#1E293B" />
                <Text className="ml-3 text-base font-medium text-navy">Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>
            <View className="h-px bg-beige-100 mx-4" />
            <TouchableOpacity className="p-4 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="diamond-outline" size={20} color="#14B8A6" />
                <Text className="ml-3 text-base font-medium text-navy">Upgrade to Premium</Text>
              </View>
              <View className="bg-teal-100 px-2 py-1 rounded-full">
                <Text className="text-xs font-bold text-teal">PRO</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Relationship Status */}
        {partner && (
          <View className="px-6 mb-6">
            <Text className="text-lg font-bold text-navy mb-3">Relationship</Text>
            <TouchableOpacity
              className="bg-white rounded-2xl p-4 shadow-md flex-row items-center justify-center border border-red-100"
              onPress={handleBreakup}
            >
              <Ionicons name="heart-dislike-outline" size={20} color="#EF4444" />
              <Text className="ml-2 text-base font-bold text-red-500">End Relationship</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Sign Out */}
        <View className="px-6 mb-8">
          <TouchableOpacity
            className="bg-white rounded-2xl p-4 shadow-md flex-row items-center justify-center"
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text className="ml-2 text-base font-bold text-red-500">Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="px-6 pb-8 items-center">
          <Text className="text-sm text-navy-500">Sort Out v1.0.0</Text>
          <Text className="text-xs text-navy-400 mt-1">Made with ❤️ for couples</Text>
        </View>
      </ScrollView>
    </View>
  </SafeAreaView>
);
}
