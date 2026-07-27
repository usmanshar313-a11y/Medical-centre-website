import React, { useState } from 'react';
import { Hero } from '../components/home/Hero';
import { AboutSection } from '../components/home/AboutSection';
import { ServicesSection } from '../components/home/ServicesSection';
import { DoctorsSection } from '../components/home/DoctorsSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { LocationSection } from '../components/home/LocationSection';
import { BookingModal } from '../components/booking/BookingModal';

export const HomePage: React.FC = () => {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);

  const handleOpenBookingWithDoctor = (docId: string) => {
    setSelectedDoctorId(docId);
    setSelectedServiceId(undefined);
    setBookingModalOpen(true);
  };

  const handleOpenBookingWithService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setSelectedDoctorId(undefined);
    setBookingModalOpen(true);
  };

  const handleOpenGeneralBooking = () => {
    setSelectedDoctorId(undefined);
    setSelectedServiceId(undefined);
    setBookingModalOpen(true);
  };

  return (
    <div className="space-y-0">
      <Hero onOpenBooking={handleOpenGeneralBooking} />
      <AboutSection />
      <ServicesSection onSelectService={handleOpenBookingWithService} />
      <DoctorsSection onSelectDoctor={handleOpenBookingWithDoctor} />
      <TestimonialsSection />
      <LocationSection />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedDoctorId={selectedDoctorId}
        preselectedServiceId={selectedServiceId}
      />
    </div>
  );
};
