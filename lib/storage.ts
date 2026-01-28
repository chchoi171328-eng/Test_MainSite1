import { supabase } from './supabaseClient';

/**
 * 파일을 Supabase Storage에 업로드
 * @param bucket - 버킷 이름 ('judgments' 또는 'legal-forms')
 * @param filePath - 파일 경로 (예: 'case1.pdf')
 * @param file - 업로드할 File 객체
 * @returns 업로드된 파일의 공개 URL
 */
export async function uploadFile(
    bucket: string,
    filePath: string,
    file: File
): Promise<string> {
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true, // 같은 이름의 파일이 있으면 덮어쓰기
        });

    if (error) {
        console.error('File upload error:', error);
        throw error;
    }

    // 공개 URL 반환
    const {
        data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return publicUrl;
}

/**
 * 파일의 공개 URL 가져오기
 * @param bucket - 버킷 이름
 * @param filePath - 파일 경로
 * @returns 파일의 공개 URL
 */
export function getFileUrl(bucket: string, filePath: string): string {
    const {
        data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return publicUrl;
}

/**
 * Storage에서 파일 삭제
 * @param bucket - 버킷 이름
 * @param filePath - 삭제할 파일 경로
 */
export async function deleteFile(
    bucket: string,
    filePath: string
): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
        console.error('File delete error:', error);
        throw error;
    }
}

/**
 * Base64 문자열을 File 객체로 변환
 * @param base64 - Base64 인코딩된 문자열
 * @param filename - 파일 이름
 * @returns File 객체
 */
export function base64ToFile(base64: string, filename: string): File {
    // data:application/pdf;base64, 형식에서 실제 데이터 추출
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}

/**
 * 파일 경로에서 파일명 추출
 * @param url - 전체 URL 또는 경로
 * @returns 파일명
 */
export function extractFilePath(url: string): string {
    if (!url) return '';

    // URL에서 파일 경로 추출
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];

    // 쿼리 파라미터 제거
    return lastPart.split('?')[0];
}
