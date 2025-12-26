import React, { createContext, useContext } from 'react';

export type PageType = 'home' | 'about' | 'practice' | 'success' | 'success-detail' | 'legal' | 'legal-detail' | 'legal-forms' | 'legal-cases' | 'case-detail' | 'tools' | 'contact' | 'consultation' | 'admin';

interface NavigationContextType {
  currentPage: PageType;
  detailId: number | null;
  navigateTo: (page: PageType, id?: number) => void;
}

export const NavigationContext = createContext<NavigationContextType>({
  currentPage: 'home',
  detailId: null,
  navigateTo: () => {},
});

export const useNavigation = () => useContext(NavigationContext);