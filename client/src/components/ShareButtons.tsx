import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export default function ShareButtons() {
  const { toast } = useToast();
  const { t } = useTranslation();

  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(t('shareFacebookText'));
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
  };

  const shareToKakao = () => {
    // KakaoTalk sharing would require Kakao SDK integration
    toast({
      title: t('shareKakaoTitle'),
      description: t('shareKakaoPreparing'),
    });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: t('copyLinkSuccessTitle'),
        description: t('copyLinkSuccessDesc'),
      });
    } catch (error) {
      toast({
        title: t('copyLinkErrorTitle'),
        description: t('copyLinkErrorDesc'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center gap-4 flex-nowrap">
      <Button
        onClick={shareToFacebook}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base md:text-lg px-7 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-md focus:ring-2 focus:ring-blue-400/60 focus:ring-offset-2 min-w-[160px] w-full sm:w-[180px] justify-center"
        style={{ letterSpacing: '0.01em' }}
        aria-label={t('shareFacebookAria')}
      >
        <i className="fab fa-facebook-f text-lg md:text-xl"></i>
        <span style={{ fontFamily: 'Pretendard, Noto Sans KR, sans-serif', fontWeight: 700 }}>{t('facebook')}</span>
      </Button>
      <Button
        onClick={shareToKakao}
        className="bg-[#FEE500] hover:bg-[#ffe066] text-[#191600] font-semibold text-base md:text-lg px-7 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-md border border-[#E0C200] focus:ring-2 focus:ring-[#FEE500]/60 focus:ring-offset-2 min-w-[160px] w-full sm:w-[180px] justify-center"
        style={{ letterSpacing: '0.01em' }}
        aria-label={t('shareKakaoAria')}
      >
        <i className="fas fa-comment text-lg md:text-xl"></i>
        <span style={{ fontFamily: 'Pretendard, Noto Sans KR, sans-serif', fontWeight: 700 }}>{t('kakao')}</span>
      </Button>
      <Button
        onClick={copyLink}
        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold text-base md:text-lg px-7 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-md focus:ring-2 focus:ring-gray-400/60 focus:ring-offset-2 min-w-[160px] w-full sm:w-[180px] justify-center"
        style={{ letterSpacing: '0.01em' }}
        aria-label={t('copyLinkAria')}
      >
        <i className="fas fa-link text-lg md:text-xl"></i>
        <span style={{ fontFamily: 'Pretendard, Noto Sans KR, sans-serif', fontWeight: 700 }}>{t('copyLink')}</span>
      </Button>
    </div>
  );
}
