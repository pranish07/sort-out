import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert, RefreshControl, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { JournalEntry, Reminder } from '@/types';
import { fetchJournalEntries, createJournalEntry, deleteJournalEntry, updateJournalEntry } from '@/services/notes';
import { fetchReminders, createReminder, deleteReminder, updateReminder } from '@/services/reminders';
import { useUserStore } from '@/store/userStore';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NotesView() {
  const user = useUserStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<'shared' | 'private'>('shared');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal states
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  
  // Form states
  const [noteContent, setNoteContent] = useState('');
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderType, setReminderType] = useState<'birthday' | 'anniversary' | 'date-night' | 'custom'>('custom');
  const [reminderDate, setReminderDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  // Edit states
  const [editingNote, setEditingNote] = useState<JournalEntry | null>(null);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateValue, setDateValue] = useState(new Date());

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [fetchedEntries, fetchedReminders] = await Promise.all([
        fetchJournalEntries(activeTab),
        fetchReminders()
      ]);
      setEntries(fetchedEntries);
      setReminders(fetchedReminders);
    } catch (error: any) {
      console.error('Error loading journal data:', error);
      Alert.alert('Error', 'Failed to load data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;
    setSubmitting(true);
    try {
      if (editingNote) {
        const updated = await updateJournalEntry(editingNote.id, noteContent);
        setEntries(entries.map(e => e.id === editingNote.id ? updated : e));
        setEditingNote(null);
      } else {
        const newNote = await createJournalEntry(noteContent, activeTab);
        setEntries([newNote, ...entries]);
      }
      setNoteContent('');
      setShowNoteModal(false);
    } catch (error: any) {
      Alert.alert('Error', `Failed to ${editingNote ? 'update' : 'create'} note.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditNote = (note: JournalEntry) => {
    setEditingNote(note);
    setNoteContent(note.content);
    setShowNoteModal(true);
  };

  const handleAddReminder = async () => {
    if (!reminderTitle.trim()) return;
    setSubmitting(true);
    try {
      if (editingReminder) {
        const updated = await updateReminder(editingReminder.id, { 
          title: reminderTitle, 
          date: new Date(reminderDate), 
          type: reminderType 
        });
        setReminders(reminders.map(r => r.id === editingReminder.id ? updated : r).sort((a, b) => a.date.getTime() - b.date.getTime()));
        setEditingReminder(null);
      } else {
        const newReminder = await createReminder(reminderTitle, new Date(reminderDate), reminderType);
        setReminders([...reminders, newReminder].sort((a, b) => a.date.getTime() - b.date.getTime()));
      }
      setReminderTitle('');
      setShowReminderModal(false);
    } catch (error: any) {
      Alert.alert('Error', `Failed to ${editingReminder ? 'update' : 'create'} reminder.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setReminderTitle(reminder.title);
    setReminderType(reminder.type);
    const date = new Date(reminder.date);
    setReminderDate(reminder.date.toISOString().split('T')[0]);
    setDateValue(date);
    setShowReminderModal(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateValue(selectedDate);
      setReminderDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await deleteJournalEntry(id);
          setEntries(entries.filter(e => e.id !== id));
        } catch (error) {
          Alert.alert('Error', 'Failed to delete entry');
        }
      }}
    ]);
  };

  const handleDeleteReminder = async (id: string) => {
    Alert.alert('Delete Reminder', 'Are you sure you want to delete this reminder?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await deleteReminder(id);
          setReminders(reminders.filter(r => r.id !== id));
        } catch (error) {
          Alert.alert('Error', 'Failed to delete reminder');
        }
      }}
    ]);
  };

  const getReminderIcon = (type: string) => {
    switch(type) {
      case 'birthday': return { name: 'gift', color: '#FF998F', bg: 'bg-blush-100' };
      case 'anniversary': return { name: 'heart', color: '#F43F5E', bg: 'bg-rose-100' };
      case 'date-night': return { name: 'wine', color: '#8B5CF6', bg: 'bg-violet-100' };
      default: return { name: 'notifications', color: '#14B8A6', bg: 'bg-teal-100' };
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAF9' }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View className="bg-teal pt-12 pb-16 px-6 rounded-b-[48px] shadow-lg">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white/80 text-lg font-medium">Capture Moments</Text>
              <Text className="text-3xl font-bold text-white">Journal</Text>
            </View>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => setShowNoteModal(true)}
              className="w-12 h-12 bg-white/20 rounded-full items-center justify-center border border-white/30"
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-1 px-6 -mt-8">
          {/* Tabs */}
          <View className="flex-row bg-white rounded-2xl p-1 shadow-md mb-6">
            <TouchableOpacity
              activeOpacity={0.8}
              className={`flex-1 py-3 rounded-xl ${activeTab === 'shared' ? 'bg-teal' : ''}`}
              onPress={() => setActiveTab('shared')}
            >
              <Text className={`text-center font-semibold ${activeTab === 'shared' ? 'text-white' : 'text-navy-600'}`}>Shared</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              className={`flex-1 py-3 rounded-xl ${activeTab === 'private' ? 'bg-teal' : ''}`}
              onPress={() => setActiveTab('private')}
            >
              <Text className={`text-center font-semibold ${activeTab === 'private' ? 'text-white' : 'text-navy-600'}`}>Private</Text>
            </TouchableOpacity>
          </View>

          {loading && !refreshing ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#14B8A6" />
            </View>
          ) : (
            <ScrollView 
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
              {/* Reminders Section */}
              <View className="mb-6">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-lg font-bold text-navy">Reminders</Text>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => setShowReminderModal(true)}>
                    <Ionicons name="add-circle" size={24} color="#14B8A6" />
                  </TouchableOpacity>
                </View>

                {reminders.length === 0 ? (
                  <View className="bg-white rounded-2xl p-6 items-center border border-dashed border-teal/20">
                    <Text className="text-navy-400 text-sm italic">No upcoming reminders</Text>
                  </View>
                ) : (
                  reminders.map((reminder) => {
                    const iconInfo = getReminderIcon(reminder.type);
                    return (
                      <TouchableOpacity 
                        key={reminder.id}
                        activeOpacity={0.7}
                        onLongPress={() => handleDeleteReminder(reminder.id)}
                        onPress={() => handleEditReminder(reminder)}
                        className="bg-white rounded-2xl p-4 shadow-sm mb-3 border border-slate-50"
                      >
                        <View className="flex-row items-center">
                          <View className={`w-12 h-12 ${iconInfo.bg} rounded-full items-center justify-center`}>
                            <Ionicons name={iconInfo.name as any} size={24} color={iconInfo.color} />
                          </View>
                          <View className="flex-1 ml-3">
                            <Text className="text-base font-semibold text-navy">{reminder.title}</Text>
                            <Text className="text-sm text-navy-600">
                              {new Date(reminder.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </Text>
                          </View>
                          <TouchableOpacity 
                            onPress={() => handleDeleteReminder(reminder.id)}
                            className="p-2"
                          >
                            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                          </TouchableOpacity>
                          <Ionicons name="chevron-forward" size={16} color="#CBD5E1" className="ml-1" />
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>

              {/* Entries List */}
              <Text className="text-lg font-bold text-navy mb-3">Entries</Text>
              {entries.length === 0 ? (
                <View className="items-center justify-center py-8">
                  <View className="w-20 h-20 bg-beige-100 rounded-full items-center justify-center mb-4">
                    <Ionicons name="book-outline" size={36} color="#CDB48C" />
                  </View>
                  <Text className="text-lg font-bold text-navy mb-1">No Entries Yet</Text>
                  <Text className="text-sm text-navy-600 text-center px-4">Start journaling your journey together.</Text>
                </View>
              ) : (
                entries.map((entry) => (
                  <TouchableOpacity 
                    key={entry.id}
                    activeOpacity={0.8}
                    onLongPress={() => handleDeleteEntry(entry.id)}
                    onPress={() => handleEditNote(entry)}
                    className="bg-white rounded-3xl p-6 shadow-sm mb-4 border border-slate-50"
                  >
                    <View className="flex-row justify-between items-start mb-3">
                      <Text className="text-xs font-bold text-teal uppercase tracking-widest">
                        {new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </Text>
                      <View className="flex-row items-center">
                        <TouchableOpacity 
                          onPress={() => handleDeleteEntry(entry.id)}
                          className="mr-3"
                        >
                          <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                        </TouchableOpacity>
                        <Ionicons name="create-outline" size={18} color="#14B8A6" />
                      </View>
                    </View>
                    <Text className="text-navy text-base leading-relaxed">{entry.content}</Text>
                  </TouchableOpacity>
                ))
              )}
              <View className="h-6" />
            </ScrollView>
          )}
        </View>
      </View>

      {/* Add Note Modal - FULL SCREEN EDITOR */}
      <Modal visible={showNoteModal} animationType="slide" transparent={false}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          {/* Editor Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
            <TouchableOpacity onPress={() => {
              setShowNoteModal(false);
              setEditingNote(null);
              setNoteContent('');
            }}>
              <Ionicons name="close" size={28} color="#0F172A" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#0F172A' }}>
              {editingNote ? 'Edit Note' : `New ${activeTab === 'shared' ? 'Shared' : 'Private'} Note`}
            </Text>
            <TouchableOpacity 
              disabled={submitting || !noteContent.trim()}
              onPress={handleAddNote}
              style={{ opacity: submitting || !noteContent.trim() ? 0.5 : 1 }}
            >
              {submitting ? (
                <ActivityIndicator color="#14B8A6" size="small" />
              ) : (
                <Text style={{ color: '#14B8A6', fontWeight: '700', fontSize: 16 }}>Save</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Editor Content */}
          <ScrollView className="flex-1 px-6 pt-4">
            <TextInput
              multiline
              autoFocus
              style={{ 
                fontSize: 18, 
                lineHeight: 28, 
                color: '#0F172A', 
                minHeight: 300, 
                textAlignVertical: 'top' 
              }}
              placeholder="Start writing your thoughts..."
              placeholderTextColor="#94A3B8"
              value={noteContent}
              onChangeText={setNoteContent}
            />
          </ScrollView>
          <View className="px-6 py-4 border-t border-slate-50">
            <Text className="text-navy-400 text-xs text-center italic">
              {editingNote ? 'Updated just now' : 'Auto-saved to your draft'}
            </Text>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Add Reminder Modal */}
      <Modal visible={showReminderModal} animationType="slide" transparent={true}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 32, paddingBottom: 48 }}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-navy">{editingReminder ? 'Edit' : 'New'} Reminder</Text>
              <TouchableOpacity onPress={() => {
                setShowReminderModal(false);
                setEditingReminder(null);
                setReminderTitle('');
                setDateValue(new Date());
                setReminderDate(new Date().toISOString().split('T')[0]);
              }}>
                <Ionicons name="close-circle" size={32} color="#CBD5E1" />
              </TouchableOpacity>
            </View>
            
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#475569', marginBottom: 8, marginLeft: 4 }}>Title</Text>
            <TextInput
              style={{ backgroundColor: '#F8FAFC', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#0F172A', marginBottom: 16 }}
              placeholder="e.g. Anniversary"
              value={reminderTitle}
              onChangeText={setReminderTitle}
            />

            <Text style={{ fontSize: 14, fontWeight: '700', color: '#475569', marginBottom: 8, marginLeft: 4 }}>Date</Text>
            <TouchableOpacity 
              onPress={() => setShowDatePicker(true)}
              style={{ backgroundColor: '#F8FAFC', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Text style={{ fontSize: 16, color: '#0F172A' }}>
                {dateValue.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#64748B" />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dateValue}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
              />
            )}

            <Text style={{ fontSize: 14, fontWeight: '700', color: '#475569', marginBottom: 8, marginLeft: 4 }}>Type</Text>
            <View className="flex-row gap-2 flex-wrap mb-6">
              {(['birthday', 'anniversary', 'date-night', 'custom'] as const).map((t) => (
                <TouchableOpacity 
                  key={t}
                  onPress={() => setReminderType(t)}
                  className={`px-4 py-2 rounded-full border ${reminderType === t ? 'bg-teal border-teal' : 'bg-white border-slate-200'}`}
                >
                  <Text className={`capitalize font-semibold ${reminderType === t ? 'text-white' : 'text-navy-600'}`}>{t.replace('-', ' ')}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              disabled={submitting || !reminderTitle.trim()}
              onPress={handleAddReminder}
              style={{ 
                paddingVertical: 16, 
                borderRadius: 16, 
                alignItems: 'center', 
                backgroundColor: submitting || !reminderTitle.trim() ? '#14B8A680' : '#14B8A6'
              }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 }}>{editingReminder ? 'Update' : 'Create'} Reminder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
