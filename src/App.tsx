import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { EmergencyBanner } from './components/common/EmergencyBanner';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { HomePage } from './pages/HomePage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { BookingModal } from './components/booking/BookingModal';

// Code-split lazy loaded PortalPage and AdminApp
const PortalPage = lazy(() =>
  import('./pages/PortalPage').then((m) => ({ default: m.PortalPage }))
);
const AdminApp = lazy(() =>
  import('./admin/AdminApp').then((m) => ({ default: m.AdminApp }))
);

const AppContent: React.FC = () => {
  const [globalBookingOpen, setGlobalBookingOpen] = useState(false);
  const location = useLocation();

  // Hide WhatsApp on standalone admin or special routes if needed
  const isHideWhatsApp = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1E8] text-[#0B6B4E]">
      <EmergencyBanner />
      <Navbar onOpenBooking={() => setGlobalBookingOpen(true)} />

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex items-center justify-center p-8">
              <div className="text-center space-y-3">
                <div className="w-10 h-10 border-4 border-[#0B6B4E] border-t-transparent rounded-full animate-spin mx-auto" />
                <div className="text-xs font-bold text-[#0B6B4E]">Loading Page...</div>
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/portal/*" element={<PortalPage />} />
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />

      {!isHideWhatsApp && <FloatingWhatsApp />}

      <BookingModal
        isOpen={globalBookingOpen}
        onClose={() => setGlobalBookingOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
