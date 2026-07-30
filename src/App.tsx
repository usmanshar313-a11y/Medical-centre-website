import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { HomePage } from './pages/HomePage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { AboutPage } from './pages/AboutPage';
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

  React.useEffect(() => {
    const handleOpen = () => setGlobalBookingOpen(true);
    window.addEventListener('open-booking-modal', handleOpen);
    return () => window.removeEventListener('open-booking-modal', handleOpen);
  }, []);

  // Hide WhatsApp & Booking floating buttons on standalone admin route
  const isHideWhatsApp = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1E8] text-[#0B6B4E]">
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
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/departments.html" element={<DepartmentsPage />} />
            <Route path="/services" element={<DepartmentsPage />} />
            <Route path="/services.html" element={<DepartmentsPage />} />
            <Route path="/doctors" element={<DepartmentsPage />} />
            <Route path="/doctors.html" element={<DepartmentsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about.html" element={<AboutPage />} />
            <Route path="/portal/*" element={<PortalPage />} />
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/admin.html" element={<AdminApp />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />

      {!isHideWhatsApp && <FloatingWhatsApp onOpenBooking={() => setGlobalBookingOpen(true)} />}

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
