import React from 'react';
import { 
  Building2, 
  Clock, 
  Accessibility, 
  ShieldCheck, 
  Heart, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-16 bg-[#F5F1E8] text-[#0B6B4E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left info box */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/10 text-xs font-bold uppercase tracking-wider text-[#0B6B4E]">
              <Building2 className="w-4 h-4" /> About Hospital
            </div>

            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B6B4E]">
              Rafah-E-Aam Medical Centre <br />
              <span className="text-[#D64545] text-xl font-normal font-urdu">(رفاہ عام میڈیکل سینٹر)</span>
            </h2>

            <p className="text-sm sm:text-base text-emerald-950/80 leading-relaxed">
              Located at St-10, Block 13, Gulberg Town, Karachi, Rafah-E-Aam Medical Centre is a trusted community healthcare institution committed to providing round-the-clock medical services, emergency triage, diagnostic laboratory testing, maternity care, and specialist consultations.
            </p>

            {/* Badges Bar */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="bg-white p-3 rounded-xl border border-emerald-900/10 flex items-center gap-3 shadow-xs">
                <div className="p-2 rounded-lg bg-emerald-100 text-[#0B6B4E]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs">Open 24 Hours</div>
                  <div className="text-[11px] text-emerald-800/70">Continuous 24/7 care</div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-emerald-900/10 flex items-center gap-3 shadow-xs">
                <div className="p-2 rounded-lg bg-emerald-100 text-[#0B6B4E]">
                  <Accessibility className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs">{t.accessibility}</div>
                  <div className="text-[11px] text-emerald-800/70">Ramps & wheelchair access</div>
                </div>
              </div>
            </div>

            {/* Feature Checkpoints */}
            <ul className="space-y-2.5 pt-2 text-xs sm:text-sm font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D64545]" />
                <span>Fully equipped emergency Ward with trained duty doctors</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D64545]" />
                <span>In-house Diagnostic Laboratory & Ultrasound Imaging</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D64545]" />
                <span>24/7 Pharmacy with authentic medicines</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D64545]" />
                <span>Maternity, Gynecological & Pediatric Care</span>
              </li>
            </ul>

          </div>

          {/* Right visual card */}
          <div className="lg:col-span-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-emerald-900/10 space-y-6">
              <div className="flex items-center justify-between border-b border-emerald-900/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0B6B4E] text-white rounded-xl flex items-center justify-center font-bold">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-[#0B6B4E]">
                      Compassionate Healthcare
                    </h3>
                    <p className="text-xs text-emerald-800/70">Serving Gulberg Town & Karachi</p>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-emerald-900/80 leading-relaxed">
                Our team prioritizes patient dignity, rapid response, and thorough medical care. Whether you require a routine health checkup or immediate emergency attention, our facility is always ready to welcome you.
              </p>

              <div className="p-4 bg-[#F5F1E8] rounded-xl border border-emerald-900/10 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D64545] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold block text-[#0B6B4E]">Address:</span>
                  <span>St-10, Block 13, Gulberg Town, Karachi, 78500, Pakistan</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
