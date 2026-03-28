'use client';

import { MessageCircle } from 'lucide-react';

export function WhatsAppFloatingButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg ring-4 ring-soft-pink/30 hover:scale-110 transition-transform"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} />
    </a>
  );
}
