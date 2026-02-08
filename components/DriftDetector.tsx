import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DriftDetector() {
  const driftLevel = 'low'; // low, medium, high
  const daysWithoutIssue = 5;

  const getStatusColor = () => {
    switch (driftLevel) {
      case 'low': return '#22C55E';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      default: return '#22C55E';
    }
  };

  return (
    <View style={{
      backgroundColor: 'white',
      borderRadius: 24,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1E293B' }}>
          Drift Detector
        </Text>
        <View style={{
          backgroundColor: getStatusColor() + '20',
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 12,
        }}>
          <Text style={{ color: getStatusColor(), fontWeight: '600', fontSize: 12 }}>
            {driftLevel.toUpperCase()}
          </Text>
        </View>
      </View>
      
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: '#F0FDF4',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Ionicons name="shield-checkmark" size={24} color="#22C55E" />
        </View>
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B' }}>
            {daysWithoutIssue} days without issues
          </Text>
          <Text style={{ fontSize: 14, color: '#64748B' }}>
            Keep up the great communication!
          </Text>
        </View>
      </View>
    </View>
  );
}
