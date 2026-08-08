'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LegalPost, LegalForm, LegalCase } from '../types';
import * as legalPostsAPI from '../api/legalPosts';
import * as legalFormsAPI from '../api/legalForms';
import * as legalCasesAPI from '../api/legalCases';

interface DataContextType {
  // 성공사례는 파일 기반(/content/cases)으로 전환되어 이 컨텍스트에서 제외됨
  // (CASE_BOARD_BRIEF 작업 2-3 — success_cases 테이블은 백업으로 보존)
  legalPosts: LegalPost[];
  legalForms: LegalForm[];
  legalCases: LegalCase[];
  loading: boolean;

  addLegalPost: (item: Omit<LegalPost, 'id'>) => Promise<void>;
  updateLegalPost: (item: LegalPost) => Promise<void>;
  deleteLegalPost: (id: number) => Promise<void>;

  addLegalForm: (item: Omit<LegalForm, 'id'>) => Promise<void>;
  updateLegalForm: (item: LegalForm) => Promise<void>;
  deleteLegalForm: (id: number) => Promise<void>;

  addLegalCase: (item: Omit<LegalCase, 'id'>) => Promise<void>;
  updateLegalCase: (item: LegalCase) => Promise<void>;
  deleteLegalCase: (id: number) => Promise<void>;

  refreshData: () => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [legalPosts, setLegalPosts] = useState<LegalPost[]>([]);
  const [legalForms, setLegalForms] = useState<LegalForm[]>([]);
  const [legalCases, setLegalCases] = useState<LegalCase[]>([]);
  const [loading, setLoading] = useState(true);

  // 데이터 로드 함수 (각 API 에러를 개별 처리)
  const loadData = async () => {
    setLoading(true);

    // 각 API를 개별적으로 호출하여 하나가 실패해도 다른 것은 로드됨
    const [postsResult, formsResult, legalCasesResult] = await Promise.allSettled([
      legalPostsAPI.getAllLegalPosts(),
      legalFormsAPI.getAllLegalForms(),
      legalCasesAPI.getAllLegalCases(),
    ]);

    setLegalPosts(postsResult.status === 'fulfilled' ? postsResult.value : []);
    setLegalForms(formsResult.status === 'fulfilled' ? formsResult.value : []);
    setLegalCases(legalCasesResult.status === 'fulfilled' ? legalCasesResult.value : []);

    // 에러 로깅
    if (postsResult.status === 'rejected') console.error('Error loading legal posts:', postsResult.reason);
    if (formsResult.status === 'rejected') console.error('Error loading legal forms:', formsResult.reason);
    if (legalCasesResult.status === 'rejected') console.error('Error loading legal cases:', legalCasesResult.reason);

    setLoading(false);
  };

  // 초기 데이터 로드
  useEffect(() => {
    loadData();
  }, []);

  // Legal Posts CRUD
  const addLegalPost = async (item: Omit<LegalPost, 'id'>) => {
    try {
      const newPost = await legalPostsAPI.createLegalPost(item);
      setLegalPosts(prev => [newPost, ...prev]);
    } catch (error) {
      console.error('Error adding legal post:', error);
      throw error;
    }
  };

  const updateLegalPost = async (item: LegalPost) => {
    try {
      const updated = await legalPostsAPI.updateLegalPost(item);
      setLegalPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
    } catch (error) {
      console.error('Error updating legal post:', error);
      throw error;
    }
  };

  const deleteLegalPost = async (id: number) => {
    try {
      await legalPostsAPI.deleteLegalPost(id);
      setLegalPosts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting legal post:', error);
      throw error;
    }
  };

  // Legal Forms CRUD
  const addLegalForm = async (item: Omit<LegalForm, 'id'>) => {
    try {
      const newForm = await legalFormsAPI.createLegalForm(item);
      setLegalForms(prev => [newForm, ...prev]);
    } catch (error) {
      console.error('Error adding legal form:', error);
      throw error;
    }
  };

  const updateLegalForm = async (item: LegalForm) => {
    try {
      const updated = await legalFormsAPI.updateLegalForm(item);
      setLegalForms(prev => prev.map(f => f.id === updated.id ? updated : f));
    } catch (error) {
      console.error('Error updating legal form:', error);
      throw error;
    }
  };

  const deleteLegalForm = async (id: number) => {
    try {
      await legalFormsAPI.deleteLegalForm(id);
      setLegalForms(prev => prev.filter(f => f.id !== id));
    } catch (error) {
      console.error('Error deleting legal form:', error);
      throw error;
    }
  };

  // Legal Cases CRUD
  const addLegalCase = async (item: Omit<LegalCase, 'id'>) => {
    try {
      const newCase = await legalCasesAPI.createLegalCase(item);
      setLegalCases(prev => [newCase, ...prev]);
    } catch (error) {
      console.error('Error adding legal case:', error);
      throw error;
    }
  };

  const updateLegalCase = async (item: LegalCase) => {
    try {
      const updated = await legalCasesAPI.updateLegalCase(item);
      setLegalCases(prev => prev.map(c => c.id === updated.id ? updated : c));
    } catch (error) {
      console.error('Error updating legal case:', error);
      throw error;
    }
  };

  const deleteLegalCase = async (id: number) => {
    try {
      await legalCasesAPI.deleteLegalCase(id);
      setLegalCases(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting legal case:', error);
      throw error;
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  return (
    <DataContext.Provider
      value={{
        legalPosts,
        legalForms,
        legalCases,
        loading,
        addLegalPost,
        updateLegalPost,
        deleteLegalPost,
        addLegalForm,
        updateLegalForm,
        deleteLegalForm,
        addLegalCase,
        updateLegalCase,
        deleteLegalCase,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};