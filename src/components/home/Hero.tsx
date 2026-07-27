import React from 'react';
import { 
  Calendar, 
  Phone, 
  Star, 
  Clock, 
  Accessibility, 
  ShieldCheck, 
  Building2, 
  Award,
  Users,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative bg-[#F5F1E8] text-[#0B6B4E] pt-8 pb-16 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Live Emergency Pill Tag */}
            <div className="inline-flex items-center gap-2 bg-[#0B6B4E]/10 px-3.5 py-1.5 rounded-full w-fit">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#D64545] animate-pulse"></span>
              <span className="text-[#0B6B4E] text-xs font-extrabold uppercase tracking-wider">
                Emergency 24/7 — Call: +92 21 36342011
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <span className="text-[#0B6B4E] font-bold text-sm tracking-wider uppercase bg-[#0B6B4E]/10 px-3 py-1 rounded-full">
                Rafah-E-Aam Medical Centre — General & Orthopedic
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-bold text-[#0B6B4E] leading-[1.02] tracking-tighter pt-2">
                Compassionate Care, <br />
                <span className="text-[#D64545]">Available 24/7.</span>
              </h1>
            </div>

            {/* Subheading / Tagline */}
            <p className="text-[#0B6B4E]/90 text-base sm:text-lg max-w-xl leading-relaxed">
              Trusted by 200+ patients in Gulberg Town. Providing state-of-the-art diagnostics, surgery, and maternal care with a human touch.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="bg-[#D64545] hover:bg-[#c23737] text-white px-7 py-3.5 rounded-full text-base font-bold shadow-lg shadow-[#D64545]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-5 h-5" />
                <span>{t.bookAppointment}</span>
              </button>

              <a
                href="tel:+922136342011"
                className="bg-white hover:bg-emerald-50 text-[#0B6B4E] border border-[#0B6B4E]/20 px-6 py-3.5 rounded-full text-base font-bold shadow-xs hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5 text-[#D64545]" />
                <span>{t.callNow}</span>
              </a>
            </div>

            {/* Rating & Trust Metrics Row */}
            <div className="pt-6 border-t border-[#0B6B4E]/15 flex flex-wrap items-center gap-6 sm:gap-8">
              <div className="flex flex-col">
                <span className="text-[#0B6B4E] font-extrabold text-2xl flex items-center gap-1">
                  3.8 <Star className="w-5 h-5 fill-amber-400 text-amber-400 inline" />
                </span>
                <span className="text-[#0B6B4E]/70 text-xs font-semibold uppercase tracking-wider">Google Rating</span>
              </div>

              <div className="h-10 w-[1px] bg-[#0B6B4E]/20 hidden sm:block"></div>

              <div className="flex flex-col">
                <span className="text-[#0B6B4E] font-extrabold text-2xl">225+</span>
                <span className="text-[#0B6B4E]/70 text-xs font-semibold uppercase tracking-wider">Patient Reviews</span>
              </div>

              <div className="h-10 w-[1px] bg-[#0B6B4E]/20 hidden sm:block"></div>

              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-[#0B6B4E]/10 shadow-sm">
                <Accessibility className="w-5 h-5 text-[#0B6B4E]" />
                <span className="text-[#0B6B4E] text-xs font-bold">Wheelchair Accessible</span>
              </div>
            </div>

          </div>

          {/* Hero Right Quick Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Card 1: Patient Dashboard Preview */}
            <div className="bg-white rounded-[24px] p-6 shadow-xl border border-[#0B6B4E]/10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0B6B4E] text-white flex items-center justify-center font-bold text-xs">
                    R
                  </div>
                  <h3 className="text-[#0B6B4E] font-bold text-base">Patient Dashboard</h3>
                </div>
                <span className="px-2.5 py-1 bg-[#0B6B4E]/10 text-[#0B6B4E] text-[10px] font-bold uppercase tracking-wider rounded-md">
                  Live Updates
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#F5F1E8] rounded-xl border border-[#0B6B4E]/10">
                  <p className="text-[#0B6B4E]/60 text-[10px] font-bold uppercase tracking-wider mb-1">
                    Hospital Hours & OPD
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[#0B6B4E] font-bold text-sm">Open 24 Hours, 7 Days</h4>
                      <p className="text-[#0B6B4E]/70 text-xs">Emergency, Diagnostics & Pharmacy</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#0B6B4E]/20 flex items-center justify-center text-[#0B6B4E] font-bold">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white border border-[#0B6B4E]/10 rounded-xl text-center">
                    <p className="text-[#0B6B4E] font-bold text-lg">24/7</p>
                    <p className="text-[#0B6B4E]/60 text-[9px] uppercase font-bold tracking-wider">Emergency</p>
                  </div>
                  <div className="p-3 bg-white border border-[#0B6B4E]/10 rounded-xl text-center">
                    <p className="text-[#D64545] font-bold text-lg">ONLINE</p>
                    <p className="text-[#0B6B4E]/60 text-[9px] uppercase font-bold tracking-wider">Patient Reports</p>
                  </div>
                </div>

                <button
                  onClick={onOpenBooking}
                  className="w-full py-3 bg-[#D64545] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#D64545]/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Quick Book New Appointment</span>
                </button>
              </div>
            </div>

            {/* Card 2: Hospital Location & Services Info */}
            <div className="bg-[#0B6B4E] rounded-[24px] p-6 text-white shadow-xl relative overflow-hidden">
              <p className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider mb-1">
                St-10, Block 13, Gulberg Town, Karachi
              </p>
              <h4 className="text-lg font-bold mb-3 text-white">Continuous Medical Facility</h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium text-emerald-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#D64545] rounded-full"></span> Maternity Care
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#D64545] rounded-full"></span> Lab / Diagnostic
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#D64545] rounded-full"></span> 24/7 Pharmacy
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#D64545] rounded-full"></span> Emergency Ward
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

