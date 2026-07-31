import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  Clock, 
  Banknote, 
  UserCheck, 
  Filter, 
  Sparkles,
  ArrowRight,
  X,
  Check,
  RotateCcw
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Department } from '../types';
import { DEPARTMENTS_DATA } from '../data/departmentsData';
import { DepartmentLottieIcon } from '../components/common/DepartmentLottieIcon';

export { DEPARTMENTS_DATA };

gsap.registerPlugin(ScrollTrigger);

export const DepartmentsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [departments] = useState<Department[]>(DEPARTMENTS_DATA);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedDeptId, setSelectedDeptId] = useState<string>('All');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [modalSearchTerm, setModalSearchTerm] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync search input with URL search param
  useEffect(() => {
    if (searchTerm) {
      setSearchParams({ search: searchTerm }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [searchTerm, setSearchParams]);

  // GSAP Entrance animation
  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dept-card',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.04,
          ease: 'power2.out',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [selectedDeptId, searchTerm]);

  // Filter departments based on selected department filter or search term
  const filteredDepartments = departments.filter((dept) => {
    // 1. Department Filter
    const matchesDept = selectedDeptId === 'All' || dept.id === selectedDeptId;
    if (!matchesDept) return false;

    // 2. Search Bar
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    const matchesDeptName = dept.name.toLowerCase().includes(term);
    const matchesDeptDesc = dept.description.toLowerCase().includes(term);
    const matchesDoctor = dept.doctors.some(
      (doc) =>
        doc.name.toLowerCase().includes(term) ||
        doc.specialty.toLowerCase().includes(term)
    );

    return matchesDeptName || matchesDeptDesc || matchesDoctor;
  });

  const selectedDepartmentObj = departments.find((d) => d.id === selectedDeptId);

  // Modal Department List filtered by internal search
  const modalDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(modalSearchTerm.toLowerCase())
  );

  return (
    <div ref={containerRef} className="bg-[#F5F1E8] min-h-screen py-8 sm:py-10 text-[#0B6B4E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">

        {/* Hero Banner Section */}
        <div className="bg-gradient-to-r from-[#0B6B4E] via-[#08523c] to-[#053b2b] text-white rounded-3xl p-7 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="max-w-3xl space-y-3 sm:space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider text-amber-300">
              <Sparkles className="w-4 h-4" />
              <span>Rafah-e-Aam Medical Centre OPD</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-5xl tracking-tight leading-tight">
              Medical Departments & Specialists
            </h1>
            <p className="text-xs sm:text-base text-emerald-100 font-medium leading-relaxed max-w-2xl">
              Browse our medical departments below. Click "Show Doctors" on any department to view consulting specialists, schedule, and book visits.
            </p>
          </div>
        </div>

        {/* Search & Filter Controls (Uncluttered, Single Dropdown/Popup Button) */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-emerald-900/10 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          
          {/* Text Search Input */}
          <div className="relative flex-1">
            <Search className="w-4.5 h-4.5 text-emerald-600 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search department, doctor, or specialty..."
              className="w-full pl-11 pr-10 py-3 bg-[#FAF8F3] border border-emerald-900/15 rounded-xl text-xs sm:text-sm font-semibold text-[#0B6B4E] placeholder:text-emerald-800/50 focus:outline-hidden focus:ring-2 focus:ring-[#0B6B4E] transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-100 px-2 py-1 rounded-md cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Department Filter Trigger Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                selectedDeptId !== 'All'
                  ? 'bg-[#0B6B4E] text-white border-[#0B6B4E] shadow-2xs'
                  : 'bg-[#FAF8F3] text-[#0B6B4E] border-emerald-900/15 hover:bg-emerald-50'
              }`}
            >
              <Filter className="w-4 h-4 shrink-0" />
              <span className="truncate max-w-[180px] sm:max-w-[220px]">
                {selectedDeptId === 'All'
                  ? 'Filter by Department'
                  : `Dept: ${selectedDepartmentObj?.name || selectedDeptId}`}
              </span>
              {selectedDeptId !== 'All' && (
                <span className="bg-amber-300 text-[#0B6B4E] text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0">
                  1
                </span>
              )}
            </button>

            {selectedDeptId !== 'All' && (
              <button
                onClick={() => setSelectedDeptId('All')}
                title="Reset Department Filter"
                className="p-3 rounded-xl bg-red-50 text-[#D64545] border border-red-200/60 hover:bg-red-100 transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results Counter & Active Filter Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-bold text-emerald-800 px-1">
          <div className="flex items-center gap-2">
            <span>Showing {filteredDepartments.length} Department{filteredDepartments.length === 1 ? '' : 's'}</span>
            {selectedDeptId !== 'All' && selectedDepartmentObj && (
              <span className="bg-emerald-100 text-[#0B6B4E] px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 border border-emerald-300">
                <span>{selectedDepartmentObj.name}</span>
                <button
                  onClick={() => setSelectedDeptId('All')}
                  className="hover:text-red-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </div>
          {searchTerm && (
            <span className="text-[#0B6B4E]">
              Search query: "{searchTerm}"
            </span>
          )}
        </div>

        {/* Department Summary Cards Grid (Clean, Deliberate Whitespace, Single Primary CTA) */}
        {filteredDepartments.length === 0 ? (
          <div className="bg-white p-10 sm:p-12 rounded-3xl border border-emerald-900/10 text-center space-y-4">
            <p className="text-base font-bold text-[#0B6B4E]">No matching medical departments found</p>
            <p className="text-xs text-emerald-700">Try adjusting your search text or department filter selection.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDeptId('All');
              }}
              className="px-5 py-2.5 bg-[#0B6B4E] text-white text-xs font-bold rounded-xl hover:bg-[#08523c] transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredDepartments.map((dept) => (
              <div
                key={dept.id}
                className="dept-card bg-white rounded-3xl border border-emerald-900/15 shadow-2xs hover:shadow-md hover:border-[#0B6B4E]/40 transition-all p-6 sm:p-7 flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  {/* Department Card Header: Lottie Icon + Title */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#FAF8F3] group-hover:bg-emerald-50 rounded-2xl border border-emerald-900/10 transition-colors shrink-0">
                      <DepartmentLottieIcon iconType={dept.icon} size={44} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-heading font-extrabold text-lg sm:text-xl text-[#0B6B4E] leading-snug group-hover:text-[#08523c] transition-colors">
                        {dept.name}
                      </h2>
                      <div className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{dept.doctors.length} Specialist{dept.doctors.length === 1 ? '' : 's'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-emerald-900/80 font-medium leading-relaxed line-clamp-3">
                    {dept.description}
                  </p>

                  {/* Schedule Metadata */}
                  <div className="space-y-2 pt-3 border-t border-emerald-900/10 text-xs text-emerald-800">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Days:
                      </span>
                      <span className="font-bold text-[#0B6B4E]">{dept.days || 'Mon - Sat'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" /> Timing:
                      </span>
                      <span className="font-bold text-[#0B6B4E]">{dept.timing || '09:00 AM - 05:00 PM'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Banknote className="w-3.5 h-3.5 text-emerald-600" /> Fee:
                      </span>
                      <span className="font-extrabold text-[#0B6B4E]">{dept.fee || 'Rs. 1,000'}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Dedicated CTA Button -> Navigates to /departments/:departmentId */}
                <Link
                  to={`/departments/${dept.id}`}
                  className="w-full bg-[#0B6B4E] hover:bg-[#08523c] active:bg-[#064230] text-white py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer group/btn"
                >
                  <span>Show Doctors</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Department Selection Filter Modal / Bottom Sheet */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in">
          <div
            className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl border border-emerald-900/10 overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-emerald-900/10 flex items-center justify-between bg-[#FAF8F3]">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-[#0B6B4E]">
                  Filter by Department
                </h3>
                <p className="text-xs text-emerald-800 font-medium mt-0.5">
                  Select a medical specialty to narrow down departments
                </p>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-2 rounded-full hover:bg-emerald-100 text-emerald-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Quick Search */}
            <div className="p-4 border-b border-emerald-900/10 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={modalSearchTerm}
                  onChange={(e) => setModalSearchTerm(e.target.value)}
                  placeholder="Type to filter departments list..."
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F3] border border-emerald-900/15 rounded-xl text-xs font-semibold text-[#0B6B4E] focus:outline-hidden focus:ring-2 focus:ring-[#0B6B4E]"
                />
              </div>
            </div>

            {/* Department List Options */}
            <div className="p-3 sm:p-4 overflow-y-auto space-y-1.5 flex-1 divide-y divide-emerald-900/5">
              {/* All Departments Option */}
              <button
                onClick={() => {
                  setSelectedDeptId('All');
                  setIsFilterModalOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedDeptId === 'All'
                    ? 'bg-[#0B6B4E] text-white'
                    : 'hover:bg-emerald-50 text-[#0B6B4E]'
                }`}
              >
                <span>All Departments ({departments.length})</span>
                {selectedDeptId === 'All' && <Check className="w-4 h-4 text-amber-300" />}
              </button>

              {/* Specific Department Options */}
              {modalDepartments.map((dept) => {
                const isSelected = selectedDeptId === dept.id;
                return (
                  <button
                    key={dept.id}
                    onClick={() => {
                      setSelectedDeptId(dept.id);
                      setIsFilterModalOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0B6B4E] text-white'
                        : 'hover:bg-emerald-50 text-emerald-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <DepartmentLottieIcon iconType={dept.icon} size={28} />
                      <span className="truncate">{dept.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        isSelected ? 'bg-emerald-800 text-amber-200' : 'bg-emerald-100 text-[#0B6B4E]'
                      }`}>
                        {dept.doctors.length} Doc{dept.doctors.length === 1 ? '' : 's'}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-amber-300" />}
                    </div>
                  </button>
                );
              })}

              {modalDepartments.length === 0 && (
                <div className="py-8 text-center text-xs text-emerald-800 font-medium">
                  No department matching "{modalSearchTerm}"
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-emerald-900/10 bg-[#FAF8F3] flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setSelectedDeptId('All');
                  setModalSearchTerm('');
                  setIsFilterModalOpen(false);
                }}
                className="px-4 py-2.5 text-xs font-bold text-[#D64545] bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
              >
                Reset Filter
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="px-5 py-2.5 bg-[#0B6B4E] text-white text-xs font-bold rounded-xl hover:bg-[#08523c] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
