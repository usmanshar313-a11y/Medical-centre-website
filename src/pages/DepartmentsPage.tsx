import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Stethoscope, 
  ShieldAlert, 
  FlaskConical, 
  Heart, 
  Baby, 
  Calendar, 
  Clock, 
  Search, 
  PhoneCall, 
  UserCheck, 
  CheckCircle2, 
  Banknote, 
  Sparkles, 
  MapPin, 
  Filter,
  ChevronRight,
  Activity
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Doctor, Department } from '../types';
import { BookingModal } from '../components/booking/BookingModal';
import { DEPARTMENTS_DATA } from '../data/departmentsData';

export { DEPARTMENTS_DATA };

gsap.registerPlugin(ScrollTrigger);

export const DepartmentsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS_DATA);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('All');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);

  const containerRef = useRef<HTMLDivElement>(null);

  const getDepartmentHeaderStyle = (index: number) => {
    const gradients = [
      'from-[#0B6B4E] via-[#08523c] to-[#043d2c]', // Classic Emerald
      'from-[#0f766e] via-[#115e59] to-[#042f2e]', // Teal Emerald
      'from-[#1e3a8a] via-[#1e40af] to-[#0f172a]', // Indigo Emerald
      'from-[#065f46] via-[#047857] to-[#022c22]', // Forest Emerald
      'from-[#0369a1] via-[#075985] to-[#0c4a6e]', // Ocean Blue Emerald
      'from-[#831843] via-[#701a75] to-[#4c0519]', // Deep Rose Emerald
      'from-[#334155] via-[#1e293b] to-[#0f172a]', // Slate Charcoal Emerald
    ];
    return gradients[index % gradients.length];
  };

  // Filter departments & internal doctors according to search and filter pill
  const filteredDepartments = departments
    .map((dept) => {
      const term = searchTerm.toLowerCase().trim();

      const matchesDeptFilter =
        selectedDeptFilter === 'All' ||
        dept.name.toLowerCase().includes(selectedDeptFilter.toLowerCase()) ||
        (selectedDeptFilter === 'Surgery' && dept.name.toLowerCase().includes('surgical')) ||
        (selectedDeptFilter === 'Radiology' && dept.name.toLowerCase().includes('sonology'));

      if (!matchesDeptFilter) return null;

      // Filter doctors inside this department if search term is active
      const matchingDoctors = dept.doctors.filter((doc) => {
        if (!term) return true;
        return (
          doc.name.toLowerCase().includes(term) ||
          doc.specialty.toLowerCase().includes(term) ||
          (doc.bio && doc.bio.toLowerCase().includes(term)) ||
          dept.name.toLowerCase().includes(term)
        );
      });

      const matchesDeptHeader =
        !term ||
        dept.name.toLowerCase().includes(term) ||
        dept.description.toLowerCase().includes(term);

      if (matchesDeptHeader || matchingDoctors.length > 0) {
        return {
          ...dept,
          doctors: term && !matchesDeptHeader ? matchingDoctors : dept.doctors
        };
      }
      return null;
    })
    .filter((d): d is Department => d !== null);

  // Total doctor count across filtered list
  const totalMatchingDoctors = filteredDepartments.reduce((acc, d) => acc + d.doctors.length, 0);

  // GSAP ScrollTrigger Animations for Apple-style reveal
  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const sections = containerRef.current?.querySelectorAll('.dept-section');
      sections?.forEach((section) => {
        const header = section.querySelector('.dept-header');
        const cards = section.querySelectorAll('.doctor-card');

        if (header) {
          gsap.fromTo(
            header,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          );
        }

        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.12,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [filteredDepartments, searchTerm, selectedDeptFilter]);

  // Sync state if URL query changes
  useEffect(() => {
    const query = searchParams.get('search');
    if (query !== null && query !== searchTerm) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchRealData = async () => {
      try {
        const docSnap = await getDocs(collection(db, 'doctors'));
        const fetchedDocs: Doctor[] = [];
        docSnap.forEach((d) => fetchedDocs.push({ id: d.id, ...d.data() } as Doctor));

        if (fetchedDocs.length > 0) {
          // Merge fetched doctors into appropriate departments
          const updated = DEPARTMENTS_DATA.map((dept) => {
            const matchedDocs = fetchedDocs.filter((fd) => {
              const spec = (fd.specialty || '').toLowerCase();
              const deptName = dept.name.toLowerCase();
              if (deptName.includes('general opd') && (spec.includes('general physician') || spec.includes('physician'))) return true;
              if (deptName.includes('cardiology') && spec.includes('cardio')) return true;
              if (deptName.includes('orthopedics') && spec.includes('ortho')) return true;
              if (deptName.includes('pediatrics') && (spec.includes('child') || spec.includes('pediatric'))) return true;
              if (deptName.includes('obstetrics') && (spec.includes('gynaec') || spec.includes('obstetric'))) return true;
              if (deptName.includes('radiology') && (spec.includes('sonologist') || spec.includes('radiologist'))) return true;
              if (deptName.includes('surgical') && (spec.includes('surgeon') || spec.includes('surgery'))) return true;
              if (deptName.includes('diabetology') && spec.includes('diabet')) return true;
              if (deptName.includes('chest') && (spec.includes('chest') || spec.includes('pulm'))) return true;
              if (deptName.includes('gastro') && spec.includes('gastro')) return true;
              if (deptName.includes('dialysis') && spec.includes('dialysis')) return true;
              if (deptName.includes('ent') && spec.includes('ent')) return true;
              if (deptName.includes('dental') && spec.includes('dental')) return true;
              return false;
            });
            return {
              ...dept,
              doctors: matchedDocs.length > 0 ? matchedDocs : dept.doctors
            };
          });
          setDepartments(updated);
        }
      } catch (e) {
        console.warn('Using static department fallback data');
      }
    };
    fetchRealData();
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (val) {
      setSearchParams({ search: val });
    } else {
      setSearchParams({});
    }
  };

  const handleOpenBooking = (docId?: string, deptId?: string) => {
    setSelectedDoctorId(docId);
    setSelectedServiceId(deptId);
    setBookingModalOpen(true);
  };

  const departmentFilterOptions = [
    'All',
    'General OPD',
    'Cardiology',
    'Orthopedics',
    'Surgery',
    'Pediatrics',
    'Obstetrics & Gynaecology',
    'Radiology',
    'Diabetology',
    'Chest Medicine',
    'Gastroenterology',
    'ENT',
    'Dental',
    '24/7 Emergency'
  ];

  const getDepartmentIcon = (iconName?: string) => {
    switch (iconName) {
      case 'heart':
        return <Heart className="w-6 h-6 text-[#0B6B4E]" />;
      case 'baby':
        return <Baby className="w-6 h-6 text-[#0B6B4E]" />;
      case 'flask':
        return <FlaskConical className="w-6 h-6 text-[#0B6B4E]" />;
      case 'shield-alert':
        return <ShieldAlert className="w-6 h-6 text-[#D64545]" />;
      case 'activity':
        return <Activity className="w-6 h-6 text-[#0B6B4E]" />;
      default:
        return <Stethoscope className="w-6 h-6 text-[#0B6B4E]" />;
    }
  };

  return (
    <div ref={containerRef} className="bg-[#F5F1E8] min-h-screen py-10 text-[#0B6B4E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">

        {/* Filter & Search Bar */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-emerald-900/10 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-emerald-700 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search by department name, doctor name, or medical specialty (e.g. Cardiology, Dr. Wajid, Surgery)..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-2.5 text-xs bg-emerald-100 text-[#0B6B4E] px-2.5 py-1 rounded-lg font-bold hover:bg-emerald-200 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {searchTerm && (
              <div className="text-xs font-bold bg-emerald-100 text-[#0B6B4E] px-3.5 py-2.5 rounded-xl border border-emerald-300/60 whitespace-nowrap">
                Found {filteredDepartments.length} department(s) & {totalMatchingDoctors} doctor(s)
              </div>
            )}
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-emerald-900 mr-2 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Filter Department:
            </span>
            {departmentFilterOptions.map((deptName) => (
              <button
                key={deptName}
                onClick={() => setSelectedDeptFilter(deptName)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDeptFilter === deptName
                    ? 'bg-[#0B6B4E] text-white shadow-xs'
                    : 'bg-[#F5F1E8] text-[#0B6B4E] hover:bg-emerald-900/10'
                }`}
              >
                {deptName}
              </button>
            ))}
          </div>
        </div>

        {/* Department Cards & Grouped Doctor Panels */}
        {filteredDepartments.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center space-y-3 border border-emerald-900/10">
            <UserCheck className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-heading font-bold text-lg text-emerald-950">No Departments or Doctors Found</h3>
            <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
              No medical department or consultant matched "{searchTerm}". Try searching for another keyword or reset filters.
            </p>
            <button
              onClick={() => { handleSearchChange(''); setSelectedDeptFilter('All'); }}
              className="bg-[#0B6B4E] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold cursor-pointer hover:bg-[#08523c]"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          <div className="space-y-16 sm:space-y-20">
            {filteredDepartments.map((dept, index) => (
              <div
                key={dept.id}
                className="dept-section bg-white rounded-3xl shadow-md border border-emerald-900/15 overflow-hidden transition-all hover:shadow-lg"
              >
                {/* Department Header Bar with Varying Gradient Colors */}
                <div className={`dept-header bg-gradient-to-r ${getDepartmentHeaderStyle(index)} text-white p-6 sm:p-8 md:p-9 border-b border-emerald-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}>
                  <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0 w-full md:w-auto">
                    <div className="p-3.5 sm:p-4 bg-white/15 rounded-2xl backdrop-blur-md text-white shrink-0 shadow-inner">
                      {getDepartmentIcon(dept.icon)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                          {dept.name}
                        </h2>
                        <span className="bg-amber-300 text-[#0B6B4E] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shrink-0 shadow-xs">
                          {dept.doctors.length} Specialist{dept.doctors.length === 1 ? '' : 's'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm md:text-base text-emerald-100/95 leading-relaxed mt-2 max-w-3xl font-medium">
                        {dept.description}
                      </p>
                    </div>
                  </div>

                  {/* Summary Badges */}
                  <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2.5 shrink-0 pt-4 md:pt-0 border-t border-white/20 md:border-t-0 w-full md:w-auto mt-2 md:mt-0">
                    {dept.days && (
                      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/15 backdrop-blur-md text-xs sm:text-sm font-semibold text-emerald-50 max-w-full">
                        <Calendar className="w-4 h-4 text-amber-300 shrink-0" />
                        <span className="truncate">Days: {dept.days}</span>
                      </span>
                    )}
                    {dept.timing && (
                      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/15 backdrop-blur-md text-xs sm:text-sm font-semibold text-emerald-50 max-w-full">
                        <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                        <span className="truncate">Timings: {dept.timing}</span>
                      </span>
                    )}
                    {dept.fee && (
                      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-100 text-[#0B6B4E] border border-emerald-300 text-xs sm:text-sm font-extrabold shadow-sm max-w-full">
                        <Banknote className="w-4 h-4 text-[#0B6B4E] shrink-0" />
                        <span className="truncate">Fee: {dept.fee}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Sub-cards: Doctors belonging to this department (Desktop: 2 per row) */}
                <div className="p-5 sm:p-8 md:p-9 bg-[#FAF8F3]">
                  <div className="text-xs sm:text-sm font-extrabold text-[#0B6B4E] uppercase tracking-wider mb-6 flex items-center gap-2">
                    <UserCheck className="w-4.5 h-4.5 text-[#0B6B4E] shrink-0" />
                    <span>Consulting Specialists & Doctors ({dept.doctors.length}):</span>
                  </div>

                  {dept.doctors.length === 0 ? (
                    <div className="p-6 bg-white rounded-2xl border border-emerald-900/10 text-xs sm:text-sm text-emerald-800 font-medium">
                      No specific doctor matches current search in this department. Walk-in consultations are available at reception.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                      {dept.doctors.map((doc) => (
                        <div
                          key={doc.id}
                          className="doctor-card bg-white rounded-2xl border border-emerald-900/15 shadow-xs hover:shadow-md transition-all p-6 sm:p-7 flex flex-col justify-between space-y-5 overflow-hidden w-full"
                        >
                          <div className="space-y-4 min-w-0 w-full">
                            {/* Doctor Photo & Header */}
                            <div className="flex items-start gap-4 sm:gap-5 min-w-0 w-full">
                              <img
                                src={doc.photoURL || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'}
                                alt={doc.name}
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover object-top border-2 border-emerald-900/15 bg-emerald-100 shrink-0 shadow-sm"
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#0B6B4E] leading-snug truncate">
                                  {doc.name}
                                </h3>
                                <div className="text-xs sm:text-sm font-bold text-[#D64545] bg-red-50 border border-red-200/60 px-3 py-1 rounded-lg inline-block mt-1.5 max-w-full truncate">
                                  {doc.specialty}
                                </div>
                                {doc.roomNumber && (
                                  <div className="text-xs text-emerald-800 font-bold mt-2 flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span className="truncate">Location: {doc.roomNumber}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Bio */}
                            {doc.bio && (
                              <div className="bg-[#F5F1E8] p-4 rounded-xl border border-emerald-900/10 text-xs sm:text-sm text-emerald-900/90 leading-relaxed break-words font-medium">
                                {doc.bio}
                              </div>
                            )}

                            {/* Icons + Details Rows */}
                            <div className="space-y-2.5 pt-3 border-t border-emerald-900/10 text-xs sm:text-sm w-full min-w-0">
                              {/* Days */}
                              <div className="flex items-center justify-between gap-2 text-emerald-900 w-full min-w-0">
                                <div className="flex items-center gap-2 font-medium text-emerald-800 shrink-0">
                                  <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span>Days:</span>
                                </div>
                                <span className="font-bold text-[#0B6B4E] text-right truncate">
                                  {Array.isArray(doc.availableDays) ? doc.availableDays.join(', ') : doc.availableDays || dept.days || 'Mon - Sat'}
                                </span>
                              </div>

                              {/* Timing */}
                              <div className="flex items-center justify-between gap-2 text-emerald-900 w-full min-w-0">
                                <div className="flex items-center gap-2 font-medium text-emerald-800 shrink-0">
                                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span>Timing:</span>
                                </div>
                                <span className="font-bold text-[#0B6B4E] text-right truncate">
                                  {doc.timing || dept.timing || '09:00 AM - 05:00 PM'}
                                </span>
                              </div>

                              {/* Consultation Fee */}
                              <div className="flex items-center justify-between gap-2 text-emerald-900 w-full min-w-0">
                                <div className="flex items-center gap-2 font-medium text-emerald-800 shrink-0">
                                  <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span>Consultation Fee:</span>
                                </div>
                                <span className="font-extrabold text-sm sm:text-base text-[#0B6B4E] bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-lg shrink-0">
                                  {doc.fee || dept.fee || 'Rs. 1,000'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* CTA Button */}
                          <button
                            onClick={() => handleOpenBooking(doc.id, dept.id)}
                            className="w-full bg-[#0B6B4E] hover:bg-[#08523c] active:bg-[#064230] text-white py-3 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer group shrink-0 mt-3"
                          >
                            <Calendar className="w-4.5 h-4.5 shrink-0" />
                            <span className="truncate">Book Visit with {doc.name.split(' ')[1] || doc.name}</span>
                            <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform ml-auto" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedDoctorId={selectedDoctorId}
        preselectedServiceId={selectedServiceId}
      />
    </div>
  );
};
