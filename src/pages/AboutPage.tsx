import React, { useEffect } from 'react';
import { 
  Building2, 
  Clock, 
  Accessibility, 
  ShieldCheck, 
  Heart, 
  MapPin, 
  CheckCircle2, 
  Phone, 
  Award, 
  Users, 
  Stethoscope, 
  FlaskConical, 
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-[#F5F1E8] min-h-screen py-10 text-[#0B6B4E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Banner Header */}
        <div className="bg-[#0B6B4E] text-white p-8 sm:p-10 rounded-3xl shadow-lg border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <span className="bg-emerald-800 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              About Rafah-E-Aam Medical Centre
            </span>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
              Dedicated to Serving Gulberg Town & Karachi
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Providing round-the-clock emergency care, general OPD consultations, orthopedic surgery, maternal healthcare, and diagnostic services with compassionate human touch.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href="tel:+922136342011"
              className="w-full sm:w-auto bg-[#D64545] hover:bg-[#c23737] text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4" /> 24/7 Helpline (+92 21 36342011)
            </a>
          </div>
        </div>

        {/* Main Hospital Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-900/10 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/10 text-xs font-bold uppercase tracking-wider text-[#0B6B4E]">
                <Building2 className="w-4 h-4" /> Community Healthcare Legacy
              </div>

              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#0B6B4E]">
                Our Mission & Healthcare Commitment
              </h2>

              <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
                Rafah-E-Aam Medical Centre was established with a clear mission: to make affordable, high-quality, and ethical healthcare accessible to every family in Gulberg Town and greater Karachi. Located conveniently at St-10, Block 13, Gulberg Town, our facility operates 24 hours a day, 7 days a week, offering continuous medical supervision.
              </p>

              <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
                From emergency casualty care and minor trauma stabilization to advanced laparoscopic surgeries, pediatric care, and maternity services, our team of over 34+ senior consultants and qualified staff ensure patient dignity, speed, and accuracy at every step.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3 bg-[#F5F1E8] rounded-2xl border border-emerald-900/10 text-center">
                  <div className="font-extrabold text-xl text-[#0B6B4E]">24/7</div>
                  <div className="text-[10px] text-emerald-800 font-bold uppercase">Emergency & Lab</div>
                </div>
                <div className="p-3 bg-[#F5F1E8] rounded-2xl border border-emerald-900/10 text-center">
                  <div className="font-extrabold text-xl text-[#0B6B4E]">34+</div>
                  <div className="text-[10px] text-emerald-800 font-bold uppercase">Medical Specialists</div>
                </div>
                <div className="p-3 bg-[#F5F1E8] rounded-2xl border border-emerald-900/10 text-center col-span-2 sm:col-span-1">
                  <div className="font-extrabold text-xl text-[#D64545]">225+</div>
                  <div className="text-[10px] text-emerald-800 font-bold uppercase">Patient Reviews</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            {/* Feature Highlights Card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-900/10 space-y-6">
              <h3 className="font-heading font-bold text-lg text-[#0B6B4E] border-b pb-3">
                Key Hospital Facilities
              </h3>

              <ul className="space-y-3.5 text-xs sm:text-sm font-medium text-emerald-900">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D64545] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#0B6B4E]">24/7 Emergency & Triage Ward</span>
                    <span className="text-emerald-800/80 text-[11px]">Equipped for immediate trauma control and acute care.</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D64545] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#0B6B4E]">Orthopedic & General Surgery</span>
                    <span className="text-emerald-800/80 text-[11px]">Specialized fracture care, joint consultations & laparoscopic procedures.</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D64545] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#0B6B4E]">Diagnostic Laboratory & Ultrasound</span>
                    <span className="text-emerald-800/80 text-[11px]">In-house sonography, pelvic & abdominal imaging, and pathology testing.</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D64545] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#0B6B4E]">Wheelchair & Patient Accessibility</span>
                    <span className="text-emerald-800/80 text-[11px]">Wheelchair ramps, accessible entrances, and friendly support staff.</span>
                  </div>
                </li>
              </ul>

              <div className="pt-2">
                <div className="p-4 bg-[#F5F1E8] rounded-2xl border border-emerald-900/10 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#D64545] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold block text-[#0B6B4E]">Hospital Location:</span>
                    <span className="text-emerald-900">St-10, Block 13, Gulberg Town, Karachi, 78500, Pakistan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Quick Actions Navigation Banner */}
        <div className="bg-[#0B6B4E] rounded-3xl p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-heading font-bold text-xl text-white">Need Specialist Medical Advice?</h3>
            <p className="text-xs text-emerald-100">Explore our doctors or schedule a visit with our medical reception team.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/doctors"
              className="bg-white hover:bg-emerald-50 text-[#0B6B4E] font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
            >
              View Specialist Panel
            </Link>
            <Link
              to="/services"
              className="bg-[#D64545] hover:bg-[#c23737] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
