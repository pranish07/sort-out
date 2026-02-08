import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type Category = 'all' | 'male-needs' | 'female-needs' | 'communication' | 'drift-prevention' | 'intimacy' | 'conflict-resolution';

export default function GuidesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all' as Category, label: 'All', icon: 'apps' },
    { id: 'male-needs' as Category, label: 'Male Needs', icon: 'male' },
    { id: 'female-needs' as Category, label: 'Female Needs', icon: 'female' },
    { id: 'communication' as Category, label: 'Communication', icon: 'chatbubbles' },
    { id: 'drift-prevention' as Category, label: 'Drift Prevention', icon: 'shield-checkmark' },
    { id: 'intimacy' as Category, label: 'Intimacy', icon: 'heart' },
    { id: 'conflict-resolution' as Category, label: 'Conflict', icon: 'people' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-6 pt-4 pb-4">
        <Text className="text-3xl font-bold text-navy mb-4">Guides</Text>

        {/* Search Bar */}
        <View className="bg-beige-100 rounded-2xl px-4 py-3 shadow-soft flex-row items-center mb-4">
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput
            className="flex-1 ml-2 text-base text-navy"
            placeholder="Search guides..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          <View className="flex-row gap-2">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                activeOpacity={0.8}
                className={`px-4 py-2 rounded-full flex-row items-center ${
                  selectedCategory === category.id ? 'bg-teal' : 'bg-beige-100'
                }`}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Ionicons
                  name={category.icon as any}
                  size={16}
                  color={selectedCategory === category.id ? 'white' : '#1E293B'}
                />
                <Text
                  className={`ml-2 text-sm font-semibold ${
                    selectedCategory === category.id ? 'text-white' : 'text-navy'
                  }`}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Guides List */}
      <ScrollView className="flex-1 px-6">
        {/* Featured Guide */}
        <View className="bg-gradient-to-br from-teal to-teal-600 rounded-3xl p-6 shadow-soft-lg mb-6">
          <View className="flex-row items-start justify-between mb-3">
            <View className="bg-white/20 px-3 py-1 rounded-full">
              <Text className="text-xs font-bold text-white">FEATURED</Text>
            </View>
            <Ionicons name="bookmark-outline" size={24} color="white" />
          </View>
          <Text className="text-2xl font-bold text-white mb-2">
            Understanding Male vs Female Needs
          </Text>
          <Text className="text-base text-white/90 mb-4">
            Learn the fundamental differences in emotional and physical needs between partners
          </Text>
          <TouchableOpacity 
            activeOpacity={0.8}
            className="bg-surface rounded-2xl py-3 items-center active:bg-gray-100"
          >
            <Text className="text-teal font-bold">Read Guide</Text>
          </TouchableOpacity>
        </View>

        {/* Guide Cards */}
        <Text className="text-lg font-bold text-navy mb-3">Popular Guides</Text>

        {[
          {
            title: 'Preventing Emotional Drift',
            category: 'Drift Prevention',
            type: 'article',
            duration: '8 min read',
            icon: 'shield-checkmark',
          },
          {
            title: 'Communication Styles Quiz',
            category: 'Communication',
            type: 'quiz',
            duration: '5 questions',
            icon: 'help-circle',
          },
          {
            title: 'Conflict Resolution Strategies',
            category: 'Conflict Resolution',
            type: 'video',
            duration: '12 min',
            icon: 'play-circle',
          },
        ].map((guide, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white rounded-2xl p-4 shadow-soft mb-3 flex-row items-center"
          >
            <View className="w-14 h-14 bg-teal-100 rounded-2xl items-center justify-center">
              <Ionicons name={guide.icon as any} size={28} color="#14B8A6" />
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-base font-bold text-navy mb-1">{guide.title}</Text>
              <View className="flex-row items-center">
                <Text className="text-sm text-navy-600">{guide.category}</Text>
                <View className="w-1 h-1 bg-navy-400 rounded-full mx-2" />
                <Text className="text-sm text-navy-600">{guide.duration}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
