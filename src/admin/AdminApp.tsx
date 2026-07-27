import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Lock, 
  Mail, 
  Key, 
  LogOut, 
  Calendar, 
  UserCheck, 
  Stethoscope, 
  FileText, 
  Star, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Database, 
  Clock, 
  Upload, 
  Users, 
  Search,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Appointment, Doctor, Service, Review, Patient, MedicalReport, AppointmentStatus } from '../types';

export const AdminApp: React.FC = () => {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Login Form
  const [email, setEmail] = useState('admin@rafahemedical.com');
  const [password, setPassword] = useState('admin123456');
  const [loginError, setLoginError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Admin Data Collections
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'appointments' | 'doctors' | 'services' | 'patients' | 'reviews'>('appointments');

  // Filter & Search
  const [apptStatusFilter, setApptStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Doctor Form Modal
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('');
  const [docTiming, setDocTiming] = useState('');
  const [docPhoto, setDocPhoto] = useState('');
  const [docBio, setDocBio] = useState('');
  const [docDays, setDocDays] = useState('');
  const [docRoom, setDocRoom] = useState('');

  // Patient Report Upload Modal
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [reportFileName, setReportFileName] = useState('');
  const [reportFileUrl, setReportFileUrl] = useState('');
  const [reportUploadSuccess, setReportUploadSuccess] = useState('');

  // Seed Status Notification
  const [seedSuccessMsg, setSeedSuccessMsg] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (usr) => {
      setAdminUser(usr);
      setAuthLoading(false);
      if (usr) {
        fetchAllAdminData();
      }
    });
    return () => unsub();
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginSubmitting(true);
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.warn('Login failed, attempting auto-creation of admin account if initial setup...', err);
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (createErr: any) {
        setLoginError(createErr.message || 'Failed to authenticate admin account.');
      }
    } finally {
      setLoginSubmitting(false);
    }
  };

  const fetchAllAdminData = async () => {
    setDataLoading(true);
    try {
      // Appointments
      const apptSnap = await getDocs(collection(db, 'appointments'));
      const apptList: Appointment[] = [];
      apptSnap.forEach((d) => apptList.push({ id: d.id, ...d.data() } as Appointment));
      apptList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setAppointments(apptList);

      // Doctors
      const docSnap = await getDocs(collection(db, 'doctors'));
      const docList: Doctor[] = [];
      docSnap.forEach((d) => docList.push({ id: d.id, ...d.data() } as Doctor));
      setDoctors(docList);

      // Services
      const servSnap = await getDocs(collection(db, 'services'));
      const servList: Service[] = [];
      servSnap.forEach((s) => servList.push({ id: s.id, ...s.data() } as Service));
      setServices(servList);

      // Patients
      const patSnap = await getDocs(collection(db, 'patients'));
      const patList: Patient[] = [];
      patSnap.forEach((p) => patList.push({ ...p.data(), uid: p.id } as Patient));
      setPatients(patList);

      // Reviews
      const revSnap = await getDocs(collection(db, 'reviews'));
      const revList: Review[] = [];
      revSnap.forEach((r) => revList.push({ id: r.id, ...r.data() } as Review));
      setReviews(revList);

      // Reports
      const repSnap = await getDocs(collection(db, 'reports'));
      const repList: MedicalReport[] = [];
      repSnap.forEach((rp) => repList.push({ id: rp.id, ...rp.data() } as MedicalReport));
      setReports(repList);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleUpdateApptStatus = async (apptId: string, status: AppointmentStatus) => {
    try {
      await updateDoc(doc(db, 'appointments', apptId), { status });
      setAppointments((prev) =>
        prev.map((a) => (a.id === apptId ? { ...a, status } : a))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !docSpecialty) return;

    const doctorData = {
      name: docName,
      specialty: docSpecialty,
      timing: docTiming,
      photoURL: docPhoto || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      bio: docBio,
      availableDays: docDays ? (docDays.includes(',') ? docDays.split(',').map((d) => d.trim()) : docDays) : '',
      roomNumber: docRoom,
    };

    try {
      if (editingDoctor) {
        await updateDoc(doc(db, 'doctors', editingDoctor.id), doctorData);
      } else {
        await addDoc(collection(db, 'doctors'), doctorData);
      }
      setDoctorModalOpen(false);
      fetchAllAdminData();
    } catch (err) {
      console.error('Error saving doctor:', err);
    }
  };

  const handleDeleteDoctor = async (docId: string) => {
    if (!window.confirm('Delete this doctor record?')) return;
    try {
      await deleteDoc(doc(db, 'doctors', docId));
      setDoctors((prev) => prev.filter((d) => d.id !== docId));
    } catch (err) {
      console.error('Failed to delete doctor:', err);
    }
  };

  const handleApproveReview = async (revId: string) => {
    try {
      await updateDoc(doc(db, 'reviews', revId), { approved: true });
      setReviews((prev) =>
        prev.map((r) => (r.id === revId ? { ...r, approved: true } : r))
      );
    } catch (err) {
      console.error('Failed to approve review:', err);
    }
  };

  const handleDeleteReview = async (revId: string) => {
    try {
      await deleteDoc(doc(db, 'reviews', revId));
      setReviews((prev) => prev.filter((r) => r.id !== revId));
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  const handleUploadPatientReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !reportFileName || !reportFileUrl) return;

    try {
      const newReport = {
        patientId: selectedPatient.uid,
        patientName: selectedPatient.name,
        fileName: reportFileName,
        fileUrl: reportFileUrl,
        uploadedBy: 'admin' as const,
        uploadedAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'reports'), newReport);
      setReportUploadSuccess(`Report attached to ${selectedPatient.name}!`);
      setReportFileName('');
      setReportFileUrl('');
      fetchAllAdminData();
    } catch (err) {
      console.error('Failed to upload report:', err);
    }
  };

  // Seed Initial Demo Data Function
  const seedDemoData = async () => {
    if (!window.confirm('Seed default Doctors, Services, and Reviews into Firestore database?')) return;
    try {
      // Seed Doctors
      const sampleDocs = [
        { name: 'Dr. Ajmaal Jami', specialty: 'General Physician', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Saqib Zain', specialty: 'General Physician', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Wajid Ali', specialty: 'Consultant Cardiologist & Physician', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. S. Kashif Mateen', specialty: 'Consultant General Surgeon & Laparoscopic Surgeon', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Hira', specialty: 'Child Specialist', photoURL: 'https://images.unsplash.com/photo-1594824813566-78a5e3752e51?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. S.M. Hussain Hadi Naqvi', specialty: 'Child Specialist', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Saud Abdul Qayyum', specialty: 'Child Specialist', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Amir Hussain', specialty: 'Child Specialist', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Syed Habib Ahmed', specialty: 'Child Specialist', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Ghazala Naseem', specialty: 'Obstetrics & Gynaecologist', photoURL: 'https://images.unsplash.com/photo-1594824813566-78a5e3752e51?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Fauzia Ali', specialty: 'Obstetrics & Gynaecologist', photoURL: 'https://images.unsplash.com/photo-1594824813566-78a5e3752e51?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Misbah Noreen', specialty: 'Obstetrics & Gynaecologist', photoURL: 'https://images.unsplash.com/photo-1594824813566-78a5e3752e51?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Ferheen', specialty: 'Obstetrics & Gynaecologist', photoURL: 'https://images.unsplash.com/photo-1594824813566-78a5e3752e51?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Sanawar Pasha', specialty: 'Obstetrics & Gynaecologist', photoURL: 'https://images.unsplash.com/photo-1594824813566-78a5e3752e51?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Khurram Zia', specialty: 'Consultant Dental Surgeon', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Syed Saadat Ali', specialty: 'Cardiologist', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Usman Alam', specialty: 'Cardiologist', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Javeriya Qureshi', specialty: 'Sonologist & Radiologist', photoURL: 'https://images.unsplash.com/photo-1594824813566-78a5e3752e51?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Shabana Saeed', specialty: 'Sonologist & Radiologist', photoURL: 'https://images.unsplash.com/photo-1594824813566-78a5e3752e51?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Gulnaz Ismail', specialty: 'Sonologist & Radiologist', photoURL: 'https://images.unsplash.com/photo-1594824813566-78a5e3752e51?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. S.M. Shahnawaz', specialty: 'Sonologist & Radiologist', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
        { 
          name: 'Dr. Erum Kazim', 
          specialty: 'General, Breast & Laparoscopic Surgeon', 
          bio: 'Assistant Professor Surgery, Dow University of Health Sciences & Civil Hospital Karachi',
          photoURL: 'https://images.unsplash.com/photo-1594824813566-78a5e3752e51?auto=format&fit=crop&w=400&q=80' 
        },
        { name: 'Dr. Mubashir Iqbal', specialty: 'General, Breast & Laparoscopic Surgeon', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Masood', specialty: 'General & Laparoscopic Surgeon', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Akhtar Baig', specialty: 'Orthopedic', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Nadia Adnan', specialty: 'General & Chest Physician', photoURL: 'https://images.unsplash.com/photo-1594824813566-78a5e3752e51?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Syed Ali Talha Raza', specialty: 'General & Chest Physician', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Shakeel Ahmed', specialty: 'Diabetologist', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Qazi Mujahid Ali', specialty: 'Diabetologist', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. M. Naseem Akhter', specialty: 'Family Physician', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Suresh Kumar', specialty: 'Gastroenterologist / Hepatologist', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Bushra Rabbani', specialty: 'Consultant General Physician', photoURL: 'https://images.unsplash.com/photo-1594824813566-78a5e3752e51?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Moeen Qureshi', specialty: 'General & Dialysis Specialist', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Asif Ali Abbasi', specialty: 'ENT Specialist', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
      ];

      for (const d of sampleDocs) {
        await addDoc(collection(db, 'doctors'), d);
      }

      // Seed Services
      const sampleServices = [
        { name: 'General Physician', description: 'Comprehensive adult outpatient consultations & health checkups', icon: 'stethoscope', department: 'General Medicine' },
        { name: 'Orthopedic Surgery', description: 'Bone, joint, fracture & spinal care consultations', icon: 'activity', department: 'Orthopedics' },
        { name: 'Cardiology', description: 'Consultant cardiac care & heart health diagnostics', icon: 'heart', department: 'Cardiology' },
        { name: 'General & Laparoscopic Surgery', description: 'Minimally invasive laparoscopic & surgical procedures', icon: 'scissors', department: 'Surgery' },
        { name: 'Pediatrics (Child Specialist)', description: 'Childhood healthcare, growth monitoring & vaccinations', icon: 'baby', department: 'Pediatrics' },
        { name: 'Obstetrics & Gynaecology', description: 'Antenatal, postnatal maternity care & women health', icon: 'heart-pulse', department: 'Maternity' },
        { name: 'Radiology & Sonology', description: 'Ultrasound scans, sonography & diagnostic radiology', icon: 'file-text', department: 'Diagnostics' },
        { name: 'General, Breast & Laparoscopic Surgery', description: 'Specialized breast surgery & laparoscopic procedures', icon: 'shield', department: 'Surgery' },
        { name: 'General & Chest Medicine (Pulmonology)', description: 'Respiratory care, asthma, chest infection & lung care', icon: 'wind', department: 'Pulmonology' },
        { name: 'Diabetology', description: 'Diabetes control, blood sugar regulation & counseling', icon: 'activity', department: 'Diabetology' },
        { name: 'Family Medicine', description: 'Holistic primary care for all family members', icon: 'users', department: 'Primary Care' },
        { name: 'Gastroenterology & Hepatology', description: 'Liver, stomach acidity, digestive & intestinal health', icon: 'activity', department: 'Gastroenterology' },
        { name: 'Dialysis', description: 'Hemodialysis support services & renal care', icon: 'droplet', department: 'Nephrology' },
        { name: 'ENT', description: 'Ear, nose, throat & sinus treatment', icon: 'stethoscope', department: 'ENT' },
        { name: 'Dental', description: 'Dental surgery, oral hygiene & preventive dental care', icon: 'smile', department: 'Dental' },
      ];

      for (const s of sampleServices) {
        await addDoc(collection(db, 'services'), s);
      }

      // Seed Sample Reviews
      const sampleReviews = [
        { patientName: 'Kamran Siddiqui', rating: 5, comment: 'Brought my mother to the 24/7 emergency ward at midnight. Excellent care!', approved: true, createdAt: new Date().toISOString() },
        { patientName: 'Shazia Parveen', rating: 5, comment: 'Very polite staff and clean premises in Gulberg Town Karachi.', approved: true, createdAt: new Date().toISOString() }
      ];

      for (const r of sampleReviews) {
        await addDoc(collection(db, 'reviews'), r);
      }

      setSeedSuccessMsg('Demo doctors, services, and reviews seeded successfully!');
      fetchAllAdminData();
    } catch (err) {
      console.error('Seeding error:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center p-6 text-[#0B6B4E]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#0B6B4E] border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-xs font-bold">Verifying Admin Credentials...</div>
        </div>
      </div>
    );
  }

  // Admin Login Screen
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center p-4 text-[#0B6B4E]">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-emerald-900/10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#0B6B4E] text-white rounded-2xl flex items-center justify-center mx-auto shadow">
              <Building2 className="w-8 h-8" />
            </div>
            <h1 className="font-heading font-extrabold text-2xl text-[#0B6B4E]">
              Admin Panel Login
            </h1>
            <p className="text-xs text-emerald-900/70">
              Rafah-E-Aam Medical Center (رفاہ عام میڈیکل سینٹر)
            </p>
          </div>

          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs space-y-1 text-emerald-900">
            <div className="font-bold flex items-center gap-1 text-[#0B6B4E]">
              <Lock className="w-3.5 h-3.5" /> Security & Account Rules
            </div>
            <div>Fixed Admin Email: <span className="font-mono font-bold">admin@rafahemedical.com</span></div>
            <div>Password: <span className="font-mono font-bold">admin123456</span></div>
          </div>

          {loginError && (
            <div className="p-3 bg-red-100 text-red-700 text-xs font-medium rounded-xl border border-red-300">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-emerald-700 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Password</label>
              <div className="relative">
                <Key className="w-4 h-4 text-emerald-700 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginSubmitting}
              className="w-full bg-[#D64545] hover:bg-[#c23737] text-white py-3 rounded-xl font-bold text-sm shadow cursor-pointer transition-colors"
            >
              {loginSubmitting ? 'Authenticating...' : 'Sign In to Admin Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered Appointments
  const filteredAppointments = appointments.filter((a) => {
    const matchesStatus = apptStatusFilter === 'all' || a.status === apptStatusFilter;
    const matchesSearch =
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.phone.includes(searchQuery) ||
      a.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Today's appointments count
  const todayStr = new Date().toISOString().split('T')[0];
  const apptsToday = appointments.filter((a) => a.preferredDate === todayStr).length;
  const pendingCount = appointments.filter((a) => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#0B6B4E] pb-20 font-sans">
      
      {/* Top Admin Bar */}
      <div className="bg-[#0B6B4E] text-white py-4 px-4 sm:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white text-[#0B6B4E] rounded-xl flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-lg text-white">
                Rafah-E-Aam Medical Center — Admin Panel
              </h1>
              <p className="text-xs text-emerald-200">
                Logged in as: {adminUser.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={seedDemoData}
              className="bg-emerald-800 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-600 flex items-center gap-1.5"
              title="Seed default doctors, services, reviews"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Seed Initial Data</span>
            </button>

            <button
              onClick={() => signOut(auth)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 space-y-6">
        
        {seedSuccessMsg && (
          <div className="p-3 bg-emerald-100 text-[#0B6B4E] text-xs font-bold rounded-xl border border-emerald-300">
            {seedSuccessMsg}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-900/10 flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-[#0B6B4E] rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold font-heading">{apptsToday}</div>
              <div className="text-xs text-emerald-800/70">Appointments Today</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-900/10 flex items-center gap-3">
            <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold font-heading">{pendingCount}</div>
              <div className="text-xs text-emerald-800/70">Pending Triage</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-900/10 flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-800 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold font-heading">{patients.length}</div>
              <div className="text-xs text-emerald-800/70">Registered Patients</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-900/10 flex items-center gap-3">
            <div className="p-3 bg-purple-100 text-purple-800 rounded-xl">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold font-heading">{doctors.length}</div>
              <div className="text-xs text-emerald-800/70">Specialist Doctors</div>
            </div>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-emerald-900/10 flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'appointments' ? 'bg-[#0B6B4E] text-white' : 'text-emerald-900 hover:bg-[#F5F1E8]'
            }`}
          >
            Appointments ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'doctors' ? 'bg-[#0B6B4E] text-white' : 'text-emerald-900 hover:bg-[#F5F1E8]'
            }`}
          >
            Manage Doctors ({doctors.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'services' ? 'bg-[#0B6B4E] text-white' : 'text-emerald-900 hover:bg-[#F5F1E8]'
            }`}
          >
            Services ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('patients')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'patients' ? 'bg-[#0B6B4E] text-white' : 'text-emerald-900 hover:bg-[#F5F1E8]'
            }`}
          >
            Patients & Reports
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'reviews' ? 'bg-[#0B6B4E] text-white' : 'text-emerald-900 hover:bg-[#F5F1E8]'
            }`}
          >
            Reviews & Testimonials ({reviews.length})
          </button>
        </div>

        {/* TAB 1: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-900/10 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h2 className="font-heading font-bold text-lg">Patient Appointments List</h2>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Search */}
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="w-3.5 h-3.5 text-emerald-700 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search patient / phone / service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#F5F1E8] text-xs border border-emerald-900/20 rounded-xl pl-8 pr-3 py-2 w-full focus:outline-none"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={apptStatusFilter}
                  onChange={(e) => setApptStatusFilter(e.target.value)}
                  className="bg-[#F5F1E8] text-xs border border-emerald-900/20 rounded-xl px-3 py-2 font-bold"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8 text-xs text-emerald-800">
                No appointments matching criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-emerald-950">
                  <thead className="bg-[#F5F1E8] text-[#0B6B4E] font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3 rounded-l-xl">Patient</th>
                      <th className="p-3">Service & Doctor</th>
                      <th className="p-3">Date & Time</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-r-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/10">
                    {filteredAppointments.map((a) => (
                      <tr key={a.id} className="hover:bg-emerald-50/50">
                        <td className="p-3 font-semibold">
                          <div>{a.patientName}</div>
                          <div className="text-[10px] text-emerald-800">{a.phone} • {a.email || 'No email'}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold">{a.service}</div>
                          <div className="text-[10px] text-emerald-800">{a.doctorName || 'Duty Specialist'}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold">{a.preferredDate}</div>
                          <div className="text-[10px] text-emerald-800">{a.preferredTime}</div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              a.status === 'confirmed'
                                ? 'bg-emerald-100 text-[#0B6B4E]'
                                : a.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : a.status === 'cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {a.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={a.status}
                            onChange={(e) =>
                              handleUpdateApptStatus(a.id, e.target.value as AppointmentStatus)
                            }
                            className="bg-[#F5F1E8] border border-emerald-900/20 rounded-lg text-xs font-bold py-1 px-2 focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirm</option>
                            <option value="completed">Complete</option>
                            <option value="cancelled">Cancel</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DOCTORS */}
        {activeTab === 'doctors' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-900/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg">Hospital Doctor Roster</h2>
              <button
                onClick={() => {
                  setEditingDoctor(null);
                  setDocName('');
                  setDocSpecialty('');
                  setDocTiming('');
                  setDocPhoto('');
                  setDocBio('');
                  setDocDays('');
                  setDocRoom('');
                  setDoctorModalOpen(true);
                }}
                className="bg-[#0B6B4E] hover:bg-[#08523c] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Doctor
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {doctors.map((d) => (
                <div key={d.id} className="p-4 bg-[#F5F1E8] rounded-2xl border border-emerald-900/10 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={d.photoURL || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'}
                        alt={d.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <div className="font-bold text-sm text-[#0B6B4E]">{d.name}</div>
                        <div className="text-xs text-[#D64545] font-semibold">{d.specialty}</div>
                      </div>
                    </div>

                    {(d.timing || d.availableDays) && (
                      <div className="text-[11px] text-emerald-900/80 bg-white/60 p-2 rounded-lg space-y-0.5">
                        {d.availableDays && (
                          <div>
                            <span className="font-bold">Date/Days: </span>
                            {Array.isArray(d.availableDays) ? d.availableDays.join(', ') : d.availableDays}
                          </div>
                        )}
                        {d.timing && (
                          <div>
                            <span className="font-bold">Timing: </span>
                            {d.timing}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-emerald-900/10">
                    <button
                      onClick={() => {
                        setEditingDoctor(d);
                        setDocName(d.name || '');
                        setDocSpecialty(d.specialty || '');
                        setDocTiming(d.timing || '');
                        setDocPhoto(d.photoURL || '');
                        setDocBio(d.bio || '');
                        setDocDays(Array.isArray(d.availableDays) ? d.availableDays.join(', ') : (d.availableDays || ''));
                        setDocRoom(d.roomNumber || '');
                        setDoctorModalOpen(true);
                      }}
                      className="text-xs font-bold text-[#0B6B4E] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>

                    <button
                      onClick={() => handleDeleteDoctor(d.id)}
                      className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SERVICES */}
        {activeTab === 'services' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-900/10 space-y-4">
            <h2 className="font-heading font-bold text-lg">Hospital Services & Care Units</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map((s) => (
                <div key={s.id} className="p-4 bg-[#F5F1E8] rounded-2xl border border-emerald-900/10 space-y-2">
                  <div className="font-bold text-sm text-[#0B6B4E]">{s.name}</div>
                  <div className="text-xs text-emerald-900/80">{s.description}</div>
                  {s.department && (
                    <span className="inline-block text-[10px] bg-emerald-100 text-[#0B6B4E] font-bold px-2 py-0.5 rounded-full">
                      {s.department}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PATIENTS & REPORTS */}
        {activeTab === 'patients' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-900/10 space-y-6">
            <h2 className="font-heading font-bold text-lg">Registered Patients & Document Uploads</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient List */}
              <div className="space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#0B6B4E]">Patient Directory</h3>
                {patients.length === 0 ? (
                  <div className="text-xs text-emerald-800">No registered profiles in system yet.</div>
                ) : (
                  <div className="space-y-2">
                    {patients.map((p) => (
                      <div
                        key={p.uid}
                        onClick={() => {
                          setSelectedPatient(p);
                          setReportUploadSuccess('');
                        }}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          selectedPatient?.uid === p.uid
                            ? 'bg-[#0B6B4E] text-white border-[#0B6B4E]'
                            : 'bg-[#F5F1E8] text-[#0B6B4E] border-emerald-900/10 hover:border-emerald-700'
                        }`}
                      >
                        <div className="font-bold">{p.name}</div>
                        <div className="text-[11px] opacity-80">{p.email} • {p.phone || 'No phone'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload Form for Selected Patient */}
              <div className="bg-[#F5F1E8] p-5 rounded-2xl border border-emerald-900/10 space-y-4">
                <h3 className="font-bold text-sm text-[#0B6B4E] flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Attach Lab Report to Patient
                </h3>

                {selectedPatient ? (
                  <form onSubmit={handleUploadPatientReport} className="space-y-3">
                    <div className="text-xs font-bold text-[#0B6B4E]">
                      Selected: {selectedPatient.name} ({selectedPatient.email})
                    </div>

                    {reportUploadSuccess && (
                      <div className="p-2 bg-emerald-100 text-[#0B6B4E] text-xs font-bold rounded-lg">
                        {reportUploadSuccess}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold mb-1">Report / Document Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Complete Blood Count (CBC) Report"
                        value={reportFileName}
                        onChange={(e) => setReportFileName(e.target.value)}
                        className="w-full bg-white border border-emerald-900/20 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1">File URL / Download Link</label>
                      <input
                        type="url"
                        required
                        placeholder="https://example.com/reports/patient-lab.pdf"
                        value={reportFileUrl}
                        onChange={(e) => setReportFileUrl(e.target.value)}
                        className="w-full bg-white border border-emerald-900/20 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#0B6B4E] hover:bg-[#08523c] text-white py-2 rounded-xl text-xs font-bold shadow"
                    >
                      Attach Report File
                    </button>
                  </form>
                ) : (
                  <div className="text-xs text-emerald-800 text-center py-6">
                    Select a patient from the list on the left to attach a diagnostic report.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-900/10 space-y-4">
            <h2 className="font-heading font-bold text-lg">Patient Reviews & Moderation</h2>

            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="p-4 bg-[#F5F1E8] rounded-2xl border border-emerald-900/10 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-[#0B6B4E]">
                      {r.patientName} — <span className="text-amber-600 font-bold">{r.rating}★</span>
                    </div>
                    <div className="text-xs text-emerald-900/80 italic">"{r.comment}"</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!r.approved ? (
                      <button
                        onClick={() => handleApproveReview(r.id)}
                        className="bg-[#0B6B4E] text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                    ) : (
                      <span className="text-[10px] bg-emerald-100 text-[#0B6B4E] font-bold px-2 py-1 rounded-full">
                        Approved
                      </span>
                    )}

                    <button
                      onClick={() => handleDeleteReview(r.id)}
                      className="text-red-600 hover:text-red-800 font-bold text-xs p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Doctor Modal */}
      {doctorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#0B6B4E] w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-heading font-bold text-base">
                {editingDoctor ? 'Edit Doctor Record' : 'Add New Doctor'}
              </h3>
              <button onClick={() => setDoctorModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoctor} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Doctor Name *</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Dr. Ajmaal Jami"
                  className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-[#0B6B4E]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Field / Specialty *</label>
                <input
                  type="text"
                  required
                  value={docSpecialty}
                  onChange={(e) => setDocSpecialty(e.target.value)}
                  placeholder="e.g. General Physician"
                  className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-[#0B6B4E]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Timing (Consulting Hours)</label>
                <input
                  type="text"
                  value={docTiming}
                  onChange={(e) => setDocTiming(e.target.value)}
                  placeholder="e.g. 5:00 PM – 8:00 PM"
                  className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-[#0B6B4E]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Date / Days (Consulting Days)</label>
                <input
                  type="text"
                  value={docDays}
                  onChange={(e) => setDocDays(e.target.value)}
                  placeholder="e.g. Monday, Wednesday & Friday"
                  className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-[#0B6B4E]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Room / Location</label>
                <input
                  type="text"
                  value={docRoom}
                  onChange={(e) => setDocRoom(e.target.value)}
                  placeholder="e.g. OPD Room 102"
                  className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-[#0B6B4E]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Qualifications / Bio</label>
                <textarea
                  rows={2}
                  value={docBio}
                  onChange={(e) => setDocBio(e.target.value)}
                  placeholder="e.g. MBBS, Assistant Professor Surgery..."
                  className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-[#0B6B4E]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Photo URL</label>
                <input
                  type="url"
                  value={docPhoto}
                  onChange={(e) => setDocPhoto(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-[#0B6B4E]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0B6B4E] hover:bg-[#08523c] text-white py-2.5 rounded-xl font-bold shadow cursor-pointer transition-colors"
              >
                Save Doctor Record
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
