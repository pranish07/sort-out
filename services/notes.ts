import { supabase } from '@/config/supabase';
import { JournalEntry } from '@/types';

export async function fetchJournalEntries(type: 'shared' | 'private'): Promise<JournalEntry[]> {
    const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('type', type)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapToJournalEntry);
}

export async function createJournalEntry(content: string, type: 'shared' | 'private'): Promise<JournalEntry> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('journal_entries')
        .insert({
            user_id: user.id,
            content,
            type,
        })
        .select()
        .single();

    if (error) throw error;
    return mapToJournalEntry(data);
}

export async function deleteJournalEntry(id: string): Promise<void> {
    const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

export async function updateJournalEntry(id: string, content: string): Promise<JournalEntry> {
    const { data, error } = await supabase
        .from('journal_entries')
        .update({
            content,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return mapToJournalEntry(data);
}

function mapToJournalEntry(dbEntry: any): JournalEntry {
    return {
        id: dbEntry.id,
        authorId: dbEntry.user_id,
        content: dbEntry.content,
        type: dbEntry.type as 'shared' | 'private',
        createdAt: new Date(dbEntry.created_at),
        updatedAt: new Date(dbEntry.updated_at),
        coupleId: '', // We use user_id mapping for now
    };
}
