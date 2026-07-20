'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useData } from '../contexts/DataContext';
import { SuccessCase, LegalPost, LegalForm, LegalCase } from '../types';
import { Trash2, Edit, Plus, Save, X, Lock, ArrowLeft, Upload, FileText, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { RichTextEditor } from './RichTextEditor';

type Tab = 'success' | 'posts' | 'forms' | 'cases';

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        console.error('Login error:', authError);
        setIsProcessing(false);
        return;
      }

      if (data.user) {
        setIsAuthenticated(true);
        setError('');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
      console.error('Login exception:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper: Extract path from Public URL
  const extractPathFromUrl = (url: string, bucket: string) => {
    try {
      // Example: .../storage/v1/object/public/judgments/123.pdf
      // We want: 123.pdf (inside the bucket)
      const parts = url.split(`/public/${bucket}/`);
      if (parts.length < 2) return null;
      return parts[1]; // Returns the path after the bucket name
    } catch (e) {
      return null;
    }
  };

  // Helper: Delete file from Storage
  const deleteFileFromStorage = async (url: string, bucket: string) => {
    const path = extractPathFromUrl(url, bucket);
    if (!path) return;

    // Fire and forget (don't block UI)
    supabase.storage.from(bucket).remove([path]).then(({ error }) => {
      if (error) console.error(`Error deleting file from ${bucket}:`, error);
    });
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

  const cleanupUnusedImages = async () => {
    const currentImages = formData.imageUrls as string[] || [];
    if (currentImages.length === 0) return;

    let contentToCheck = '';
    if (activeTab === 'success') contentToCheck = formData.description || '';
    else if (activeTab === 'posts') contentToCheck = formData.content || '';
    else if (activeTab === 'cases') contentToCheck = formData.content || '';

    const remainingImages = currentImages.filter(url => contentToCheck.includes(url));
    const imagesToDelete = currentImages.filter(url => !contentToCheck.includes(url));

    if (imagesToDelete.length > 0) {
      imagesToDelete.forEach(url => deleteFileFromStorage(url, 'content-images'));
    }

    // Update formData with only remaining images
    setFormData((prev: any) => ({ ...prev, imageUrls: remainingImages }));
  };

  const handleSave = async () => {
    if (!formData.title || formData.title.trim() === '') {
      alert("제목은 필수 입력 항목입니다.");
      return;
    }

    // Cleanup unused images from Editor
    await cleanupUnusedImages();

    if (activeTab === 'success') {
      const cleanData = {
        ...formData,
        category: formData.category || '',
        result: formData.result || '',
        description: formData.description || '',
        judgmentUrl: formData.judgmentUrl || null,
        judgmentFormat: formData.judgmentFormat || null
      };
      if (editId) updateSuccessCase(cleanData as SuccessCase);
      else addSuccessCase(cleanData as SuccessCase);
    } else if (activeTab === 'posts') {
      const cleanData = {
        ...formData,
        category: formData.category || '',
        summary: formData.summary || '',
        content: formData.content || '',
        date: editId ? formData.date : new Date().toLocaleDateString()
      };
      if (editId) updateLegalPost(cleanData as LegalPost);
      else addLegalPost(cleanData as LegalPost);
    } else if (activeTab === 'forms') {
      if (!formData.format || !formData.size) {
        alert("파일을 업로드하거나 형식을 입력해주세요.");
        return;
      }
      const cleanData = {
        ...formData,
        category: formData.category || '',
        fileUrl: formData.fileUrl || null
      };
      if (editId) updateLegalForm(cleanData as LegalForm);
      else addLegalForm(cleanData as LegalForm);
    } else if (activeTab === 'cases') {
      const dataToSave = { ...formData };
      // tags 처리: 문자열이면 배열로 변환, 없으면 빈 배열
      if (typeof dataToSave.tags === 'string') {
        dataToSave.tags = dataToSave.tags.trim() ? dataToSave.tags.split(',').map((t: string) => t.trim()).filter(t => t) : [];
      } else if (!dataToSave.tags) {
        dataToSave.tags = [];
      }
      // 다른 필드 null 안전성 확보
      const cleanData = {
        ...dataToSave,
        court: dataToSave.court || '',
        caseNumber: dataToSave.caseNumber || '',
        summary: dataToSave.summary || '',
        content: dataToSave.content || ''
      };
      if (editId) updateLegalCase(cleanData as LegalCase);
      else addLegalCase(cleanData as LegalCase);
    }
    setIsEditing(false);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (value.length > 5000) return;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Handler for Legal Forms upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 50MB limit
    if (file.size > 50 * 1024 * 1024) {
      alert("파일 크기는 50MB 이하여야 합니다.");
      e.target.value = '';
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `forms/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('legal-forms')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('legal-forms')
        .getPublicUrl(filePath);

      const extension = fileExt?.toUpperCase() || 'FILE';
      let sizeString = '';
      if (file.size < 1024 * 1024) {
        sizeString = (file.size / 1024).toFixed(1) + 'KB';
      } else {
        sizeString = (file.size / (1024 * 1024)).toFixed(1) + 'MB';
      }

      setFormData((prev: any) => ({
        ...prev,
        title: prev.title || file.name,
        format: extension,
        size: sizeString,
        fileUrl: publicUrl
      }));

      alert('파일이 업로드되었습니다.');
    } catch (error) {
      console.error('Upload error:', error);
      alert('파일 업로드 중 오류가 발생했습니다: ' + (error as Error).message);
    }
  };

  // Handler for Success Case Judgment file upload
  const handleJudgmentFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Allow PDF, JPG, PNG
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert("PDF, JPG, PNG 파일만 업로드 가능합니다.");
      return;
    }

    // 50MB limit
    if (file.size > 50 * 1024 * 1024) {
      alert("파일 크기는 50MB 이하여야 합니다.");
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `judgments/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('judgments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('judgments')
        .getPublicUrl(filePath);

      let format = 'image';
      if (file.type === 'application/pdf') format = 'pdf';

      setFormData((prev: any) => ({
        ...prev,
        judgmentUrl: publicUrl,
        judgmentFormat: format
      }));

      alert('판결문이 업로드되었습니다.');
    } catch (error) {
      console.error('Upload error:', error);
      alert('파일 업로드 중 오류가 발생했습니다: ' + (error as Error).message);
    }
  };

  const handleRemoveJudgment = async () => {
    if (window.confirm('판결문 파일을 삭제하시겠습니까?')) {
      if (formData.judgmentUrl) {
        await deleteFileFromStorage(formData.judgmentUrl, 'judgments');
      }
      setFormData((prev: any) => ({
        ...prev,
        judgmentUrl: null,
        judgmentFormat: null
      }));
    }
  };

  const handleRemoveFile = async () => {
    if (window.confirm('첨부 파일을 삭제하시겠습니까?')) {
      if (formData.fileUrl) {
        await deleteFileFromStorage(formData.fileUrl, 'legal-forms');
      }
      setFormData((prev: any) => ({
        ...prev,
        fileUrl: null,
        format: null,
        size: null
      }));
      // Reset input if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const [testResult, setTestResult] = useState<{ url: string; status: string } | null>(null);

  const handleTestUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `test_${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('content-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('content-images')
        .getPublicUrl(fileName);

      // Check access
      const response = await fetch(publicUrl);
      setTestResult({
        url: publicUrl,
        status: response.status === 200 ? '성공 (200 OK)' : `실패 (${response.status})`
      });

    } catch (err) {
      alert('테스트 실패: ' + (err as Error).message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
        <Link
          href="/"
          className="absolute top-6 left-6 text-gray-500 hover:text-brand-dark flex items-center gap-2 transition-colors font-medium"
        >
          <ArrowLeft size={20} /> 홈으로
        </Link>
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
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
              disabled={isProcessing}
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
              disabled={isProcessing}
              required
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

  // 목록 카드 표시용 제목 입력 (성공사례·법률정보·주요판례 공용)
  const listTitleField = (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        목록 제목{' '}
        <span className="font-normal text-gray-400">({(formData.listTitle || '').length}자)</span>
      </label>
      <input
        name="listTitle"
        value={formData.listTitle || ''}
        onChange={handleChange}
        maxLength={60}
        className="w-full border p-2 rounded"
        placeholder="목록 카드에 표시될 짧은 제목 (25자 내외, 비우면 원제목 표시)"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-brand-dark text-white py-6 shadow-md">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold">SOL & LUNA 관리자</h1>
          <button onClick={() => setIsAuthenticated(false)} className="text-sm text-gray-300 hover:text-white">로그아웃</button>
        </div>
      </header>

      {/* 이미지 테스트 도구 */}
      <div className="container mx-auto px-6 mt-6">
        <div className="p-4 bg-gray-100 rounded-lg border border-gray-300">
          <h3 className="font-bold mb-2">📸 이미지 업로드 진단 도구 (문제가 있을 때 사용)</h3>
          <input type="file" onChange={handleTestUpload} className="mb-2" />
          {testResult && (
            <div className="mt-2 bg-white p-2 rounded border">
              <p><strong>상태:</strong> <span className={testResult.status.includes('200') ? 'text-green-600' : 'text-red-600'}>{testResult.status}</span></p>
              <p className="text-xs text-gray-500 break-all my-1">{testResult.url}</p>
              {testResult.status.includes('200') ? (
                <img src={testResult.url} alt="Test" className="mt-2 max-w-xs border rounded" />
              ) : (
                <p className="text-red-500 font-bold mt-1 text-sm">
                  이미지가 보이지 않는다면 Supabase Bucket 설정을 확인해야 합니다.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

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
              className={`px-6 py-3 rounded-t-lg font-medium transition-colors ${activeTab === tab.id ? 'bg-white text-brand-gold border-t border-x border-gray-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
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
                    {listTitleField}
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
                      <RichTextEditor
                        value={formData.description || ''}
                        onChange={(html) => setFormData((prev: any) => ({ ...prev, description: html }))}
                        maxLength={1000}
                        placeholder="성공 사례 설명을 작성하세요..."
                        onImageUpload={(url) => {
                          setFormData((prev: any) => {
                            const currentUrls = prev.imageUrls || [];
                            return { ...prev, imageUrls: [...currentUrls, url] };
                          });
                        }}
                      />
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
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-green-600 flex items-center gap-1">
                              <ImageIcon size={14} /> 파일 등록됨 ({formData.judgmentFormat})
                            </span>
                            <button
                              onClick={handleRemoveJudgment}
                              className="text-gray-400 hover:text-red-500"
                              title="파일 삭제"
                            >
                              <X size={16} />
                            </button>
                          </div>
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
                    {listTitleField}
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
                      <RichTextEditor
                        value={formData.content || ''}
                        onChange={(html) => setFormData((prev: any) => ({ ...prev, content: html }))}
                        maxLength={5000}
                        placeholder="전체 본문 내용을 입력하세요..."
                        onImageUpload={(url) => {
                          setFormData((prev: any) => {
                            const currentUrls = prev.imageUrls || [];
                            return { ...prev, imageUrls: [...currentUrls, url] };
                          });
                        }}
                      />
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
                    {listTitleField}
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
                      <RichTextEditor
                        value={formData.content || ''}
                        onChange={(html) => setFormData((prev: any) => ({ ...prev, content: html }))}
                        maxLength={5000}
                        placeholder="판결 요지 및 전체 내용을 입력하세요..."
                        onImageUpload={(url) => {
                          setFormData((prev: any) => {
                            const currentUrls = prev.imageUrls || [];
                            return { ...prev, imageUrls: [...currentUrls, url] };
                          });
                        }}
                      />
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
                        {item.fileUrl ? <FileText size={16} className="text-brand-gold" /> : <FileText size={16} className="text-gray-300" />}
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