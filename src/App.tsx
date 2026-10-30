/**
 * NEXORA AI — Master Application Root & Router
 * Unifies all 20 pages + legal compliance suite with
 * dark cinematic SaaS design system and responsive navigation.
 */

import React, { useState } from 'react';
import { ActivePage } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AppSidebar } from './components/layout/AppSidebar';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ExplorePage } from './pages/public/ExplorePage';
import { PricingPage } from './pages/public/PricingPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { BlogPage } from './pages/public/BlogPage';
import { HelpCenterPage } from './pages/public/HelpCenterPage';
import { AuthPage } from './pages/public/AuthPage';
import { LegalPages } from './pages/public/LegalPages';

// 7 AI Studios
import { WritingStudio } from './pages/studios/WritingStudio';
import { ImageStudio } from './pages/studios/ImageStudio';
import { VideoStudio } from './pages/studios/VideoStudio';
import { DocumentStudio } from './pages/studios/DocumentStudio';
import { ChatbotStudio } from './pages/studios/ChatbotStudio';
import { MarketingStudio } from './pages/studios/MarketingStudio';
import { BusinessStudio } from './pages/studios/BusinessStudio';

// Authenticated Application Pages
import { DashboardPage } from './pages/app/DashboardPage';
import { ProjectsPage } from './pages/app/ProjectsPage';
import { BillingPage } from './pages/app/BillingPage';
import { SettingsPage } from './pages/app/SettingsPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

function MainRouter() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const { user } = useAuth();

  // Determine whether current page uses the dashboard sidebar layout
  const isStudioOrApp = 
    activePage.startsWith('studio-') ||
    ['dashboard', 'projects', 'billing', 'settings', 'admin'].includes(activePage);

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage setActivePage={setActivePage} />;
      case 'explore':
        return <ExplorePage setActivePage={setActivePage} />;
      case 'studio-writing':
        return <WritingStudio />;
      case 'studio-image':
        return <ImageStudio />;
      case 'studio-video':
        return <VideoStudio />;
      case 'studio-document':
        return <DocumentStudio />;
      case 'studio-chatbot':
        return <ChatbotStudio />;
      case 'studio-marketing':
        return <MarketingStudio />;
      case 'studio-business':
        return <BusinessStudio />;
      case 'pricing':
        return <PricingPage setActivePage={setActivePage} />;
      case 'about':
        return <AboutPage setActivePage={setActivePage} />;
      case 'contact':
        return <ContactPage setActivePage={setActivePage} />;
      case 'blog':
        return <BlogPage setActivePage={setActivePage} />;
      case 'help':
        return <HelpCenterPage setActivePage={setActivePage} />;
      case 'auth':
        return <AuthPage setActivePage={setActivePage} />;
      case 'dashboard':
        return <DashboardPage setActivePage={setActivePage} />;
      case 'projects':
        return <ProjectsPage setActivePage={setActivePage} />;
      case 'billing':
        return <BillingPage setActivePage={setActivePage} />;
      case 'settings':
        return <SettingsPage setActivePage={setActivePage} />;
      case 'admin':
        return <AdminDashboardPage setActivePage={setActivePage} />;
      case 'legal-privacy':
        return <LegalPages initialTab="privacy" setActivePage={setActivePage} />;
      case 'legal-terms':
        return <LegalPages initialTab="terms" setActivePage={setActivePage} />;
      case 'legal-cookies':
        return <LegalPages initialTab="cookies" setActivePage={setActivePage} />;
      case 'legal-refund':
        return <LegalPages initialTab="refund" setActivePage={setActivePage} />;
      case 'legal-acceptable-use':
        return <LegalPages initialTab="acceptable-use" setActivePage={setActivePage} />;
      default:
        return <HomePage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080B14] text-[#F8FAFC]">
      {/* Universal Top Navigation */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Body */}
      {isStudioOrApp && user ? (
        <div className="flex-1 flex overflow-hidden">
          <AppSidebar activePage={activePage} setActivePage={setActivePage} />
          <main className="flex-1 overflow-y-auto bg-[#080B14]">
            {renderCurrentPage()}
          </main>
        </div>
      ) : (
        <main className="flex-1">
          {renderCurrentPage()}
        </main>
      )}

      {/* Universal Footer */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainRouter />
      </ToastProvider>
    </AuthProvider>
  );
}
