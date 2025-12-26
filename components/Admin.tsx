import React, { useState, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigation } from '../contexts/NavigationContext';
import { SuccessCase, LegalPost, LegalForm, LegalCase } from '../types';
import { Trash2, Edit, Plus, Save, X, Lock, ArrowLeft, Upload, FileText, Image as ImageIcon } from 'lucide-react';

type Tab = 'success' | 'posts' | 'forms' | 'cases';

// Admin Password Configuration
const ADMIN_PASSWORD = "sllaw0072";

export const Admin: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('success');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Data Context
  const { 
    successCases, addSuccessCase, updateSuccessCase, deleteSuccessCase,
    legalPosts, addLegalPost, updateLegalPost, deleteLegalPost,
    legalForms, addLegalForm, updateLegalForm, deleteLegalForm,
    legalCases, addLegalCase, updateLegalCase, deleteLegalCase
  } = useData();

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Generic State holders for forms
  const [formData, setFormData] = useState<any>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
      } else {
        setError('비밀번호가 올바르지 않습니다.');
      }
      setIsProcessing(false);
    }, 500);
  };

  const startEdit = (item: any) => {
    setFormData({ ...item });
    setEditId(item.id);
    setIsEditing(true);
  };

  const startAdd = () => {
    setFormData({});
    setEditId(null);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!formData.title || formData.title.trim() === '') {
        alert("제목은 필수 입력 항목입니다.");
        return;
    }

    if (activeTab === 'success') {
      if (editId) updateSuccessCase(formData as SuccessCase);
      else addSuccessCase(formData as SuccessCase);
    } else if (activeTab === 'posts') {
      if (editId) updateLegalPost(formData as LegalPost);
      else addLegalPost({ ...formData, date: new Date().toLocaleDateString() } as LegalPost);
    } else if (activeTab === 'forms') {
      if (!formData.format || !formData.size) {
          alert("파일을 업로드하거나 형식을 입력해주세요.");
          return;
      }
      if (editId) updateLegalForm(formData as LegalForm);
      else addLegalForm(formData as LegalForm);
    } else if (activeTab === 'cases') {
      const dataToSave = { ...formData };
      if (typeof dataToSave.tags === 'string') {
          dataToSave.tags = dataToSave.tags.split(',').map((t: string) => t.trim());
      }
      if (editId) updateLegalCase(dataToSave as LegalCase);
      else addLegalCase(dataToSave as LegalCase);
    }
    setIsEditing(false);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (value.length > 5000) return; 
    setFormData({ ...formData, [name]: value });
  };

  // Handler for Legal Forms upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("데모 환경 제한으로 2MB 이하의 파일만 업로드 가능합니다.");
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const extension = file.name.split('.').pop()?.toUpperCase() || 'FILE';
        let sizeString = '';
        if (file.size < 1024 * 1024) {
          sizeString = (file.size / 1024).toFixed(1) + 'KB';
        } else {
          sizeString = (file.size / (1024 * 1024)).toFixed(1) + 'MB';
        }

        setFormData({
          ...formData,
          title: formData.title || file.name,
          format: extension,
          size: sizeString,
          fileUrl: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler for Success Case Judgment file upload
  const handleJudgmentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
       // Allow PDF, JPG, PNG
       const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
       if (!validTypes.includes(file.type)) {
           alert("PDF, JPG, PNG 파일만 업로드 가능합니다.");
           return;
       }

       if (file.size > 3 * 1024 * 1024) {
          alert("3MB 이하의 파일만 업로드 가능합니다.");
          return;
       }

       const reader = new FileReader();
       reader.onloadend = () => {
          let format = 'image';
          if (file.type === 'application/pdf') format = 'pdf';
          
          setFormData({
            ...formData,
            judgmentUrl: reader.result as string,
            judgmentFormat: format
          });
       };
       reader.readAsDataURL(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
        <button 
          onClick={() => navigateTo('home')}
          className="absolute top-6 left-6 text-gray-500 hover:text-brand-dark flex items-center gap-2 transition-colors font-medium"
        >
          <ArrowLeft size={20} /> 홈으로
        </button>
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-brand-dark text-white rounded-full flex items-center justify-center mb-4">
              <Lock size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">관리자 로그인</h2>
            <p className="text-sm text-gray-500 mt-2">콘텐츠 관리를 위해 로그인해주세요.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
              disabled={isProcessing}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-brand-gold text-white font-bold py-3 rounded hover:bg-yellow-700 transition-colors disabled:opacity-50"
            >
              {isProcessing ? '확인 중...' : '로그인'}
            </button>
          </form>
          <div className="mt-4 text-center text-xs text-gray-400">
             (데모 환경 호환성 모드 적용됨)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-brand-dark text-white py-6 shadow-md">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold">SOL & LUNA 관리자</h1>
          <button onClick={() => setIsAuthenticated(false)} className="text-sm text-gray-300 hover:text-white">로그아웃</button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-2">
          {[
            { id: 'success', label: '성공 사례' },
            { id: 'posts', label: '최신 법률 정보' },
            { id: 'forms', label: '법률 서식' },
            { id: 'cases', label: '주요 판례' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as Tab); setIsEditing(false); }}
              className={`px-6 py-3 rounded-t-lg font-medium transition-colors ${
                activeTab === tab.id ? 'bg-white text-brand-gold border-t border-x border-gray-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {activeTab === 'success' && '성공 사례 관리'}
            {activeTab === 'posts' && '최신 법률 정보 관리'}
            {activeTab === 'forms' && '법률 서식 관리'}
            {activeTab === 'cases' && '주요 판례 관리'}
          </h2>
          <button 
            onClick={startAdd}
            className="flex items-center gap-2 bg-brand-gold text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
          >
            <Plus size={18} /> 새 항목 추가
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isEditing ? (
            <div className="p-8">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold">{editId ? '항목 수정' : '새 항목 추가'}</h3>
                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>
              
              <div className="space-y-4 max-w-2xl">
                {activeTab === 'success' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">제목 <span className="text-red-500">*</span></label>
                      <input name="title" value={formData.title || ''} onChange={handleChange} maxLength={100} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                      <input name="category" value={formData.category || ''} onChange={handleChange} maxLength={50} className="w-full border p-2 rounded" placeholder="예: 형사, 민사" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">결과</label>
                      <input name="result" value={formData.result || ''} onChange={handleChange} maxLength={50} className="w-full border p-2 rounded" placeholder="예: 무죄, 승소" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                      <textarea name="description" value={formData.description || ''} onChange={handleChange} maxLength={500} rows={4} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">판결문 업로드 (선택)</label>
                        <div className="flex items-center gap-4">
                            <input 
                                type="file" 
                                id="judgmentFile"
                                onChange={handleJudgmentFileChange}
                                className="hidden" 
                                accept=".pdf, .jpg, .jpeg, .png"
                            />
                            <button 
                                onClick={() => document.getElementById('judgmentFile')?.click()}
                                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 flex items-center gap-2 text-sm text-gray-700"
                            >
                                <Upload size={16} /> 파일 선택 (PDF/JPG)
                            </button>
                            {formData.judgmentUrl && (
                                <span className="text-sm text-green-600 flex items-center gap-1">
                                    <ImageIcon size={14} /> 파일 등록됨 ({formData.judgmentFormat})
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">※ 3MB 이하의 PDF 또는 이미지 파일만 업로드 가능합니다.</p>
                    </div>
                  </>
                )}

                {activeTab === 'posts' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">제목 <span className="text-red-500">*</span></label>
                      <input name="title" value={formData.title || ''} onChange={handleChange} maxLength={100} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                      <input name="category" value={formData.category || ''} onChange={handleChange} maxLength={50} className="w-full border p-2 rounded" placeholder="예: 건설/부동산" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">요약 내용</label>
                      <textarea name="summary" value={formData.summary || ''} onChange={handleChange} maxLength={200} rows={3} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">본문 내용</label>
                      <textarea name="content" value={formData.content || ''} onChange={handleChange} maxLength={3000} rows={10} className="w-full border p-2 rounded" placeholder="전체 본문 내용을 입력하세요." />
                    </div>
                    {!editId && <p className="text-sm text-gray-500">작성일은 자동으로 오늘 날짜로 저장됩니다.</p>}
                  </>
                )}

                {activeTab === 'forms' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">서식 파일 업로드 <span className="text-red-500">*</span></label>
                      <div className="flex items-center gap-4">
                          <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden" 
                          />
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 flex items-center gap-2 text-sm text-gray-700"
                          >
                             <Upload size={16} /> 파일 선택
                          </button>
                          <span className="text-sm text-gray-500">
                             {formData.format ? `${formData.title} (${formData.size})` : '선택된 파일 없음'}
                          </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">※ 데모 버전에서는 2MB 이하의 파일만 업로드 가능합니다.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">서식명 <span className="text-red-500">*</span></label>
                      <input name="title" value={formData.title || ''} onChange={handleChange} maxLength={100} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                      <input name="category" value={formData.category || ''} onChange={handleChange} maxLength={50} className="w-full border p-2 rounded" placeholder="예: 민사, 형사" />
                    </div>
                    <div className="flex gap-4 p-4 bg-gray-50 rounded border border-gray-100">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">형식 (자동입력)</label>
                        <input name="format" value={formData.format || ''} readOnly className="w-full bg-transparent border-none p-0 text-gray-700 font-medium focus:ring-0" placeholder="-" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">용량 (자동입력)</label>
                        <input name="size" value={formData.size || ''} readOnly className="w-full bg-transparent border-none p-0 text-gray-700 font-medium focus:ring-0" placeholder="-" />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'cases' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">판례 제목 <span className="text-red-500">*</span></label>
                      <input name="title" value={formData.title || ''} onChange={handleChange} maxLength={100} className="w-full border p-2 rounded" />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">선고 법원/일자</label>
                        <input name="court" value={formData.court || ''} onChange={handleChange} maxLength={100} className="w-full border p-2 rounded" placeholder="예: 대법원 2023. 5. 12. 선고" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">사건 번호</label>
                        <input name="caseNumber" value={formData.caseNumber || ''} onChange={handleChange} maxLength={50} className="w-full border p-2 rounded" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">요약</label>
                      <textarea name="summary" value={formData.summary || ''} onChange={handleChange} maxLength={300} rows={3} className="w-full border p-2 rounded" />
                    </div>
                     <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">전체 내용</label>
                      <textarea name="content" value={formData.content || ''} onChange={handleChange} maxLength={3000} rows={10} className="w-full border p-2 rounded" placeholder="판결 요지 및 전체 내용을 입력하세요." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">태그 (쉼표로 구분)</label>
                      <input name="tags" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''} onChange={handleChange} maxLength={100} className="w-full border p-2 rounded" placeholder="형사, 부동산, 배임" />
                    </div>
                  </>
                )}

                <div className="pt-4 flex gap-3">
                  <button onClick={handleSave} className="bg-brand-dark text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors flex items-center gap-2">
                    <Save size={18} /> 저장하기
                  </button>
                  <button onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 transition-colors">
                    취소
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상세 정보</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeTab === 'success' && successCases.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.category} / {item.result}
                        {item.judgmentUrl && <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">파일있음</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => startEdit(item)} className="text-brand-gold hover:text-yellow-700 mr-4"><Edit size={18} /></button>
                        <button onClick={() => deleteSuccessCase(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'posts' && legalPosts.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                         <span className="block">{item.date}</span>
                         <span className="text-xs text-brand-gold">{item.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => startEdit(item)} className="text-brand-gold hover:text-yellow-700 mr-4"><Edit size={18} /></button>
                        <button onClick={() => deleteLegalPost(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'forms' && legalForms.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 flex items-center gap-2">
                        {item.fileUrl ? <FileText size={16} className="text-brand-gold"/> : <FileText size={16} className="text-gray-300"/>}
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{item.category} ({item.format}, {item.size})</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => startEdit(item)} className="text-brand-gold hover:text-yellow-700 mr-4"><Edit size={18} /></button>
                        <button onClick={() => deleteLegalForm(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'cases' && legalCases.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{item.court}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => startEdit(item)} className="text-brand-gold hover:text-yellow-700 mr-4"><Edit size={18} /></button>
                        <button onClick={() => deleteLegalCase(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};