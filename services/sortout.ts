import { supabase } from '@/config/supabase';

export async function createIssue(userId: string, partnerId: string | undefined, title: string, text: string, voiceNoteURL?: string) {
    const { data, error } = await supabase
        .from('sort_out_issues')
        .insert({
            user_id: userId,
            partner_id: partnerId,
            title,
            user1_submission: {
                text,
                voiceNoteURL,
                submittedAt: new Date().toISOString(),
                userId,
            },
            status: 'pending',
            resolution_progress: 0,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getIssues(userId: string) {
    const { data, error } = await supabase
        .from('sort_out_issues')
        .select('*')
        .or(`user_id.eq.${userId},partner_id.eq.${userId}`)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as any[];
}

export async function getIssueById(issueId: string) {
    const { data, error } = await supabase
        .from('sort_out_issues')
        .select('*')
        .eq('id', issueId)
        .single();

    if (error) throw error;
    return data;
}

export async function submitPartnerPerspective(issueId: string, text: string, voiceNoteURL?: string) {
    const { data, error } = await supabase
        .from('sort_out_issues')
        .update({
            user2_submission: {
                text,
                voiceNoteURL,
                submittedAt: new Date().toISOString(),
            },
            status: 'analyzing',
            resolution_progress: 50,
            updated_at: new Date().toISOString(),
        })
        .eq('id', issueId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function saveAIAnalysis(issueId: string, analysis: any) {
    const { data, error } = await supabase
        .from('sort_out_issues')
        .update({
            ai_analysis: {
                ...analysis,
                analyzedAt: new Date().toISOString(),
            },
            status: 'resolved',
            resolution_progress: 100,
            updated_at: new Date().toISOString(),
        })
        .eq('id', issueId)
        .select()
        .single();

    if (error) throw error;
    return data;
}
