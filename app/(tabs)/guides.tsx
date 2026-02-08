import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
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
    <SafeAreaView className="flex-1 bg-surface font-outfit">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-4 pb-2">
          <Text className="text-3xl font-bold text-navy tracking-tight">Learn & Grow</Text>
          <Text className="text-base text-navy-500 mt-1">Expert guidance for your relationship</Text>
        </View>

        {/* Search Bar */}
        <View className="px-6 mt-4">
          <View className="bg-white rounded-3xl px-5 py-4 shadow-soft flex-row items-center border border-surface-200">
            <Ionicons name="search" size={20} color="#94A3B8" />
            <TextInput
              className="flex-1 ml-3 text-base text-navy font-medium"
              placeholder="Search guides..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Category Pills */}
        <View className="mt-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6">
            <View className="flex-row gap-3 pr-12">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  activeOpacity={0.8}
                  className={`px-5 py-3 rounded-2xl flex-row items-center shadow-sm ${
                    selectedCategory === category.id ? 'bg-teal shadow-teal/30' : 'bg-white border border-surface-200'
                  }`}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={18}
                    color={selectedCategory === category.id ? 'white' : '#14B8A6'}
                  />
                  <Text
                    className={`ml-2 text-sm font-bold ${
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

        {/* Featured Guide */}
        <View className="px-6 mt-8">
          <TouchableOpacity 
            activeOpacity={0.9}
            className="bg-teal rounded-[32px] overflow-hidden shadow-teal/40 shadow-2xl"
          >
            {/* Background Texture/Accent */}
            <View className="absolute right-[-20] top-[-20] opacity-20 transform rotate-12">
              <Ionicons name="sparkles" size={200} color="white" />
            </View>

            <View className="p-7">
              <View className="flex-row items-center mb-4">
                <View className="bg-white/20 px-3 py-1.5 rounded-full border border-white/30">
                  <Text className="text-[10px] font-bold text-white tracking-widest uppercase text-center">Featured Course</Text>
                </View>
                <View className="ml-2 flex-row">
                  {[1, 2, 3, 4, 5].map((s) => <Ionicons key={s} name="star" size={10} color="white" className="mr-0.5" />)}
                </View>
              </View>

              <Text className="text-2xl font-bold text-white leading-tight mb-2">
                The Anatomy of Emotional Intimacy
              </Text>
              <Text className="text-base text-white/80 font-medium mb-6">
                A 7-day masterclass on building deeper connections through vulnerability.
              </Text>

              <View className="flex-row items-center justify-between mt-2">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/30">
                    <Ionicons name="play" size={18} color="white" />
                  </View>
                  <View className="ml-3">
                    <Text className="text-white font-bold text-sm">Start Lesson</Text>
                    <Text className="text-white/60 text-xs font-medium">12 mins • Level 1</Text>
                  </View>
                </View>
                <Ionicons name="bookmark-outline" size={24} color="white" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Continue Learning */}
        <View className="mt-10">
          <View className="px-6 flex-row justify-between items-end mb-4">
            <Text className="text-xl font-bold text-navy">Continue Learning</Text>
            <TouchableOpacity><Text className="text-teal font-bold text-sm">See All</Text></TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 pb-4">
            <View className="flex-row gap-4 pr-12">
              {[
                { title: 'Male Ego & Pride', progress: 0.65, icon: 'shield', color: '#6366F1' },
                { title: 'Active Listening', progress: 0.3, icon: 'ear', color: '#F59E0B' },
                { title: 'Conflict Calm', progress: 0.9, icon: 'water', color: '#06B6D4' }
              ].map((item, i) => (
                <TouchableOpacity key={i} className="bg-white rounded-3xl p-4 w-44 shadow-soft border border-surface-200">
                  <View style={{ backgroundColor: `${item.color}20` }} className="w-12 h-12 rounded-2xl items-center justify-center mb-3">
                    <Ionicons name={item.icon as any} size={24} color={item.color} />
                  </View>
                  <Text className="text-[15px] font-bold text-navy mb-3 leading-tight" numberOfLines={2}>{item.title}</Text>
                  <View className="w-full h-1.5 bg-surface-200 rounded-full overflow-hidden">
                    <View style={{ width: `${item.progress * 100}%`, backgroundColor: item.color }} className="h-full" />
                  </View>
                  <Text className="text-[10px] text-navy-400 font-bold mt-2 uppercase">{Math.round(item.progress * 100)}% Complete</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* All Guides Grid */}
        <View className="px-6 mt-6 mb-12">
          <Text className="text-xl font-bold text-navy mb-5">Latest Guides</Text>
          
          {[
            {
              title: 'Decoding Non-Verbal Cues',
              category: 'Communication',
              duration: '8 min',
              icon: 'eye-outline',
              color: '#EC4899'
            },
            {
              title: 'The Drift Prevention Check-in',
              category: 'Relationship Tips',
              duration: '5 min',
              icon: 'sync-outline',
              color: '#3B82F6'
            },
            {
              title: 'Rekindling the Spark',
              category: 'Intimacy',
              duration: '12 min',
              icon: 'flame-outline',
              color: '#F43F5E'
            }
          ].map((guide, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              className="bg-white rounded-3xl p-4 shadow-soft mb-4 flex-row items-center border border-surface-200 active:bg-surface-100"
            >
              <View style={{ backgroundColor: `${guide.color}15` }} className="w-16 h-16 rounded-2xl items-center justify-center">
                <Ionicons name={guide.icon as any} size={28} color={guide.color} />
              </View>
              <View className="flex-1 ml-4">
                <View className="flex-row items-center mb-1">
                  <Text className="text-[10px] font-extrabold text-teal uppercase tracking-widest">{guide.category}</Text>
                  <View className="w-1 h-1 bg-surface-300 rounded-full mx-2" />
                  <Text className="text-[10px] font-bold text-navy-400 uppercase tracking-widest">{guide.duration}</Text>
                </View>
                <Text className="text-[17px] font-bold text-navy leading-snug">{guide.title}</Text>
              </View>
              <View className="w-10 h-10 bg-surface-100 rounded-full items-center justify-center">
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
