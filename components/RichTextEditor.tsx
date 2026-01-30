import React, { useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { supabase } from '../lib/supabaseClient';

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    maxLength?: number;
    onImageUpload?: (url: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    placeholder = '내용을 입력하세요...',
    maxLength = 5000,
    onImageUpload
}) => {
    const quillRef = useRef<ReactQuill>(null);

    // 이미지 업로드 핸들러
    const imageHandler = () => {
        // 현재 커서 위치 저장
        const quill = quillRef.current?.getEditor();
        const range = quill?.getSelection();

        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            // 파일 크기 체크 (10MB - 가이드라인 기준)
            if (file.size > 10 * 1024 * 1024) {
                alert('이미지 크기는 10MB 이하여야 합니다.');
                return;
            }

            try {
                // 파일명 생성 (타임스탬프 + 랜덤 문자열)
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `${fileName}`;

                // Supabase Storage에 업로드
                const { data, error } = await supabase.storage
                    .from('content-images')
                    .upload(filePath, file);

                if (error) {
                    console.error('Upload Error:', error);
                    alert('이미지 업로드에 실패했습니다: ' + error.message);
                    return;
                }

                // 이미지 Public URL 가져오기
                const { data: { publicUrl } } = supabase.storage
                    .from('content-images')
                    .getPublicUrl(filePath);

                // 에디터에 이미지 삽입
                if (quill) {
                    // 저장된 커서 위치 사용, 없으면 0 (맨 위)
                    const index = range ? range.index : 0;
                    quill.insertEmbed(index, 'image', publicUrl);
                    // 이미지 삽입 후 커서를 이미지 다음으로 이동
                    quill.setSelection(index + 1, 0);
                }

                // 부모 컴포넌트에 URL 알림
                if (onImageUpload) {
                    onImageUpload(publicUrl);
                }

            } catch (error) {
                console.error('Error in image handler:', error);
                alert('이미지 처리 중 오류가 발생했습니다.');
            }
        };
    };

    // Quill 모듈 설정
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'align': [] }],
                ['link', 'image'],
                [{ 'color': [] }, { 'background': [] }],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        },
        clipboard: {
            matchVisual: false
        }
    }), []);

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'indent',
        'align',
        'link', 'image',
        'color', 'background'
    ];

    const handleChange = (content: string) => {
        // 길이 제한 체크 (HTML 태그 제외한 텍스트만)
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';

        if (textContent.length <= maxLength) {
            onChange(content);
        }
    };

    return (
        <div className="rich-text-editor">
            {/* @ts-ignore */}
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                style={{ marginBottom: '50px' }}
            />
            <style>{`
        .rich-text-editor .ql-toolbar {
          background-color: #f8f9fa;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }
        .rich-text-editor .ql-container {
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 14px;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          min-height: 300px;
        }
        .rich-text-editor .ql-editor {
          min-height: 300px;
        }
        .rich-text-editor .ql-editor img {
          max-width: 100%;
          height: auto;
          cursor: pointer;
        }
        .rich-text-editor .ql-editor img:hover {
          opacity: 0.9;
        }
      `}</style>
        </div>
    );
};
