import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface LoveScoreCircleProps {
  score: number;
}

export default function LoveScoreCircle({ score }: LoveScoreCircleProps) {
  const radius = 80;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

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
