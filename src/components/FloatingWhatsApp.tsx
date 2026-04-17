"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ADMIN_PHONE = "966505855924";

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-show tooltip after 5 seconds on first visit
  useEffect(() => {
    const dismissed = sessionStorage.getItem("wa_tooltip_dismissed");
    if (dismissed) return;
    const timer = setTimeout(() => {
      setShowTooltip(true);
      // Auto-hide after 8 seconds
      setTimeout(() => setShowTooltip(false), 8000);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    setHasInteracted(true);
    setShowTooltip(false);
    window.open(
      `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent("السلام عليكم، أتواصل معكم من منصة مرتقى أكاديمي.")}`,
      "_blank"
    );
  };

  const dismissTooltip = () => {
    setShowTooltip(false);
    sessionStorage.setItem("wa_tooltip_dismissed", "1");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 cursor-pointer">
      {/* Tooltip — absolutely positioned above the button */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-[72px] right-0 bg-white text-black rounded-2xl shadow-2xl shadow-black/20 p-4 pl-10 w-[240px] font-tajawal"
            dir="rtl"
          >
            {/* Close */}
            <button type="button" onClick={dismissTooltip}
              className="absolute top-2.5 left-2.5 text-black/20 hover:text-black/50 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
            {/* Arrow pointing to button */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white rotate-45 shadow-sm" />
            <p className="text-sm font-black mb-0.5">تحتاج مساعدة؟ 👋</p>
            <p className="text-[11px] text-black/50 leading-relaxed">تواصل معنا مباشرة عبر الواتساب وسنرد عليك فوراً!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => !hasInteracted && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="relative w-[60px] h-[60px] bg-[#25D366] text-white rounded-full shadow-[0_4px_24px_rgba(37,211,102,0.4)] flex items-center justify-center transition-all group"
        aria-label="تواصل عبر الواتساب"
      >
        {/* Ping animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />

        {/* Icon */}
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current relative z-10 group-hover:scale-110 transition-transform">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </motion.button>
    </div>
  );
}
