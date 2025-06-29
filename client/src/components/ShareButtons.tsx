import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ShareButtons() {
  const { toast } = useToast();

  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("오늘의 운세를 확인해보세요!");
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
  };

  const shareToKakao = () => {
    // KakaoTalk sharing would require Kakao SDK integration
    toast({
      title: "카카오톡 공유",
      description: "카카오톡 공유 기능을 준비중입니다.",
    });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "링크 복사 완료",
        description: "링크가 클립보드에 복사되었습니다.",
      });
    } catch (error) {
      toast({
        title: "복사 실패",
        description: "링크 복사에 실패했습니다.",
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
        aria-label="페이스북으로 공유"
      >
        <i className="fab fa-facebook-f text-lg md:text-xl"></i>
        <span style={{ fontFamily: 'Pretendard, Noto Sans KR, sans-serif', fontWeight: 700 }}>페이스북</span>
      </Button>
      <Button
        onClick={shareToKakao}
        className="bg-[#FEE500] hover:bg-[#ffe066] text-[#191600] font-semibold text-base md:text-lg px-7 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-md border border-[#E0C200] focus:ring-2 focus:ring-[#FEE500]/60 focus:ring-offset-2 min-w-[160px] w-full sm:w-[180px] justify-center"
        style={{ letterSpacing: '0.01em' }}
        aria-label="카카오톡으로 공유"
      >
        <i className="fas fa-comment text-lg md:text-xl"></i>
        <span style={{ fontFamily: 'Pretendard, Noto Sans KR, sans-serif', fontWeight: 700 }}>카카오톡</span>
      </Button>
      <Button
        onClick={copyLink}
        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold text-base md:text-lg px-7 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-md focus:ring-2 focus:ring-gray-400/60 focus:ring-offset-2 min-w-[160px] w-full sm:w-[180px] justify-center"
        style={{ letterSpacing: '0.01em' }}
        aria-label="링크 복사"
      >
        <i className="fas fa-link text-lg md:text-xl"></i>
        <span style={{ fontFamily: 'Pretendard, Noto Sans KR, sans-serif', fontWeight: 700 }}>링크복사</span>
      </Button>
    </div>
  );
}
