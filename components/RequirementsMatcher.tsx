import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '@/store/userStore';

export default function RequirementsMatcher() {
  const userAssessment = useUserStore((state) => state.userAssessment);
  const partnerAssessment = useUserStore((state) => state.partnerAssessment);

  const requirements = [
    { label: 'Emotional Needs', user: userAssessment?.['Emotional Needs'] || 0, partner: partnerAssessment?.['Emotional Needs'] || 0, icon: 'heart-outline' },
    { label: 'Physical Affection', user: userAssessment?.['Physical Affection'] || 0, partner: partnerAssessment?.['Physical Affection'] || 0, icon: 'hand-left-outline' },
    { label: 'Communication', user: userAssessment?.['Communication'] || 0, partner: partnerAssessment?.['Communication'] || 0, icon: 'chatbubbles-outline' },
    { label: 'Adventure', user: userAssessment?.['Adventure'] || 0, partner: partnerAssessment?.['Adventure'] || 0, icon: 'rocket-outline' },
    { label: 'Quality Time', user: userAssessment?.['Quality Time'] || 0, partner: partnerAssessment?.['Quality Time'] || 0, icon: 'time-outline' },
  ];

  const isCompleted = !!userAssessment;

  if (!isCompleted) {
    return (
      <View className="bg-white rounded-3xl p-6 shadow-lg">
        <Text className="text-lg font-bold text-navy mb-4">Requirements Matcher</Text>
        <View className="bg-surface rounded-2xl p-6 items-center border border-dashed border-teal/30">
            <Ionicons name="git-compare" size={32} color="#14B8A6" />
            <Text className="mt-3 text-sm text-navy-400 text-center font-bold">Please take the test to see how you match with your partner's core needs.</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-3xl p-6 shadow-lg">
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
