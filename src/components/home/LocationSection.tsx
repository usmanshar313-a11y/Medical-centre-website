import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Accessibility, ExternalLink, Navigation } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const LocationSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="location" className="py-20 bg-[#F5F1E8] text-[#0B6B4E] gsap-reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <span className="bg-emerald-900/10 text-[#0B6B4E] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
            Hospital Location & Directions
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0B6B4E]">
            Visit Rafah-E-Aam Medical Centre
          </h2>
          <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
            Conveniently located in Block 13, Gulberg Town, Karachi. Accessible round-the-clock for routine checkups, OPD clinics, and emergency care.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Info Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-emerald-900/10 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <h3 className="font-heading font-extrabold text-xl text-[#0B6B4E]">
                Contact & Address
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-start gap-3 p-3.5 bg-[#F5F1E8] rounded-2xl border border-emerald-900/5">
                  <MapPin className="w-5 h-5 text-[#D64545] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#0B6B4E]">Full Address</div>
                    <div className="text-emerald-900/80 leading-snug mt-0.5">
                      St-10, Block 13, Gulberg Town, Karachi, 78500, Pakistan
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#F5F1E8] rounded-2xl border border-emerald-900/5">
                  <Phone className="w-5 h-5 text-[#0B6B4E] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#0B6B4E]">24/7 Phone Helpline</div>
                    <a
                      href="tel:+922136342011"
                      className="text-[#D64545] font-extrabold hover:underline text-sm inline-block mt-0.5"
                    >
                      +92 21 36342011
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#F5F1E8] rounded-2xl border border-emerald-900/5">
                  <Clock className="w-5 h-5 text-[#0B6B4E] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#0B6B4E]">Operating Hours</div>
                    <div className="text-emerald-900/80 leading-snug mt-0.5">
                      Open 24 Hours, 7 Days a Week (OPD + Emergency)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#F5F1E8] rounded-2xl border border-emerald-900/5">
                  <Accessibility className="w-5 h-5 text-[#0B6B4E] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#0B6B4E]">Accessibility</div>
                    <div className="text-emerald-900/80 leading-snug mt-0.5">
                      Wheelchair accessible entrance, corridors, and rest rooms
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Rafah-E-Aam+Medical+Center+St-10+Block+13+Gulberg+Town+Karachi"
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#0B6B4E] hover:bg-[#08523c] text-white py-3.5 rounded-2xl text-xs sm:text-sm font-bold shadow flex items-center justify-center gap-2 transition-all hover:gap-3 cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
            </a>
          </motion.div>

          {/* Map Embed */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-emerald-900/10 overflow-hidden min-h-[380px]"
          >
            <iframe
              title="Rafah-E-Aam Medical Center Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3617.9048385002047!2d67.0805175!3d24.9353723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f37dbbe63eb%3A0xb35a39626e2e5055!2sBlock%2013%20Gulberg%20Town%2C%20Karachi!5e0!3m2!1sen!2spk!4v1700000000000!5m2!1sen!2spk"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

        </div>

      </div>
    </section>
  );
};
