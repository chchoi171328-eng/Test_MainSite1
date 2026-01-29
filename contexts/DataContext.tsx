import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SuccessCase, LegalPost, LegalForm, LegalCase } from '../types';
import * as successCasesAPI from '../api/successCases';
import * as legalPostsAPI from '../api/legalPosts';
import * as legalFormsAPI from '../api/legalForms';
import * as legalCasesAPI from '../api/legalCases';

interface DataContextType {
  successCases: SuccessCase[];
  legalPosts: LegalPost[];
  legalForms: LegalForm[];
  legalCases: LegalCase[];
  loading: boolean;

  addSuccessCase: (item: Omit<SuccessCase, 'id'>) => Promise<void>;
  updateSuccessCase: (item: SuccessCase) => Promise<void>;
  deleteSuccessCase: (id: number) => Promise<void>;

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
  const [successCases, setSuccessCases] = useState<SuccessCase[]>([]);
  const [legalPosts, setLegalPosts] = useState<LegalPost[]>([]);
  const [legalForms, setLegalForms] = useState<LegalForm[]>([]);
  const [legalCases, setLegalCases] = useState<LegalCase[]>([]);
  const [loading, setLoading] = useState(true);

  // 데이터 로드 함수 (각 API 에러를 개별 처리)
  const loadData = async () => {
    setLoading(true);

    // 각 API를 개별적으로 호출하여 하나가 실패해도 다른 것은 로드됨
    const [casesResult, postsResult, formsResult, legalCasesResult] = await Promise.allSettled([
      successCasesAPI.getAllSuccessCases(),
      legalPostsAPI.getAllLegalPosts(),
      legalFormsAPI.getAllLegalForms(),
      legalCasesAPI.getAllLegalCases(),
    ]);

    setSuccessCases(casesResult.status === 'fulfilled' ? casesResult.value : []);
    setLegalPosts(postsResult.status === 'fulfilled' ? postsResult.value : []);
    setLegalForms(formsResult.status === 'fulfilled' ? formsResult.value : []);
    setLegalCases(legalCasesResult.status === 'fulfilled' ? legalCasesResult.value : []);

    // 에러 로깅
    if (casesResult.status === 'rejected') console.error('Error loading success cases:', casesResult.reason);
    if (postsResult.status === 'rejected') console.error('Error loading legal posts:', postsResult.reason);
    if (formsResult.status === 'rejected') console.error('Error loading legal forms:', formsResult.reason);
    if (legalCasesResult.status === 'rejected') console.error('Error loading legal cases:', legalCasesResult.reason);

    setLoading(false);
  };

  // 초기 데이터 로드
  useEffect(() => {
    loadData();
  }, []);

  // Success Cases CRUD
  const addSuccessCase = async (item: Omit<SuccessCase, 'id'>) => {
    try {
      const newCase = await successCasesAPI.createSuccessCase(item);
      setSuccessCases(prev => [newCase, ...prev]);
    } catch (error) {
      console.error('Error adding success case:', error);
      throw error;
    }
  };

  const updateSuccessCase = async (item: SuccessCase) => {
    try {
      const updated = await successCasesAPI.updateSuccessCase(item);
      setSuccessCases(prev => prev.map(c => c.id === updated.id ? updated : c));
    } catch (error) {
      console.error('Error updating success case:', error);
      throw error;
    }
  };

  const deleteSuccessCase = async (id: number) => {
    try {
      await successCasesAPI.deleteSuccessCase(id);
      setSuccessCases(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting success case:', error);
      throw error;
    }
  };

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
        successCases,
        legalPosts,
        legalForms,
        legalCases,
        loading,
        addSuccessCase,
        updateSuccessCase,
        deleteSuccessCase,
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