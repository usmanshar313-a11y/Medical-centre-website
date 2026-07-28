import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  HeartPulse,
  Stethoscope,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Doctor } from '../../types';

interface NavbarProps {
  onOpenBooking: () => void;
}

const QUICK_DOCTORS_PREVIEW: Doctor[] = [
  { id: 'doc-1', name: 'Dr. Ajmaal Jami', specialty: 'General Physician' },
  { id: 'doc-3', name: 'Dr. Wajid Ali', specialty: 'Consultant Cardiologist & Physician' },
  { id: 'doc-4', name: 'Dr. S. Kashif Mateen', specialty: 'Consultant General & Laparoscopic Surgeon' },
  { id: 'doc-5', name: 'Dr. Hira', specialty: 'Child Specialist' },
  { id: 'doc-10', name: 'Dr. Ghazala Naseem', specialty: 'Obstetrics & Gynaecologist' },
  { id: 'doc-22', name: 'Dr. Erum Kazim', specialty: 'General, Breast & Laparoscopic Surgeon' },
  { id: 'doc-25', name: 'Dr. Akhtar Baig', specialty: 'Orthopedic' },
  { id: 'doc-28', name: 'Dr. Shakeel Ahmed', specialty: 'Diabetologist' },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const { user, patientProfile, signInWithGoogle, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (type: 'home' | 'departments' | 'about' | 'contact') => {
    setMobileMenuOpen(false);
    if (type === 'home') {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (type === 'departments') {
      navigate('/departments');
    } else if (type === 'about') {
      navigate('/about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (type === 'contact') {
      if (location.pathname !== '/') {
        navigate('/#location');
      } else {
        const el = document.querySelector('#location');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/departments?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const matchingDoctors = searchQuery.trim()
    ? QUICK_DOCTORS_PREVIEW.filter(
        (d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 bg-[#0B6B4E] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white text-[#0B6B4E] flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6 sm:w-7 sm:h-7 text-[#0B6B4E]" />
            </div>
            <div>
              <div className="font-heading font-bold text-base sm:text-lg leading-tight text-white tracking-wide">
                Rafah-E-Aam
              </div>
              <div className="text-[11px] text-emerald-100 font-medium tracking-normal leading-none">
                Medical Centre — <span className="text-amber-200 font-semibold">General & Orthopedic</span>
              </div>
            </div>
          </Link>

          {/* Navbar Items (Home, Departments, About Us, Contact) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-emerald-50">
            <button 
              onClick={() => handleNavClick('home')} 
              className={`hover:text-white transition-colors cursor-pointer ${
                location.pathname === '/' ? 'text-white border-b-2 border-amber-300 pb-0.5' : ''
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('departments')} 
              className={`hover:text-white transition-colors cursor-pointer ${
                location.pathname.startsWith('/departments') ? 'text-white border-b-2 border-amber-300 pb-0.5' : ''
              }`}
            >
              Departments
            </button>
            <button 
              onClick={() => handleNavClick('about')} 
              className={`hover:text-white transition-colors cursor-pointer ${
                location.pathname.startsWith('/about') ? 'text-white border-b-2 border-amber-300 pb-0.5' : ''
              }`}
            >
              About Us
            </button>
            <button 
              onClick={() => handleNavClick('contact')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Doctor Search Bar Component */}
          <div className="relative hidden md:block w-64 lg:w-72" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-emerald-200 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search Doctor / Specialty..."
                value={searchQuery}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                className="w-full bg-emerald-900/60 border border-emerald-500/40 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-white placeholder-emerald-200/70 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:bg-emerald-900/90 transition-all"
              />
            </form>

            {/* Live Search Dropdown */}
            {searchOpen && searchQuery.trim() && (
              <div className="absolute left-0 right-0 mt-2 bg-white text-[#0B6B4E] rounded-2xl shadow-2xl border border-emerald-100 p-3 z-50 space-y-2">
                <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider border-b border-emerald-900/10 pb-1 flex items-center justify-between">
                  <span>Doctors & Specialties</span>
                  <span className="text-[9px] text-emerald-600">Press Enter for all</span>
                </div>

                {matchingDoctors.length > 0 ? (
                  <div className="space-y-1 max-h-56 overflow-y-auto">
                    {matchingDoctors.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => {
                          setSearchOpen(false);
                          navigate(`/departments?search=${encodeURIComponent(doc.name)}`);
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-[#F5F1E8] transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="font-heading font-bold text-xs text-[#0B6B4E] group-hover:text-emerald-950">
                            {doc.name}
                          </div>
                          <div className="text-[10px] text-[#D64545] font-semibold">
                            {doc.specialty}
                          </div>
                        </div>
                        <Stethoscope className="w-3.5 h-3.5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-emerald-800 p-2 text-center">
                    Search all doctors for "{searchQuery}"
                  </div>
                )}

                <button
                  onClick={handleSearchSubmit}
                  className="w-full bg-[#0B6B4E] text-white py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#08523c] transition-colors cursor-pointer"
                >
                  <span>View All Results</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* User Auth & Booking CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-emerald-800/80 hover:bg-emerald-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-colors border border-emerald-400/30 cursor-pointer"
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
                      Patient Portal
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
                      Sign Out
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
                <span>Sign In</span>
              </button>
            )}

            {/* Red Primary CTA */}
            <button
              onClick={onOpenBooking}
              className="bg-[#D64545] hover:bg-[#c23737] active:bg-[#b02e2e] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
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
        <div className="lg:hidden bg-[#09573f] border-t border-emerald-700 px-4 pt-3 pb-6 space-y-4">
          
          {/* Mobile Doctor Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-emerald-200 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search doctor or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-emerald-900/80 border border-emerald-500/40 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-white placeholder-emerald-200/70 focus:outline-none"
            />
          </form>

          {/* Mobile Nav Items */}
          <nav className="flex flex-col space-y-2 text-sm font-medium text-emerald-100 pb-3 border-b border-emerald-700/60">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left py-1.5 hover:text-white font-bold"
            >
              1. Home
            </button>
            <button
              onClick={() => handleNavClick('departments')}
              className="text-left py-1.5 hover:text-white font-bold"
            >
              2. Departments
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-left py-1.5 hover:text-white font-bold"
            >
              3. About Us
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left py-1.5 hover:text-white font-bold"
            >
              4. Contact
            </button>
          </nav>

          <div className="flex flex-col gap-2 pt-1">
            {user ? (
              <>
                <Link
                  to="/portal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
                >
                  <UserIcon className="w-4 h-4" />
                  Patient Portal ({patientProfile?.name || user.displayName})
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
                  Sign Out
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
                Sign In
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
              Book Appointment
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
