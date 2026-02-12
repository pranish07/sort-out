import { supabase } from '@/config/supabase';

export interface PairingCode {
    id: string;
    code: string;
    user_id: string;
    expires_at: string;
    used: boolean;
    created_at: string;
}

export async function generatePairingCode(): Promise<PairingCode> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Delete any existing unused codes for this user to keep it clean
    await supabase
        .from('pairing_codes')
        .delete()
        .eq('user_id', user.id)
        .eq('used', false);

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const { data, error } = await supabase
        .from('pairing_codes')
        .insert({
            user_id: user.id,
            code,
            expires_at: expiresAt.toISOString(),
            used: false,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getActivePairingCode(): Promise<PairingCode | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('pairing_codes')
        .select('*')
        .eq('user_id', user.id)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function usePairingCode(code: string): Promise<{ success: boolean; message: string }> {
    const { data, error } = await supabase.rpc('pair_user_by_code', {
        input_code: code.toUpperCase(),
    });

    if (error) throw error;
    return data as { success: boolean; message: string };
}
