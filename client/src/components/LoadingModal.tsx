import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LoadingModalProps {
  open: boolean;
  onClose?: () => void;
}

export default function LoadingModal({ open, onClose }: LoadingModalProps) {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(40);

  useEffect(() => {
    if (!open) {
      setProgress(40);
      return;
    }
    let pct = 40;
    const interval = setInterval(() => {
      pct += Math.random() * 15 + 5;
      if (pct > 100) pct = 40;
      setProgress(pct);
    }, 500);
    return () => clearInterval(interval);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open && onClose) onClose(); }}>
      <DialogContent className="sm:max-w-sm">
        <VisuallyHidden>
          <DialogTitle>{t('analyzingTitle')}</DialogTitle>
          <DialogDescription>{t('analyzingDesc')}</DialogDescription>
        </VisuallyHidden>
        <div className="text-center py-6">
          <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-br from-fortune-gold to-traditional-gold opacity-30"></div>
            <div className="absolute inset-2 animate-pulse rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 opacity-40"></div>
            <div className="w-16 h-16 bg-gradient-to-r from-fortune-gold to-traditional-gold rounded-full flex items-center justify-center animate-spin-slow shadow-2xl border-4 border-white/60">
              <i className="fas fa-yin-yang text-white text-3xl animate-bounce"></i>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
            {t('analyzingTitle')}
            <span className="animate-bounce text-fortune-gold text-xl">...</span>
          </h3>
          <div className="w-32 mx-auto mt-4 h-2 bg-gradient-to-r from-fortune-gold via-yellow-300 to-traditional-gold rounded-full overflow-hidden">
            <div className="h-2 bg-yellow-400 animate-loading-bar rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-gray-600 text-sm mt-4 animate-pulse">{t('analyzingDesc')}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
