import { supabase } from '../lib/supabaseClient';
import { LegalForm } from '../types';

/**
 * 모든 법률서식 조회
 */
export async function getAllLegalForms(): Promise<LegalForm[]> {
    const { data, error } = await supabase
        .from('legal_forms')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching legal forms:', error);
        throw error;
    }

    return data || [];
}

/**
 * 특정 법률서식 조회
 */
export async function getLegalFormById(id: number): Promise<LegalForm | null> {
    const { data, error } = await supabase
        .from('legal_forms')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching legal form:', error);
        return null;
    }

    return data;
}

/**
 * 새로운 법률서식 추가
 */
export async function createLegalForm(
    legalForm: Omit<LegalForm, 'id'>
): Promise<LegalForm> {
    const { data, error } = await supabase
        .from('legal_forms')
        .insert([
            {
                title: legalForm.title,
                category: legalForm.category,
                format: legalForm.format,
                size: legalForm.size,
                file_url: legalForm.fileUrl,
            },
        ])
        .select()
        .single();

    if (error) {
        console.error('Error creating legal form:', error);
        throw error;
    }

    return data;
}

/**
 * 법률서식 수정
 */
export async function updateLegalForm(legalForm: LegalForm): Promise<LegalForm> {
    const { data, error } = await supabase
        .from('legal_forms')
        .update({
            title: legalForm.title,
            category: legalForm.category,
            format: legalForm.format,
            size: legalForm.size,
            file_url: legalForm.fileUrl,
        })
        .eq('id', legalForm.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating legal form:', error);
        throw error;
    }

    return data;
}

/**
 * 법률서식 삭제
 */
export async function deleteLegalForm(id: number): Promise<void> {
    const { error } = await supabase
        .from('legal_forms')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting legal form:', error);
        throw error;
    }
}
