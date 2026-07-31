import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Banknote, 
  UserCheck, 
  Loader2
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { DEPARTMENTS_DATA } from '../data/departmentsData';
import { Department, Doctor } from '../types';
import { DepartmentLottieIcon } from '../components/common/DepartmentLottieIcon';

// In-Memory Doctor Cache to prevent redundant Firestore network reads
const departmentDoctorCache: Record<string, Doctor[]> = {};

export const DepartmentDetailPage: React.FC = () => {
  const { departmentId } = useParams<{ departmentId: string }>();

  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const loadDepartmentData = async () => {
      const targetId = (departmentId || '').toLowerCase();
      
      // Find initial matching department from local static dataset
      const localDept = DEPARTMENTS_DATA.find(
        (d) => d.id.toLowerCase() === targetId
      );

      if (!localDept) {
        setDepartment(null);
        setLoading(false);
        return;
      }

      let currentDept = { ...localDept };

      // 1. Check in-memory cache first for instant render
      if (departmentDoctorCache[targetId]) {
        setDepartment({
          ...currentDept,
          doctors: departmentDoctorCache[targetId],
        });
        setLoading(false);
        return;
      }

      // 2. Lazy load doctor data from Firestore if not cached
      setLoading(true);
      try {
        const fetchPromise = getDocs(collection(db, 'doctors'));
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Firestore fetch timeout')), 2500)
        );

        const docSnap = await Promise.race([fetchPromise, timeoutPromise]);
        const fetchedDocs: Doctor[] = [];
        docSnap.forEach((d) => fetchedDocs.push({ id: d.id, ...d.data() } as Doctor));

        if (fetchedDocs.length > 0) {
          const matchedDocs = fetchedDocs.filter((fd) => {
            const spec = (fd.specialty || '').toLowerCase();
            const deptName = currentDept.name.toLowerCase();
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

          if (matchedDocs.length > 0) {
            departmentDoctorCache[targetId] = matchedDocs;
            currentDept = {
              ...currentDept,
              doctors: matchedDocs,
            };
          } else {
            departmentDoctorCache[targetId] = currentDept.doctors;
          }
        } else {
          departmentDoctorCache[targetId] = currentDept.doctors;
        }
      } catch (err) {
        console.warn('Using static fallback for department doctors:', departmentId);
        departmentDoctorCache[targetId] = currentDept.doctors;
      } finally {
        setDepartment(currentDept);
        setLoading(false);
      }
    };

    loadDepartmentData();
  }, [departmentId]);

  const handleOpenBooking = (docId: string) => {
    window.dispatchEvent(
      new CustomEvent('open-booking-modal', {
        detail: { doctorId: docId, departmentId: department?.id },
      })
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-[#0B6B4E] animate-spin mx-auto" />
          <p className="text-sm font-bold text-[#0B6B4E]">Loading Department Doctors...</p>
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] py-16 px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 sm:p-10 rounded-3xl text-center space-y-6 shadow-xs border border-emerald-900/10">
          <h2 className="text-2xl font-extrabold text-[#0B6B4E]">Department Not Found</h2>
          <p className="text-xs sm:text-sm text-emerald-800 font-medium">
            The requested medical department could not be located in our OPD directory.
          </p>
          <Link
            to="/departments"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B6B4E] text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-[#08523c] transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Departments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F1E8] min-h-screen py-8 sm:py-10 text-[#0B6B4E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Uncluttered Navigation Bar */}
        <div>
          <Link
            to="/departments"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#0B6B4E] hover:text-[#08523c] bg-white px-4 py-2.5 rounded-xl border border-emerald-900/10 shadow-2xs transition-all hover:-translate-x-0.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Departments
          </Link>
        </div>

        {/* Clean Header Card with Context */}
        <div className="bg-gradient-to-br from-[#0B6B4E] to-[#064230] text-white p-7 sm:p-10 rounded-3xl shadow-md border border-emerald-800/40 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="p-3.5 sm:p-4 bg-white/15 rounded-2xl backdrop-blur-md shrink-0 shadow-inner">
                <DepartmentLottieIcon iconType={department.icon} size={48} />
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
                    {department.name}
                  </h1>
                  <span className="bg-amber-300 text-[#0B6B4E] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shrink-0 shadow-2xs">
                    {department.doctors.length} Specialist{department.doctors.length === 1 ? '' : 's'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-base text-emerald-100/95 leading-relaxed max-w-4xl font-medium">
            {department.description}
          </p>

          {/* Key OPD Info Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/20 text-xs sm:text-sm">
            {department.days && (
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 backdrop-blur-md font-semibold text-emerald-50">
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>Days: {department.days}</span>
              </span>
            )}
            {department.timing && (
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 backdrop-blur-md font-semibold text-emerald-50">
                <Clock className="w-4 h-4 text-amber-300" />
                <span>OPD Hours: {department.timing}</span>
              </span>
            )}
            {department.fee && (
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-300 text-[#0B6B4E] font-extrabold shadow-2xs">
                <Banknote className="w-4 h-4 text-[#0B6B4E]" />
                <span>Fee: {department.fee}</span>
              </span>
            )}
          </div>
        </div>

        {/* Doctor List Title */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs sm:text-base font-extrabold uppercase tracking-wider text-[#0B6B4E]">
            <UserCheck className="w-5 h-5 text-[#0B6B4E]" />
            <span>Consulting Specialists & Doctors ({department.doctors.length})</span>
          </div>
        </div>

        {/* Doctor Cards Grid (Unchanged Design, Clean Whitespace, Single Primary CTA) */}
        {department.doctors.length === 0 ? (
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-emerald-900/10 text-center space-y-3">
            <p className="text-sm text-emerald-800 font-medium">
              No individual consultant listed online for this department at the moment.
            </p>
            <p className="text-xs text-emerald-600">
              Walk-in OPD consultations and emergency support are available at reception 24/7.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {department.doctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl border border-emerald-900/15 shadow-2xs hover:shadow-md transition-all p-6 sm:p-7 flex flex-col justify-between space-y-6 overflow-hidden w-full"
              >
                <div className="space-y-4 min-w-0 w-full">
                  {/* Doctor Photo & Details */}
                  <div className="flex items-start gap-4 sm:gap-5 min-w-0 w-full">
                    <img
                      src={
                        doc.photoURL ||
                        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={doc.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover object-top border-2 border-emerald-900/15 bg-emerald-100 shrink-0 shadow-2xs"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';
                      }}
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
                    <div className="bg-[#FAF8F3] p-4 rounded-xl border border-emerald-900/10 text-xs sm:text-sm text-emerald-900/90 leading-relaxed break-words font-medium">
                      {doc.bio}
                    </div>
                  )}

                  {/* Days, Timing & Fee Details */}
                  <div className="space-y-2.5 pt-3 border-t border-emerald-900/10 text-xs sm:text-sm w-full min-w-0">
                    <div className="flex items-center justify-between gap-2 text-emerald-900 w-full min-w-0">
                      <div className="flex items-center gap-2 font-medium text-emerald-800 shrink-0">
                        <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Days:</span>
                      </div>
                      <span className="font-bold text-[#0B6B4E] text-right truncate">
                        {Array.isArray(doc.availableDays)
                          ? doc.availableDays.join(', ')
                          : doc.availableDays || department.days || 'Mon - Sat'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-emerald-900 w-full min-w-0">
                      <div className="flex items-center gap-2 font-medium text-emerald-800 shrink-0">
                        <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Timing:</span>
                      </div>
                      <span className="font-bold text-[#0B6B4E] text-right truncate">
                        {doc.timing || department.timing || '09:00 AM - 05:00 PM'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-emerald-900 w-full min-w-0">
                      <div className="flex items-center gap-2 font-medium text-emerald-800 shrink-0">
                        <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Consultation Fee:</span>
                      </div>
                      <span className="font-extrabold text-sm sm:text-base text-[#0B6B4E] bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-lg shrink-0">
                        {doc.fee || department.fee || 'Rs. 1,000'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Single Primary CTA Button */}
                <button
                  onClick={() => handleOpenBooking(doc.id)}
                  className="w-full bg-[#0B6B4E] hover:bg-[#08523c] active:bg-[#064230] text-white py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer group shrink-0 mt-3"
                >
                  <Calendar className="w-4.5 h-4.5 shrink-0" />
                  <span>Book Visit with {doc.name.split(' ')[1] || doc.name}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
