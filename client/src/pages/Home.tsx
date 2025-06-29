import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FortuneForm from "@/components/FortuneForm";
import FortuneResults from "@/components/FortuneResults";
import LoadingModal from "@/components/LoadingModal";
import AdBanner from "@/components/AdBanner";
import { BirthDateInput, FortuneData } from "@/types/fortune";
import { getFortune } from "@/lib/fortune";
import { clearOldFortunes } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [fortune, setFortune] = useState<FortuneData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // 페이지 로드시 오래된 운세 정리
    clearOldFortunes();
  }, []);

  const handleFortuneGeneration = async (
    birthDate: BirthDateInput,
    aiModel: "openai" | "gemini"
  ) => {
    setIsLoading(true);
    try {
      const fortuneData = await getFortune(birthDate, aiModel);
      setFortune(fortuneData);
      setShowResults(true);

      // 결과로 스크롤
      setTimeout(() => {
        const resultsElement = document.getElementById("fortune-results");
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (error) {
      toast({
        title: "운세 생성 실패",
        description:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-center sm:justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl border border-white/30">
                <i className="fas fa-yin-yang text-white text-xl sm:text-2xl drop-shadow-lg"></i>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-lg">
                  오늘의 운세
                </h1>
                <p className="text-white/80 text-sm sm:text-base font-medium tracking-wide">
                  AI 맞춤 운세 서비스
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                <span className="text-white/90 text-sm font-medium">Today</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-6xl">
        {/* Intro Section */}
        <section className="text-center mb-8 lg:mb-12">
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8 lg:p-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-full mx-auto mb-6 lg:mb-8 flex items-center justify-center shadow-2xl">
                <i className="fas fa-star text-white text-xl sm:text-2xl lg:text-3xl drop-shadow-lg animate-pulse"></i>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 mb-4 lg:mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI가 알려주는
                </span>
                <br className="sm:hidden" />
                <span className="text-gray-800"> 나만의 운세</span>
              </h2>
              <p className="text-gray-600 text-base sm:text-lg lg:text-xl mb-6 lg:mb-8 leading-relaxed max-w-3xl mx-auto font-medium">
                생년월일을 입력하시면 AI가 한국 전통 사주학을 바탕으로
                <br className="hidden sm:block" />
                오늘의 맞춤 운세를 정확하게 분석해드립니다.
              </p>

              <FortuneForm
                onSubmit={handleFortuneGeneration}
                isLoading={isLoading}
                showModelSelect={false}
              />

              <div className="mt-6 lg:mt-8">
                <AdBanner position="top" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Fortune Results */}
        {showResults && fortune && (
          <section id="fortune-results" className="mb-8">
            <FortuneResults fortune={fortune} />
          </section>
        )}

        {/* Recommended Section */}
        <section>
          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                다른 운세도 확인해보세요
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-4 h-auto flex-col space-y-2 transition-all duration-300 transform hover:scale-105"
                  onClick={() =>
                    toast({
                      title: "준비중",
                      description: "주간운세 기능을 준비중입니다.",
                    })
                  }
                >
                  <i className="fas fa-calendar-week text-2xl"></i>
                  <span className="text-sm font-medium">주간운세</span>
                </Button>
                <Button
                  className="bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white p-4 h-auto flex-col space-y-2 transition-all duration-300 transform hover:scale-105"
                  onClick={() =>
                    toast({
                      title: "준비중",
                      description: "월간운세 기능을 준비중입니다.",
                    })
                  }
                >
                  <i className="fas fa-calendar-alt text-2xl"></i>
                  <span className="text-sm font-medium">월간운세</span>
                </Button>
                <Button
                  className="bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white p-4 h-auto flex-col space-y-2 transition-all duration-300 transform hover:scale-105"
                  onClick={() =>
                    toast({
                      title: "준비중",
                      description: "궁합보기 기능을 준비중입니다.",
                    })
                  }
                >
                  <i className="fas fa-heart text-2xl"></i>
                  <span className="text-sm font-medium">궁합보기</span>
                </Button>
                <Button
                  className="bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-4 h-auto flex-col space-y-2 transition-all duration-300 transform hover:scale-105"
                  onClick={() =>
                    toast({
                      title: "준비중",
                      description: "타로점 기능을 준비중입니다.",
                    })
                  }
                >
                  <i className="fas fa-eye text-2xl"></i>
                  <span className="text-sm font-medium">타로점</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Floating Action Button (Top 이동) */}
      <div className="fixed bottom-10 right-10 z-[100]">
        <button
          onClick={scrollToTop}
          aria-label="맨 위로"
          className="group bg-gradient-to-br from-indigo-600 to-purple-600 text-white w-16 h-16 rounded-full shadow-2xl border-2 border-white/80 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_32px_rgba(80,0,200,0.25)] focus:outline-none focus:ring-4 focus:ring-indigo-300 active:scale-95"
          style={{ opacity: 0.96 }}
        >
          <i className="fas fa-arrow-up text-3xl drop-shadow-lg transition-transform duration-200 group-hover:-translate-y-1"></i>
        </button>
      </div>

      {/* Loading Modal */}
      <LoadingModal open={isLoading} onClose={() => setIsLoading(false)} />

      {/* Footer */}
      <footer className="w-full bg-gradient-to-r from-fortune-gold to-traditional-gold py-8 mt-16 shadow-inner">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🔮</span>
            <span className="font-bold text-lg text-gray-800 tracking-wide">오늘의 운세</span>
          </div>
          <p className="text-sm text-gray-700 text-center max-w-md">
            AI가 전하는 오늘의 행운과 조언이 여러분의 하루에 작은 힘이 되길 바랍니다.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="https://github.com/kyungseok-lee" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600 transition-colors" aria-label="GitHub"><i className="fab fa-github text-xl"></i></a>
            <a href="mailto:meant0415@gmail.com" className="text-gray-600 hover:text-indigo-600 transition-colors" aria-label="Email"><i className="fas fa-envelope text-xl"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
