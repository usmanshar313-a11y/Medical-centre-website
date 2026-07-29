import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Phone, 
  Star, 
  Accessibility 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative bg-[#F5F1E8] text-[#0B6B4E] pt-12 pb-20 lg:py-24 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        
        {/* Main Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          <span className="inline-block text-[#0B6B4E] font-bold text-xs sm:text-sm tracking-wider uppercase bg-[#0B6B4E]/10 px-4 py-1.5 rounded-full shadow-2xs">
            Rafah-E-Aam Medical Centre — General & Orthopedic
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B6B4E] leading-[1.15] tracking-tight">
            Compassionate Care, <br className="hidden sm:inline" />
            <span className="text-[#D64545]"> Available 24/7.</span>
          </h1>
        </motion.div>

        {/* Subheading / Tagline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="text-[#0B6B4E]/90 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed"
        >
          Trusted by 200+ patients in Gulberg Town. Providing state-of-the-art OPD diagnostics, surgery, and maternal care with a human touch.
        </motion.p>

        {/* Centered Buttons Group */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto bg-[#D64545] hover:bg-[#c23737] text-white px-8 py-3.5 rounded-full text-base font-bold shadow-lg shadow-[#D64545]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-5 h-5" />
            <span>{t.bookAppointment}</span>
          </button>

          <a
            href="tel:+922136342011"
            className="w-full sm:w-auto bg-white hover:bg-emerald-50 text-[#0B6B4E] border border-[#0B6B4E]/20 px-7 py-3.5 rounded-full text-base font-bold shadow-xs hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5 text-[#D64545]" />
            <span>{t.callNow}</span>
          </a>
        </motion.div>

        {/* Rating & Trust Metrics Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="pt-8 border-t border-[#0B6B4E]/15 flex flex-wrap items-center justify-center gap-6 sm:gap-10"
        >
          <div className="flex flex-col items-center">
            <span className="text-[#0B6B4E] font-extrabold text-2xl flex items-center gap-1">
              3.8 <Star className="w-5 h-5 fill-amber-400 text-amber-400 inline" />
            </span>
            <span className="text-[#0B6B4E]/70 text-[11px] font-semibold uppercase tracking-wider">Google Rating</span>
          </div>

          <div className="h-10 w-[1px] bg-[#0B6B4E]/20 hidden sm:block"></div>

          <div className="flex flex-col items-center">
            <span className="text-[#0B6B4E] font-extrabold text-2xl">225+</span>
            <span className="text-[#0B6B4E]/70 text-[11px] font-semibold uppercase tracking-wider">Patient Reviews</span>
          </div>

          <div className="h-10 w-[1px] bg-[#0B6B4E]/20 hidden sm:block"></div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#0B6B4E]/10 shadow-xs">
            <Accessibility className="w-5 h-5 text-[#0B6B4E]" />
            <span className="text-[#0B6B4E] text-xs font-bold">Wheelchair Accessible</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
