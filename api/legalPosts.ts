import { supabase } from '../lib/supabaseClient';
import { LegalPost } from '../types';

/**
 * 모든 법률정보 조회
 */
// Helper to map DB row to Frontend Type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapDBToLegalPost = (row: any): LegalPost => ({
    id: row.id,
    title: row.title,
    listTitle: row.list_title ?? undefined,
    category: row.category,
    date: row.date,
    summary: row.summary,
    content: row.content,
    imageUrls: row.image_urls || [],
});

/**
 * 모든 법률정보 조회
 */
export async function getAllLegalPosts(): Promise<LegalPost[]> {
    const { data, error } = await supabase
        .from('legal_posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching legal posts:', error);
        throw error;
    }

    return (data || []).map(mapDBToLegalPost);
}

/**
 * 목록 카드용 경량 조회 — 본문(content)을 제외해 페이지 직렬화 용량을 줄인다.
 * (87건 × 본문 수 KB를 통째로 내려보내면 목록 페이지 프리렌더가 실패한다)
 */
export async function getLegalPostList(): Promise<LegalPost[]> {
    const { data, error } = await supabase
        .from('legal_posts')
        .select('id, title, list_title, category, date, summary, image_urls')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching legal post list:', error);
        throw error;
    }

    return (data || []).map((row) => mapDBToLegalPost({ ...row, content: '' }));
}

/**
 * 특정 법률정보 조회
 */
export async function getLegalPostById(id: number): Promise<LegalPost | null> {
    const { data, error } = await supabase
        .from('legal_posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching legal post:', error);
        return null;
    }

    return data ? mapDBToLegalPost(data) : null;
}

/**
 * 새로운 법률정보 추가
 */
export async function createLegalPost(
    legalPost: Omit<LegalPost, 'id'>
): Promise<LegalPost> {
    const { data, error } = await supabase
        .from('legal_posts')
        .insert([{
            title: legalPost.title,
            list_title: legalPost.listTitle || null,
            category: legalPost.category,
            date: legalPost.date,
            summary: legalPost.summary,
            content: legalPost.content,
            image_urls: legalPost.imageUrls || [],
        }])
        .select()
        .single();

    if (error) {
        console.error('Error creating legal post:', error);
        throw error;
    }

    return mapDBToLegalPost(data);
}

/**
 * 법률정보 수정
 */
export async function updateLegalPost(legalPost: LegalPost): Promise<LegalPost> {
    const { data, error } = await supabase
        .from('legal_posts')
        .update({
            title: legalPost.title,
            list_title: legalPost.listTitle || null,
            category: legalPost.category,
            date: legalPost.date,
            summary: legalPost.summary,
            content: legalPost.content,
            image_urls: legalPost.imageUrls || [],
        })
        .eq('id', legalPost.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating legal post:', error);
        throw error;
    }

    return mapDBToLegalPost(data);
}

/**
 * 법률정보 삭제
 */
export async function deleteLegalPost(id: number): Promise<void> {
    const { error } = await supabase
        .from('legal_posts')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting legal post:', error);
        throw error;
    }
}
