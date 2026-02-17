import { supabase } from './supabase';

// ─── Projects ───────────────────────────────────────────────
export async function getProjects() {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });
    return { data, error };
}

export async function getProject(id: string) {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
    return { data, error };
}

export async function createProject(name: string, type: string = 'blog') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: { message: 'Not authenticated' } };

    const { data, error } = await supabase
        .from('projects')
        .insert({ name, type, user_id: user.id })
        .select()
        .single();
    return { data, error };
}

export async function renameProject(id: string, name: string) {
    const { data, error } = await supabase
        .from('projects')
        .update({ name, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
    return { data, error };
}

export async function deleteProject(id: string) {
    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
    return { error };
}

export async function toggleFavorite(id: string, isFavorite: boolean) {
    const { error } = await supabase
        .from('projects')
        .update({ is_favorite: isFavorite })
        .eq('id', id);
    return { error };
}

// ─── Documents ──────────────────────────────────────────────
export async function getDocuments(projectId: string) {
    const { data, error } = await supabase
        .from('documents')
        .select('*, profiles:user_id(full_name, avatar_url)')
        .eq('project_id', projectId)
        .order('updated_at', { ascending: false });
    return { data, error };
}

export async function getDocument(id: string) {
    const { data, error } = await supabase
        .from('documents')
        .select('*, projects(name)')
        .eq('id', id)
        .single();
    return { data, error };
}

export async function createDocument(projectId: string, title: string = 'Untitled Document') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: { message: 'Not authenticated' } };

    const { data, error } = await supabase
        .from('documents')
        .insert({ project_id: projectId, title, user_id: user.id })
        .select()
        .single();
    return { data, error };
}

export async function renameDocument(id: string, title: string) {
    const { data, error } = await supabase
        .from('documents')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
    return { data, error };
}

export async function deleteDocument(id: string) {
    const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
    return { error };
}

export async function updateDocumentContent(id: string, content: string, wordCount: number) {
    const { error } = await supabase
        .from('documents')
        .update({ content, word_count: wordCount, updated_at: new Date().toISOString() })
        .eq('id', id);
    return { error };
}

export async function updateProjectStatus(id: string, status: string) {
    const { error } = await supabase
        .from('projects')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
    return { error };
}

export async function updateDocumentStatus(id: string, status: string) {
    const { error } = await supabase
        .from('documents')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
    return { error };
}

// ─── Dashboard Stats ────────────────────────────────────────
export async function getDashboardStats() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { projectCount: 0, documentCount: 0, totalWords: 0, aiQueries: 0 };

    const [projects, documents, aiGens] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('documents').select('word_count').eq('user_id', user.id),
        supabase.from('ai_generations').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    ]);

    const totalWords = documents.data?.reduce((sum, d) => sum + (d.word_count || 0), 0) ?? 0;

    return {
        projectCount: projects.count ?? 0,
        documentCount: documents.data?.length ?? 0,
        totalWords,
        aiQueries: aiGens.count ?? 0,
    };
}

export async function getRecentDocuments(limit: number = 5) {
    const { data, error } = await supabase
        .from('documents')
        .select('*, projects(name), profiles:user_id(full_name, avatar_url)')
        .order('updated_at', { ascending: false })
        .limit(limit);
    return { data, error };
}

// ─── AI Generations ─────────────────────────────────────────
export async function logAiGeneration(documentId: string, prompt: string, output: string, tokensUsed: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: { message: 'Not authenticated' } };

    const { error } = await supabase
        .from('ai_generations')
        .insert({
            user_id: user.id,
            document_id: documentId,
            prompt,
            output,
            tokens_used: tokensUsed,
        });

    // Also update or create usage tracking for current month
    if (!error) {
        const now = new Date();
        const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

        const { data: existing } = await supabase
            .from('usage_tracking')
            .select('*')
            .eq('user_id', user.id)
            .gte('period_start', periodStart)
            .lte('period_end', periodEnd)
            .maybeSingle();

        if (existing) {
            await supabase
                .from('usage_tracking')
                .update({
                    ai_requests_count: existing.ai_requests_count + 1,
                    tokens_used_total: existing.tokens_used_total + tokensUsed,
                    words_generated: existing.words_generated + output.split(/\s+/).length,
                })
                .eq('id', existing.id);
        } else {
            await supabase
                .from('usage_tracking')
                .insert({
                    user_id: user.id,
                    ai_requests_count: 1,
                    tokens_used_total: tokensUsed,
                    words_generated: output.split(/\s+/).length,
                    period_start: periodStart,
                    period_end: periodEnd,
                });
        }
    }

    return { error };
}

// ─── Analytics ──────────────────────────────────────────────
export async function getAnalyticsData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Calculate 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoIso = thirtyDaysAgo.toISOString();

    const [usage, aiGens, projects, docs, allDocs] = await Promise.all([
        supabase.from('usage_tracking').select('*').eq('user_id', user.id).order('period_start', { ascending: false }),
        supabase.from('ai_generations').select('*').eq('user_id', user.id).gte('created_at', thirtyDaysAgoIso).order('created_at', { ascending: true }),
        supabase.from('projects').select('id, name, type, status, updated_at').eq('user_id', user.id),
        supabase.from('documents').select('id, title, word_count, status, updated_at, projects(name)').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(10),
        supabase.from('documents').select('id, word_count, status').eq('user_id', user.id), // Fetch all for stats
    ]);

    // Calculate accurate total words from all documents
    const totalWords = allDocs.data?.reduce((sum, d) => sum + (d.word_count || 0), 0) ?? 0;

    const totalAiQueries = usage.data?.reduce((sum, u) => sum + (u.ai_requests_count || 0), 0) ?? 0;
    const totalTokens = usage.data?.reduce((sum, u) => sum + (u.tokens_used_total || 0), 0) ?? 0;

    return {
        totalWords,
        totalAiQueries,
        projectCount: projects.data?.length ?? 0,
        totalTokens,
        recentDocs: docs.data ?? [],
        aiGenerations: aiGens.data ?? [], // Full list for charts (last 30 days)
        projects: projects.data ?? [],     // Full list for breakdown
        documentStats: allDocs.data ?? [], // Full list for status distribution
        usageHistory: usage.data ?? [],
    };
}
