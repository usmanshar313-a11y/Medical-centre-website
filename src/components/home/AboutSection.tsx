import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Clock, CheckCircle2, ArrowRight, Accessibility } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-20 bg-[#F5F1E8] text-[#0B6B4E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Homepage Summary Card for About Us */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-emerald-900/10 max-w-4xl mx-auto space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-900/10 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-[#F5F1E8] rounded-2xl text-[#0B6B4E]">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                  About Our Centre
                </span>
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0B6B4E]">
                  Rafah-E-Aam Medical Centre
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 bg-[#F5F1E8] px-3.5 py-2 rounded-xl border border-emerald-900/10 shrink-0">
              <Clock className="w-4 h-4 text-[#D64545]" />
              <span>Open 24/7 in Gulberg Town</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed max-w-3xl">
            Located at St-10, Block 13, Gulberg Town, Karachi, Rafah-E-Aam Medical Centre is a trusted community institution delivering 24/7 emergency triage, orthopedic surgery, maternal care, and specialist OPD consultations across 15+ departments.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3">
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-emerald-900">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 34+ Specialist Doctors Panel
              </span>
              <span className="flex items-center gap-1.5">
                <Accessibility className="w-4 h-4 text-emerald-600" /> Full Wheelchair Accessibility
              </span>
            </div>

            <Link
              to="/about"
              className="w-full sm:w-auto bg-[#0B6B4E] hover:bg-[#08523c] text-white px-6 py-3 rounded-xl text-xs font-bold shadow transition-all flex items-center justify-center gap-2 cursor-pointer hover:gap-3 shrink-0"
            >
              <span>Learn More About Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </motion.div>

      </div>
    </section>
  );
};
