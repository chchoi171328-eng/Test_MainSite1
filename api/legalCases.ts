import { supabase } from '../lib/supabaseClient';
import { LegalCase } from '../types';

/**
 * 모든 판례 조회
 */
// Helper to map DB row to Frontend Type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapDBToLegalCase = (row: any): LegalCase => ({
    id: row.id,
    title: row.title,
    court: row.court,
    caseNumber: row.case_number,
    summary: row.summary,
    tags: row.tags,
    content: row.content,
    imageUrls: row.image_urls || [],
});

/**
 * 모든 판례 조회
 */
export async function getAllLegalCases(): Promise<LegalCase[]> {
    const { data, error } = await supabase
        .from('legal_cases')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching legal cases:', error);
        throw error;
    }

    return (data || []).map(mapDBToLegalCase);
}

/**
 * 특정 판례 조회
 */
export async function getLegalCaseById(id: number): Promise<LegalCase | null> {
    const { data, error } = await supabase
        .from('legal_cases')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching legal case:', error);
        return null;
    }

    return data ? mapDBToLegalCase(data) : null;
}

/**
 * 새로운 판례 추가
 */
export async function createLegalCase(
    legalCase: Omit<LegalCase, 'id'>
): Promise<LegalCase> {
    const { data, error } = await supabase
        .from('legal_cases')
        .insert([
            {
                title: legalCase.title,
                court: legalCase.court,
                case_number: legalCase.caseNumber,
                summary: legalCase.summary,
                tags: legalCase.tags,
                content: legalCase.content,
                image_urls: legalCase.imageUrls || [],
            },
        ])
        .select()
        .single();

    if (error) {
        console.error('Error creating legal case:', error);
        throw error;
    }

    return mapDBToLegalCase(data);
}

/**
 * 판례 수정
 */
export async function updateLegalCase(legalCase: LegalCase): Promise<LegalCase> {
    const { data, error } = await supabase
        .from('legal_cases')
        .update({
            title: legalCase.title,
            court: legalCase.court,
            case_number: legalCase.caseNumber,
            summary: legalCase.summary,
            tags: legalCase.tags,
            content: legalCase.content,
            image_urls: legalCase.imageUrls || [],
        })
        .eq('id', legalCase.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating legal case:', error);
        throw error;
    }

    return mapDBToLegalCase(data);
}

/**
 * 판례 삭제
 */
export async function deleteLegalCase(id: number): Promise<void> {
    const { error } = await supabase
        .from('legal_cases')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting legal case:', error);
        throw error;
    }
}
