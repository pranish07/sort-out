import { supabase } from '@/config/supabase';
import { Reminder } from '@/types';

export async function fetchReminders(): Promise<Reminder[]> {
    const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .order('date', { ascending: true });

    if (error) throw error;
    return (data || []).map(mapToReminder);
}

export async function createReminder(
    title: string,
    date: Date,
    type: 'birthday' | 'anniversary' | 'date-night' | 'custom',
    description?: string
): Promise<Reminder> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('reminders')
        .insert({
            user_id: user.id,
            title,
            date: date.toISOString().split('T')[0],
            type,
            description,
        })
        .select()
        .single();

    if (error) throw error;
    return mapToReminder(data);
}

export async function deleteReminder(id: string): Promise<void> {
    const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

export async function updateReminder(id: string, updates: { title?: string, date?: Date, type?: string }): Promise<Reminder> {
    const { data, error } = await supabase
        .from('reminders')
        .update({
            ...updates,
            date: updates.date ? updates.date.toISOString().split('T')[0] : undefined,
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return mapToReminder(data);
}

function mapToReminder(dbReminder: any): Reminder {
    return {
        id: dbReminder.id,
        title: dbReminder.title,
        description: dbReminder.description,
        date: new Date(dbReminder.date),
        type: dbReminder.type,
        notificationEnabled: dbReminder.notification_enabled,
        createdAt: new Date(dbReminder.created_at),
        coupleId: '', // We use user_id mapping for now
    };
}
