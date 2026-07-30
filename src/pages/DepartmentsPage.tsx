import React, { useEffect, useState } from 'react';
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
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Doctor, Department } from '../types';
import { BookingModal } from '../components/booking/BookingModal';

export const DEPARTMENTS_DATA: Department[] = [
  {
    id: 'gen-physician',
    name: 'General OPD & Internal Medicine',
    description: 'Comprehensive adult outpatient consultations, hypertension management, fever & infectious care, diabetes screening, and general medical checkups.',
    timing: '09:00 AM - 09:00 PM',
    days: 'Mon - Sat',
    fee: 'Rs. 1,000',
    icon: 'stethoscope',
    doctors: [
      {
        id: 'doc-1',
        name: 'Dr. Ajmaal Jami',
        specialty: 'General Physician',
        availableDays: 'Mon - Sat',
        timing: '09:00 AM - 01:00 PM',
        fee: 'Rs. 1,000',
        roomNumber: 'OPD-1',
        photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        bio: 'Senior General Physician with over 15+ years experience in chronic disease management and adult outpatient care.'
      },
      {
        id: 'doc-2',
        name: 'Dr. Saqib Zain',
        specialty: 'General Physician',
        availableDays: 'Mon - Sat',
        timing: '05:00 PM - 09:00 PM',
        fee: 'Rs. 1,000',
        roomNumber: 'OPD-2',
        photoURL: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
        bio: 'Specialist in primary medical care, hypertension control, seasonal fevers, and preventive health screenings.'
      },
      {
        id: 'doc-32',
        name: 'Dr. Bushra Rabbani',
        specialty: 'Consultant General Physician',
        availableDays: 'Mon, Wed, Fri',
        timing: '02:00 PM - 05:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'OPD-3',
        photoURL: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?auto=format&fit=crop&w=400&q=80',
        bio: 'Consultant physician specializing in internal medicine, elder care, and metabolic health.'
      }
    ]
  },
  {
    id: 'cardiology',
    name: 'Cardiology & Heart Care',
    description: 'Expert cardiac consultations, ECG diagnostics, blood pressure monitoring, heart disease prevention, and post-cardiac surgery recovery care.',
    timing: '02:00 PM - 09:00 PM',
    days: 'Mon - Sat',
    fee: 'Rs. 1,500',
    icon: 'heart',
    doctors: [
      {
        id: 'doc-3',
        name: 'Dr. Wajid Ali',
        specialty: 'Consultant Cardiologist & Physician',
        availableDays: 'Mon, Wed, Fri',
        timing: '06:00 PM - 09:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'Cardio-1',
        photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        bio: 'Consultant Cardiologist specializing in ischemic heart disease, hypertension management, and non-invasive cardiac diagnostics.'
      },
      {
        id: 'doc-16',
        name: 'Dr. Syed Saadat Ali',
        specialty: 'Cardiologist',
        availableDays: 'Tue, Thu, Sat',
        timing: '05:00 PM - 08:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'Cardio-2',
        photoURL: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
        bio: 'Experienced clinical cardiologist offering consultations for angina, arrhythmia, and cardiac health evaluations.'
      },
      {
        id: 'doc-17',
        name: 'Dr. Usman Alam',
        specialty: 'Cardiologist',
        availableDays: 'Mon - Sat',
        timing: '02:00 PM - 05:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'Cardio-3',
        photoURL: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
        bio: 'Specialist in preventative cardiology, hypertension, and routine heart health checks.'
      }
    ]
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics & Joint Care',
    description: 'Advanced bone and joint care, fracture alignment, spinal disorder management, arthritis consultations, and orthopedic trauma stabilization.',
    timing: '06:00 PM - 09:00 PM',
    days: 'Mon - Sat',
    fee: 'Rs. 1,500',
    icon: 'activity',
    doctors: [
      {
        id: 'doc-25',
        name: 'Dr. Akhtar Baig',
        specialty: 'Orthopedic Specialist',
        availableDays: 'Mon - Sat',
        timing: '06:00 PM - 09:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'Ortho-1',
        photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        bio: 'Renowned Orthopedic consultant with deep expertise in bone fractures, joint arthritis, back pain, and spinal alignment.'
      }
    ]
  },
  {
    id: 'gen-lap-surgery',
    name: 'General, Laparoscopic & Surgical Care',
    description: 'Minimally invasive keyhole laparoscopic procedures, hernia repair, gallbladder surgery, appendectomy, breast surgery, and general surgical consultation.',
    timing: '04:00 PM - 09:00 PM',
    days: 'Daily',
    fee: 'Rs. 1,500',
    icon: 'stethoscope',
    doctors: [
      {
        id: 'doc-4',
        name: 'Dr. S. Kashif Mateen',
        specialty: 'Consultant General & Laparoscopic Surgeon',
        availableDays: 'Tue, Thu, Sat',
        timing: '05:00 PM - 08:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'OT-1',
        photoURL: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
        bio: 'Senior laparoscopic surgeon providing expert keyhole surgical procedures, hernia repair, and abdominal surgery.'
      },
      {
        id: 'doc-22',
        name: 'Dr. Erum Kazim',
        specialty: 'General, Breast & Laparoscopic Surgeon',
        availableDays: 'Mon - Sat',
        timing: '04:00 PM - 07:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'OT-2',
        photoURL: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        bio: 'Assistant Professor Surgery at DUHS & Civil Hospital Karachi. Specialist in breast surgery, endocrine procedures, and laparoscopic surgery.'
      },
      {
        id: 'doc-23',
        name: 'Dr. Mubashir Iqbal',
        specialty: 'General, Breast & Laparoscopic Surgeon',
        availableDays: 'Mon, Wed, Fri',
        timing: '06:00 PM - 09:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'OT-3',
        photoURL: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
        bio: 'Consultant surgeon specializing in general surgery, wound management, and laparoscopic procedures.'
      },
      {
        id: 'doc-24',
        name: 'Dr. Masood',
        specialty: 'General & Laparoscopic Surgeon',
        availableDays: 'Daily',
        timing: '07:00 PM - 10:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'OT-4',
        photoURL: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
        bio: 'Experienced surgeon providing emergency and elective surgical consultations.'
      }
    ]
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics & Child Health',
    description: 'Dedicated healthcare for infants, toddlers, and children, growth and developmental monitoring, childhood vaccination programs, and pediatric emergency care.',
    timing: '10:00 AM - 11:00 PM',
    days: 'Mon - Sat',
    fee: 'Rs. 1,000',
    icon: 'baby',
    doctors: [
      {
        id: 'doc-5',
        name: 'Dr. Hira',
        specialty: 'Child Specialist',
        availableDays: 'Mon - Sat',
        timing: '10:00 AM - 02:00 PM',
        fee: 'Rs. 1,000',
        roomNumber: 'Peds-1',
        photoURL: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?auto=format&fit=crop&w=400&q=80',
        bio: 'Compassionate pediatric specialist caring for newborn health, infant growth, and childhood fevers.'
      },
      {
        id: 'doc-6',
        name: 'Dr. S.M. Hussain Hadi Naqvi',
        specialty: 'Child Specialist',
        availableDays: 'Mon, Wed, Fri',
        timing: '05:00 PM - 08:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'Peds-2',
        photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        bio: 'Senior pediatrician specializing in childhood respiratory illnesses, nutrition, and vaccination.'
      },
      {
        id: 'doc-7',
        name: 'Dr. Saud Abdul Qayyum',
        specialty: 'Child Specialist',
        availableDays: 'Tue, Thu, Sat',
        timing: '06:00 PM - 09:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'Peds-3',
        photoURL: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
        bio: 'Consultant child specialist with expertise in pediatric infectious diseases and asthma.'
      },
      {
        id: 'doc-8',
        name: 'Dr. Amir Hussain',
        specialty: 'Child Specialist',
        availableDays: 'Mon - Sat',
        timing: '02:00 PM - 05:00 PM',
        fee: 'Rs. 1,000',
        roomNumber: 'Peds-4',
        photoURL: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
        bio: 'Pediatric care consultant focusing on toddler wellness, immunity, and developmental milestones.'
      },
      {
        id: 'doc-9',
        name: 'Dr. Syed Habib Ahmed',
        specialty: 'Child Specialist',
        availableDays: 'Mon - Sat',
        timing: '08:00 PM - 11:00 PM',
        fee: 'Rs. 1,000',
        roomNumber: 'Peds-5',
        photoURL: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
        bio: 'Night-duty pediatric consultant providing emergency child health consultations.'
      }
    ]
  },
  {
    id: 'obs-gyn',
    name: 'Obstetrics & Gynaecology (Maternity Care)',
    description: 'Comprehensive maternity care, antenatal screening, high-risk pregnancy management, gynecological consultations, postnatal care, and women reproductive health.',
    timing: '11:00 AM - 10:00 PM',
    days: 'Mon - Sat',
    fee: 'Rs. 1,200',
    icon: 'heart',
    doctors: [
      {
        id: 'doc-10',
        name: 'Dr. Ghazala Naseem',
        specialty: 'Obstetrics & Gynaecologist',
        availableDays: 'Mon, Wed, Fri',
        timing: '11:00 AM - 02:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'Gynae-1',
        photoURL: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        bio: 'Senior Gynaecologist with extensive experience in antenatal monitoring, safe delivery, and reproductive health.'
      },
      {
        id: 'doc-11',
        name: 'Dr. Fauzia Ali',
        specialty: 'Obstetrics & Gynaecologist',
        availableDays: 'Tue, Thu, Sat',
        timing: '04:00 PM - 07:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'Gynae-2',
        photoURL: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?auto=format&fit=crop&w=400&q=80',
        bio: 'Consultant Obstetrician providing personalized maternal care, ultrasound consultations, and gynecological care.'
      },
      {
        id: 'doc-12',
        name: 'Dr. Misbah Noreen',
        specialty: 'Obstetrics & Gynaecologist',
        availableDays: 'Mon - Sat',
        timing: '06:00 PM - 09:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'Gynae-3',
        photoURL: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        bio: 'Experienced specialist in pregnancy health, PCOS treatment, and routine gynecological consultations.'
      },
      {
        id: 'doc-13',
        name: 'Dr. Ferheen',
        specialty: 'Obstetrics & Gynaecologist',
        availableDays: 'Mon, Wed, Fri',
        timing: '02:00 PM - 05:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'Gynae-4',
        photoURL: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?auto=format&fit=crop&w=400&q=80',
        bio: 'Consultant in maternal-fetal wellness and family planning consultations.'
      },
      {
        id: 'doc-14',
        name: 'Dr. Sanawar Pasha',
        specialty: 'Obstetrics & Gynaecologist',
        availableDays: 'Tue, Thu, Sat',
        timing: '07:00 PM - 10:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'Gynae-5',
        photoURL: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        bio: 'Specialist in high-risk pregnancy support and laparoscopic gynecological procedures.'
      }
    ]
  },
  {
    id: 'radiology-sonology',
    name: 'Radiology & Diagnostic Sonology',
    description: 'High-precision abdominal, pelvic, and obstetrical ultrasound scans, Doppler imaging, diagnostic radiology, and organ sonography.',
    timing: '10:00 AM - 11:00 PM',
    days: 'Mon - Sat',
    fee: 'Rs. 1,200',
    icon: 'flask',
    doctors: [
      {
        id: 'doc-18',
        name: 'Dr. Javeriya Qureshi',
        specialty: 'Sonologist & Radiologist',
        availableDays: 'Mon - Sat',
        timing: '10:00 AM - 02:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'Radio-1',
        photoURL: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?auto=format&fit=crop&w=400&q=80',
        bio: 'Expert Sonologist offering abdominal ultrasound, pelvic scans, anomaly scans, and Doppler studies.'
      },
      {
        id: 'doc-19',
        name: 'Dr. Shabana Saeed',
        specialty: 'Sonologist & Radiologist',
        availableDays: 'Mon, Wed, Fri',
        timing: '03:00 PM - 06:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'Radio-2',
        photoURL: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        bio: 'Diagnostic Radiology specialist with focus on fetal sonography and soft tissue imaging.'
      },
      {
        id: 'doc-20',
        name: 'Dr. Gulnaz Ismail',
        specialty: 'Sonologist & Radiologist',
        availableDays: 'Tue, Thu, Sat',
        timing: '05:00 PM - 08:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'Radio-3',
        photoURL: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?auto=format&fit=crop&w=400&q=80',
        bio: 'Sonologist providing fast-turnaround ultrasound reporting and Doppler diagnostics.'
      },
      {
        id: 'doc-21',
        name: 'Dr. S.M. Shahnawaz',
        specialty: 'Sonologist & Radiologist',
        availableDays: 'Mon - Sat',
        timing: '08:00 PM - 11:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'Radio-4',
        photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        bio: 'Radiologist specializing in emergency ultrasound scanning and radiological interpretation.'
      }
    ]
  },
  {
    id: 'diabetology',
    name: 'Diabetology & Endocrinology',
    description: 'Comprehensive diabetes management, HbA1c control, insulin adjustment, diabetic neuropathy care, and dietary counseling.',
    timing: '05:00 PM - 09:00 PM',
    days: 'Mon - Sat',
    fee: 'Rs. 1,200',
    icon: 'stethoscope',
    doctors: [
      {
        id: 'doc-28',
        name: 'Dr. Shakeel Ahmed',
        specialty: 'Diabetologist',
        availableDays: 'Mon, Wed, Fri',
        timing: '05:00 PM - 08:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'Diabetes-1',
        photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        bio: 'Diabetologist offering specialized blood sugar regulation, diabetic foot care, and lifestyle coaching.'
      },
      {
        id: 'doc-29',
        name: 'Dr. Qazi Mujahid Ali',
        specialty: 'Diabetologist',
        availableDays: 'Tue, Thu, Sat',
        timing: '06:00 PM - 09:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'Diabetes-2',
        photoURL: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
        bio: 'Consultant Diabetologist focused on Type 1 & Type 2 diabetes control and preventing organ complications.'
      }
    ]
  },
  {
    id: 'chest-pulmonology',
    name: 'General & Chest Medicine (Pulmonology)',
    description: 'Specialized respiratory care, asthma treatment, chronic bronchitis, chest infections, tuberculosis management, and lung health evaluations.',
    timing: '04:00 PM - 09:00 PM',
    days: 'Mon - Sat',
    fee: 'Rs. 1,500',
    icon: 'stethoscope',
    doctors: [
      {
        id: 'doc-26',
        name: 'Dr. Nadia Adnan',
        specialty: 'General & Chest Physician',
        availableDays: 'Mon, Wed, Fri',
        timing: '04:00 PM - 07:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'Chest-1',
        photoURL: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        bio: 'Chest Physician providing specialized management for asthma, severe cough, respiratory allergies, and lung care.'
      },
      {
        id: 'doc-27',
        name: 'Dr. Syed Ali Talha Raza',
        specialty: 'General & Chest Physician',
        availableDays: 'Tue, Thu, Sat',
        timing: '06:00 PM - 09:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'Chest-2',
        photoURL: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
        bio: 'Pulmonology consultant experienced in chronic bronchitis, pneumonia, and post-viral respiratory recovery.'
      }
    ]
  },
  {
    id: 'gastroenterology',
    name: 'Gastroenterology & Hepatology',
    description: 'Specialist consultations for stomach acidity, liver diseases, hepatitis B/C care, peptic ulcers, IBS, and digestive health.',
    timing: '06:00 PM - 09:00 PM',
    days: 'Mon, Wed, Fri',
    fee: 'Rs. 1,500',
    icon: 'flask',
    doctors: [
      {
        id: 'doc-31',
        name: 'Dr. Suresh Kumar',
        specialty: 'Gastroenterologist / Hepatologist',
        availableDays: 'Mon, Wed, Fri',
        timing: '06:00 PM - 09:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'Gastro-1',
        photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        bio: 'Consultant Gastroenterologist specializing in digestive disorders, liver health, stomach acidity, and gut health.'
      }
    ]
  },
  {
    id: 'family-medicine',
    name: 'Family Medicine & Primary Care',
    description: 'Holistic primary care for all family members, preventive wellness checkups, routine health monitoring, and long-term illness management.',
    timing: '09:00 AM - 02:00 PM',
    days: 'Mon - Sat',
    fee: 'Rs. 1,000',
    icon: 'stethoscope',
    doctors: [
      {
        id: 'doc-30',
        name: 'Dr. M. Naseem Akhter',
        specialty: 'Family Physician',
        availableDays: 'Mon - Sat',
        timing: '09:00 AM - 02:00 PM',
        fee: 'Rs. 1,000',
        roomNumber: 'Family-1',
        photoURL: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
        bio: 'Family medicine consultant dedicated to multi-generational family healthcare and wellness.'
      }
    ]
  },
  {
    id: 'dialysis',
    name: 'Dialysis & Nephrology Unit',
    description: 'Hemodialysis support, renal failure consultations, kidney function monitoring, and specialized nephrology support.',
    timing: '09:00 AM - 05:00 PM',
    days: 'Mon - Sat',
    fee: 'Rs. 1,200',
    icon: 'flask',
    doctors: [
      {
        id: 'doc-33',
        name: 'Dr. Moeen Qureshi',
        specialty: 'General & Dialysis Specialist',
        availableDays: 'Mon - Sat',
        timing: '09:00 AM - 05:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'Dialysis Unit',
        photoURL: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
        bio: 'Specialist overseeing hemodialysis procedures, fluid balance, and renal failure management.'
      }
    ]
  },
  {
    id: 'ent',
    name: 'ENT (Ear, Nose & Throat)',
    description: 'Comprehensive ENT consultations, sinus allergy treatment, tonsillitis care, hearing evaluations, and nasal disorder treatment.',
    timing: '05:00 PM - 08:00 PM',
    days: 'Tue, Thu, Sat',
    fee: 'Rs. 1,200',
    icon: 'stethoscope',
    doctors: [
      {
        id: 'doc-34',
        name: 'Dr. Asif Ali Abbasi',
        specialty: 'ENT Specialist',
        availableDays: 'Tue, Thu, Sat',
        timing: '05:00 PM - 08:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'ENT-1',
        photoURL: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
        bio: 'Consultant ENT surgeon providing medical and surgical solutions for ear, nose, throat, and sinus conditions.'
      }
    ]
  },
  {
    id: 'dental',
    name: 'Dental Surgery & Oral Care',
    description: 'Complete oral hygiene care, dental surgery, tooth extractions, root canal consultations, scaling, and preventive dental care.',
    timing: '05:00 PM - 09:00 PM',
    days: 'Mon - Sat',
    fee: 'Rs. 1,000',
    icon: 'stethoscope',
    doctors: [
      {
        id: 'doc-15',
        name: 'Dr. Khurram Zia',
        specialty: 'Consultant Dental Surgeon',
        availableDays: 'Mon - Sat',
        timing: '05:00 PM - 09:00 PM',
        fee: 'Rs. 1,000',
        roomNumber: 'Dental-1',
        photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        bio: 'Consultant Dental Surgeon offering painless dental procedures, restorative dentistry, and oral surgery.'
      }
    ]
  },
  {
    id: 'emergency-247',
    name: '24/7 Emergency & Casualty Care',
    description: 'Immediate trauma stabilization, acute casualty care, round-the-clock emergency medical oxygen, nebulization, ECG, and urgent triage.',
    timing: '24 Hours / 7 Days',
    days: 'All Days (24/7)',
    fee: 'Rs. 800',
    icon: 'shield-alert',
    doctors: [
      {
        id: 'doc-er',
        name: '24/7 ER Casualty Medical Officer',
        specialty: 'Emergency Medicine & Acute Care',
        availableDays: 'Daily 24 Hours',
        timing: '24/7 Immediate',
        fee: 'Rs. 800',
        roomNumber: 'ER Triage',
        photoURL: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80',
        bio: 'On-duty emergency medical team ready 24/7 for immediate casualty response, nebulization, and acute medical triage.'
      }
    ]
  }
];

export const DepartmentsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS_DATA);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('All');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);

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
    <div className="bg-[#F5F1E8] min-h-screen py-10 text-[#0B6B4E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

    

        {/* Filter & Search Bar */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-900/10 space-y-4">
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
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              No medical department or consultant matched "{searchTerm}". Try searching for another keyword or reset filters.
            </p>
            <button
              onClick={() => { handleSearchChange(''); setSelectedDeptFilter('All'); }}
              className="bg-[#0B6B4E] text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer hover:bg-[#08523c]"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {filteredDepartments.map((dept) => (
              <div
                key={dept.id}
                className="bg-white rounded-3xl shadow-sm border border-emerald-900/15 overflow-hidden transition-all hover:shadow-md"
              >
                {/* Department Header Bar */}
                <div className="bg-gradient-to-r from-[#0B6B4E] to-[#08523c] text-white p-5 sm:p-6 md:p-8 border-b border-emerald-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
                  <div className="flex items-start sm:items-center gap-4 min-w-0 w-full md:w-auto">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs text-white shrink-0">
                      {getDepartmentIcon(dept.icon)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                          {dept.name}
                        </h2>
                        <span className="bg-amber-300 text-[#0B6B4E] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                          {dept.doctors.length} Doctor{dept.doctors.length === 1 ? '' : 's'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed mt-1 max-w-3xl">
                        {dept.description}
                      </p>
                    </div>
                  </div>

                  {/* Summary Badges for Days, Timing, Fee (Fully contained inside dark header) */}
                  <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 shrink-0 pt-3 md:pt-0 border-t border-emerald-700/50 md:border-t-0 w-full md:w-auto mt-1 md:mt-0 pb-1 md:pb-0">
                    {dept.days && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-semibold text-emerald-50 max-w-full">
                        <Calendar className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                        <span className="truncate">Days: {dept.days}</span>
                      </span>
                    )}
                    {dept.timing && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-semibold text-emerald-50 max-w-full">
                        <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                        <span className="truncate">Timings: {dept.timing}</span>
                      </span>
                    )}
                    {dept.fee && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100/90 text-[#0B6B4E] border border-emerald-300 text-xs font-bold shadow-xs max-w-full">
                        <Banknote className="w-3.5 h-3.5 text-[#0B6B4E] shrink-0" />
                        <span className="truncate">Fee: {dept.fee}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Sub-cards: Doctors belonging to this department */}
                <div className="p-4 sm:p-6 md:p-8 bg-[#FAF8F3]">
                  <div className="text-xs font-extrabold text-[#0B6B4E] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#0B6B4E] shrink-0" />
                    <span>Consulating Doctors & Specialists in {dept.name}:</span>
                  </div>

                  {dept.doctors.length === 0 ? (
                    <div className="p-6 bg-white rounded-2xl border border-emerald-900/10 text-xs text-emerald-800">
                      No specific doctor matches current search in this department. Walk-in consultations are available at reception.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                      {dept.doctors.map((doc) => (
                        <div
                          key={doc.id}
                          className="bg-white rounded-2xl border border-emerald-900/10 shadow-xs hover:shadow-md transition-all p-4 sm:p-5 flex flex-col justify-between space-y-4 overflow-hidden w-full"
                        >
                          <div className="space-y-3 min-w-0 w-full">
                            {/* Doctor Photo & Header */}
                            <div className="flex items-start gap-3 min-w-0 w-full">
                              <img
                                src={doc.photoURL || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'}
                                alt={doc.name}
                                className="w-14 h-14 rounded-2xl object-cover object-top border border-emerald-900/10 bg-emerald-100 shrink-0 shadow-xs"
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-heading font-bold text-base text-[#0B6B4E] leading-snug truncate">
                                  {doc.name}
                                </h3>
                                <div className="text-[11px] font-bold text-[#D64545] bg-red-50 px-2 py-0.5 rounded-md inline-block mt-0.5 max-w-full truncate">
                                  {doc.specialty}
                                </div>
                                {doc.roomNumber && (
                                  <div className="text-[10px] text-emerald-800 font-semibold mt-1 flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span className="truncate">Room: {doc.roomNumber}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Bio (Unclipped full text with clean background) */}
                            {doc.bio && (
                              <div className="bg-[#F5F1E8] p-3 rounded-xl border border-emerald-900/10 text-xs text-emerald-900/90 leading-relaxed break-words">
                                {doc.bio}
                              </div>
                            )}

                            {/* Icons + Details Rows (Strict left alignment inside padding) */}
                            <div className="space-y-2 pt-2.5 border-t border-emerald-900/10 text-xs w-full min-w-0">
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
                                <span className="font-extrabold text-[#0B6B4E] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md shrink-0">
                                  {doc.fee || dept.fee || 'Rs. 1,000'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* CTA Button */}
                          <button
                            onClick={() => handleOpenBooking(doc.id, dept.id)}
                            className="w-full bg-[#0B6B4E] hover:bg-[#08523c] text-white py-2.5 px-3 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer group shrink-0"
                          >
                            <Calendar className="w-4 h-4 shrink-0" />
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
