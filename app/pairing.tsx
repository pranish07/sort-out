import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '@/store/userStore';
import { generatePairingCode, getActivePairingCode, usePairingCode } from '@/services/pairing';
import { syncUser } from '@/services/auth';
import { ActivityIndicator } from 'react-native';
import { useEffect } from 'react';

export default function PairingScreen() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const setPartner = useUserStore((state) => state.setPartner);
  
  const [inviteCode, setInviteCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'generate' | 'join'>('generate');

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const active = await getActivePairingCode();
        if (active) {
          setGeneratedCode(active.code);
        }
      } catch (error) {
        console.error('Error fetching active code:', error);
      }
    };
    fetchCode();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const codeData = await generatePairingCode();
      setGeneratedCode(codeData.code);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!inviteCode.trim() || inviteCode.length < 6) {
      Alert.alert('Error', 'Please enter a valid 6-character invite code');
      return;
    }
    
    setLoading(true);
    try {
      const result = await usePairingCode(inviteCode);
      if (result.success) {
        // Sync user data to get partner info
        const syncResult = await syncUser();
        if (syncResult) {
          setUser(syncResult.user);
          setPartner(syncResult.partner);
        }
        
        Alert.alert('Success', 'Partner paired successfully!', [
          { text: 'OK', onPress: () => router.replace('/(tabs)/me') }
        ]);
      } else {
        Alert.alert('Pairing Failed', result.message);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 40}
      >
        <ScrollView 
          className="flex-1"
          contentContainerClassName="pb-12"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
                  minWidth: 200,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {loading ? (
                    <ActivityIndicator color="#14B8A6" size="large" />
                  ) : generatedCode ? (
                    <Text style={{
                      fontSize: 36,
                      fontWeight: 'bold',
                      color: '#14B8A6',
                      letterSpacing: 8,
                    }}>
                      {generatedCode}
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={handleGenerate}>
                      <Text style={{ color: '#14B8A6', fontWeight: '700' }}>Tap to Generate</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {generatedCode && !loading && (
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
                )}
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
              backgroundColor: '#F0FDFA',
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
            }}>
              <Ionicons name="shield-checkmark" size={24} color="#14B8A6" />
              <Text style={{ flex: 1, marginLeft: 12, color: '#134E48', fontSize: 14 }}>
                Unique pairing codes ensure only you and your partner can connect. Only two people can be in a group.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
