import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PairingScreen() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState('');
  const [generatedCode] = useState(() => {
    // Generate a simple invite code
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  });
  const [mode, setMode] = useState<'generate' | 'join'>('generate');

  const handleJoin = () => {
    if (!inviteCode.trim()) {
      Alert.alert('Error', 'Please enter an invite code');
      return;
    }
    // For offline mode, just simulate joining
    Alert.alert('Success', 'Partner paired successfully! (Demo mode)', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1">
        {/* Header */}
        <View style={{ padding: 24 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#1E293B" />
          </TouchableOpacity>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1E293B', marginTop: 16 }}>
            Pair with Partner
          </Text>
          <Text style={{ fontSize: 16, color: '#64748B', marginTop: 8 }}>
            Connect with your partner to start tracking together
          </Text>
        </View>

        {/* Mode Toggle */}
        <View style={{ flexDirection: 'row', marginHorizontal: 24, marginBottom: 24 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 12,
              backgroundColor: mode === 'generate' ? '#14B8A6' : '#E2E8F0',
              borderTopLeftRadius: 12,
              borderBottomLeftRadius: 12,
              alignItems: 'center',
            }}
            onPress={() => setMode('generate')}
          >
            <Text style={{ color: mode === 'generate' ? 'white' : '#64748B', fontWeight: '600' }}>
              Generate Code
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 12,
              backgroundColor: mode === 'join' ? '#14B8A6' : '#E2E8F0',
              borderTopRightRadius: 12,
              borderBottomRightRadius: 12,
              alignItems: 'center',
            }}
            onPress={() => setMode('join')}
          >
            <Text style={{ color: mode === 'join' ? 'white' : '#64748B', fontWeight: '600' }}>
              Join Partner
            </Text>
          </TouchableOpacity>
        </View>

        {mode === 'generate' ? (
          <View style={{ marginHorizontal: 24 }}>
            <View style={{
              backgroundColor: 'white',
              borderRadius: 24,
              padding: 32,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}>
              <Text style={{ fontSize: 16, color: '#64748B', marginBottom: 16 }}>
                Share this code with your partner
              </Text>
              
              {/* Code Display */}
              <View style={{
                backgroundColor: '#F0FDF4',
                paddingVertical: 24,
                paddingHorizontal: 48,
                borderRadius: 16,
                marginBottom: 24,
              }}>
                <Text style={{
                  fontSize: 36,
                  fontWeight: 'bold',
                  color: '#14B8A6',
                  letterSpacing: 8,
                }}>
                  {generatedCode}
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#14B8A6',
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 12,
                }}
                onPress={() => Alert.alert('Copied!', 'Code copied to clipboard')}
              >
                <Ionicons name="copy-outline" size={20} color="white" />
                <Text style={{ color: 'white', fontWeight: '600', marginLeft: 8 }}>
                  Copy Code
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={{ marginHorizontal: 24 }}>
            <View style={{
              backgroundColor: 'white',
              borderRadius: 24,
              padding: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}>
              <Text style={{ fontSize: 16, color: '#64748B', marginBottom: 16 }}>
                Enter the code from your partner
              </Text>
              
              <TextInput
                style={{
                  backgroundColor: '#F1F5F9',
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 24,
                  textAlign: 'center',
                  letterSpacing: 8,
                  color: '#1E293B',
                }}
                value={inviteCode}
                onChangeText={setInviteCode}
                placeholder="ABC123"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                maxLength={6}
              />

              <TouchableOpacity
                style={{
                  backgroundColor: '#14B8A6',
                  paddingVertical: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                  marginTop: 24,
                }}
                onPress={handleJoin}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                  Join Partner
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Info */}
        <View style={{ marginHorizontal: 24, marginTop: 24 }}>
          <View style={{
            backgroundColor: '#FEF3C7',
            borderRadius: 12,
            padding: 16,
            flexDirection: 'row',
          }}>
            <Ionicons name="information-circle" size={24} color="#D97706" />
            <Text style={{ flex: 1, marginLeft: 12, color: '#92400E', fontSize: 14 }}>
              Note: This is demo mode. In the full version, pairing would sync your data with your partner.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
