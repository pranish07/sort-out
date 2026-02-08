import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '@/types';

interface PartnerStatusProps {
  partner: User;
}

export default function PartnerStatus({ partner }: PartnerStatusProps) {
  return (
    <View className="bg-white rounded-3xl p-5 shadow-soft flex-row items-center">
      <View className="w-16 h-16 bg-blush-100 rounded-full items-center justify-center">
        <Text className="text-2xl font-bold text-blush-500">
          {partner.displayName?.charAt(0).toUpperCase() || 'P'}
        </Text>
      </View>
      <View className="flex-1 ml-4">
        <Text className="text-lg font-bold text-navy">{partner.displayName}</Text>
        <View className="flex-row items-center mt-1">
          <View className="w-2 h-2 bg-sage-400 rounded-full" />
          <Text className="ml-2 text-sm text-navy-600">Active today</Text>
        </View>
      </View>
      <Ionicons name="heart" size={28} color="#FF998F" />
    </View>
  );
}
