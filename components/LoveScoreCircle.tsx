import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface LoveScoreCircleProps {
  score: number;
  isCompleted?: boolean;
}

export default function LoveScoreCircle({ score, isCompleted = true }: LoveScoreCircleProps) {
  const radius = 80;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  if (!isCompleted) {
    return (
      <View className="bg-white rounded-3xl p-6 items-center shadow-lg">
        <Text className="text-lg font-bold text-navy mb-4">Relationship Score</Text>
        <View className="w-40 h-40 bg-surface rounded-full items-center justify-center border-4 border-dashed border-teal/30">
          <Text className="text-teal text-4xl font-black">?</Text>
        </View>
        <Text className="mt-6 text-sm text-navy-400 text-center font-medium">
          Take the assessment better understand your connection score.
        </Text>
      </View>
    );
  }

  return (
    <View style={{
      backgroundColor: 'white',
      borderRadius: 24,
      padding: 24,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 16 }}>
        Love Score
      </Text>
      <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={200} height={200}>
          {/* Background circle */}
          <Circle
            cx={100}
            cy={100}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <Circle
            cx={100}
            cy={100}
            r={radius}
            stroke="#14B8A6"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            transform={`rotate(-90 100 100)`}
          />
        </Svg>
        <View style={{ position: 'absolute', alignItems: 'center' }}>
          <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#14B8A6' }}>
            {score}
          </Text>
          <Text style={{ fontSize: 14, color: '#64748B' }}>out of 100</Text>
        </View>
      </View>
      <Text style={{ marginTop: 16, fontSize: 14, color: '#64748B', textAlign: 'center' }}>
        Your relationship is doing great! 💕
      </Text>
    </View>
  );
}
