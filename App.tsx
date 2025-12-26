import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { PracticeAreas } from './components/PracticeAreas';
import { SuccessCases } from './components/SuccessCases';
import { SuccessDetail } from './components/SuccessDetail';
import { LegalInfo } from './components/LegalInfo';
import { LegalDetail } from './components/LegalDetail';
import { LegalForms } from './components/LegalForms';
import { LegalCases } from './components/LegalCases';
import { CaseDetail } from './components/CaseDetail';
import { SmartTools } from './components/SmartTools';
import { Contact } from './components/Contact';
import { Consultation } from './components/Consultation';
import { Footer } from './components/Footer';
import { Admin } from './components/Admin';
import { NavigationContext, PageType } from './contexts/NavigationContext';
import { DataProvider } from './contexts/DataContext';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [detailId, setDetailId] = useState<number | null>(null);

  const navigateTo = (page: PageType, id?: number) => {
    setCurrentPage(page);
    if (id !== undefined) {
      setDetailId(id);
    }
    window.scrollTo(0, 0);
  };

  return (
    <DataProvider>
      <NavigationContext.Provider value={{ currentPage, detailId, navigateTo }}>
        <div className="min-h-screen bg-white flex flex-col">
          {currentPage !== 'admin' && <Navigation />}
          <main className={`flex-grow ${currentPage === 'home' ? '' : currentPage === 'admin' ? '' : 'pt-20'}`}>
            {currentPage === 'home' && (
              <>
                <Hero />
                <About />
                <SuccessCases limit={3} />
                <LegalCases limit={3} />
                <Contact />
              </>
            )}
            {currentPage === 'about' && <About />}
            {currentPage === 'practice' && <PracticeAreas />}
            {currentPage === 'success' && <SuccessCases />}
            {currentPage === 'success-detail' && <SuccessDetail />}
            {currentPage === 'legal' && <LegalInfo />}
            {currentPage === 'legal-detail' && <LegalDetail />}
            {currentPage === 'legal-forms' && <LegalForms />}
            {currentPage === 'legal-cases' && <LegalCases />}
            {currentPage === 'case-detail' && <CaseDetail />}
            {currentPage === 'tools' && <SmartTools />}
            {currentPage === 'contact' && <Contact />}
            {currentPage === 'consultation' && <Consultation />}
            {currentPage === 'admin' && <Admin />}
          </main>
          {currentPage !== 'admin' && <Footer />}
        </div>
      </NavigationContext.Provider>
    </DataProvider>
  );
};

export default App;