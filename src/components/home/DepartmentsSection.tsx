import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  ShieldAlert, 
  FlaskConical, 
  Heart, 
  Baby, 
  ArrowRight,
  CheckCircle2,
  Calendar,
  Clock,
  Banknote,
  Activity,
  Building2
} from 'lucide-react';

interface DepartmentsSectionProps {
  onOpenBooking?: () => void;
}

export const DepartmentsSection: React.FC<DepartmentsSectionProps> = ({ onOpenBooking }) => {
  const FEATURED_DEPARTMENTS = [
    {
      name: 'General OPD & Internal Medicine',
      doctors: 'Dr. Ajmaal Jami, Dr. Saqib Zain, Dr. Bushra Rabbani',
      timing: '09:00 AM – 09:00 PM',
      days: 'Mon – Sat',
      fee: 'Rs. 1,000',
      icon: Stethoscope,
      bg: 'bg-emerald-50 text-[#0B6B4E]'
    },
    {
      name: 'Cardiology & Heart Care',
      doctors: 'Dr. Wajid Ali, Dr. Syed Saadat Ali, Dr. Usman Alam',
      timing: '02:00 PM – 09:00 PM',
      days: 'Mon – Sat',
      fee: 'Rs. 1,500',
      icon: Heart,
      bg: 'bg-red-50 text-[#D64545]'
    },
    {
      name: 'Orthopedics & Joint Surgery',
      doctors: 'Dr. Akhtar Baig',
      timing: '06:00 PM – 09:00 PM',
      days: 'Mon – Sat',
      fee: 'Rs. 1,500',
      icon: Activity,
      bg: 'bg-emerald-50 text-[#0B6B4E]'
    },
    {
      name: 'Laparoscopic & General Surgery',
      doctors: 'Dr. S. Kashif Mateen, Dr. Erum Kazim, Dr. Mubashir Iqbal',
      timing: '04:00 PM – 09:00 PM',
      days: 'Daily',
      fee: 'Rs. 1,500',
      icon: Stethoscope,
      bg: 'bg-emerald-50 text-[#0B6B4E]'
    },
    {
      name: 'Pediatrics & Child Care',
      doctors: 'Dr. Hira, Dr. S.M. Hussain Hadi, Dr. Saud Abdul Qayyum',
      timing: '10:00 AM – 11:00 PM',
      days: 'Mon – Sat',
      fee: 'Rs. 1,000',
      icon: Baby,
      bg: 'bg-emerald-50 text-[#0B6B4E]'
    },
    {
      name: 'Obstetrics & Gynaecology',
      doctors: 'Dr. Ghazala Naseem, Dr. Fauzia Ali, Dr. Misbah Noreen',
      timing: '11:00 AM – 10:00 PM',
      days: 'Mon – Sat',
      fee: 'Rs. 1,200',
      icon: Heart,
      bg: 'bg-emerald-50 text-[#0B6B4E]'
    },
    {
      name: 'Radiology & Ultrasound',
      doctors: 'Dr. Javeriya Qureshi, Dr. Shabana Saeed',
      timing: '10:00 AM – 11:00 PM',
      days: 'Mon – Sat',
      fee: 'Rs. 1,200',
      icon: FlaskConical,
      bg: 'bg-emerald-50 text-[#0B6B4E]'
    },
    {
      name: '24/7 Emergency & Casualty',
      doctors: 'On-Duty Casualty & ER Team',
      timing: '24 Hours / 7 Days',
      days: 'All Days (24/7)',
      fee: 'Rs. 800',
      icon: ShieldAlert,
      bg: 'bg-red-100 text-[#D64545]'
    }
  ];

  return (
    <section id="departments" className="py-16 bg-[#e8e2d5] text-[#0B6B4E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="bg-emerald-900/10 text-[#0B6B4E] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#0B6B4E]" />
            Hospital Departments & Specialist Panel
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B6B4E]">
            Our Clinical Departments & Specialist Doctors
          </h2>
          <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
            Rafah-E-Aam Medical Centre features 15+ specialized medical departments and over 34+ senior consultant doctors. Check department timings, days, and fees below.
          </p>
        </div>

        {/* Combined Single Departments Preview Grid */}
        <div className="bg-[#F5F1E8] rounded-3xl p-6 sm:p-8 border border-emerald-900/15 shadow-md space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_DEPARTMENTS.map((dept, idx) => {
              const Icon = dept.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-emerald-900/10 shadow-xs flex flex-col justify-between hover:shadow-md transition-all space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl ${dept.bg}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-extrabold text-[#D64545] bg-red-50 px-2 py-0.5 rounded-md">
                        {dept.fee}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-sm text-[#0B6B4E] leading-snug">
                      {dept.name}
                    </h3>

                    <p className="text-[11px] text-emerald-800 line-clamp-2 leading-tight">
                      <span className="font-semibold text-emerald-950">Doctors: </span>
                      {dept.doctors}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-emerald-900/10 space-y-1 text-[11px]">
                    <div className="flex items-center justify-between text-emerald-900">
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-emerald-600" /> Days:
                      </span>
                      <span className="font-bold text-[#0B6B4E]">{dept.days}</span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-900">
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-600" /> Timings:
                      </span>
                      <span className="font-bold text-[#0B6B4E]">{dept.timing}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Single CTA Button as per Part 3 Requirement */}
          <div className="pt-6 border-t border-emerald-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-emerald-900 font-medium text-center sm:text-left">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span>All 15+ departments & 34+ doctors with complete days, timings, and fees listed.</span>
            </div>

            <Link
              to="/departments"
              className="w-full sm:w-auto bg-[#0B6B4E] hover:bg-[#08523c] text-white px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer hover:gap-3"
            >
              <span>View All Departments</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};
