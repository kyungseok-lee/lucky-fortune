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
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Home() {
  const [fortune, setFortune] = useState<FortuneData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

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
        title: t('fortuneErrorTitle'),
        description:
          error instanceof Error
            ? error.message
            : t('fortuneErrorUnknown'),
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
      <header className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 shadow-2xl sticky top-0 z-50 backdrop-blur-md">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 text-left">
            <img src="/clover.png" alt="Lucky Fortune" className="w-10 h-10 drop-shadow-lg" />
            <div>
              <h1 className="text-base sm:text-lg lg:text-xl font-black text-white tracking-tight drop-shadow-lg">
                <Link href="/" className="focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-md">
                  {t('appTitle')}
                </Link>
              </h1>
              <p className="text-white/80 text-xs sm:text-sm font-medium tracking-wide">
                {t('appSubtitle')}
              </p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Intro Section */}
        <section className="mb-8 lg:mb-12">
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8 lg:p-12">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-4 sm:mb-10 lg:mb-14">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl border border-green-300/40 mb-3 sm:mb-0">
                  <img src="/clover.png" alt="Lucky Fortune" className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 mt-1 sm:mt-1.5 lg:mt-2 drop-shadow-lg" />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 mb-2 lg:mb-4 tracking-tight">
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {t('aiIntro')}
                    </span>
                    <span className="text-gray-800">
                      {' '}{t('fortuneResult')}
                    </span>
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg lg:text-xl mb-2 lg:mb-4 leading-relaxed max-w-3xl font-medium">
                    {t('needForAnalysis')}
                  </p>
                </div>
              </div>
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
                {t('fortuneResult')}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 h-auto flex-col space-y-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  onClick={() =>
                    toast({
                      title: t('featurePreparingTitle'),
                      description: t('featureWeeklyPreparing'),
                    })
                  }
                >
                  <i className="fas fa-calendar-week text-2xl"></i>
                  <span className="text-sm font-medium">{t('weeklyFortune')}</span>
                </Button>
                <Button
                  className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-4 h-auto flex-col space-y-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  onClick={() =>
                    toast({
                      title: t('featurePreparingTitle'),
                      description: t('featureMonthlyPreparing'),
                    })
                  }
                >
                  <i className="fas fa-calendar-alt text-2xl"></i>
                  <span className="text-sm font-medium">{t('monthlyFortune')}</span>
                </Button>
                <Button
                  className="bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white p-4 h-auto flex-col space-y-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  onClick={() =>
                    toast({
                      title: t('featurePreparingTitle'),
                      description: t('featureCompatibilityPreparing'),
                    })
                  }
                >
                  <i className="fas fa-heart text-2xl"></i>
                  <span className="text-sm font-medium">{t('compatibility')}</span>
                </Button>
                <Button
                  className="bg-gradient-to-br from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white p-4 h-auto flex-col space-y-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  onClick={() =>
                    toast({
                      title: t('featurePreparingTitle'),
                      description: t('featureTarotPreparing'),
                    })
                  }
                >
                  <i className="fas fa-eye text-2xl"></i>
                  <span className="text-sm font-medium">{t('tarot')}</span>
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
          aria-label={t('scrollToTop')}
          className="group bg-gradient-to-br from-emerald-600 to-teal-600 text-white w-16 h-16 rounded-full shadow-2xl border-2 border-white/80 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_32px_rgba(16,185,129,0.25)] focus:outline-none focus:ring-4 focus:ring-emerald-300 active:scale-95"
          style={{ opacity: 0.96 }}
        >
          <i className="fas fa-arrow-up text-3xl drop-shadow-lg transition-transform duration-200 group-hover:-translate-y-1"></i>
        </button>
      </div>

      {/* Loading Modal */}
      <LoadingModal open={isLoading} onClose={() => setIsLoading(false)} />

      {/* Footer */}
      <footer className="w-full bg-gradient-to-r from-gray-900 via-slate-900 to-zinc-900 py-8 mt-8 shadow-inner">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2 mb-2">
            <img src="/clover.png" alt="Lucky Fortune" className="w-6 h-6 drop-shadow-lg" />
            <span className="font-bold text-lg text-white tracking-wide">{t('appTitle')}</span>
          </div>
          <p className="text-sm text-gray-300 text-center max-w-md">
            {t('footerSlogan')}
          </p>
          <div className="flex gap-4 mt-2">
            <a href="https://github.com/kyungseok-lee" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition-colors" aria-label="GitHub"><i className="fab fa-github text-xl"></i></a>
            <a href="mailto:meant0415@gmail.com" className="text-gray-400 hover:text-emerald-400 transition-colors" aria-label="Email"><i className="fas fa-envelope text-xl"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
