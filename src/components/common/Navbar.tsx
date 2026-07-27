import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Calendar, 
  User as UserIcon, 
  LogOut, 
  Globe, 
  Menu, 
  X, 
  ChevronDown,
  HeartPulse,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const { user, patientProfile, signInWithGoogle, logout } = useAuth();
  const { language, setLanguage, t, isUrdu } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (hash: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/' + hash);
    } else {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ur' : 'en');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B6B4E] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-white text-[#0B6B4E] flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
              <HeartPulse className="w-7 h-7 text-[#0B6B4E]" />
            </div>
            <div>
              <div className="font-heading font-bold text-lg leading-tight text-white tracking-wide">
                Rafah-E-Aam
              </div>
              <div className="text-xs text-emerald-100 font-medium tracking-normal flex flex-col sm:flex-row sm:items-center sm:gap-1.5 leading-none">
                <span>Medical Centre — <span className="text-amber-200 font-semibold">General & Orthopedic</span></span>
                <span className="text-red-200 font-urdu">(رفاہ عام)</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-emerald-50">
            <button 
              onClick={() => handleNavClick('#home')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.home}
            </button>
            <button 
              onClick={() => handleNavClick('#about')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.about}
            </button>
            <button 
              onClick={() => handleNavClick('#services')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.services}
            </button>
            <button 
              onClick={() => handleNavClick('#doctors')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.doctors}
            </button>
            <button 
              onClick={() => handleNavClick('#reviews')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.reviews}
            </button>
            <button 
              onClick={() => handleNavClick('#location')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.contact}
            </button>
          </nav>

          {/* Actions: Lang Switcher, Login/Portal, Book CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-400/40 hover:bg-emerald-800/50 text-xs font-semibold text-emerald-100 transition-colors cursor-pointer"
              title="Toggle Language"
            >
              <Globe className="w-4 h-4 text-emerald-200" />
              <span>{language === 'en' ? 'اردو' : 'English'}</span>
            </button>

            {/* User Auth or Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-emerald-800/80 hover:bg-emerald-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-colors border border-emerald-400/30"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.displayName?.charAt(0) || 'P'}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate">
                    {patientProfile?.name || user.displayName || 'Portal'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-50 border border-emerald-100 text-[#0B6B4E]">
                    <Link
                      to="/portal"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-[#F5F1E8] transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-[#0B6B4E]" />
                      {t.portal}
                    </Link>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 text-white hover:bg-white hover:text-[#0B6B4E] text-xs font-semibold transition-all cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{t.login}</span>
              </button>
            )}

            {/* Red Primary CTA */}
            <button
              onClick={onOpenBooking}
              className="bg-[#D64545] hover:bg-[#c23737] active:bg-[#b02e2e] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.bookAppointment}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="p-1.5 rounded-lg border border-emerald-400/40 text-emerald-100 text-xs font-semibold"
            >
              {language === 'en' ? 'اردو' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-emerald-100 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#09573f] border-t border-emerald-700 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-emerald-100 pb-3 border-b border-emerald-700/60">
            <button
              onClick={() => handleNavClick('#home')}
              className="text-left py-1.5 hover:text-white"
            >
              {t.home}
            </button>
            <button
              onClick={() => handleNavClick('#about')}
              className="text-left py-1.5 hover:text-white"
            >
              {t.about}
            </button>
            <button
              onClick={() => handleNavClick('#services')}
              className="text-left py-1.5 hover:text-white"
            >
              {t.services}
            </button>
            <button
              onClick={() => handleNavClick('#doctors')}
              className="text-left py-1.5 hover:text-white"
            >
              {t.doctors}
            </button>
            <button
              onClick={() => handleNavClick('#reviews')}
              className="text-left py-1.5 hover:text-white"
            >
              {t.reviews}
            </button>
            <button
              onClick={() => handleNavClick('#location')}
              className="text-left py-1.5 hover:text-white"
            >
              {t.contact}
            </button>
          </nav>

          <div className="flex flex-col gap-2 pt-2">
            {user ? (
              <>
                <Link
                  to="/portal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
                >
                  <UserIcon className="w-4 h-4" />
                  {t.portal} ({patientProfile?.name || user.displayName})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="flex items-center gap-2 text-red-200 hover:text-white text-sm font-semibold py-1 px-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t.logout}
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signInWithGoogle();
                }}
                className="w-full flex items-center justify-center gap-2 bg-emerald-800 text-white py-2.5 rounded-xl text-sm font-semibold border border-emerald-600"
              >
                <UserIcon className="w-4 h-4" />
                {t.login}
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full bg-[#D64545] hover:bg-[#c23737] text-white py-3 rounded-xl text-sm font-bold shadow flex items-center justify-center gap-2 mt-2"
            >
              <Calendar className="w-4 h-4" />
              {t.bookAppointment}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
