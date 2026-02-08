import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DailyTipCard() {
  const tip = "Take 5 minutes today to ask your partner about their day. Active listening strengthens emotional bonds.";

  return (
    <View style={{
      backgroundColor: '#14B8A6',
      borderRadius: 24,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <View style={{
          width: 40,
          height: 40,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Ionicons name="bulb" size={24} color="white" />
        </View>
        <Text style={{ marginLeft: 12, fontSize: 18, fontWeight: 'bold', color: 'white' }}>Daily Tip</Text>
      </View>
      <Text style={{ fontSize: 16, color: 'white', lineHeight: 24 }}>{tip}</Text>
    </View>
  );
}
