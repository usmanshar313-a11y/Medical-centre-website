import React, { useState } from 'react';
import { Hero } from '../components/home/Hero';
import { AboutSection } from '../components/home/AboutSection';
import { DepartmentsSection } from '../components/home/DepartmentsSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { LocationSection } from '../components/home/LocationSection';
import { BookingModal } from '../components/booking/BookingModal';

export const HomePage: React.FC = () => {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);

  const handleOpenGeneralBooking = () => {
    setSelectedDoctorId(undefined);
    setSelectedServiceId(undefined);
    setBookingModalOpen(true);
  };

  return (
    <div className="space-y-0">
      <Hero onOpenBooking={handleOpenGeneralBooking} />
      <AboutSection />
      <DepartmentsSection onOpenBooking={handleOpenGeneralBooking} />
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
