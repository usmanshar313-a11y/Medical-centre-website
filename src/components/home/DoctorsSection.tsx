import React, { useEffect, useState } from 'react';
import { UserCheck, Calendar, Phone, Award, Clock } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Doctor } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface DoctorsSectionProps {
  onSelectDoctor: (doctorId: string) => void;
}

const SAMPLE_DOCTORS: Doctor[] = [
  { id: 'doc-1', name: 'Dr. Ajmaal Jami', specialty: 'General Physician' },
  { id: 'doc-2', name: 'Dr. Saqib Zain', specialty: 'General Physician' },
  { id: 'doc-3', name: 'Dr. Wajid Ali', specialty: 'Consultant Cardiologist & Physician' },
  { id: 'doc-4', name: 'Dr. S. Kashif Mateen', specialty: 'Consultant General Surgeon & Laparoscopic Surgeon' },
  { id: 'doc-5', name: 'Dr. Hira', specialty: 'Child Specialist' },
  { id: 'doc-6', name: 'Dr. S.M. Hussain Hadi Naqvi', specialty: 'Child Specialist' },
  { id: 'doc-7', name: 'Dr. Saud Abdul Qayyum', specialty: 'Child Specialist' },
  { id: 'doc-8', name: 'Dr. Amir Hussain', specialty: 'Child Specialist' },
  { id: 'doc-9', name: 'Dr. Syed Habib Ahmed', specialty: 'Child Specialist' },
  { id: 'doc-10', name: 'Dr. Ghazala Naseem', specialty: 'Obstetrics & Gynaecologist' },
  { id: 'doc-11', name: 'Dr. Fauzia Ali', specialty: 'Obstetrics & Gynaecologist' },
  { id: 'doc-12', name: 'Dr. Misbah Noreen', specialty: 'Obstetrics & Gynaecologist' },
  { id: 'doc-13', name: 'Dr. Ferheen', specialty: 'Obstetrics & Gynaecologist' },
  { id: 'doc-14', name: 'Dr. Sanawar Pasha', specialty: 'Obstetrics & Gynaecologist' },
  { id: 'doc-15', name: 'Dr. Khurram Zia', specialty: 'Consultant Dental Surgeon' },
  { id: 'doc-16', name: 'Dr. Syed Saadat Ali', specialty: 'Cardiologist' },
  { id: 'doc-17', name: 'Dr. Usman Alam', specialty: 'Cardiologist' },
  { id: 'doc-18', name: 'Dr. Javeriya Qureshi', specialty: 'Sonologist & Radiologist' },
  { id: 'doc-19', name: 'Dr. Shabana Saeed', specialty: 'Sonologist & Radiologist' },
  { id: 'doc-20', name: 'Dr. Gulnaz Ismail', specialty: 'Sonologist & Radiologist' },
  { id: 'doc-21', name: 'Dr. S.M. Shahnawaz', specialty: 'Sonologist & Radiologist' },
  { 
    id: 'doc-22', 
    name: 'Dr. Erum Kazim', 
    specialty: 'General, Breast & Laparoscopic Surgeon', 
    bio: 'Assistant Professor Surgery, Dow University of Health Sciences & Civil Hospital Karachi' 
  },
  { id: 'doc-23', name: 'Dr. Mubashir Iqbal', specialty: 'General, Breast & Laparoscopic Surgeon' },
  { id: 'doc-24', name: 'Dr. Masood', specialty: 'General & Laparoscopic Surgeon' },
  { id: 'doc-25', name: 'Dr. Akhtar Baig', specialty: 'Orthopedic' },
  { id: 'doc-26', name: 'Dr. Nadia Adnan', specialty: 'General & Chest Physician' },
  { id: 'doc-27', name: 'Dr. Syed Ali Talha Raza', specialty: 'General & Chest Physician' },
  { id: 'doc-28', name: 'Dr. Shakeel Ahmed', specialty: 'Diabetologist' },
  { id: 'doc-29', name: 'Dr. Qazi Mujahid Ali', specialty: 'Diabetologist' },
  { id: 'doc-30', name: 'Dr. M. Naseem Akhter', specialty: 'Family Physician' },
  { id: 'doc-31', name: 'Dr. Suresh Kumar', specialty: 'Gastroenterologist / Hepatologist' },
  { id: 'doc-32', name: 'Dr. Bushra Rabbani', specialty: 'Consultant General Physician' },
  { id: 'doc-33', name: 'Dr. Moeen Qureshi', specialty: 'General & Dialysis Specialist' },
  { id: 'doc-34', name: 'Dr. Asif Ali Abbasi', specialty: 'ENT Specialist' },
];

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({ onSelectDoctor }) => {
  const { t } = useLanguage();
  const [doctors, setDoctors] = useState<Doctor[]>(SAMPLE_DOCTORS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const snap = await getDocs(collection(db, 'doctors'));
        const fetched: Doctor[] = [];
        snap.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as Doctor);
        });
        if (fetched.length > 0) {
          setDoctors(fetched);
        }
      } catch (e) {
        console.warn('Using fallback doctor sample');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <section id="doctors" className="py-16 bg-[#F5F1E8] text-[#0B6B4E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="bg-emerald-900/10 text-[#0B6B4E] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Specialist Panel
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B6B4E]">
            Meet Our Medical Doctors
          </h2>
          <p className="text-xs sm:text-sm text-emerald-950/80">
            Dedicated physicians and consultants committed to compassionate healthcare at Rafah-E-Aam Medical Center.
          </p>
        </div>

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-emerald-900/10 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-48 bg-emerald-100 relative overflow-hidden">
                  <img
                    src={doc.photoURL || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'}
                    alt={doc.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top"
                  />
                  {doc.roomNumber && (
                    <span className="absolute bottom-2 right-2 bg-[#0B6B4E] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                      {doc.roomNumber}
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-heading font-bold text-base text-[#0B6B4E]">
                    {doc.name}
                  </h3>
                  <div className="text-xs font-semibold text-[#D64545]">
                    {doc.specialty}
                  </div>
                  {doc.bio && (
                    <p className="text-xs text-emerald-900/70 line-clamp-3 leading-relaxed pt-1">
                      {doc.bio}
                    </p>
                  )}

                  {doc.availableDays && (Array.isArray(doc.availableDays) ? doc.availableDays.length > 0 : Boolean(doc.availableDays)) && (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium pt-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Days: {Array.isArray(doc.availableDays) ? doc.availableDays.join(', ') : doc.availableDays}</span>
                    </div>
                  )}

                  {doc.timing && (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium pt-0.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Timing: {doc.timing}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => onSelectDoctor(doc.id)}
                  className="w-full bg-[#D64545] hover:bg-[#c23737] text-white py-2.5 rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Visit with Doctor</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
