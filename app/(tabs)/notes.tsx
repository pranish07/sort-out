import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function NotesScreen() {
  const [activeTab, setActiveTab] = useState<'shared' | 'private'>('shared');
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-blush-50">
      {/* Header */}
      <View className="px-6 pt-4 pb-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-3xl font-bold text-navy">Journal</Text>
          <TouchableOpacity className="w-12 h-12 bg-teal rounded-full items-center justify-center shadow-soft">
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="flex-row bg-white rounded-2xl p-1 shadow-soft">
          <TouchableOpacity
            className={`flex-1 py-3 rounded-xl ${
              activeTab === 'shared' ? 'bg-teal' : ''
            }`}
            onPress={() => setActiveTab('shared')}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === 'shared' ? 'text-white' : 'text-navy-600'
              }`}
            >
              Shared
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 rounded-xl ${
              activeTab === 'private' ? 'bg-teal' : ''
            }`}
            onPress={() => setActiveTab('private')}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === 'private' ? 'text-white' : 'text-navy-600'
              }`}
            >
              Private
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar Strip */}
      <View className="px-6 mb-4">
        <TouchableOpacity
          className="bg-white rounded-2xl p-4 shadow-soft flex-row items-center justify-between"
          onPress={() => setShowCalendar(!showCalendar)}
        >
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={20} color="#14B8A6" />
            <Text className="ml-2 text-navy font-medium">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
          </View>
          <Ionicons
            name={showCalendar ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#64748B"
          />
        </TouchableOpacity>
      </View>

      {/* Entries List */}
      <ScrollView className="flex-1 px-6">
        {/* Empty State */}
        <View className="items-center justify-center py-12">
          <View className="w-24 h-24 bg-beige-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="book-outline" size={48} color="#CDB48C" />
          </View>
          <Text className="text-xl font-bold text-navy mb-2">No Entries Yet</Text>
          <Text className="text-base text-navy-600 text-center px-8">
            Start journaling your journey together. Share moments, feelings, and memories.
          </Text>
        </View>

        {/* Reminders Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-navy">Reminders</Text>
            <TouchableOpacity>
              <Ionicons name="add-circle" size={24} color="#14B8A6" />
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-2xl p-4 shadow-soft">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-blush-100 rounded-full items-center justify-center">
                <Ionicons name="gift" size={24} color="#FF998F" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-base font-semibold text-navy">Partner's Birthday</Text>
                <Text className="text-sm text-navy-600">Coming up soon</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
