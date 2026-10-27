import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X, ArrowRight } from 'lucide-react';

export interface TopBannerProps {
  bannerText?: string | null;
  onOpenCart?: () => void;
  onClose?: () => void;
}

export const TopBanner: React.FC<TopBannerProps> = ({
  bannerText,
  onOpenCart,
  onClose,
}) => {
  if (!bannerText || !bannerText.trim()) {
    return null;
  }

  const cleanText = bannerText.trim();

  return (
    <aside
      role="banner"
      aria-label="Promoción destacada"
      className="w-full bg-gradient-to-r from-[#D9532F] via-[#DF6744] to-[#C94723] text-white relative z-50 select-none shadow-xs"
    >
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="max-w-[1320px] mx-auto px-4 lg:px-6 py-2 flex items-center justify-between gap-3 text-xs sm:text-[13px]"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 justify-center sm:justify-start">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 shrink-0">
            <Sparkles className="w-3 h-3 text-white animate-pulse" />
          </span>
          <span className="font-semibold uppercase tracking-wider text-[11px] bg-white/25 px-2 py-0.5 rounded-full shrink-0 hidden sm:inline">
            Promo
          </span>
          <span className="font-semibold text-white truncate drop-shadow-xs">
            {cleanText}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenCart && (
            <button
              type="button"
              onClick={onOpenCart}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-[#D9532F] hover:bg-[#FAF1ED] text-[11px] sm:text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <span>Ver promo</span>
              <ArrowRight className="w-3 h-3 stroke-[2.2]" />
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors shrink-0 cursor-pointer"
              aria-label="Cerrar aviso promocional"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </motion.div>
    </aside>
  );
};

export default TopBanner;

