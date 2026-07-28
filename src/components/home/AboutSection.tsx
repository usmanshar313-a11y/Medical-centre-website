import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Clock, CheckCircle2, ArrowRight, Accessibility } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-12 bg-[#F5F1E8] text-[#0B6B4E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Homepage Summary Card for About Us */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-900/10 max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-900/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#F5F1E8] rounded-2xl text-[#0B6B4E]">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  About Hospital
                </span>
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0B6B4E]">
                  Rafah-E-Aam Medical Centre
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 bg-[#F5F1E8] px-3 py-1.5 rounded-xl border border-emerald-900/10">
              <Clock className="w-4 h-4 text-[#D64545]" />
              <span>Open 24/7 in Gulberg Town</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed max-w-3xl">
            Located at St-10, Block 13, Gulberg Town, Karachi, Rafah-E-Aam Medical Centre is a trusted community institution delivering 24/7 emergency triage, orthopedic surgery, maternal care, and specialist consultations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-emerald-900">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 34+ Specialist Panel
              </span>
              <span className="flex items-center gap-1.5">
                <Accessibility className="w-4 h-4 text-emerald-600" /> Wheelchair Accessible
              </span>
            </div>

            <a
              href="about.html"
              className="w-full sm:w-auto bg-[#0B6B4E] hover:bg-[#08523c] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow transition-all flex items-center justify-center gap-2 cursor-pointer hover:gap-3"
            >
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
