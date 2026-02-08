import { View, TouchableOpacity, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#14B8A6',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          paddingTop: 8,
          paddingBottom: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'Notes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sortout"
        options={{
          tabBarLabel: 'Sort Out',
          tabBarButton: (props: any) => {
            const { accessibilityState, onPress } = props;
            const focused = accessibilityState?.selected;

            return (
              <View className="flex-1 items-center justify-center">
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={onPress}
                  style={{
                    top: -10, // Adjust height
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View 
                    style={{
                      width: 60,
                      height: 60,
                      backgroundColor: '#14B8A6',
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                      shadowColor: '#14B8A6',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 5,
                      borderWidth: 4,
                      borderColor: '#FFFFFF',
                    }}
                  >
                    <Ionicons name="flash" size={28} color="white" />
                  </View>
                  <Text 
                    className="text-[10px] font-bold mt-1"
                    style={{ color: '#14B8A6' }}
                  >
                    Sort Out
                  </Text>
                </TouchableOpacity>
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="guides"
        options={{
          title: 'Guides',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: 'Me',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
