import { supabase } from '../lib/supabaseClient';
import { SuccessCase } from '../types';

/**
 * 모든 성공사례 조회
 */
export async function getAllSuccessCases(): Promise<SuccessCase[]> {
    const { data, error } = await supabase
        .from('success_cases')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching success cases:', error);
        throw error;
    }

    return data || [];
}

/**
 * 특정 성공사례 조회
 */
export async function getSuccessCaseById(id: number): Promise<SuccessCase | null> {
    const { data, error } = await supabase
        .from('success_cases')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching success case:', error);
        return null;
    }

    return data;
}

/**
 * 새로운 성공사례 추가
 */
export async function createSuccessCase(
    successCase: Omit<SuccessCase, 'id'>
): Promise<SuccessCase> {
    const { data, error } = await supabase
        .from('success_cases')
        .insert([
            {
                title: successCase.title,
                category: successCase.category,
                result: successCase.result,
                description: successCase.description,
                judgment_url: successCase.judgmentUrl,
                judgment_format: successCase.judgmentFormat,
                image_urls: successCase.imageUrls || [],
            },
        ])
        .select()
        .single();

    if (error) {
        console.error('Error creating success case:', error);
        throw error;
    }

    return data;
}

/**
 * 성공사례 수정
 */
export async function updateSuccessCase(
    successCase: SuccessCase
): Promise<SuccessCase> {
    const { data, error } = await supabase
        .from('success_cases')
        .update({
            title: successCase.title,
            category: successCase.category,
            result: successCase.result,
            description: successCase.description,
            judgment_url: successCase.judgmentUrl,
            judgment_format: successCase.judgmentFormat,
            image_urls: successCase.imageUrls || [],
        })
        .eq('id', successCase.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating success case:', error);
        throw error;
    }

    return data;
}

/**
 * 성공사례 삭제
 */
export async function deleteSuccessCase(id: number): Promise<void> {
    const { error } = await supabase
        .from('success_cases')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting success case:', error);
        throw error;
    }
}
