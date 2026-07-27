import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Stethoscope, 
  FileText, 
  CheckCircle2, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Doctor, Service } from '../../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDoctorId?: string;
  preselectedServiceId?: string;
}

const DEFAULT_SERVICES: Service[] = [
  { id: 'gen-physician', name: 'General Physician', description: 'Comprehensive adult outpatient consultations & health checkups' },
  { id: 'orthopedics', name: 'Orthopedic Surgery', description: 'Bone, joint, fracture & spinal care consultations' },
  { id: 'cardiology', name: 'Cardiology', description: 'Consultant cardiac care & heart health diagnostics' },
  { id: 'gen-lap-surgery', name: 'General & Laparoscopic Surgery', description: 'Minimally invasive laparoscopic & surgical procedures' },
  { id: 'pediatrics', name: 'Pediatrics (Child Specialist)', description: 'Childhood healthcare, growth monitoring & vaccinations' },
  { id: 'obs-gyn', name: 'Obstetrics & Gynaecology', description: 'Antenatal, postnatal maternity care & women health' },
  { id: 'radiology-sonology', name: 'Radiology & Sonology', description: 'Ultrasound scans, sonography & diagnostic radiology' },
  { id: 'breast-lap-surgery', name: 'General, Breast & Laparoscopic Surgery', description: 'Specialized breast surgery & laparoscopic procedures' },
  { id: 'chest-pulmonology', name: 'General & Chest Medicine (Pulmonology)', description: 'Respiratory care, asthma, chest infection & lung care' },
  { id: 'diabetology', name: 'Diabetology', description: 'Diabetes control, blood sugar regulation & counseling' },
  { id: 'family-medicine', name: 'Family Medicine', description: 'Holistic primary care for all family members' },
  { id: 'gastroenterology', name: 'Gastroenterology & Hepatology', description: 'Liver, stomach acidity, digestive & intestinal health' },
  { id: 'dialysis', name: 'Dialysis', description: 'Hemodialysis support services & renal care' },
  { id: 'ent', name: 'ENT', description: 'Ear, nose, throat & sinus treatment' },
  { id: 'dental', name: 'Dental', description: 'Dental surgery, oral hygiene & preventive dental care' },
];

const DEFAULT_DOCTORS: Doctor[] = [
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
  { id: 'doc-22', name: 'Dr. Erum Kazim', specialty: 'General, Breast & Laparoscopic Surgeon' },
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

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedDoctorId,
  preselectedServiceId,
}) => {
  const { user, patientProfile } = useAuth();
  const { t } = useLanguage();

  const [doctors, setDoctors] = useState<Doctor[]>(DEFAULT_DOCTORS);
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [loadingDocs, setLoadingDocs] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('09:00 AM');
  const [reason, setReason] = useState('');
  const [isReturning, setIsReturning] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Prefill when opened
  useEffect(() => {
    if (isOpen) {
      if (patientProfile) {
        setName(patientProfile.name || '');
        setPhone(patientProfile.phone || '');
        setEmail(patientProfile.email || '');
      } else if (user) {
        setName(user.displayName || '');
        setEmail(user.email || '');
      }

      // Default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setPreferredDate(tomorrow.toISOString().split('T')[0]);

      if (preselectedDoctorId) setDoctorId(preselectedDoctorId);
      if (preselectedServiceId) setService(preselectedServiceId);

      // Fetch doctors & services from Firestore
      fetchMetadata();
    } else {
      setSubmitted(false);
      setErrorMsg('');
    }
  }, [isOpen, user, patientProfile, preselectedDoctorId, preselectedServiceId]);

  const fetchMetadata = async () => {
    setLoadingDocs(true);
    try {
      // Doctors
      const docSnap = await getDocs(collection(db, 'doctors'));
      const fetchedDocs: Doctor[] = [];
      docSnap.forEach((d) => fetchedDocs.push({ id: d.id, ...d.data() } as Doctor));
      if (fetchedDocs.length > 0) setDoctors(fetchedDocs);

      // Services
      const servSnap = await getDocs(collection(db, 'services'));
      const fetchedServs: Service[] = [];
      servSnap.forEach((s) => fetchedServs.push({ id: s.id, ...s.data() } as Service));
      if (fetchedServs.length > 0) setServices(fetchedServs);
    } catch (e) {
      console.warn('Using default services list', e);
    } finally {
      setLoadingDocs(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !preferredDate || !preferredTime || (!service && !doctorId)) {
      setErrorMsg('Please fill in all required fields (Name, Phone, Date, Time, and Service).');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const selectedDoc = doctors.find((d) => d.id === doctorId);
      const selectedServ = services.find((s) => s.id === service)?.name || service || 'General OPD';

      const appointmentData = {
        patientId: user ? user.uid : 'guest',
        patientName: name,
        phone,
        email,
        service: selectedServ,
        doctorId: doctorId || '',
        doctorName: selectedDoc ? selectedDoc.name : 'Duty Specialist',
        preferredDate,
        preferredTime,
        reason,
        status: 'pending',
        isReturning,
        source: 'web',
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'appointments'), appointmentData);
      setSubmitted(true);
    } catch (err: any) {
      console.error('Booking submission error:', err);
      setErrorMsg('Failed to record appointment. Please check your connection or try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getFilteredDoctors = () => {
    if (!service) return doctors;
    const selectedServObj = services.find((s) => s.id === service || s.name === service);
    const selectedName = (selectedServObj ? selectedServObj.name : service).toLowerCase();

    const filtered = doctors.filter((d) => {
      const spec = (d.specialty || '').toLowerCase();
      
      if (selectedName.includes('general physician')) {
        return spec.includes('general physician') || spec.includes('family physician') || spec.includes('physician');
      }
      if (selectedName.includes('orthopedic')) {
        return spec.includes('orthopedic');
      }
      if (selectedName.includes('cardiology')) {
        return spec.includes('cardiologist') || spec.includes('cardio');
      }
      if (selectedName.includes('pediatrics') || selectedName.includes('child')) {
        return spec.includes('child specialist') || spec.includes('pediatric');
      }
      if (selectedName.includes('obstetrics') || selectedName.includes('gynaecology')) {
        return spec.includes('obstetrics') || spec.includes('gynaecologist');
      }
      if (selectedName.includes('radiology') || selectedName.includes('sonology')) {
        return spec.includes('sonologist') || spec.includes('radiologist');
      }
      if (selectedName.includes('breast') && selectedName.includes('laparoscopic')) {
        return spec.includes('breast') || spec.includes('laparoscopic');
      }
      if (selectedName.includes('laparoscopic') || selectedName.includes('surgery')) {
        return spec.includes('surgeon') || spec.includes('surgery') || spec.includes('laparoscopic');
      }
      if (selectedName.includes('chest') || selectedName.includes('pulmonology')) {
        return spec.includes('chest') || spec.includes('pulm');
      }
      if (selectedName.includes('diabetology')) {
        return spec.includes('diabetologist') || spec.includes('diabetes');
      }
      if (selectedName.includes('family medicine')) {
        return spec.includes('family physician') || spec.includes('general physician');
      }
      if (selectedName.includes('gastroenterology') || selectedName.includes('hepatology')) {
        return spec.includes('gastroenterologist') || spec.includes('hepatologist');
      }
      if (selectedName.includes('dialysis')) {
        return spec.includes('dialysis');
      }
      if (selectedName.includes('ent')) {
        return spec.includes('ent');
      }
      if (selectedName.includes('dental')) {
        return spec.includes('dental');
      }

      return spec.includes(selectedName) || selectedName.includes(spec);
    });

    return filtered.length > 0 ? filtered : doctors;
  };

  const filteredDoctors = getFilteredDoctors();

  const whatsappLink = `https://wa.me/922136342011?text=${encodeURIComponent(
    `Hello Rafah-E-Aam Medical Centre, I booked an appointment request on your website for ${name} (${phone}) on ${preferredDate} at ${preferredTime}. Please confirm my slot.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      
      {/* Container: Bottom-sheet style on mobile, rounded modal on desktop */}
      <div className="bg-[#F5F1E8] text-[#0B6B4E] w-full max-w-2xl rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-emerald-900/10">
        
        {/* Modal Header */}
        <div className="bg-[#0B6B4E] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-300" />
            <h2 className="font-heading font-bold text-base sm:text-lg">
              {t.bookAppointment} — Rafah-E-Aam
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {submitted ? (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-[#0B6B4E] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 text-[#0B6B4E]" />
              </div>

              <h3 className="font-heading text-xl font-bold text-[#0B6B4E]">
                Appointment Request Received!
              </h3>

              <p className="text-sm text-emerald-900/80 max-w-md mx-auto leading-relaxed">
                Thank you <span className="font-semibold">{name}</span>. Your request for{' '}
                <span className="font-semibold">{preferredDate} at {preferredTime}</span> has been logged. Our reception team will call you at <span className="font-semibold">{phone}</span> to confirm.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold px-5 py-3 rounded-xl shadow flex items-center justify-center gap-2 text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  {t.whatsappConfirm}
                </a>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto bg-[#0B6B4E] hover:bg-[#08523c] text-white font-bold px-5 py-3 rounded-xl text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {!user && (
                <div className="bg-emerald-900/5 p-3 rounded-xl border border-emerald-800/10 text-xs text-emerald-900 flex items-center justify-between">
                  <span>Guest booking enabled. Have an account?</span>
                  <span className="font-bold text-[#0B6B4E] underline cursor-pointer">
                    Sign in to track status
                  </span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-xs rounded-xl font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Patient Name */}
                <div>
                  <label className="block text-xs font-bold text-[#0B6B4E] mb-1">
                    {t.fullName} *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-emerald-700 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Muhammad Ali"
                      className="w-full bg-white border border-emerald-900/20 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-[#0B6B4E] mb-1">
                    {t.phoneNumber} *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-emerald-700 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full bg-white border border-emerald-900/20 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-[#0B6B4E] mb-1">
                    {t.emailAddress}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-emerald-700 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="patient@example.com"
                      className="w-full bg-white border border-emerald-900/20 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                    />
                  </div>
                </div>

                {/* Patient Type */}
                <div>
                  <label className="block text-xs font-bold text-[#0B6B4E] mb-1">
                    Patient Visit Type
                  </label>
                  <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-emerald-900/20 text-xs font-medium">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="returning"
                        checked={!isReturning}
                        onChange={() => setIsReturning(false)}
                        className="accent-[#0B6B4E]"
                      />
                      New Patient
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="returning"
                        checked={isReturning}
                        onChange={() => setIsReturning(true)}
                        className="accent-[#0B6B4E]"
                      />
                      Follow-up / Returning
                    </label>
                  </div>
                </div>
              </div>

              {/* Service / Department */}
              <div>
                <label className="block text-xs font-bold text-[#0B6B4E] mb-1">
                  {t.selectService} *
                </label>
                <div className="relative">
                  <Stethoscope className="w-4 h-4 text-emerald-700 absolute left-3 top-3" />
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full bg-white border border-emerald-900/20 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                  >
                    <option value="">-- Choose Department / Care --</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preferred Doctor */}
              <div>
                <label className="block text-xs font-bold text-[#0B6B4E] mb-1">
                  {t.selectDoctor}
                </label>
                <select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full bg-white border border-emerald-900/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                >
                  <option value="">-- Any Available Specialist / Duty Doctor ({filteredDoctors.length} available) --</option>
                  {filteredDoctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-[#0B6B4E] mb-1">
                    {t.preferredDate} *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-white border border-emerald-900/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                  />
                </div>

                {/* Time Slot */}
                <div>
                  <label className="block text-xs font-bold text-[#0B6B4E] mb-1">
                    {t.preferredTime} *
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full bg-white border border-emerald-900/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                  >
                    <option value="09:00 AM">09:00 AM - Morning</option>
                    <option value="11:00 AM">11:00 AM - Morning</option>
                    <option value="02:00 PM">02:00 PM - Afternoon</option>
                    <option value="05:00 PM">05:00 PM - Evening</option>
                    <option value="08:00 PM">08:00 PM - Night Care</option>
                    <option value="Emergency Any Time">24/7 Emergency Immediate</option>
                  </select>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-bold text-[#0B6B4E] mb-1">
                  {t.reasonVisit}
                </label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Briefly describe symptoms or checkup type..."
                  className="w-full bg-white border border-emerald-900/20 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#D64545] hover:bg-[#c23737] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {submitting ? (
                  <span>Submitting Request...</span>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>{t.confirmBooking}</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
