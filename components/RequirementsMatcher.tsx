import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RequirementsMatcher() {
  const requirements = [
    { label: 'Emotional Needs', user: 85, partner: 78, icon: 'heart-outline' },
    { label: 'Physical Affection', user: 72, partner: 88, icon: 'hand-left-outline' },
    { label: 'Communication', user: 90, partner: 85, icon: 'chatbubbles-outline' },
    { label: 'Adventure', user: 65, partner: 70, icon: 'rocket-outline' },
    { label: 'Quality Time', user: 95, partner: 92, icon: 'time-outline' },
  ];

  return (
    <View className="bg-white rounded-3xl p-6 shadow-soft-lg">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-lg font-bold text-navy">Requirements Matcher</Text>
        <View className="flex-row gap-4">
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-teal rounded-full" />
            <Text className="ml-2 text-xs font-bold text-navy-600">You</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-sage-400 rounded-full" />
            <Text className="ml-2 text-xs font-bold text-navy-600">Partner</Text>
          </View>
        </View>
      </View>
      
      {requirements.map((req, index) => (
        <View key={index} className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center flex-1">
              <Ionicons name={req.icon as any} size={18} color="#14B8A6" />
              <Text className="ml-2 text-sm font-semibold text-navy">{req.label}</Text>
            </View>
            <View className="flex-row items-center gap-4">
              <Text className="text-sm font-bold text-navy">{req.user}%</Text>
              <Text className="text-sm font-bold text-sage-500">{req.partner}%</Text>
            </View>
          </View>
          
          <View className="flex-row gap-2">
            {/* User Bar */}
            <View className="flex-1 bg-beige-100 rounded-full h-2 overflow-hidden">
              <View
                className="bg-teal rounded-full h-2"
                style={{ width: `${req.user}%` }}
              />
            </View>
            {/* Partner Bar */}
            <View className="flex-1 bg-beige-100 rounded-full h-2 overflow-hidden">
              <View
                className="bg-sage-400 rounded-full h-2"
                style={{ width: `${req.partner}%` }}
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
