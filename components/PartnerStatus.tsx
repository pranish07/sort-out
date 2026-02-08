import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '@/types';

interface PartnerStatusProps {
  partner: User | null;
}

export default function PartnerStatus({ partner }: PartnerStatusProps) {
  if (!partner) {
    return (
      <View className="bg-white rounded-3xl p-5 shadow-md flex-row items-center border border-beige-100">
        <View className="w-16 h-16 bg-beige-100 rounded-full items-center justify-center">
          <Ionicons name="person" size={32} color="#94A3B8" />
        </View>
        <View className="flex-1 ml-4">
          <Text className="text-xs font-bold text-navy-400 uppercase tracking-widest">Partner Status</Text>
          <Text className="text-lg font-bold text-navy mt-1">Not paired yet</Text>
        </View>
        <TouchableOpacity className="bg-teal px-6 py-2 rounded-xl">
          <Text className="text-white font-bold">Pair</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-3xl p-5 shadow-md flex-row items-center">
      <View className="w-16 h-16 bg-blush-100 rounded-full items-center justify-center">
        <Text className="text-2xl font-bold text-blush-500">
          {partner.displayName?.charAt(0).toUpperCase() || 'P'}
        </Text>
      </View>
      <View className="flex-1 ml-4">
        <View className="flex-row items-center">
            <Text className="text-xs font-bold text-navy-400 uppercase tracking-widest">Partner Status</Text>
        </View>
        <Text className="text-lg font-bold text-navy mt-1">{partner.displayName}</Text>
        <View className="flex-row items-center mt-1">
          <View className="w-2 h-2 bg-sage-400 rounded-full" />
          <Text className="ml-2 text-sm text-navy-600">Active today</Text>
        </View>
      </View>
      <Ionicons name="heart" size={28} color="#FF998F" />
    </View>
  );
}
