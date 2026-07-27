import React from 'react';

export const FloatingWhatsApp: React.FC = () => {
  const whatsappUrl = `https://wa.me/922136342011?text=${encodeURIComponent(
    "Hi, I'd like to book an appointment at Rafah-E-Aam Medical Center (رفاہ عام میڈیکل سینٹر)"
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
      aria-label="Chat on WhatsApp"
    >
      <span className="relative flex h-3 w-3 -mr-1">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>

      <svg
        className="w-6 h-6 fill-current text-white shrink-0"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.029 6.987 2.894a9.825 9.825 0 012.888 6.982c-.001 5.451-4.437 9.885-9.885 9.885m0-18C5.23 3.785.39 8.623.39 14.611c0 2.112.551 4.108 1.583 5.864L0 24l3.635-1.921c1.698.927 3.623 1.416 5.586 1.416h.005c5.987 0 10.828-4.838 10.828-10.828 0-2.893-1.127-5.612-3.172-7.658a10.76 10.76 0 00-7.653-3.173" />
      </svg>

      <span className="hidden sm:inline font-bold text-xs tracking-wide">
        WhatsApp Us
      </span>
    </a>
  );
};
