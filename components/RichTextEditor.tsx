import React, { useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    maxLength?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    placeholder = '내용을 입력하세요...',
    maxLength = 5000
}) => {
    const quillRef = useRef<ReactQuill>(null);

    // 이미지 업로드 핸들러
    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            // 파일 크기 체크 (3MB)
            if (file.size > 3 * 1024 * 1024) {
                alert('이미지 크기는 3MB 이하여야 합니다.');
                return;
            }

            // 이미지를 Base64로 변환
            const reader = new FileReader();
            reader.onload = () => {
                const quill = quillRef.current?.getEditor();
                if (quill) {
                    const range = quill.getSelection();
                    const index = range ? range.index : 0;

                    // 에디터에 이미지 삽입
                    quill.insertEmbed(index, 'image', reader.result);
                    quill.setSelection(index + 1, 0);
                }
            };
            reader.readAsDataURL(file);
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
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                style={{ height: '300px', marginBottom: '50px' }}
            />
            <style>{`
        .rich-text-editor .ql-container {
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 14px;
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
